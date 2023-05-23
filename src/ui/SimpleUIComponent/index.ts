import { generateUUID } from 'three/src/math/MathUtils'
import { Component, UIComponent } from '../../base-types'
import { Components } from '../../core'

export class SimpleUIComponent<T extends HTMLElement = HTMLElement> extends Component<T> implements UIComponent {

    name: string = "SimpleUIComponent"
    domElement: T
    children: UIComponent[] = []
    components: Components
    id: string
    protected _enabled: boolean = true
    protected _visible: boolean = true

    get visible() { return this._visible }
    set visible(visible: boolean) { this._visible = visible }

    get enabled() { return this._enabled }
    set enabled(enabled: boolean) { this._enabled = enabled }
    
    constructor(components: Components, domElement: T, id?: string) {
        super()
        this.components = components
        this.domElement = domElement
        this.id = id?? generateUUID().toLowerCase()
    }

    get(): T {
        return this.domElement
    }

    dispose(onlyChildren = false) {
        this.children.forEach( child => child.dispose() )
        if (!onlyChildren) {this.domElement.remove()}
    }

    addChild(...items: UIComponent[]) {
        items.forEach( item => {
            this.children.push(item)
            this.domElement.append(item.domElement)
        } )
    }

    htmlToElement(htmlString: string) {
        var template = document.createElement('template')
        htmlString = htmlString.trim() // Never return a text node of whitespace as the result
        template.innerHTML = htmlString
        return template.content.firstChild
    }

}