import { AIMessageType, RoleEnum } from "../../types";
import { State } from "./core/state";

export class GetIngredientInformation extends State {

    async run(): Promise<AIMessageType> {
        const chat = this.context.getChat();
        const ingredient = chat[chat.length - 1].content;
        try {
            console.log('ingredient: ', ingredient)
            const API_KEY = import.meta.env.VITE_APP_FDC_API_KEY;
            const response = await this.fetch(ingredient, API_KEY);
            if (!response.ok) {
                console.error(`Failed to fetch data for ingredient: ${ingredient}`);
                return Promise.resolve({ role: RoleEnum.ASSISTANT, content: "Error fetching" });
            }
            const data: {foods: Array<{description: string, foodNutrients: Array<{nutrientName: string, value: number, unitName: string}>}>} = await response.json();
            console.log(`Data for ${ingredient}:`, data);

            const foodDescriptions = data.foods.map((food, index) => `${index}. ${food.description}`).join('\n');
            const generatedMessage = await this.context.aiService.generate(`
                Message:
                |${foodDescriptions}|
    
                "Which number fits better with ${ingredient}. 
                
                Respond with a JSON object and nothing else:
                 {"number": <the number>}"
            `);
            console.log("number: ", generatedMessage.response);
            const index = JSON.parse(generatedMessage.response).number;
            const food = data.foods[index];
            const foodNutrients = food.foodNutrients
            .filter(nutrient => nutrient.value > 0)
            .map(nutrient => `${nutrient.nutrientName}: ${nutrient.value}${nutrient.unitName}`)
            .join('\n');

            return Promise.resolve({ role: RoleEnum.ASSISTANT, content: foodNutrients });
        } catch (error) {
            console.error(`Error fetching data for ingredient: ${ingredient}`, error);
        }
        return Promise.resolve({ role: RoleEnum.ASSISTANT, content: "Error fetching" });
    }

    private async fetch(ingredient: string, API_KEY: string) {
        return fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${ingredient}&dataType=Foundation,SR%20Legacy&requireAllWords=true&api_key=${API_KEY}`);
    }

}