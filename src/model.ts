export enum MediaType {
    Episode,
    Movie,
    Series,

    /**
     * If a media's type is ExternalPlayable, it MUST implement
     * [IPlayableMedia]
     */
    ExternalPlayable,
}

export interface IMedia {
    discovery: string;
    id: string;
    title: string;
    type: MediaType;
}

export interface ITakeoutRequest {
    episodes: number;
    seriesId: string;
}

export interface ITakeoutItem {
    id: string;
    title: string;
    type: MediaType;
    resumeTimeSeconds?: number;
    url: string;
}

export interface ITakeoutSeries {
    episodes: ITakeoutItem[];
    title: string;
    id: string;
}

export interface ITakeoutResponse {
    series: ITakeoutSeries[];
    token: string;
}

export interface ITakeoutInstructions {
    token: string;

    nextMedia: Array<{
        id: string;
        resumeTimeSeconds?: number;
    }>;
}

export interface IDownloaderOptions {
    url: string;
    localPath: string;
    onSize: (totalBytes: number) => Promise<boolean | void>;
    onBytes: (bytesDownloaded: number) => void;
}

export interface IDownloader {
    download(options: IDownloaderOptions): Promise<boolean>;
}
