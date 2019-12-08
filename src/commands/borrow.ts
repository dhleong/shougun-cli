import { flags as flg } from "@oclif/command";
import { Bar, FormatFn, MultiBar, Presets } from "cli-progress";
import fs from "fs-extra";
import { prompt } from "inquirer";
import os from "os";
import pathlib from "path";

// tslint:disable-next-line no-var-requires
const defaultProgressFormatter = require("cli-progress/lib/formatter") as FormatFn;

import {
    IBorrowRequest,
    IBorrowResponse,
    IDownloader,
    ILoanInstructions,
    ILoanItem,
    MediaType,
} from "../model";
import { printMediaResults } from "../output";
import { RpcClient } from "../rpc";
import { RpcCommand } from "../rpc-command";

type BorrowWithTitle = IBorrowRequest & { title: string };

const SIMULTANEOUS_DOWNLOADS = 3;

interface IBorrowTask {
    containerTitle: string;
    subDirectories: string[];
    item: ILoanItem;
}

export default class Borrow extends RpcCommand {
    public static description = "Copy files for local playback";
    public static examples = [
        "$ borrow",
    ];
    public static flags = {
        ...RpcCommand.flags,
    };
    public static args = [
        {
            description: "Where to save the downloaded videos",
            name: "path",
        },
    ];

    public static strict = false;

    public async run() {
        const {args, flags} = this.parse(Borrow);
        const localPath = args.path || ".";

        await fs.access(localPath, fs.constants.W_OK);

        const rpc = await this.rpc(flags, {
            libraryOnly: true,
        });

        const requests = await this.selectSeries(rpc);
        await this.chooseEpisodesPerRequest(requests);

        const response = await rpc.borrow(requests);

        const downloader = await this.createDownloader(flags);
        await this.downloadFiles(downloader, response, localPath);

        await this.writeLoanInstructions(response, rpc.serverId);

        try {
            // the borrower is probably local, so we can
            // be pretty brief in our search for it
            const borrowerRpc = await this.rpc(flags, {
                borrowerOnly: true,
                timeout: 1000,
            });
            borrowerRpc.loadLoans();
        } catch (e) {
            // ignore; borrower server not running
        }

    }

    private async selectSeries(rpc: RpcClient) {
        const candidates = await rpc.queryRecent({ onlyLocal: true });
        const media = candidates.filter(it => it.type === MediaType.Series)
            .map(m => ({
                episodes: 3,
                seriesId: m.id,
                title: m.title,
            }));
        if (!media.length) {
            this.error("No recent media available", { exit: 1 });
        }

        const chosen = await prompt({
            message: "Choose a few series to borrow: ",
            name: "requests",
            type: "checkbox",

            choices: media.map(m => ({
                name: m.title,
                value: m,
            })),
        });

        return chosen.requests as BorrowWithTitle[];
    }

    private async chooseEpisodesPerRequest(requests: BorrowWithTitle[]) {
        const episodesPerSeries = await prompt(
            requests.map(r => ({
                default: r.episodes,
                message: `How many episodes of ${r.title}?`,
                name: r.seriesId,
                type: "number",
            })),
        );

        for (const r of requests) {
            if (episodesPerSeries[r.seriesId]) {
                r.episodes = episodesPerSeries[r.seriesId] as number;
            }
        }
    }

    private async downloadFiles(
        downloader: IDownloader,
        response: IBorrowResponse,
        rootPath: string,
    ) {
        const multiBar = new MultiBar({
            clearOnComplete: true,
            format: (options, params, payload) => {
                let format: string;
                if (payload.title) {
                    // file download line:
                    format = "{bar} [{title}] {eta_formatted}";
                } else {
                    // total files line:
                    format = "Downloading: {bar} [{value} / {total}]";
                }

                return defaultProgressFormatter({
                    ...options,
                    format,
                }, params, payload);
            },
            hideCursor: true,
        }, Presets.shades_classic);

        const media: IBorrowTask[] = [];
        for (const s of response.series) {
            for (const e of s.episodes) {
                const parts = e.id.split(":").slice(1, -1);
                media.push({
                    containerTitle: s.title,
                    item: e,
                    subDirectories: parts,
                });
            }
        }

        const overallProgress = multiBar.create(media.length, 0);
        const tasks: Array<Promise<void>> = [];
        for (let i = 0; i < SIMULTANEOUS_DOWNLOADS; ++i) {
            tasks.push(this.createDownloadTask(
                overallProgress,
                multiBar,
                downloader,
                rootPath,
                media,
            ));
        }

        await Promise.all(tasks);
        multiBar.stop();

        this.log("Done!");
    }

    private async createDownloadTask(
        overallProgress: Bar,
        multiBar: MultiBar,
        downloader: IDownloader,
        rootPath: string,
        queue: IBorrowTask[],
    ) {
        const bar = multiBar.create(0, 0);
        const onSize = async (size: number) => {
            bar.setTotal(size);
        };
        const onBytes = (bytes: number) => {
            bar.increment(bytes);
        };

        while (true) {
            const task = queue.shift();
            if (!task) {
                break;
            }

            const { item } = task;
            const extension = pathlib.extname(item.url);
            const fileName = item.title + extension;
            const localPath = pathlib.join(
                rootPath,
                task.containerTitle,
                ...task.subDirectories,
                fileName,
            );

            bar.update(0, {
                title: item.title,
            });

            await downloader.download({
                localPath,
                onBytes,
                onSize,
                url: item.url,
            });
            bar.stop();
            overallProgress.increment(1);
        }

        multiBar.remove(bar);
    }

    private async writeLoanInstructions(
        response: IBorrowResponse,
        serverId: string,
    ) {
        const instructions: ILoanInstructions = {
            nextMedia: [],
            serverId,
            token: response.token,
        };

        for (const s of response.series) {
            if (!s.episodes.length) {
                continue;
            }

            const e = s.episodes[0];
            instructions.nextMedia.push({
                id: e.id,
                resumeTimeSeconds: e.resumeTimeSeconds,
            });
        }

        const borrowFile = pathlib.join(
            os.homedir(),
            ".config", "shougun", "borrow",
            `loan.${response.token}.json`,
        );
        await fs.mkdirs(pathlib.dirname(borrowFile));
        await fs.writeJson(borrowFile, instructions);
    }
}
