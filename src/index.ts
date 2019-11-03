#!/usr/bin/env ts-node

import { discover } from "./discovery";

// tslint:disable no-console
(async () => {
    const client = await discover();
    const result = await client.search("shikaotoko");
    console.log("result=", await client.start(result[0]));
})().catch(e => { console.error("error", e, e.stack); });
