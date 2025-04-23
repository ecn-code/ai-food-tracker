import { StateDef, WorkFlowTaskEnum } from "../../../types";
import { OllamaService } from "../ollama-service";
import { Context } from "../workflow/context";
import { AIAutoTask } from "./aiAutoTask";
import { AIGate } from "./aiGate";
import { State } from "./state";
import { UserInput } from "./userInput";

export class WorkFlow {

    private states: State[];

    private constructor(states: State[]) {
        this.states = states;
    }

    static from(states: StateDef[]) {
        // Ensure there are no repeated names
        const stateNames = new Set(states.map(state => state.name));
        if (stateNames.size !== states.length) {
            throw new Error("State names must be unique.");
        }

        // Create a dependency graph
        const withoutDependency = '<<>>';
        const dependencyGraph = new Map<string, string[]>();
        states.forEach(state => {
            const nextState = state.nextStateName || withoutDependency;
            if (!dependencyGraph.has(nextState)) {
                dependencyGraph.set(nextState, []);
            }
            dependencyGraph.get(nextState)!.push(state.name);
        });

        // Check all nextStates (keys of dependencyGraph) exist in stateNames
        dependencyGraph.forEach((_, nextState) => {
            if (nextState !== withoutDependency && !stateNames.has(nextState)) {
                throw new Error(`Invalid nextStateName: ${nextState} does not exist in state definitions.`);
            }
        });

        const context = new Context(new OllamaService());

        const stateInstances: State[] = [];
        states.forEach(state => {
            switch (state.type) {
                case WorkFlowTaskEnum.AI_AUTO_TASK:
                    stateInstances.push(new AIAutoTask(state.prompt, context, state.nextStateName));
                    break;
                case WorkFlowTaskEnum.AI_GATE:
                    stateInstances.push(new AIGate(context, state.branches));
                    break;
                case WorkFlowTaskEnum.USER_INPUT:
                    stateInstances.push(new UserInput(state.feedback, context, state.nextStateName));
                    break;
                default:
                    throw new Error(`Invalid state: ${state} does not exist in state definitions.`);
            }
        });

        return new WorkFlow(stateInstances);
    }

}