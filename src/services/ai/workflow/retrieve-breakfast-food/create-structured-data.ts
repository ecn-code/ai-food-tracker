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
            [{
                "name": "<nombre del producto>",
                "search": "<nombre por el que podriamos buscarlo en la BD de FoodData Central API | nulo si no podemos>",
                "ingredients": "<ingredientes que tiene esa preparacion>",
                "weight": <numero en gramos de la cantidad aproximada>, 
                "description": "<Que ingredientes podria tener ese producto>"
            }]

            Solo responde con JSON no añadas ningún texto ni formato extra.
            `
        });
        const evaluation = await this.context.aiService.chat(this.context.temporalChat);

        console.log(evaluation.message);
        this.context.food = JSON.parse(evaluation.message.content);

        return this.context.transitionTo(new RetrieveNutritionalValues(this.context));
    }
}