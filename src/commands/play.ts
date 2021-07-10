import _debug from "debug";
const debug = _debug("shougun-cli:play");

import { flags as flg } from "@oclif/command";

import { IEpisodeQuery } from "../model";
import { printMediaResults } from "../output";

import { PlaybackOptions } from "../flags/playback";
import { RpcClient } from "../rpc";
import { RpcCommand } from "../rpc-command";

export default class Play extends RpcCommand {
    public static description = "Play by title";
    public static examples = [
        "$ play the good place",
        "$ play --season 2 the good place",
        "$ play --season 2 --episode 3 the good place",
        "$ play --episode 9 the good place",
    ];
    public static flags = {
        ...RpcCommand.flags,
        ...PlaybackOptions.flags,

        episode: flg.integer({
            description: "The episode number to play. If `season` is not also provided, plays this episode of the first season.",
        }),
        season: flg.integer({
            description: "The season number to play. If `episode` is not also provided, plays the first episode of that season.",
        }),
    };
    public static args = [
        {name: "query"},
    ];

    public static strict = false;

    public async run() {
        const {argv, flags} = this.parse(Play);
        const rpc = await this.rpc(flags);
        const query = argv.join(" ");

        let episodeQuery: IEpisodeQuery | undefined;
        if (flags.episode || flags.season) {
            episodeQuery = {
                episodeIndex: (flags.episode || 1) - 1,
                seasonIndex: (flags.season || 1) - 1,
            };
        }

        if (episodeQuery) {
            this.startEpisodeByTitle(rpc, flags, query, episodeQuery);
        } else {
            this.startByTitle(rpc, flags, query);
        }
    }

    private async startByTitle(
        rpc: RpcClient,
        flags: any,
        query: string,
    ) {
        const opts = PlaybackOptions.parse(flags);
        debug("Starting media by query", query, "; opts=", opts);

        const results = await rpc.startByTitle(query, opts);
        if (!results) {
            this.error(`No results for: ${query}`);
            return;
        }
        printMediaResults(flags, [results]);
    }

    private async startEpisodeByTitle(
        rpc: RpcClient,
        flags: any,
        query: string,
        episodeQuery: IEpisodeQuery,
    ) {
        const opts = PlaybackOptions.parse(flags);
        debug("Starting episode", episodeQuery, " by query", query, "; opts=", opts);

        const results = await rpc.startEpisodeByTitle(query, episodeQuery, opts);
        if (!results) {
            this.error(`No results for: ${query}`);
            return;
        }
        printMediaResults(flags, [results]);
    }
}
