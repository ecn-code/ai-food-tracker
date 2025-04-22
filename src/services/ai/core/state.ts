import { AIMessageType } from "../../../types";

export interface State {
    run(): Promise<AIMessageType>;
    name(): string;
}