import _debug from "debug";
const debug = _debug("shougun:cli:discover");

import url from "url";

import { Client } from "node-ssdp";
import { RpcClient } from "./rpc";

export interface IDiscoverOptions {
    timeout?: number;
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

    const promise = new Promise<RpcClient>((resolve, reject) => {
        const timeout = setTimeout(() => {
            client.stop();
            reject(new Error("Timeout searching for server"));
        }, opts.timeout);

        client.on("response", (headers, statusCode, info) => {
            const location = headers.LOCATION;
            if (!location) return;

            const { host, port } = url.parse(location);
            if (!(host && port)) return;

            clearTimeout(timeout);
            client.stop();

            debug("Found server at", headers, info);
            resolve(new RpcClient(info.address, parseInt(port, 10)));
        });

    });

    const result = client.search("urn:schemas:service:ShougunServer:1");
    if (result) {
        await result;
        debug("finished sending search");
    }

    return promise;
}
