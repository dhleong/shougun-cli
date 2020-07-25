import { createClient } from "msgpack-rpc-lite";
import {
    IBorrowedData,
    IBorrowRequest,
    IBorrowResponse,
    IEpisodeQuery,
    IMedia,
    IViewedInformation,
} from "./model";

const DEFAULT_TIMEOUT = 7;

export class RpcClient {
    public static readonly VERSION = 1;

    public static async findByAddress(
        host: string,
        port: number,
        timeout: number = DEFAULT_TIMEOUT,
    ) {
        const client = new RpcClient(
            "...searching...",
            host,
            port,
            timeout,
        );
        const id = await client.getId();
        return new RpcClient(id, host, port, timeout);
    }

    constructor(
        public readonly serverId: string,
        private readonly host: string,
        private readonly port: number,
        private readonly timeout: number = DEFAULT_TIMEOUT,
    ) { }

    public async getId(): Promise<string> {
        return this.perform("getId");
    }

    public async loadLoans(): Promise<void> {
        return this.perform("loadLoans");
    }

    public async markBorrowReturned(
        tokens: string[],
    ) {
        return this.perform("markBorrowReturned", tokens);
    }

    public async queryRecent(opts?: {
        maxResults?: number,
        onlyLocal?: boolean,
    }): Promise<IMedia[]> {
        return this.perform("queryRecent", opts);
    }

    public async queryRecommended(opts?: {
        maxResults?: number,
        onlyLocal?: boolean,
    }): Promise<IMedia[]> {
        return this.perform("queryRecommended", opts);
    }

    public async retrieveBorrowed(): Promise<IBorrowedData> {
        return this.perform("retrieveBorrowed");
    }

    public async returnBorrowed(
        tokens: string[],
        viewedInfo: IViewedInformation[],
    ) {
        return this.perform("returnBorrowed", tokens, viewedInfo);
    }

    public async search(
        title: string,
    ): Promise<IMedia[]> {
        return this.perform("search", title);
    }

    public async showRecommendations(): Promise<void> {
        return this.perform("showRecommendations");
    }

    public async start(
        media: IMedia,
    ): Promise<IMedia | undefined> {
        return this.perform("start", media);
    }

    public async startByPath(
        path: string,
    ): Promise<IMedia | undefined> {
        return this.perform("startByPath", path);
    }

    public async startByTitle(
        title: string,
    ): Promise<IMedia | undefined> {
        return this.perform("startByTitle", title);
    }

    public async startEpisodeByTitle(
        title: string,
        query: IEpisodeQuery,
    ): Promise<IMedia | undefined> {
        return this.perform("startEpisodeByTitle", title, query);
    }

    public async borrow(
        requests: IBorrowRequest[],
    ): Promise<IBorrowResponse> {
        return this.perform("borrow", requests);
    }

    private async perform(request: string, ...args: any[]) {
        const client = createClient(this.port, this.host, this.timeout);
        try {
            const result = client.request(request, args);
            if (!result) throw new Error("No result");

            const [ response ] = await result;
            return response;
        } finally {
            client.close();
        }
    }
}
