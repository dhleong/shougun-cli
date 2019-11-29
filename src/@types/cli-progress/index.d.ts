import { Options, Preset } from "cli-progress";

declare module "cli-progress" {
    export class MultiBar {
        constructor(
           options: Options,
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
