import _debug from "debug";
const debug = _debug("shougun-cli:return");

import {
    IBorrowedData,
    IBorrowRequest,
    IBorrowResponse,
    IDownloader,
    ILoanInstructions,
    ILoanItem,
    MediaType,
} from "../model";
import { printMediaResults } from "../output";
import { RpcClient } from "../rpc";
import { RpcCommand } from "../rpc-command";

export default class Return extends RpcCommand {
    public static description = "Return watched data after borrowing";
    public static examples = [
        "$ return",
    ];
    public static flags = {
        ...RpcCommand.flags,
    };

    public async run() {
        const {flags} = this.parse(Return);

        debug("retrieve borrowed data");
        const borrowerRpc = await this.rpc(flags, {
            borrowerOnly: true,
        });
        const borrowedData = await borrowerRpc.retrieveBorrowed();

        debug("returning borrowed data");
        await this.returnBorrowed(borrowedData);

        // mark return "complete" on borrowerRpc
        debug("marking return complete");
        await borrowerRpc.markBorrowReturned(
            borrowedData.tokens.map(pair => pair.token),
        );

        this.log("Done!");
    }

    private async returnBorrowed(borrowedData: IBorrowedData) {
        const tokensByServerId = borrowedData.tokens.reduce((map, pair) => {
            const { serverId, token } = pair;
            if (!map[serverId]) map[serverId] = [];

            map[serverId].push(token);

            return map;
        }, {} as {[serverId: string]: string[]});

        for (const serverId of Object.keys(tokensByServerId)) {
            const rpc = await this.rpc({}, {
                libraryOnly: true,
                sid: serverId,
            });

            debug("returning data to ", serverId);
            const tokens = tokensByServerId[serverId];
            await rpc.returnBorrowed(
                tokens,
                borrowedData.viewedInformation,
            );
        }
    }
}
