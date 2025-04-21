import { AIResponseType } from "../../../types";

export interface State {
    run(): Promise<AIMessageType>;
}