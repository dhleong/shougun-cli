import { createClient } from "msgpack-rpc-lite";
import { IMedia, ITakeoutRequest, ITakeoutResponse } from "./model";

export class RpcClient {
    public static readonly VERSION = 1;

    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly timeout: number = 7,
    ) { }

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

    public async startByTitle(
        title: string,
    ): Promise<IMedia | undefined> {
        return this.perform("startByTitle", title);
    }

    public async takeout(
        requests: ITakeoutRequest[],
    ): Promise<ITakeoutResponse> {
        return this.perform("takeout", requests);
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
