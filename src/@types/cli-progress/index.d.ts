import { Options, Preset } from "cli-progress";

declare module "cli-progress" {
    type FormatFn = (
        options: Options,
        params: any,
        payload: any,
    ) => string;

    export interface IExtendedOptions {
        format?: FormatFn;
    }
}
