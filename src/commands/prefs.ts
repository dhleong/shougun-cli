import { flags as flg } from "@oclif/command";
import cli from "cli-ux";

import { PlaybackOptions } from "../flags/playback";
import { RpcClient } from "../rpc";
import { RpcCommand } from "../rpc-command";
import { MediaPrefs } from "../flags/prefs";
import { IMediaPrefs } from '../model';

export default class Prefs extends RpcCommand {

    public static description = "Get or set prefs. Omit all flags to view";
    public static examples = [
        "$ prefs the good place",
        "$ prefs the good place --language en",
        "$ prefs --clear the good place",
    ];
    public static flags = {
        ...RpcCommand.flags,
        ...MediaPrefs.flags,

        clear: flg.boolean({
            description: "If set, remove all preferences",
        }),
    }
    public static args = [
        {name: "query"},
    ];

    public static strict = false;

    public async run() {
        const {argv, flags} = this.parse(Prefs);
        const rpc = await this.rpc(flags);
        const query = argv.join(" ");
        const prefs = MediaPrefs.parse(flags);

        const candidates = await rpc.search(query);
        if (!candidates) {
            this.error(`No series for: ${query}`);
            return;
        }

        const series = candidates[0];

        let newPrefs: IMediaPrefs | undefined;
        if (flags.clear) {
            await rpc.deletePrefsForSeries(series.id);
            this.log(`Cleared preferences for ${series.title}.`);
            return;
        } else if (!prefs) {
            newPrefs = await rpc.loadPrefsForSeries(series.id);
            this.log(`Preferences for ${series.title}:\n`);
        } else {
            newPrefs = await rpc.updatePrefsForSeries(series.id, prefs ?? {});
            this.log(`Updated preferences for ${series.title}:\n`);
        }

        cli.table([
            {
                name: "Preferred Audio Language",
                value: newPrefs?.preferredAudioLanguage ?? "(none)"
            },
        ], {
            name: {},
            value: {},
        });
    }
}
