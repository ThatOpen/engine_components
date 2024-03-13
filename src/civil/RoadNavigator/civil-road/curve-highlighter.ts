import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

export class CurveHighlighter {
    private scene: THREE.Scene | THREE.Group;
    private _highlightColor: THREE.ColorRepresentation;
    private activeSelection: Line2 | undefined;

    constructor(scene: THREE.Group | THREE.Scene) {
        this.scene = scene;
        this._highlightColor = 0xbcf124;
    }

    set highlightColor(color: THREE.ColorRepresentation) {
        this._highlightColor = color;
    }

    highlight(curve: THREE.LineSegments) {
        if (this.activeSelection) {
            this.scene.remove(this.activeSelection);
        }
        const lGeom = new LineGeometry();
        lGeom.setPositions(new Float32Array(curve.geometry.attributes.position.array));
        const lMat = new LineMaterial({ 
            color: this._highlightColor,
            linewidth: 1.5,
            worldUnits: true
        });
        lMat.needsUpdate = true;
        const line = new Line2(lGeom, lMat);
        line.updateMatrix();
        this.scene.add(line);
        this.activeSelection = line;
    }

    dispose() {
        if (this.activeSelection) {
            this.scene.remove(this.activeSelection);
        }
        this.scene = null as any;
        this._highlightColor = null as any;
    }
}