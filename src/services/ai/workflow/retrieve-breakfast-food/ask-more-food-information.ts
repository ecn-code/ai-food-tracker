import { RoleEnum } from "../../../../types";
import { Context } from "../context";
import { State } from "../state";
import CheckFoodAnswer from "./check-food-answer";

export default class AskMoreFoodInformation implements State {
    private context: Context;
    private firstTime: boolean;

    constructor(context: Context) {
        this.context = context;
        this.firstTime = true;
    }

    public async run() {
        console.debug('Running AskMoreFoodInformation');

        if (this.firstTime) {
            const message = { role: RoleEnum.ASSISTANTE, content: `¿Desayunaste algo más?` };
            this.context.temporalChat.push(message);
            this.firstTime = false;
            return Promise.resolve({ message });
        }

        return this.context.transitionTo(new CheckFoodAnswer(this.context));
    }
}