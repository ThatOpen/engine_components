import { SimpleDimensionLine } from "../../core/SimpleDimensions/simple-dimension-line";
import { SimpleDimensions } from "../../core";
import { Vector3 } from "three";
import { UI, Component, Event } from "../../base-types";
import { Button, SimpleUICard, FloatingWindow } from "../../ui";
import { Components } from "../../core";
import { FragmentManager, FragmentGrouper, FragmentHighlighter, HighlightMap } from "../../fragments";
import { generateUUID } from "three/src/math/MathUtils";
import { DrawManager } from "../../annotation";
import { OrthoPerspectiveCamera } from "../OrthoPerspectiveCamera";
import { CameraProjection } from "../OrthoPerspectiveCamera/src/types";

export interface IViewpointsManagerConfig {
    selectionHighlighter: string
    fragmentManager: FragmentManager
    fragmentGrouper: FragmentGrouper
    fragmentHighlighter: FragmentHighlighter
    drawManager?: DrawManager
}

export interface IViewpoint {
    guid: string
    title: string
    description: string | null
    position: Vector3 
    target: Vector3
    selection: HighlightMap
    projection: CameraProjection
    dimensions: {start: Vector3, end: Vector3}[]
    filter?: { [groupSystem: string]: string }
    annotations?: SVGGElement
}

export class ViewpointsManager extends Component<string> implements UI {

    private _components: Components
    private _fragmentManager: FragmentManager
    private _fragmentGrouper: FragmentGrouper
    private _fragmentHighlighter: FragmentHighlighter
    private _drawManager?: DrawManager
    name: string = "ViewpointsManager"
    uiElement!: {
        mainButton: Button
        newButton: Button
        window: FloatingWindow
    }
    enabled: boolean = true
    list: IViewpoint[] = []
    selectionHighlighter: string
    onViewpointViewed: Event<string> = new Event()
    onViewpointAdded: Event<string> = new Event()

    constructor(components: Components, config: IViewpointsManagerConfig) {
        super()
        this._components = components
        this.selectionHighlighter = config.selectionHighlighter
        this._fragmentGrouper = config.fragmentGrouper
        this._fragmentHighlighter = config.fragmentHighlighter
        this._fragmentManager = config.fragmentManager
        this._drawManager = config.drawManager
        this._setUI()
    }

    private _setUI() {
        const viewerContainer = this._components.renderer.get().domElement.parentElement as HTMLElement
        const window = new FloatingWindow(this._components, {title: "Viewpoints"})
        viewerContainer.append(window.get())
        window.visible = false
        const mainButton = new Button(this._components, {materialIconName: "photo_camera"})
        const newButton = new Button(this._components, {materialIconName: "add", name: "New viewpoint"})
        const listButton = new Button(this._components, {materialIconName: "format_list_bulleted", name: "Viewpoints list"})
        listButton.onclick = () => {window.visible = !window.visible}
        mainButton.addButton(listButton, newButton)
        this.uiElement = { mainButton, newButton, window }
    }

    get(): string {
        throw new Error("Method not implemented.");
    }

    add(data: {title: string, description: string | null}) {
        const { title, description } = data
        if (!title) { return }

        const guid = generateUUID().toLowerCase()

        //#region Store dimensions
        const dimensions: {start: Vector3, end: Vector3}[] = []
        const dimensionsComponent = this._components.tools.get("SimpleDimensions") as SimpleDimensions | undefined
        if (dimensionsComponent) {
            dimensionsComponent.get().forEach( dimension => {
                dimensions.push( {start: dimension.start, end: dimension.end} )
            } )
        }
        //#endregion

        //#redgion Store selection
        const selection = this._fragmentHighlighter.selection[this.selectionHighlighter]
        //#endregion
        
        //#region Store filter (WIP)
        // const filter = {entities: "IFCBEAM", storeys: "N07"}
        //#endregion

        //#region Store camera position and target
        const camera = this._components.camera as OrthoPerspectiveCamera
        const controls = camera.controls
        const target = new Vector3()
        const position = new Vector3()
        controls.getTarget(target)
        controls.getPosition(position)
        const projection = camera.getProjection()
        //#endregion

        //#region Store annotations
        const annotations = this._drawManager?.saveDrawing(guid)
        //#endregion

        const viewpoint: IViewpoint = {
            guid,
            title, 
            target, 
            position, 
            selection,
            // filter, 
            description,
            dimensions,
            annotations,
            projection
        }

        //#region UI representation
        const card = new SimpleUICard(this._components, {title, description: description?? "", id: viewpoint.guid})
        card.domElement.onclick = () => this.view(viewpoint.guid)
        this.uiElement.window.addChild(card)
        //#endregion

        this.list.push( viewpoint )
        this.onViewpointAdded.trigger(guid)
        return viewpoint
    }

    retrieve(guid: string) {
        return this.list.find(v => v.guid === guid)
    }

    view(guid: string) {
        const viewpoint = this.retrieve(guid)
        if (!viewpoint) { return }

        //#region Recover annotations
        if (this._drawManager && viewpoint.annotations) {
            this._drawManager.viewport.clear()
            this._drawManager.enabled = true
            this._drawManager.viewport.get().append(viewpoint.annotations)
        }
        //#endregion

        //#region Recover dimensions
        const dimensionsComponent = this._components.tools.get("SimpleDimensions") as SimpleDimensions | undefined
        if (dimensionsComponent) { 
            viewpoint.dimensions.forEach( data => {
                const dimension = new SimpleDimensionLine(this._components, {
                    start: data.start, 
                    end: data.end,
                    //@ts-ignore
                    lineMaterial: dimensionsComponent._lineMaterial,
                    //@ts-ignore
                    endpoint: dimensionsComponent._endpointMesh
                })
                dimension.createBoundingBox()
                //@ts-ignore
                dimensionsComponent._dimensions.push(dimension)
            } )
        }
        //#endregion

        //#region Recover filtered elements
        // if (viewpoint.filter) {
        //     const filterData = fragments.groups.get(viewpoint.filter)
        //     for (const fragmentID in fragments.list) {
        //         const fragment = fragments.list[fragmentID]
        //         fragment.setVisibility(fragment.items, false)
        //     }
        //     for (const fragmentID in filterData) {
        //         const ids = filterData[fragmentID]
        //         fragments.list[fragmentID]?.setVisibility(ids, true)
        //     }
        // }
        //#endregion

        // Select elements in the viewpoint
        const selection: {[fragmentID: string]: string[]} = {}
        for (const fragmentID in viewpoint.selection) {
            const idSet = viewpoint.selection[fragmentID]
            selection[fragmentID] = [...idSet]
        }
        this._fragmentHighlighter.highlightByID(this.selectionHighlighter, selection, true)

        //#region Recover camera position & target
        const camera = this._components.camera as OrthoPerspectiveCamera
        const controls = camera.controls
        controls.setLookAt(
            viewpoint.position.x,
            viewpoint.position.y,
            viewpoint.position.z,
            viewpoint.target.x,
            viewpoint.target.y,
            viewpoint.target.z,
            true
        )
        this.onViewpointViewed.trigger(guid)
        //#endregion

    }

}