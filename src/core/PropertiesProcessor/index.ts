import * as webIfc from "web-ifc"
import { UI, UIComponent, Component } from "../../base-types"
import { TreeView, SimpleUIComponent } from "../../ui"
import { Components } from "../../core"
import { FragmentGroup, FragmentManager, FragmentHighlighter } from "../../fragments"

interface IPropData {
    name: string
    value: number | boolean | string
    type: number
    group: string
}

interface IEntityAttributes {
    globalId: IPropData
    ifcEntity: IPropData
    name?: IPropData
    predefinedType?: IPropData
    description?: IPropData
    longName?: IPropData
    tag?: IPropData
    type?: IPropData
}

interface IModelProp {
    [propertyName: string]: IPropData
}

interface IModelProperties {
    [expressID: string]: IModelProp
}

interface IPropertiesList {
    [modelID: string]: IModelProperties
}

interface IComponentConfig {
    selectionHighlighter: string
}

class PropertiesContainer extends SimpleUIComponent {
    name: string = "PropertiesContainer"
    constructor(components: Components) {
        const container = document.createElement("div")
        super(components, container)
    }
}

class PropertiesTable extends SimpleUIComponent {
    name: string = "PropertiesTable"
    constructor(components: Components) {
        const table = document.createElement("table")
        table.className = "ifcjs-table"
        super(components, table)
    }
}

export class PropertiesProcessor extends Component<IPropertiesList> implements UI {

    name: string = "PropertiesParser"
    enabled: boolean = true
    components: Components
    uiElement!: PropertiesContainer
    private _fragmentsHighlighter: FragmentHighlighter
    private _fragmentsManager: FragmentManager
    private _map: IPropertiesList = {}
    private _config: IComponentConfig = {
        selectionHighlighter: "select"
    }

    constructor(components: Components, fragmentManager: FragmentManager, fragmentHighlighter: FragmentHighlighter, config?: IComponentConfig) {
        super()
        this.components = components
        this._config = {...this._config, ...config}
        this._fragmentsManager = fragmentManager
        this._fragmentsHighlighter = fragmentHighlighter
        this.setEventListeners()
        this.setUI()
    }

    private setUI() {
        this.uiElement = new PropertiesContainer(this.components)
    }

    private setEventListeners() {
        const highlighterEvents = this._fragmentsHighlighter.events
        highlighterEvents[this._config.selectionHighlighter]?.onClear.on( () => this.uiElement.dispose(true) )
        highlighterEvents[this._config.selectionHighlighter]?.onHighlight.on( selection => {
            const fragmentIDs = Object.keys(selection)
            if (fragmentIDs.length !== 1) {
                this.uiElement.dispose(true)
                return
            }
            const fragmentID = fragmentIDs[0]
            const expressIDs = [...selection[fragmentID]]
            if (expressIDs.length !== 1) {
                this.uiElement.dispose(true)
                return
            }
            const expressID = expressIDs[0]
            const modelID = this._fragmentsManager.list[fragmentID].mesh.parent?.uuid
            if (!modelID) { return }
            this.renderProperties(modelID, expressID)
        } )
    }

    get(): IPropertiesList { return this._map }

    process(model: FragmentGroup) {
        const props: IModelProperties = {}
        this.processElements(model, props)
        this.processStoreys(model, props)
        this.processQsets(model, props)
        this.processPsets(model, props)
        this._map[model.uuid] = props
        return props
    }

    groupProperties(props: IModelProp) {
        const groups: Record<string, IPropData[]> = {}
        for (const name in props) {
            const prop = props[name]
            if (!groups[prop.group]) { groups[prop.group] = [] }
            groups[prop.group].push(prop)
        }
        return groups
    }

    renderProperties(modelID: string, expressID: string) {
        this.uiElement.dispose(true)
        const modelProperties = this.get()[modelID]
        if (!modelProperties) { return }
        const elementProperties = modelProperties[expressID]
        if (!elementProperties) { return }
        const groupedProperties = this.groupProperties(elementProperties)
        for (const groupName in groupedProperties) {
            const groupTree = new TreeView(this.components, groupName)
            this.uiElement.addChild(groupTree)
            const props = groupedProperties[groupName]

            //#region Group properties 
            const propsTable: UIComponent = new PropertiesTable(this.components)
            const tableStructure = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody></tbody>
            `
            propsTable.domElement.innerHTML = tableStructure
            const tableBody = propsTable.domElement.querySelector("tbody") as HTMLElement
            //#endregion

            groupTree.addChild(propsTable)
            props.forEach( prop => {
                const value = typeof prop.value === "number"? prop.value.toPrecision(4) : prop.value
                const propRow = `<tr><td>${prop.name}</td><td>${value}</td></tr>`
                tableBody.innerHTML += propRow
            } )
            groupTree.expand(true)
        }
    }

    private storeProperty(props: IModelProperties, expressID: number, data: IPropData) {
        if (!props[expressID]) { props[expressID] = {} }
        props[expressID][data.name] = data
    }

    /**
     * @description Foundation function that returns basic entity information such as name, description, type, globalID and tag. That information is called attributes in the IFC Schema.
     * @param model 
     * @param expressID 
     * @param prefix 
     */
    private processAttributes(model: FragmentGroup, expressID: number, options?: { group?: string, prefix?: string }) {
        const _options = { group: "Attributes", prefix: "", ...options }
        const { group, prefix } = _options
        const props = model.properties[expressID]
        const attributes: IEntityAttributes = {
            globalId: { name: `${prefix}GlobalId`, value: props.GlobalId.value, type: props.GlobalId.type, group: group},
            ifcEntity: { name: `${prefix}IfcEntity`, value: model.allTypes[props.type], type: 1, group: group }
        }
        if (props.Name) {
            attributes.name = { name: `${prefix}Name`, value: props.Name.value, type: props.Name.type, group: group}
        }
        if (props.Description) {
            attributes.description = { name: `${prefix}Description`, value: props.Description.value, type: props.Description.type, group: group}
        }
        if (props.Tag) {
            attributes.tag = { name: `${prefix}Tag`, value: props.Tag.value, type: props.Tag.type, group: group}
        }
        if (props.ObjectType) {
            attributes.type = { name: `${prefix}Type`, value: props.ObjectType.value, type: props.ObjectType.type, group: group}
        }
        if (props.LongName) {
            attributes.longName = { name: `${prefix}LongName`, value: props.LongName.value, type: props.LongName.type, group: group}
        }
        return attributes
    }

    private processElements(model: FragmentGroup, props: IModelProperties) {
        const properties = model.properties
        const arrayProperties = Object.values(properties)
        const building: any = arrayProperties.find( (prop: any) => prop.type === webIfc.IFCBUILDING )
        const { globalId, type, tag, ifcEntity, ...buildingAttributes } = this.processAttributes(model, building.expressID, { group: "Building", prefix: "Building" })
        model.fragments.forEach( fragment => {
            fragment.items.forEach( expressID => {
                const elementAttributes = this.processAttributes(model, Number(expressID))
                for (const name in elementAttributes) {
                    //@ts-ignore
                    const attribute = elementAttributes[name]
                    this.storeProperty(props, Number(expressID), attribute)
                }
                for (const name in buildingAttributes) {
                    //@ts-ignore
                    const attribute = buildingAttributes[name]
                    this.storeProperty(props, Number(expressID), attribute)
                }
            } )
        } )
    }

    private processPsets(model: FragmentGroup, props: IModelProperties) {
        const properties = model.properties
        const arrayProperties = Object.values(properties)
        const psetRels = arrayProperties.filter( (prop: any) => {
            const isRel = prop.type === webIfc.IFCRELDEFINESBYPROPERTIES
            const propertyDefinitionID = prop.RelatingPropertyDefinition?.value
            const isPset = properties[propertyDefinitionID]?.type === webIfc.IFCPROPERTYSET
            return isRel && isPset
        } )
        psetRels.forEach( (rel: any) => {
            const definition = properties[rel.RelatingPropertyDefinition.value]
            const elements = rel.RelatedObjects.map( (obj: any) => { return obj.value } )
            elements.forEach( (expressID: number) => {
                const definitionProperties = definition.HasProperties.map( (prop: any) => { return properties[prop.value] } )
                definitionProperties.forEach( (prop: any) => {
                    const value = prop.NominalValue?.label === "IFCBOOLEAN"? prop.NominalValue.value === "T"? true : false : prop.NominalValue?.value
                    const data: IPropData = {
                        name: prop.Name.value,
                        value: value,
                        type: prop.NominalValue?.type,
                        group: definition.Name.value
                    }
                    this.storeProperty(props, expressID, data)
                } )
            } )
        } )
    }
    
    private processQsets(model: FragmentGroup, props: IModelProperties) {
        const properties = model.properties
        const arrayProperties = Object.values(properties)
        const qsetRels = arrayProperties.filter( (prop: any) => {
            const isRel = prop.type === webIfc.IFCRELDEFINESBYPROPERTIES
            const propertyDefinitionID = prop.RelatingPropertyDefinition?.value
            const isQset = properties[propertyDefinitionID]?.type === webIfc.IFCELEMENTQUANTITY
            return isRel && isQset
        } )
        qsetRels.forEach( (rel: any) => {
            const definition = properties[rel.RelatingPropertyDefinition.value]
            const elements = rel.RelatedObjects.map( (obj: any) => { return obj.value } )
            elements.forEach( (expressID: number) => {
                const definitionQuantities = definition.Quantities.map( (prop: any) => { return properties[prop.value] } )
                definitionQuantities.forEach( (qto: any) => {
                    const entityName = model.allTypes[qto.type]
                    let valuePropName = entityName.replace(/IFCQUANTITY/, "").toLowerCase()
                    valuePropName = valuePropName[0].toUpperCase() + valuePropName.slice(1) + "Value"
                    const data: IPropData = {
                        name: qto.Name.value,
                        value: qto[valuePropName].value,
                        type: qto[valuePropName].type,
                        group: definition.Name.value
                    }
                    this.storeProperty(props, expressID, data)
                } )
            } )
        } )

    }

    private processStoreys(model: FragmentGroup, props: IModelProperties) {
        const properties = model.properties
        const arrayProperties = Object.values(properties)
        const spatialRelations = arrayProperties.filter( (prop: any) => {
            return prop.type === webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE
        } )
        spatialRelations.forEach( (rel: any) => {
            const elements = rel.RelatedElements.map( (el: any) => { return el.value } )
            const structure = properties[rel.RelatingStructure.value]
            if (structure.type === webIfc.IFCBUILDINGSTOREY) {
                const { globalId, type, tag, ifcEntity, ...storeyAttributes } = this.processAttributes(model, structure.expressID, { group: "Storey", prefix: "Storey" })
                const elevation: IPropData = {
                    name: "StoreyElevation",
                    group: "Storey",
                    value: structure.Elevation.value,
                    type: structure.Elevation.type,
                }
                elements.forEach( (expressID: number) => {
                    this.storeProperty(props, expressID, elevation)
                    for (const name in storeyAttributes) {
                        //@ts-ignore
                        const attribute = storeyAttributes[name]
                        this.storeProperty(props, expressID, attribute)
                    }
                } )
            }
        } )
    }

    // createGroupSystem(propName: string, autoAdd: boolean) {

    // }

}