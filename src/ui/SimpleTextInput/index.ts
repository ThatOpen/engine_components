import { generateUUID } from "three/src/math/MathUtils";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";

interface SimpleTextInputConfig {
    name: string
    initialValue?: string
    label?: string
    placeholder?: string
    id?: string
}

export class SimpleTextInput extends SimpleUIComponent<HTMLElement> {

    name = "SimpleTextInput"
    onChange: Event<globalThis.Event> = new Event()

    constructor(components: Components, config: SimpleTextInputConfig) {
        const { label, name, placeholder } = config
        const div = document.createElement("div")
        const id = config.id?? generateUUID().toLowerCase()
        div.innerHTML = `
        <label for="${name}" class="block leading-6 text-gray-300 ${!label? 'hidden' : ''}">${label}</label>
        <div class="mt-1">
            <input type="email" name="${name}" id="${id}-${name}-input" 
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-ifcjs-200 sm:text-sm sm:leading-6" 
            ${placeholder? `placeholder="${placeholder}"` : ''}>
        </div>
        `
        requestAnimationFrame(() => {
            const input = document.getElementById(`${this.id}-${name}-input`) as HTMLInputElement
            input.addEventListener("change", e => this.onChange.trigger(e))
        })
        super(components, div, id)
    }

}