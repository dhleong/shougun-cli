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

    export class MultiBar {
        constructor(
            options: IExtendedOptions | Options,
            preset?: Preset,
        );

        public create(
            totalValue: number,
            startValue: number,
            payload?: any,
        ): Bar;

        public remove(
            bar: Bar,
        ): void;

        public stop(): void;
    }
}
