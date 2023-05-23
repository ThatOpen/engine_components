
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Vector3 } from 'three'
import { Component, Hideable } from '../../base-types'
import { DimensionLabelClassName } from '../SimpleDimensions/types'

export class SimpleTag extends Component<CSS2DObject> implements Hideable {

  name: string = "SimpleTag"
  enabled: boolean = true
  visible: boolean = true
  private _center: Vector3
  private _htmlTag: HTMLElement
  private _tagContent: number | string
  private _unit: string
  private _label!: CSS2DObject

  get(): CSS2DObject {
    return this._label
  }
  
  constructor(center: Vector3, tagContent: number | string, unit: string) {
    super()

    this._center = center
    this._tagContent = tagContent
    this._unit = unit

    this._htmlTag = document.createElement('div')
    this._htmlTag.className = DimensionLabelClassName
    this._htmlTag.textContent = `${this._tagContent} ${this._unit}`

    this.createLabel()
    return this
  }

  createLabel() {
    this._label = new CSS2DObject(this._htmlTag)
    this._label.position.set(this._center.x, this._center.y, this._center.z)
  }

  set tagContent(tagContent: number | string) {
    this._tagContent = tagContent
    this._htmlTag.textContent = `${tagContent} ${this._unit}`
  }

}
