import { createClient } from "msgpack-rpc-lite";
import { IMedia } from "./model";

export class RpcClient {
    public static readonly VERSION = 1;

    constructor(
        private readonly host: string,
        private readonly port: number,
    ) { }

    public async search(
        title: string,
    ): Promise<IMedia[]> {
        return this.perform("search", title);
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

    private async perform(request: string, ...args: any[]) {
        const client = createClient(this.port, this.host);
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
