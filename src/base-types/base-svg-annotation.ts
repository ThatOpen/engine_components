import { UIComponent, UI } from "./base-types";
import { Component } from "./component";
import { DrawManager } from "../annotation/DrawManager";
import { Button } from "../ui/ButtonComponent";

export interface SVGAnnotationStyle {
    fillColor: string
    strokeWidth: number
    strokeColor: string
}

export abstract class BaseSVGAnnotation extends Component<null> implements UI {

    abstract name: string
    abstract uiElement: UIComponent
    protected _enabled: boolean = false
    protected _isDrawing: boolean = false
    protected _svgViewport?: SVGElement | null = null
    private _drawManager: DrawManager | null | undefined
    private _draw: (e?: MouseEvent) => void = e => this.draw(e)
    private _start: (e?: MouseEvent) => void = e => this.start(e)
    private _end: (e?: MouseEvent) => void = e => this.end(e)
    private _cancel: (e?: KeyboardEvent) => void = e => {e?.stopImmediatePropagation(); if (e?.key === "Escape") {this.cancel()}}

    set svgViewport(value: SVGElement | undefined | null) {
        this._svgViewport = value
    }

    get svgViewport() {
        return this._svgViewport?? undefined
    }

    set enabled(value: boolean) {
        if (this._svgViewport) {
            if (value) {
                this._svgViewport.addEventListener("mousemove", this._draw)
                this._svgViewport.addEventListener("mousedown", this._start)
                this._svgViewport.addEventListener("mouseup", this._end)
                document.addEventListener("keydown", this._cancel)
                this.uiElement.active = true
                this._enabled = true
            } else {
                this.uiElement.active = false
                this._enabled = false
                this._svgViewport.removeEventListener("mousemove", this._draw)
                this._svgViewport.removeEventListener("mousedown", this._start)
                this._svgViewport.removeEventListener("mouseup", this._end)
                document.removeEventListener("keydown", this._cancel)
            }
        } else {
            this.uiElement.active = false
            this._enabled = false
        }
    }

    get enabled() {
        return this._enabled
    }

    get canDraw() {
        return this.enabled && this._svgViewport
    }

    set drawManager(manager: DrawManager | null | undefined) {
        this._drawManager = manager
        if (manager) {
            manager.addDrawingTool(this.name, this)
            if (this.uiElement instanceof Button) {
                manager.uiElement.drawingTools.addButton(this.uiElement)
            }
            this.svgViewport = manager.viewport.get()
        } else {
            this.svgViewport = null
        }
    }
    
    get drawManager() {
        return this._drawManager
    }

    start(e?: MouseEvent) {
        console.log(e)
    }

    draw(e?: MouseEvent) {
        console.log(e)
    }

    end(e?: MouseEvent) {
        console.log(e)
    }
    
    cancel(e?: KeyboardEvent) {
        console.log(e)
    }

    get() {
        return null
    }
    
}