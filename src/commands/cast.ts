import { flags as flg } from "@oclif/command";

import { printMediaResults } from "../output";

import { PlaybackOptions } from "../flags/playback";
import { RpcCommand } from "../rpc-command";

export default class Cast extends RpcCommand {
    public static description = "Play by file path";
    public static examples = [
        "$ cast ~/shows/the.good.place.mp4",
    ];
    public static flags = {
        ...RpcCommand.flags,
        ...PlaybackOptions.flags,
    };
    public static args = [
        {name: "path"},
    ];

    public static strict = false;

    public async run() {
        const {argv, flags} = this.parse(Cast);
        const rpc = await this.rpc(flags);
        const options = PlaybackOptions.parse(flags);

        const path = argv.join(" ");
        const results = await rpc.startByPath(path, options);
        if (!results) {
            this.error(`No results for: ${path}`);
            return;
        }
        printMediaResults(flags, [results]);
    }
}
