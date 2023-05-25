import { BufferAttribute, BufferGeometry, Group, LineBasicMaterial, Matrix4, Object3D, Vector3 } from 'three'
import { Component, Disposable, Event, UI } from '../../base-types'
import { Components } from '../Components'
import { DxfViewer } from 'dxf-viewer'
import { degToRad } from 'three/src/math/MathUtils'
import { Button, FloatingWindow } from '../../ui'

export class DXFManager extends Component<Group[]> implements UI, Disposable {

    name: string = 'DXFManager'
    enabled: boolean = true
    uiElement!: Button
    onDXFImported: Event<Group> = new Event()
    onDXFTransformed: Event<Matrix4> = new Event()
    private _components: Components
    private _dxfViewer: DxfViewer
    private _rotationMatrix = new Matrix4().makeRotationX(degToRad(-90))
    private _list: {[id: string]: {drawing: Group, matrix: Matrix4}} = {}
    private _input = document.createElement("input")

    constructor(components: Components) {
        super()
        this._components = components
        const dummyContainer = document.createElement("div")
        this._dxfViewer = new DxfViewer(dummyContainer, null)
        this.setUI()
    }

    private setUI() {
        this._input.style.visibility = "none"
        this.viewerContainer.append(this._input)
        this._input.type = "file"
        this._input.onchange = async e => {
            //@ts-ignore
            const file = e.target.files[0] as File
            await this.import(URL.createObjectURL(file).toString(), file.name)
        }
        const button = new Button(this._components, {materialIconName: "villa"})
        const upload = new Button(this._components, {materialIconName: "upload", name: "Import DXF"})
        upload.onclick = () => {this._input.click()}
        const listWindow = new FloatingWindow(this._components, {title: "DXF Drawings"})
        listWindow.visible = false
        this.viewerContainer.append(listWindow.get())
        const buttonList = new Button(this._components, {materialIconName: "format_list_bulleted", name: "DXF list"})
        buttonList.onclick = () => {listWindow.visible = !listWindow.visible}
        button.addButton(buttonList, upload)
        this.uiElement = button
    }

    private get viewerContainer() {
        return this._components.renderer.get().domElement.parentElement as HTMLElement
    }

    private get scene() {
        return this._components.scene.get()
    }

    async import(url: string, name: string) {
        const existingDrawing = this._list[name]

        await this._dxfViewer.Load({
            url,
            fonts: ["./assets/fonts/Roboto-LightItalic.ttf"],
            progressCbk: null,
            workerFactory: null
        })

        const dxfGroup = existingDrawing? existingDrawing.drawing : new Group()
        
        if (existingDrawing) {
            this.disposeDrawing(name)
        } else {
            dxfGroup.name = name
            this.scene.add(dxfGroup)
            this._list[name] = {drawing: dxfGroup, matrix: new Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)}
        }

        dxfGroup.add(...this._dxfViewer.GetScene().children)

        dxfGroup.children.forEach( child => {
            //@ts-ignore
            child.material.dispose()
            //@ts-ignore
            child.material = new LineBasicMaterial({color: "Black"})
            this.setPosition(child)
            //@ts-ignore
            this._components.meshes.push(child)
        } )

        this.onDXFImported.trigger(dxfGroup)

        return dxfGroup
    }

    transform(
        dxfName: string,
        baseA: Vector3, 
        baseB: Vector3, 
        targetA: Vector3, 
        targetB: Vector3,
        targetPlaneNormal: Vector3
    ) {
        const existingDrawing = this._list[dxfName]?.drawing
        if (!existingDrawing) {console.warn(`There is no dxf drawing called ${dxfName}`); return}
        const matrix = this.getTransformMatrix(
            baseA,
            baseB,
            targetA,
            targetB,
            targetPlaneNormal
        )
        this._list[dxfName].matrix = matrix
        existingDrawing.children.forEach( child => {
            //@ts-ignore
            child.geometry.getAttribute("position").applyMatrix4(matrix)
        } )
        this.onDXFTransformed.trigger(matrix)
    }

    private setPosition(object: Object3D) {
        //@ts-ignore
        const geometry = object.geometry as BufferGeometry
        const position = geometry.getAttribute("position")
        const array: number[] = []
        for (let i = 0; i < position.array.length; i += position.itemSize) {
            array.push(position.array[i], position.array[i+1], 0)
        }
        const newPosition = new BufferAttribute(new Float32Array(array), 3).applyMatrix4(this._rotationMatrix)
        geometry.setAttribute("position", newPosition)
    }

    private getTransformMatrix(
        baseA: Vector3, 
        baseB: Vector3, 
        targetA: Vector3, 
        targetB: Vector3,
        targetPlaneNormal: Vector3, 
    ) {
    
        const matrix = new Matrix4()
        
        baseB.sub(baseA)
        targetB.sub(targetA)
        
        //Scale
        const scaleFactor = targetB.length()/baseB.length()
        const scaleVector = new Vector3(1,1,1).multiplyScalar(scaleFactor)

        //Rotation
        const angle = targetB.angleTo(baseB)
        const axis = baseB.clone().cross(targetB).normalize()
        const rotationMatrix = new Matrix4().makeRotationAxis(axis, angle)
    
        // Additional rotation to align object's up direction with target plane normal
        const upDirection = new Vector3(0, 1, 0)
        const upAngle = upDirection.angleTo(targetPlaneNormal)
        const upAxis = upDirection.clone().cross(targetPlaneNormal).normalize()
        const upRotationMatrix = new Matrix4().makeRotationAxis(upAxis, upAngle)

        const finalRotation = upRotationMatrix.multiply(rotationMatrix)
    
        //Transform matrix
        matrix.multiply(finalRotation)
        matrix.scale(scaleVector)
        const finalPosition = baseA.multiplyScalar(scaleFactor*-1).applyMatrix4(finalRotation.clone().setPosition(targetA))
        matrix.setPosition(finalPosition.add(new Vector3().addScalar(0.001).multiply(targetPlaneNormal)))
    
        return matrix
    
    }

    disposeDrawing(name: string) {
        const existingDrawing = this._list[name]?.drawing
        if (!name || !existingDrawing) {return}
        existingDrawing.children.forEach( child => {
            //@ts-ignore
            child.material.dispose()
            //@ts-ignore
            child.geometry.dispose()
            child.removeFromParent()
            const filteredMeshes = this._components.meshes.filter( mesh => mesh.uuid !== child.uuid )
            this._components.meshes = filteredMeshes
        } )
    }

    dispose() {
        for (const name in this._list) {
            this.disposeDrawing(name)
        }
    }

    get(): Group[] {
        return Object.values(this._list).map( value => {return value.drawing} )
    }
}