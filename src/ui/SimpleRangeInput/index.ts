import { generateUUID } from "three/src/math/MathUtils";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";

interface SimpleTextInputConfig {
    name: string
    min?: number
    max?: number
    initialValue?: number
    label?: string
    id?: string
}

export class SimpleRangeInput extends SimpleUIComponent<HTMLElement> {

    name = "SimpleRangeInput"
    onChange: Event<globalThis.Event> = new Event()

    constructor(components: Components, config: SimpleTextInputConfig) {
        const { label, name, initialValue, min, max } = config
        const div = document.createElement("div")
        const id = config.id?? generateUUID().toLowerCase()
        div.innerHTML = `
        <label for="${name}" class="block leading-6 text-gray-300 ${!label? 'hidden' : ''}">${label}</label>
        <div class="mt-1">
            <input type="range" min="${min?? 0}" max="${max?? 10}" name="${name}" id="${id}-${name}-input" value="${initialValue}"
            class="block w-full rounded-md border-0 py-1.5 shadow-sm sm:text-sm sm:leading-6">
        </div>
        `
        requestAnimationFrame(() => {
            const input = document.getElementById(`${this.id}-${name}-input`) as HTMLInputElement
            input.addEventListener("change", e => this.onChange.trigger(e))
        })
        super(components, div, id)
    }

}