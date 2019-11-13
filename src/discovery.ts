import _debug from "debug";
const debug = _debug("shougun:cli:discover");

import * as url from "url";

import { Client } from "node-ssdp";
import { RpcClient } from "./rpc";

export interface IDiscoverOptions {
    timeout?: number;
    rpcTimeout?: number;
}

const defaultOptions: IDiscoverOptions = {
    timeout: 5000,
};

export async function discover(
    options: IDiscoverOptions = defaultOptions,
): Promise<RpcClient> {
    const opts = {
        ...defaultOptions,
        ...options,
    };

    const client = new Client();
    const foundVersions = new Set<string>();

    const promise = new Promise<RpcClient>((resolve, reject) => {
        const timeout = setTimeout(() => {
            client.stop();

            if (!foundVersions.size) {
                reject(new Error("Timeout searching for server"));
            } else {
                const versions = Array.from(foundVersions);
                const message = `No servers with matching versions found; ` +
                    `found servers with version: ${versions} ` +
                    `but we need ${RpcClient.VERSION}`;
                reject(new Error(message));
            }
        }, opts.timeout);

        client.on("response", (headers, statusCode, info) => {
            debug("got", headers);
            const location = headers.LOCATION;
            if (!location) return;

            const { host, port } = url.parse(location);
            if (!(host && port)) return;

            if (typeof headers.SERVER !== "string") return;
            const serverInfo = headers.SERVER.split(":");
            const serverVersion = serverInfo[serverInfo.length - 1];

            if (parseInt(serverVersion, 10) !== RpcClient.VERSION) {
                foundVersions.add(serverVersion);
                return;
            }

            clearTimeout(timeout);
            client.stop();

            debug("Found server at", headers, info);
            resolve(new RpcClient(info.address, parseInt(port, 10), opts.rpcTimeout));
        });

    });

    const result = client.search("urn:schemas:service:ShougunServer:*");
    if (result) {
        await result;
        debug("finished sending search");
    }

    return promise;
}
