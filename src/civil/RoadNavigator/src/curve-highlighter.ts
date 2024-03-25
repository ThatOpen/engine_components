import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

// 1. Highlight all alignment lines ✅
// 2. Show all endpoints of curves ✅
// 3. Highlight curves on hover ✅
// 4. Adjust raycaster Line threshold to zoom ✅
// 5. Use a different color depending on the curve type
// 6. Method to center camera on selected alignment / selected curve

export class CurveHighlighter {
  private scene: THREE.Scene | THREE.Group;

  selectCurve: Line2;

  selectPoints: THREE.Points;

  hoverCurve: Line2;

  hoverPoints: THREE.Points;

  constructor(scene: THREE.Group | THREE.Scene) {
    this.scene = scene;
    this.hoverCurve = this.newCurve(0x444444, 0.003);
    this.hoverPoints = this.newPoints(5, 0x444444);
    this.selectCurve = this.newCurve(0xbcf124, 0.005);
    this.selectPoints = this.newPoints(7, 0xffffff);
  }

  dispose() {
    if (this.selectCurve) {
      this.scene.remove(this.selectCurve);
    }

    this.selectCurve.material.dispose();
    this.selectCurve.geometry.dispose();
    this.selectCurve = null as any;

    this.hoverCurve.material.dispose();
    this.hoverCurve.geometry.dispose();
    this.hoverCurve = null as any;

    (this.hoverPoints.material as THREE.Material).dispose();
    this.hoverPoints.geometry.dispose();

    (this.selectPoints.material as THREE.Material).dispose();
    this.selectPoints.geometry.dispose();

    this.scene = null as any;
  }

  select(mesh: FRAGS.CurveMesh) {
    this.highlight(mesh, this.selectCurve, this.selectPoints);
  }

  unSelect() {
    this.selectCurve.removeFromParent();
    this.selectPoints.removeFromParent();
  }

  hover(mesh: FRAGS.CurveMesh) {
    this.highlight(mesh, this.hoverCurve, this.hoverPoints);
  }

  unHover() {
    this.hoverCurve.removeFromParent();
    this.hoverPoints.removeFromParent();
  }

  private highlight(mesh: FRAGS.CurveMesh, curve: Line2, points: THREE.Points) {
    const { alignment } = mesh.curve;

    this.scene.add(curve);
    this.scene.add(points);

    const lines: number[] = [];
    const vertices: THREE.Vector3[] = [];
    for (const foundCurve of alignment.horizontal) {
      const position = foundCurve.mesh.geometry.attributes.position;
      for (const coord of position.array) {
        lines.push(coord);
      }
      const [x, y, z] = position.array;
      vertices.push(new THREE.Vector3(x, y, z));
    }

    const lastX = lines[lines.length - 3];
    const lastY = lines[lines.length - 2];
    const lastZ = lines[lines.length - 1];
    vertices.push(new THREE.Vector3(lastX, lastY, lastZ));

    if (lines.length / 3 > curve.geometry.attributes.position.count) {
      curve.geometry.dispose();
      curve.geometry = new LineGeometry();
    }

    curve.geometry.setPositions(lines);

    points.geometry.setFromPoints(vertices);
  }

  private newCurve(color: number, linewidth: number) {
    const selectGeometry = new LineGeometry();
    const selectMaterial = new LineMaterial({
      color,
      linewidth,
      worldUnits: false,
    });
    const curve = new Line2(selectGeometry, selectMaterial);
    this.scene.add(curve);
    return curve;
  }

  private newPoints(size: number, color: number) {
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsAttr = new THREE.BufferAttribute(new Float32Array(), 3);
    pointsGeometry.setAttribute("position", pointsAttr);
    const pointsMaterial = new THREE.PointsMaterial({ size, color });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.frustumCulled = false;
    this.scene.add(points);
    return points;
  }
}
