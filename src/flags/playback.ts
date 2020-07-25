import { flags as flg } from "@oclif/command";

import { IPlaybackOptions } from "../model";

export class PlaybackOptions {
    public static flags = {
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
        const preferredAudioLanguage = flags.language;

        if (!(currentTime || preferredAudioLanguage)) {
            return;
        }

        const opts: IPlaybackOptions = {};

        if (currentTime) {
            opts.currentTime = currentTime;
        }

        if (preferredAudioLanguage) {
            opts.prefs = {
                preferredAudioLanguage,
            };
        }

        return opts;
    }
}
