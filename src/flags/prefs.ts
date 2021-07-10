import { flags as flg } from "@oclif/command";

import { IMediaPrefs } from '../model';
import { cleanObject } from "../util/collection";

export class MediaPrefs {
    public static flags = {
        "language": flg.string({
            char: "l",
            description: "preferred audio language",
        }),

        "subtitle": flg.string({
            char: "s",
            description: "subtitle language",
        }),
    }

    public static parse(flags: any): IMediaPrefs | undefined {
        const preferredAudioLanguage = flags.language;
        const preferredSubtitleLanguage = flags.subtitle;

        return cleanObject({
            preferredAudioLanguage,
            preferredSubtitleLanguage,
        });
    }
}
