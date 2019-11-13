import { flags as flg } from "@oclif/command";

import { printMediaResults } from "../output";

import { RpcCommand } from "../rpc-command";

export default class Search extends RpcCommand {
    public static description = "Search for available titles";
    public static examples = [
        "$ search the good place",
    ];
    public static flags = {
        ...RpcCommand.flags,
    };
    public static args = [
        {name: "query"},
    ];

    public static strict = false;

    public async run() {
        const {argv, flags} = this.parse(Search);
        const rpc = await this.rpc(flags);

        const query = argv.join(" ");
        const results = await rpc.search(query);
        printMediaResults(flags, results);
    }
}
