import { flags as flg } from "@oclif/command";

import { IPlaybackOptions } from "../model";
import { MediaPrefs } from './prefs';

export class PlaybackOptions {
    public static flags = {
        ...MediaPrefs.flags,

        "start-time": flg.string({
            description: "in seconds",
            helpValue: "time",
        }),

        "language": flg.string({
            char: "l",
            description: "preferred audio language",
        }),
    };

    public static parse(flags: any): IPlaybackOptions | undefined {
        const currentTime = flags["start-time"];
        const prefs = MediaPrefs.parse(flags);

        if (!(currentTime || prefs)) {
            return;
        }

        const opts: IPlaybackOptions = {};

        if (currentTime) {
            opts.currentTime = currentTime;
        }

        if (prefs) {
            opts.prefs = prefs;
        }

        return opts;
    }
}
