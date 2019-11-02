#!/usr/bin/env ts-node

import { discover } from "./discovery";

// tslint:disable no-console
(async () => {
    const client = await discover();
    const result = await client.startByTitle("shikaotoko");
    console.log("result=", result);
})().catch(e => { console.error("error", e, e.stack); });
