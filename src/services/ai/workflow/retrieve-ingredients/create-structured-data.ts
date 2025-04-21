import { RoleEnum } from "../../../../types";
import { Context } from "../context";
import RetrieveNutritionalValues from "../retrieveNutritionalValues";
import { State } from "../../core/state";

export default class CreateStructuredData implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        console.debug('Running CreateStructuredData');

        this.context.pushMessage({
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
        const evaluation = await this.context.aiService.chat(this.context.getMessages());

        console.log(evaluation.message);
        this.context.food = JSON.parse(evaluation.message.content);
        this.context.food.forEach(async ingredient => {
            try {
                const API_KEY = import.meta.env.VITE_APP_FDC_API_KEY;
                const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${ingredient.search}&dataType=Foundation,SR%20Legacy&requireAllWords=true&api_key=${API_KEY}`);
                if (!response.ok) {
                    console.error(`Failed to fetch data for ingredient: ${ingredient}`);
                    return;
                }
                const data = await response.json();
                console.log(`Data for ${ingredient}:`, data);

                const foodNutrients = await this.context.aiService.generate(`
                    Analiza el siguiente json:
                    |${JSON.stringify(data)}|
        
                    Selecciona un item del array foods, y luego selecciona de ese los foodNutrients que tienen valor.
        
                    Responde solo en formato JSON con los nutrientes.
                `);
                console.log(foodNutrients);
                
            } catch (error) {
                console.error(`Error fetching data for ingredient: ${ingredient}`, error);
            }
        });

        return this.context.transitionTo(new RetrieveNutritionalValues(this.context));
    }
}