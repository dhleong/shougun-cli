import * as chai from "chai";

import { cleanObject } from "../../src/util/collection";

const { expect } = chai;

describe("cleanObject", () => {
    it("handles an empty object", () => {
        expect(cleanObject({})).to.be.undefined;
    });

    it("removes undefined keys", () => {
        expect(cleanObject({
            "taco": "al pastor",
            "salad": undefined,
        })).to.deep.equal({
            "taco": "al pastor",
        });
    });

    it("returns undefined if all values are undefined", () => {
        expect(cleanObject({
            "taco": undefined,
            "salad": undefined,
        })).to.be.undefined;
    });
});
