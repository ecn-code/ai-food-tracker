import { RoleEnum } from "../../../types";
import { Context } from "./context";
import { State } from "../core/state";

export default class RetrieveNutritionalValues implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        console.debug('Running RetrieveNutritionalValues');

        this.context.food.forEach(element => {
            console.log(element);
        });

        return Promise.resolve({ message: { role: RoleEnum.ASSISTANT, content: "Gracias por la información. Estamos buscando toda la información nutricional que podras consultar en el dashboard." } });
    }
}