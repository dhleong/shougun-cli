import { IMedia } from "./model";

// tslint:disable no-console

function padLeft(s: string, width: number) {
    if (s.length === width) {
        return s;
    } else if (s.length > width) {
        return s.substr(0, width);
    }

    const delta = width - s.length;
    return " ".repeat(delta) + s;
}

function describeDiscovery(id: string) {
    if (id.startsWith("local:")) {
        return "Local";
    }

    if (id.startsWith("babbling:")) {
        return id.substring("babbling:".length)
            .replace(/App$/, "");
    }

    return id;
}

export function printMediaResults(
    flags: any,  // TODO: we could have eg --json
    media: IMedia[],
) {
    console.log("");

    if (!media.length) {
        console.log(`No results`);
        return;
    }

    for (const m of media) {
        const source = padLeft(describeDiscovery(m.discovery), 8);
        console.log(`${source}: ${m.title}`);
        if ((m as any).url) {
            console.log(`    - ${(m as any).url}`);
        }
        if ((m as any).desc) {
            console.log(`    ${(m as any).desc}`);
        }

        console.log();
    }
}
