import { createClient } from "msgpack-rpc-lite";

export class RpcClient {

    constructor(
        private readonly host: string,
        private readonly port: number,
    ) { }

    public async startByTitle(
        title: string,
    ): Promise<{title: string} | undefined> {
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
