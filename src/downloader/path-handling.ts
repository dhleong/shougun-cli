import _debug from "debug";
const debug = _debug("shougun-cli:downloader:path");

import fs from "fs-extra";
import pathlib from "path";

import { IDownloader, IDownloaderOptions } from "../model";

/**
 * Delegates the downloading and progress reporting to
 * another Downloader, and manages the local path.
 */
export class PathHandlingDownloader implements IDownloader {
    constructor(
        private base: IDownloader,
    ) {}

    public async download(options: IDownloaderOptions) {

        // ensure the directory exists
        const dirName = pathlib.dirname(options.localPath);
        const fileName = pathlib.basename(options.localPath);
        await fs.mkdirs(dirName);

        // download to a tmp file
        const tempFile = pathlib.join(
            dirName, "." + fileName + ".download",
        );
        const downloaded = await this.base.download({
            ...options,
            localPath: tempFile,

            onSize: async size => {
                // shortcut: if the file already exists, we don't
                // need to re-download
                try {
                    const fileStat = await fs.stat(options.localPath);
                    if (fileStat.size === size) {
                        debug(`skipping ${options.localPath}; it already exists`);
                        return false;
                    }
                } catch (e) {
                    if (e.code !== "ENOENT") {
                        // if code is ENOENT then the file doesn't
                        // exist, so just fall through and download;
                        // otherwise, re-throw because it's unexpected
                        throw e;
                    }
                }

                // if we get here then we're going to download; forward
                // to the delegate:
                return options.onSize(size);
            },
        });

        if (!downloaded) {
            return false;
        }

        // move the tmp file to the original path
        await fs.rename(tempFile, options.localPath);
        return true;
    }
}
