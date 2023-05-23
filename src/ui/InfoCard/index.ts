import { Vector2, Vector3 } from "three";
import { Component, Event, UI, Updateable } from "../../base-types";
import { Components } from "../../core";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { FloatingWindow } from "../FloatingWindow";

export class InfoCard extends Component<string> implements Updateable, UI {

    name: string = "InfoCard"
    enabled: boolean = true
    afterUpdate: Event<any> = new Event()
    beforeUpdate: Event<any> = new Event()
    uiElement!: FloatingWindow
    private _components: Components
    private _startCSSElement: CSS2DObject
    private _line: SVGLineElement
    private _scenePosition: Vector3;

    constructor(components: Components, scenePosition: Vector3) {
        super()

        this._components = components
        this._scenePosition = scenePosition

        const className = "w-3 h-3 bg-ifcjs-120 rounded-full"

        const startDiv = document.createElement("div")
        startDiv.className = className
        this._startCSSElement = new CSS2DObject(startDiv)
        this._startCSSElement.position.copy(scenePosition)

        components.scene.get().add(this._startCSSElement)

        const container = this._components.renderer.get().domElement.parentElement as HTMLElement
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.classList.add("absolute", "top-0", "w-full", "h-full", "pointer-events-none")
        this._line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this._line.setAttribute('stroke', '#1a2128');
        this._line.setAttribute('stroke-width', '3');
        this._line.setAttribute('stroke-linecap', 'round');
        this._line.setAttribute('x1', '20');
        this._line.setAttribute('y1', '20');
        svgElement.appendChild(this._line);
        container.appendChild(svgElement)
        this.setUI()
    }

    private get _viewerContainer() {
        return this._components.renderer.get().domElement.parentElement as HTMLElement
    }

    private setUI() {
        const window = new FloatingWindow(this._components, {title: "Info card"})
        this._viewerContainer.append(window.domElement)
        window.updateReferencePoints()
        this.uiElement = window
    }
    
    private worldToScreen(vector3: Vector3, vector2: Vector2) {
        const camera = this._components.camera.get()
        const screenVector = vector3.clone().project(camera)
        vector2.x = Math.round((screenVector.x + 1) * this._viewerContainer.clientWidth / 2)
        vector2.y = Math.round((-screenVector.y + 1) * this._viewerContainer.clientHeight / 2)
        return vector2
    }
    
    update(): void {
        if (!this.uiElement) {return}
        this.beforeUpdate.trigger()

        this._startCSSElement.position.copy(this._scenePosition)
        const rect = this._startCSSElement.element.getBoundingClientRect()
        const vector2 = new Vector2(rect.x, rect.y)
        this._line.setAttribute('x1', (rect.x + rect.width/2).toString())
        this._line.setAttribute('y1', (rect.y + rect.height/2).toString())
        
        this.uiElement.updateReferencePoints()
        let minimumPoint: Vector2 = this.uiElement.referencePoints.center
        for (const point in this.uiElement.referencePoints) {
            //@ts-ignore
            const currentPoint = this.uiElement.referencePoints[point]
            const currentDistance = currentPoint.distanceTo(vector2)
            const currentMinimumDistance = minimumPoint.distanceTo(vector2)
            minimumPoint = currentDistance < currentMinimumDistance? currentPoint : minimumPoint
        }
        this._line.setAttribute('x2', minimumPoint.x.toString())
        this._line.setAttribute('y2', minimumPoint.y.toString())

        this.afterUpdate.trigger()
    }

    get(): string {
        throw new Error("Method not implemented.");
    }

}