import { generateUUID } from "three/src/math/MathUtils";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";

interface SimpleTextInputConfig {
    name: string
    initialValue?: string
    label?: string
    id?: string
}

export class SimpleColorInput extends SimpleUIComponent<HTMLElement> {

    name = "SimpleColorInput"
    onChange: Event<globalThis.Event> = new Event()

    constructor(components: Components, config: SimpleTextInputConfig) {
        const { label, name, initialValue } = config
        const div = document.createElement("div")
        const id = config.id?? generateUUID().toLowerCase()
        div.innerHTML = `
        <label for="${name}" class="block leading-6 text-gray-300 ${!label? 'hidden' : ''}">${label}</label>
        <div class="mt-1">
            <input type="color" name="${name}" id="${id}-${name}-input" value="${initialValue}"
            class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300
            focus:ring-2 focus:ring-inset focus:ring-ifcjs-200 sm:text-sm sm:leading-6">
        </div>
        `
        requestAnimationFrame(() => {
            const input = document.getElementById(`${this.id}-${name}-input`) as HTMLInputElement
            input.addEventListener("change", e => this.onChange.trigger(e))
        })
        super(components, div, id)
    }

}