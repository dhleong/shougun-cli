import fs from "fs-extra";
import * as http from "http";
import pathlib from "path";

import { IDownloader } from "../model";

export class SimpleDownloader implements IDownloader {
    public async download(options: {
        url: string,
        localPath: string,
        onSize: (totalBytes: number) => void,
        onBytes: (bytesDownloaded: number) => void,
    }) {
        const resp = await new Promise<http.IncomingMessage>(resolve => {
            http.get(options.url, res => {
                resolve(res);
            });
        });
        const length = parseInt(resp.headers["content-length"] as string, 10);
        options.onSize(length);

        await fs.mkdirs(pathlib.dirname(options.localPath));
        const output = fs.createWriteStream(options.localPath);

        return new Promise<void>(resolve => {
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
    }
}
