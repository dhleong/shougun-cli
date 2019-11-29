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
}

export interface IDownloader {
    download(options: {
        url: string,
        localPath: string,
        onSize: (totalBytes: number) => void,
        onBytes: (bytesDownloaded: number) => void,
    }): Promise<void>;
}
