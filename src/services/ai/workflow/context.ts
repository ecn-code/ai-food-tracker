import Track from "../../../components/models/Track";
import { AIMessageType } from "../../../types";
import { AIService } from "../ai-service";
import { RetrieveDateState } from "./retrieve-date/retrieve-date-state";
import { State } from "./state";

export class Context {
    aiService: AIService;
    track: Track;
    state: State;
    temporalChat: Array<AIMessageType>;

    constructor(aiService: AIService, track: Track) {
        this.track = track;
        this.aiService = aiService;
        this.state = new RetrieveDateState(this);
        this.temporalChat = [];
    }

    run() {
        return this.state.run();
    }

    transitionTo(state: State) {
        this.state = state;
        return this.run();
    }
}