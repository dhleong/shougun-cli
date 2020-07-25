import { flags as flg } from "@oclif/command";

import { IMediaPrefs } from '../model';

export class MediaPrefs {
    public static flags = {
        "language": flg.string({
            char: "l",
            description: "preferred audio language",
        }),
    }

    public static parse(flags: any): IMediaPrefs | undefined {
        const preferredAudioLanguage = flags.language;
        if (!preferredAudioLanguage) return;

        return {
            preferredAudioLanguage,
        };
    }
}
