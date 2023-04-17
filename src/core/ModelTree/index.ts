import { TreeView, UI, Component, Components, Fragments } from "../../"

export interface ITreeStructure {
    name: string
    children: ElementTreeItem[]
}

interface IElementTreeItem {
    name: string
    filter: { [groupSystemName: string]: string }
    children: ElementTreeItem[]
}

class ElementTreeItem extends Component<IElementTreeItem> implements IElementTreeItem, UI {

    name: string
    enabled: boolean = true
    filter: { [groupSystemName: string]: string } = {}
    components: Components
    uiElement: TreeView
    fragments?: Fragments
    private _children: ElementTreeItem[] = []

    get children() { return this._children }
    set children(children: ElementTreeItem[]) {
        this._children = children
        children.forEach( child => this.uiElement.addChild(child.uiElement) )
    }
    
    constructor(components: Components, name: string) {
        super()
        this.components = components
        const fragments = components.tools.get("Fragments") as Fragments | undefined
        if (!fragments) { throw new Error() }
        this.fragments = fragments
        this.name = name
        this.uiElement = new TreeView(this.components, name)
        this.uiElement.onclick = () => this.select()
        this.uiElement.onmouseover = () => this.highlight()
    }

    get(): IElementTreeItem { return { name: this.name, filter: this.filter, children: this.children } }

    select() {
        if (!this.fragments) { return }
        const highlighter = this.fragments.highlighter
        const groups = this.fragments.groups
        highlighter.highlightByID("select", groups.get(this.filter))
    }

    highlight() {
        if (!this.fragments) { return }
        const highlighter = this.fragments.highlighter
        const groups = this.fragments.groups
        highlighter.highlightByID("highlight", groups.get(this.filter))
    }

}

export class ModelTree extends Component<ElementTreeItem> implements UI {

    uiElement: TreeView
    name: string
    enabled: boolean = true
    components: Components
    groupSystemNames: string[]
    functionsMap: {[groupSystemName: string]: () => void} = {}
    fragments?: Fragments
    private _tree: ElementTreeItem

    constructor(components: Components, name: string, groupSystemNames: string[]) {
        super()
        this.components = components
        const fragments = components.tools.get("Fragments") as Fragments | undefined
        if (!fragments) { throw new Error("ModelTree needs Fragments in order to work properly. Try const fragments = new Fragments(components) and then components.tools.add(fragments).") }
        this.fragments = fragments
        this.name = name
        this.groupSystemNames = groupSystemNames
        this._tree = new ElementTreeItem(this.components, this.name)
        this.uiElement = this._tree.uiElement
    }

    /**
     * @description In case ModelTree.build() is called and the current groupSystemName in the iteration doesn't exists, the builder calls the getter function to create the groupSystem.
     * @param groupSystemName 
     * @param getter 
     */
    // setGroupSystemGetter(groupSystemName: string, getter: () => void) {
    //     const nameExists = this.groupSystemNames.includes(groupSystemName)
    //     if (!nameExists) { return }
    //     this.functionsMap[groupSystemName] = getter
    // }
    
    get(): ElementTreeItem { return this._tree }

    build() {
        this._tree.children = this.process(this.groupSystemNames)
        return this.get()
    }

    // TODO: Check more in detail this update method.
    update() {
        this.uiElement.dispose()
        this._tree.uiElement.dispose()
        this.build() 
        return this.get() 
    }

    private process(groupSystemNames: string[], result = {}) {
        const groups: ElementTreeItem[] = []
        if (!this.fragments) { return groups }
        const currentSystemName = groupSystemNames[0] //storeys
        const systemGroups = this.fragments.groups.groupSystems[currentSystemName]
        if (!currentSystemName || !systemGroups) { return groups }
        for (const name in systemGroups) { //name is N00, N01, N02...
            const filter = { ...result, [currentSystemName]: name } // { storeys: "N00" }, { storeys: "N01" }...
            const hasElements = Object.keys(this.fragments.groups.get(filter)).length > 0
            if (hasElements) {
                const treeItemName = currentSystemName[0].toUpperCase() + currentSystemName.slice(1) // Storeys
                const treeItem = new ElementTreeItem(this.components, `${treeItemName}: ${name}`) // Storeys: N01
                treeItem.filter = filter
                groups.push(treeItem)
                treeItem.children = this.process(groupSystemNames.slice(1), filter)
            }
        }
        return groups
    }
      

}