import { flags as flg } from "@oclif/command";

import { IPlaybackOptions } from "../model";
import { cleanObject } from "../util/collection";
import { MediaPrefs } from './prefs';

export class PlaybackOptions {
    public static flags = {
        ...MediaPrefs.flags,

        "start-time": flg.string({
            description: "in seconds",
            helpValue: "time",
        }),
    };

    public static parse(flags: any): IPlaybackOptions | undefined {
        const currentTime = flags["start-time"];
        const prefs = MediaPrefs.parse(flags);

        const opts: IPlaybackOptions = {
            currentTime,
            prefs,
        };

        return cleanObject(opts);
    }
}
