import { UIComponent, Components, Component } from "../../"

export class TreeView extends Component<HTMLElement> implements UIComponent {

    #childrenContainer: HTMLDivElement = document.createElement("div")
    name: string
    enabled: boolean = true
    visible: boolean = true
    components: Components
    #expanded: boolean = false
    domElement: HTMLElement = document.createElement("div")
    children: UIComponent[] = []

    get expanded() { return this.#expanded }
    set expanded(expanded: boolean) {
        this.#expanded = expanded
        if (expanded) {
            this.#childrenContainer.style.display = "block"
        } else {
            this.#childrenContainer.style.display = "none"
        }
    }

    set onclick(listener: (e?: MouseEvent) => void) {
        this.domElement.onclick = e => {
            e.stopImmediatePropagation()
            listener(e)
        }
    }

    set onmouseover(listener: (e?: MouseEvent) => void) {
        this.domElement.onmouseover = e => {
            e.stopImmediatePropagation()
            listener(e)
        }
    }

    constructor(components: Components, name: string) {
        super()
        this.components = components
        this.name = name

        this.domElement.className = "tooeen-tree-item"

        const div = document.createElement("div")
        div.className = "tooeen-tree-item-title"
        const arrow = document.createElement("span")
        arrow.onclick = () => this.toggle()
        arrow.className = "material-icons"
        arrow.innerText = "arrow_right"
        const p = document.createElement("p")
        p.innerText = name
        div.append(arrow, p)
        this.domElement.append(div)

        this.#childrenContainer.className = "tooeen-tree-item-container"
        this.#childrenContainer.style.display = "none"
        this.domElement.append(this.#childrenContainer)
    }

    get(): HTMLElement {
        return this.domElement
    }

    dispose(onlyChildren = false) {
        this.children.forEach( child => child.dispose() )
        if (!onlyChildren) { 
            this.domElement.remove()
            this.#childrenContainer.remove()
        }
    }

    toggle(deep = false) {
        if (deep) {
            if (this.expanded) { this.collapse() } else { this.expand() }
        } else {
            this.expanded = !this.expanded
        }
    }

    addChild(...items: UIComponent[]) {
        items.forEach( item => {
            this.children.push(item)
            this.#childrenContainer.append(item.domElement)
        } )
    }

    collapse(deep = true) {
        this.expanded = false
        if (deep) {
            this.children.forEach( child => {
                if (child instanceof TreeView) { child.collapse(deep) }
            } )
        }
    }
    
    expand(deep = true) {
        this.expanded = true
        if (deep) {
            this.children.forEach( child => {
                if (child instanceof TreeView) { child.expand(deep) }
            } )
        }
    }

}