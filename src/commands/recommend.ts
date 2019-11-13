import { flags as flg } from "@oclif/command";

import { printMediaResults } from "../output";

import { RpcCommand } from "../rpc-command";

export default class Recommend extends RpcCommand {
    public static description = "Fetch recommendations";
    public static examples = [
        "$ recommend",
    ];
    public static flags = {
        ...RpcCommand.flags,

        print: flg.boolean({
            char: "p",
            description: "print results to stdout instead of casting",
        }),
    };

    public static strict = false;

    public async run() {
        const {flags} = this.parse(Recommend);
        const rpc = await this.rpc(flags);

        if (flags.print) {
            const results = await rpc.queryRecommended();
            printMediaResults(flags, results);
        } else {
            await rpc.showRecommendations();
        }
    }
}
