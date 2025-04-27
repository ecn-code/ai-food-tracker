import { BranchDef, Constructor, StateDef, WorkFlowTaskEnum } from "../../../types";
import { OllamaService } from "../ollama-service";
import { Context } from "../workflow/context";
import { AIAutoTask } from "./aiAutoTask";
import { AIGate } from "./aiGate";
import { State } from "./state";
import { UserInput } from "./userInput";

export class WorkFlow {

    private context: Context;

    private constructor(context: Context) {
        this.context = context;
    }

    setUserInput(userInput: string) {
        this.context.setUserMessage(userInput);
    }

    run() {
        return this.context.run();
    }

    static builder(initialStateName: string | null) {
        return new WorkFlowBuilder(initialStateName);
    }

    static from(workFlowBuilder: WorkFlowBuilder) {
        const context = workFlowBuilder.getContext();
        if (!context) {
            throw new Error("Error creating workflow");

        }

        return new WorkFlow(context);
    }

}

class WorkFlowBuilder {

    private context: Context | null;
    private initialStateName: string | null;
    private definedStates: Map<string, Constructor<State>>;

    public constructor(initialStateName: string | null) {
        this.context = null;
        this.initialStateName = initialStateName;

        this.definedStates = new Map();
        this.registerState(WorkFlowTaskEnum.AI_AUTO_TASK.toString(), AIAutoTask);
        this.registerState(WorkFlowTaskEnum.AI_GATE.toString(), AIGate);
        this.registerState(WorkFlowTaskEnum.USER_INPUT.toString(), UserInput);
    }

    registerState(type: string, clazz: Constructor<State>) {
        this.definedStates.set(type, clazz);
    }

    getContext() {
        return this.context;
    }

    states(states: StateDef[]) {
        // Ensure there are no repeated names
        const stateNames = new Set(states.map(state => state.name));
        if (stateNames.size !== states.length) {
            throw new Error("State names must be unique.");
        }

        // Create a dependency graph
        const withoutDependency = '<<>>';
        const dependencyGraph = new Map<string, string[]>();
        states.forEach(state => {
            const nextState = (state as { nextStateName?: string }).nextStateName || withoutDependency;
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

        const createStates = (context: Context) => {
            const stateMap = new Map<string, State>();
            states.forEach(state => {
                const clazz = this.definedStates.get(state.type);
                if(!clazz) {
                    throw new Error(`${state.type} not supported`);
                }

                stateMap.set(state.name, new clazz(state, context));
            });
            return stateMap;
        };

        this.context = new Context(new OllamaService(), this.initialStateName, createStates);

        return this;
    }

    build() {
        return WorkFlow.from(this);
    }

}