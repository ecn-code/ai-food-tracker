import { RoleEnum } from "../../../types";
import { Context } from "./context";
import { State } from "./state";

export default class RetrieveNutritionalValues implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        return Promise.resolve({ message: { role: RoleEnum.ASSISTANTE, content: "Gracias por la información. Estamos buscando toda la información nutricional que podras consultar en el dashboard." } });
    }
}