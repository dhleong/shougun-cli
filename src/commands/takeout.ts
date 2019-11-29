import { flags as flg } from "@oclif/command";
import { Bar, FormatFn, MultiBar, Presets } from "cli-progress";
import { prompt } from "inquirer";
import os from "os";
import pathlib from "path";

// tslint:disable-next-line no-var-requires
const defaultProgressFormatter = require("cli-progress/lib/formatter") as FormatFn;

import { SimpleDownloader } from "../downloader/simple";
import {
    IDownloader,
    ITakeoutItem,
    ITakeoutRequest,
    ITakeoutResponse,
    MediaType,
} from "../model";
import { printMediaResults } from "../output";
import { RpcClient } from "../rpc";
import { RpcCommand } from "../rpc-command";

type TakeoutWithTitle = ITakeoutRequest & { title: string };

const SIMULTANEOUS_DOWNLOADS = 3;

export default class Takeout extends RpcCommand {
    public static description = "Copy files for local playback";
    public static examples = [
        "$ takeout",
    ];
    public static flags = {
        ...RpcCommand.flags,
    };

    public static strict = false;

    public async run() {
        const {argv, flags} = this.parse(Takeout);
        const localPath = "";

        const rpc = await this.rpc(flags);

        const requests = await this.selectSeries(rpc);
        await this.chooseEpisodesPerRequest(requests);

        const response = await rpc.takeout(requests);

        await this.downloadFiles(response, localPath);
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
            message: "Choose a few series for takeout: ",
            name: "requests",
            type: "checkbox",

            choices: media.map(m => ({
                name: m.title,
                value: m,
            })),
        });

        return chosen.requests as TakeoutWithTitle[];
    }

    private async chooseEpisodesPerRequest(requests: TakeoutWithTitle[]) {
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
        response: ITakeoutResponse,
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

        const overallProgress = multiBar.create(response.media.length, 0);
        const downloader = new SimpleDownloader();
        const tasks: Array<Promise<void>> = [];
        for (let i = 0; i < SIMULTANEOUS_DOWNLOADS; ++i) {
            tasks.push(this.createDownloadTask(
                overallProgress,
                multiBar,
                downloader,
                rootPath,
                response.media,
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
        queue: ITakeoutItem[],
    ) {
        const bar = multiBar.create(0, 0);
        const onSize = (size: number) => {
            bar.setTotal(size);
        };
        const onBytes = (bytes: number) => {
            bar.increment(bytes);
        };

        while (true) {
            const item = queue.pop();
            if (!item) {
                break;
            }

            const extension = pathlib.extname(item.url);
            const fileName = item.media.title + extension;
            const localPath = pathlib.join(
                rootPath,
                item.media.seriesId,
                fileName,
            );

            bar.update(0, {
                title: item.media.title,
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
}
