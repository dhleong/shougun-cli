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

    public async download(options: IDownloaderOptions): Promise<void> {
        // ensure the directory exists
        const dirName = pathlib.dirname(options.localPath);
        const fileName = pathlib.basename(options.localPath);
        await fs.mkdirs(dirName);

        // download to a tmp file
        const tempFile = pathlib.join(
            dirName, "." + fileName + ".download",
        );
        await this.base.download({
            ...options,
            localPath: tempFile,
        });

        // move the tmp file to the original path
        await fs.rename(tempFile, options.localPath);
    }
}
