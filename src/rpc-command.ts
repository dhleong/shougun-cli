import { Command, flags as flg } from "@oclif/command";
import cli from "cli-ux";

import { discover, IDiscoverOptions } from "./discovery";
import { PathHandlingDownloader } from "./downloader/path-handling";
import { SimpleDownloader } from "./downloader/simple";
import { IDownloader } from "./model";
import { RpcClient } from "./rpc";

/**
 * Base command implementation for all RPC-based CLI commands; not in the
 * ./commands package to avoid confusing oclif
 */
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

    protected async rpc(flags: any, options: Partial<IDiscoverOptions> = {}) {
        const timeout = flags.timeout;
        if (flags.server) {
            // provided:
            const [ host, port ] = flags.server.split(":");
            if (!host || !tryParseInt(port)) {
                throw new Error(`Invalid server format: ${flags.server}`);
            }

            return RpcClient.findByAddress(host, port, timeout);
        }

        try {
            cli.action.start("Connecting to server");
            const rpc = await discover({
                ...options,
                rpcTimeout: timeout,
            });

            return proxyWithUi(this, rpc);

        } finally {
            cli.action.stop();
        }
    }

    protected async createDownloader(flags: any): Promise<IDownloader> {
        // in the future we might support fancier downloaders that the
        // user can request
        return new PathHandlingDownloader(new SimpleDownloader());
    }
}

function tryParseInt(v: string) {
    try {
        return parseInt(v, 10);
    } catch (e) {
        // ignore; return undefined
    }
}

function proxyWithUi(
    command: RpcCommand,
    client: RpcClient,
) {
    const handler = {
        get: (target: RpcClient, key: string) => {
            switch (key) {
            case "constructor":
                return RpcClient.constructor;
            default:
                if (!(target as any)[key]) {
                    return undefined;
                }
            }

            const fn = (target as any)[key].bind(target);
            return async (...args: any[]) => {
                cli.action.start("Communicating");
                try {
                    return await fn(...args);
                } catch (e) {
                    command.error(e, { exit: 2});
                    throw e;
                } finally {
                    cli.action.stop();
                    command.log("");
                }
            };
        },
    };

    return new Proxy(client, handler);
}
