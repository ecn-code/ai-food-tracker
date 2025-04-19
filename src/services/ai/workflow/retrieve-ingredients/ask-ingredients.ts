import { RoleEnum } from "../../../../types";
import { Context } from "../context";
import { IngredientState } from "../ingredientState";
import { State } from "../state";
import CheckEnd from "./checkEnd";

export default class AskIngredients
    implements State {
    private context: Context;
    private firstTime: boolean;

    constructor(context: Context) {
        this.context = context;
        this.firstTime = true;
    }

    public async run() {
        console.debug('Running AskIngredients');

        if (this.firstTime) {
            const message = { role: RoleEnum.ASSISTANTE, content: `¿Que ingredientes tiene?` };
            this.context.pushMessage(message);
            this.firstTime = false;
            return Promise.resolve({ message });
        }

        return this.context.transitionTo(new IngredientState(
            this.context,
            (context) => new AskIngredients(context),
            (context) => new CheckEnd(context))
        );
    }
}