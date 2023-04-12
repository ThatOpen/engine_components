import { Component, Components, Hideable, UIComponent } from "../../types"
import { Button } from "../ButtonComponent"
import { IContainerPosition } from "../UIManager"

interface IToolbarOptions {
    name?: string
    position?: IContainerPosition
}

type IToolbarDirection = "horizontal" | "vertical"

export class Toolbar extends Component<HTMLDivElement> implements Hideable, UIComponent {
    
    name: string
    domElement: HTMLDivElement = document.createElement("div")
    children: Button[] = []
    parent?: Button
    components: Components
    #position!: IContainerPosition
    #enabled: boolean = true
    #visible: boolean = true

    set visible(visible: boolean) {
        this.domElement.style.display = visible && this.hasElements? "flex" : "none"
        this.#visible = visible && this.hasElements
    }

    get visible() { return this.#visible }

    set enabled(enabled: boolean) {
        this.closeMenus()
        this.children.forEach( button => {
            button.enabled = enabled
            button.menu.enabled = enabled
        } )
        this.#enabled = enabled
    }

    get enabled() { return this.#enabled }

    set position(position: IContainerPosition) {
        this.#position = position
        this.updateElements()
    }

    get position() { return this.#position }

    constructor(components: Components, options?: IToolbarOptions) {
        super()
        this.components = components
        const _options: Required<IToolbarOptions> = {
            name: "Toolbar",
            position: "bottom",
            ...options
        }
        this.name = _options.name
        this.domElement.id = _options.name
        this.domElement.classList.add("tooeen-toolbar")
        this.position = _options.position
        this.visible = true
    }

    get hasElements() {
        return this.children.length > 0
    }

    get(): HTMLDivElement { return this.domElement }

    addButton(...button: Button[]) {
        button.forEach( btn => {
            btn.parent = this
            this.children.push(btn)
            this.domElement.append(btn.domElement)
        } )
        //@ts-ignore
        this.components.ui.updateToolbars()
    }

    updateElements() {
        this.children.forEach( button => button.parent = this )
    }

    closeMenus() {
        this.children.forEach( button => button.closeMenus() )
    }

    setDirection(direction: IToolbarDirection = "horizontal") {
        this.domElement.classList.remove("htoolbar", "vtoolbar")
        this.domElement.classList.add(`${direction[0]}toolbar`)
    }

}