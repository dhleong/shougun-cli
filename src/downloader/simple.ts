import fs from "fs-extra";
import * as http from "http";

import { IDownloader, IDownloaderOptions } from "../model";

/**
 * Simple downloader implementation using Node's builtin HTTP libraries.
 * Supports progress notification, but expects to be wrapped in a
 * PathHandlingDownloader
 */
export class SimpleDownloader implements IDownloader {
    public async download(options: IDownloaderOptions) {
        const resp = await new Promise<http.IncomingMessage>(resolve => {
            http.get(options.url, res => {
                resolve(res);
            });
        });
        const length = parseInt(resp.headers["content-length"] as string, 10);
        const shouldDownload = await options.onSize(length);
        if (shouldDownload === false) {
            resp.destroy();
            return false;
        }

        const output = fs.createWriteStream(options.localPath);

        await new Promise<void>(resolve => {
            resp.on("data", buffer => {
                output.write(buffer);
                if (buffer instanceof Buffer) {
                    options.onBytes(buffer.length);
                } else if (typeof buffer === "string") {
                    options.onBytes(buffer.length);
                }
            });

            resp.on("end", () => {
                output.end();
                resolve();
            });
        });
        return true;
    }
}
