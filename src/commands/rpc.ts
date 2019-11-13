import { Command, flags as flg } from "@oclif/command";

import { discover } from "../discovery";
import { RpcClient } from "../rpc";

export abstract class RpcCommand extends Command {
    public static flags = {
        help: flg.help({char: "h"}),

        server: flg.string({
            char: "s",
            description: "ip:port to connect to",
        }),
        timeout: flg.integer({
            char: "t",
            description: "in seconds",
        }),
    };

    protected async rpc(flags: any) {
        const timeout = flags.timeout;
        if (flags.server) {
            // provided:
            const [ host, port ] = flags.server.split(":");
            if (!host || !tryParseInt(port)) {
                throw new Error(`Invalid server format: ${flags.server}`);
            }

            return new RpcClient(
                host,
                port,
                timeout,
            );
        }

        return discover({
            rpcTimeout: timeout,
        });
    }
}

function tryParseInt(v: string) {
    try {
        return parseInt(v, 10);
    } catch (e) {
        // ignore; return undefined
    }
}
