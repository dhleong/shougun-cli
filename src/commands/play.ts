import { flags as flg } from "@oclif/command";

import { printMediaResults } from "../output";

import { RpcCommand } from "../rpc-command";

export default class Play extends RpcCommand {
    public static description = "Play by title";
    public static examples = [
        "$ play the good place",
    ];
    public static flags = {
        ...RpcCommand.flags,
    };
    public static args = [
        {name: "query"},
    ];

    public static strict = false;

    public async run() {
        const {argv, flags} = this.parse(Play);
        const rpc = await this.rpc(flags);

        const query = argv.join(" ");
        const results = await rpc.startByTitle(query);
        if (!results) {
            this.error(`No results for: ${query}`);
            return;
        }
        printMediaResults(flags, [results]);
    }
}
