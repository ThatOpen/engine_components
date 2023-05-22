import { Components } from "../../core";
import { BaseAnnotation2D, UI } from "../../base-types";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";

export class FreehandAnnotation extends BaseAnnotation2D implements UI {
    
    name: string = "FreehandAnnotation"
    uiElement!: Button
    canvas: HTMLCanvasElement | null = null
    private _components: Components

    constructor(components: Components, drawer?: DrawManager | null) {
        super()
        this._components = components
        this.setUI()
        this.drawManager = drawer
    }

    private setUI() {
        const button = new Button(this._components, {name: "Free", materialIconName: "gesture"})
        button.onclick = () => {
            if (this.drawManager) {
                this.drawManager.activateTool(this)
            } else {
                this.enabled = !this.enabled
            }
        }
        this.uiElement = button
    }

    start() {
        if (!this.canDraw || this._isDrawing) {return}
        const ctx = this.canvas?.getContext("2d")
        if (!ctx) { return new Error("This annotation component has an invalid canvas 2d context. This is either because the canvas doesn't exists or it doesn't have a 2d context.") }
        this._isDrawing = true
        ctx.beginPath()
    }
    
    draw(e: MouseEvent) {
        if (!this.canDraw || !this._isDrawing) {return}
        const ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()
    }
    
    end() {
        if (!this._isDrawing) {return}
        this._isDrawing = false
        const ctx = this.canvas?.getContext("2d")
        ctx?.stroke()
    }

}