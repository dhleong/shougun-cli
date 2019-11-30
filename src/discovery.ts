import _debug from "debug";
const debug = _debug("shougun:cli:discover");

import * as url from "url";

import os from "os";
import pathlib from "path";

import fsextra from "fs-extra";
import { Client } from "node-ssdp";
import { RpcClient } from "./rpc";

export const LOCAL_ANNOUNCE_PATH = pathlib.join(
    os.homedir(),
    ".config/shougun/announce.port",
);

export interface IDiscoverOptions {
    timeout?: number;
    rpcTimeout?: number;

    /**
     * If provided, the sid of the server to find
     */
    sid?: string;
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
    let timeout: number | undefined;

    const promise = new Promise<RpcClient>((resolve, reject) => {
        timeout = setTimeout(() => {
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
            if (!headers.SID || typeof headers.SID !== "string") {
                return;
            }

            const serverUuid: string = headers.SID;
            if (opts.sid && serverUuid !== opts.sid) {
                return;
            }

            if (parseInt(serverVersion, 10) !== RpcClient.VERSION) {
                foundVersions.add(serverVersion);
                return;
            }

            clearTimeout(timeout);
            client.stop();

            debug("Found server at", headers, info);
            resolve(new RpcClient(
                serverUuid,
                info.address,
                parseInt(port, 10),
                opts.rpcTimeout,
            ));
        });

    });

    try {
        const result = client.search("urn:schemas:service:ShougunServer:*");
        if (result) {
            await result;
            debug("finished sending search");
        }

        return promise;
    } catch (e) {
        if (!e.message.includes("No sockets available")) {
            throw e;
        }
    }

    debug("No sockets available; searching in local mode");
    promise.catch(e => { /* ignore */ });

    if (timeout) {
        clearTimeout(timeout);
    }

    const portBuffer = await fsextra.readFile(LOCAL_ANNOUNCE_PATH);
    return RpcClient.findByAddress(
        "localhost",
        parseInt(portBuffer.toString(), 10),
        opts.rpcTimeout,
    );
}
