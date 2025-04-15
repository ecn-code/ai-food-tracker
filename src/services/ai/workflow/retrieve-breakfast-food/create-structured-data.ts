import { RoleEnum } from "../../../../types";
import { Context } from "../context";
import RetrieveNutritionalValues from "../retrieve-nutritional-values";
import { State } from "../state";

export default class CreateStructuredData implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        console.debug('Running CreateStructuredData');

        this.context.temporalChat.push({
            role: RoleEnum.USER,
            content: `
            Haz un json array con los platos y productos comidos en el desayuno en ingles
            Con la siguiente estructura:
            {
            "name": "<nombre del producto>", 
            "weight": <numero en gramos de la cantidad aproximada>, 
            "description": "<Que ingredientes podria tener ese producto>"
            }

            Solo responde con JSON no añadas ningún texto ni formato extra.
            `
        });
        const evaluation = await this.context.aiService.chat(this.context.temporalChat);

        console.log(evaluation.message);

        return this.context.transitionTo(new RetrieveNutritionalValues(this.context));
    }
}