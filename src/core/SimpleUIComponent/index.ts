import { Component, Components, UIComponent } from '../../'

export class SimpleUIComponent extends Component<HTMLElement> implements UIComponent {

    name: string = "SimpleUIComponent"
    domElement: HTMLElement
    children: UIComponent[] = []
    components: Components
    private _enabled: boolean = true
    private _visible: boolean = true

    get visible() { return this._visible }
    set visible(visible: boolean) { this._visible = visible }

    get enabled() { return this._enabled }
    set enabled(enabled: boolean) { this._enabled = enabled }
    
    constructor(components: Components, domElement: HTMLElement) {
        super()
        this.components = components
        this.domElement = domElement
    }

    get(): HTMLElement {
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

}