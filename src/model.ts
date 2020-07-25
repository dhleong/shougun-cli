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

export interface IMediaPrefs {
    preferredAudioLanguage?: string;
}

export interface IPlaybackOptions {
    /**
     * In *seconds*
     */
    currentTime?: number;

    /**
     * If provided, gets merged onto any prefs set for the media
     */
    prefs?: IMediaPrefs;
}

/*
 * Borrowing
 */

export interface IBorrowRequest {
    episodes: number;
    seriesId: string;
}

export interface ILoanItem {
    id: string;
    title: string;
    type: MediaType;
    resumeTimeSeconds?: number;
    url: string;
}

export interface ILoanedSeries {
    episodes: ILoanItem[];
    title: string;
    id: string;
}

export interface IBorrowResponse {
    series: ILoanedSeries[];
    token: string;
}

export interface ILoanInstructions {
    serverId: string;
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

export interface IViewedInformation {
    id: string;

    seriesId?: string;
    title: string;

    /** Unix time in millis */
    lastViewedTimestamp: number;
    resumeTimeSeconds: number;
    videoDurationSeconds: number;
}

export interface IBorrowedData {
    tokens: Array<{ serverId: string, token: string }>;
    viewedInformation: IViewedInformation[];
}

/*
 * Episode queries, from Babbling
 */

export interface ISeasonAndEpisodeQuery {
    episodeIndex: number;
    seasonIndex: number;
}

export type IEpisodeQuery = ISeasonAndEpisodeQuery;
