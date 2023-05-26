import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";
import { generateUUID } from "three/src/math/MathUtils";

interface ICardInfo {
    title: string
    description: string
    id?: string
}

export class SimpleUICard extends SimpleUIComponent<HTMLDivElement> {

    name: string = "UICard"

    constructor(components: Components, info: ICardInfo) {
        const card = document.createElement("div")
        card.className = "bg-ifcjs-100 p-2 text-white flex flex-col rounded-lg border-transparent border border-solid hover:border-ifcjs-200 hover:bg-ifcjs-200 hover:bg-opacity-5"
        const id = info.id?? generateUUID()
        const template = `
            <div id="${id}-before-title"></div>
            <h3 class="font-bold" id="${id}-title">${info.title}</h3>
            <div id="${id}-before-description"></div>
            <p id="${id}-description">${info.description}</p>
            <div id="${id}-after-description"></div>
        `
        card.innerHTML = template
        super(components, card, id)
    }

}