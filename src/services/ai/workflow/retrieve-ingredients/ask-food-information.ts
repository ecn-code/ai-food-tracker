import { RoleEnum } from "../../../../types";
import { Context } from "../context";
import { State } from "../state";
import CheckFoodAnswer from "./check-food-answer";

export default class AskFoodInformation implements State {
    private context: Context;
    private firstTime: boolean;

    constructor(context: Context) {
        this.context = context;
        this.firstTime = true;
        this.context.temporalChat = [];
    }

    public async run() {
        console.debug('Running AskFoodInformation');

        if (this.firstTime) {
            //TODO: mensaje más personalizado y distinto cada vez
            const message = { role: RoleEnum.ASSISTANTE, content: `¿Que desayunaste el día ${this.context.track.date}?` };
            this.context.temporalChat.push(message);
            this.firstTime = false;
            return Promise.resolve({ message });
        }

        return this.context.transitionTo(new CheckFoodAnswer(this.context));
    }
}