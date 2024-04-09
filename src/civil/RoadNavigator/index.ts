import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { Components, Simple2DScene } from "../../core";
import { CurveHighlighter } from "./src/curve-highlighter";
import { MarkerManager } from "../../core/Simple2DMarker/src/marker-manager";

export abstract class RoadNavigator extends Component<any> {
  enabled = true;

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  abstract highlighter: CurveHighlighter;

  readonly onHighlight = new Event<{
    point: THREE.Vector3;
    mesh: FRAGS.CurveMesh;
  }>();

  private _curveMeshes: FRAGS.CurveMesh[] = [];

  markerManager: MarkerManager;

  protected constructor(components: Components) {
    super(components);
    this.scene = new Simple2DScene(this.components, false);
    this.markerManager = new MarkerManager(this.components, this.scene);
    this.setupEvents();
    this.adjustRaycasterOnZoom();
  }

  get() {
    return null as any;
  }

  async draw(model: FragmentsGroup, filter?: Iterable<FRAGS.Alignment>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }
    const { alignments } = model.civilData;
    const allAlignments = filter || alignments.values();
    const scene = this.scene.get();

    const totalBBox: THREE.Box3 = new THREE.Box3();
    totalBBox.makeEmpty();
    totalBBox.min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    totalBBox.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    for (const alignment of allAlignments) {
      if (!alignment) {
        throw new Error("Alignment not found!");
      }
      if (this.view !== "vertical") {
        // TODO: Generate All The KPs and Stations
        // TODO: Look if
        this.markerManager.addCivilMarker(
          `0+${alignment.initialKP.toFixed(2)}`,
          alignment[this.view][0].mesh,
          "InitialKP"
        );

        this.markerManager.addCivilMarker(
          "end",
          alignment[this.view][alignment[this.view].length - 1].mesh,
          "FinalKP"
        );
      }

      for (const curve of alignment[this.view]) {
        scene.add(curve.mesh);
        this._curveMeshes.push(curve.mesh);

        if (!totalBBox.isEmpty()) {
          totalBBox.expandByObject(curve.mesh);
        } else {
          curve.mesh.geometry.computeBoundingBox();
          const cbox = curve.mesh.geometry.boundingBox;

          if (cbox instanceof THREE.Box3) {
            totalBBox.copy(cbox).applyMatrix4(curve.mesh.matrixWorld);
          }
        }
      }
    }

    const scaledBbox = new THREE.Box3();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    totalBBox.getCenter(center);
    totalBBox.getSize(size);
    size.multiplyScalar(1.2);
    scaledBbox.setFromCenterAndSize(center, size);

    await this.scene.controls.fitToBox(scaledBbox, false);
  }

  setupEvents() {
    const mousePositionSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    this.scene.get().add(mousePositionSphere);

    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("mousemove", (event) => {
        const dom = this.scene.uiElement.get("container").domElement;

        const intersects = this.highlighter.castRay(
          event,
          this.scene.camera,
          dom,
          this._curveMeshes
        );

        if (intersects) {
          const { point, object } = intersects;
          mousePositionSphere.position.copy(point);
          this.highlighter.hover(object as FRAGS.CurveMesh);
          return;
        }

        this.highlighter.unHover();
      });

    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("click", async (event) => {
        const dom = this.scene.uiElement.get("container").domElement;

        const intersects = this.highlighter.castRay(
          event,
          this.scene.camera,
          dom,
          this._curveMeshes
        );

        if (intersects) {
          const { point, object } = intersects;
          mousePositionSphere.position.copy(point);
          const mesh = object as FRAGS.CurveMesh;
          this.highlighter.select(mesh);
          // TODO: Example and Test, should be replaced with the actual implementation
          // this.markerManager.addCivilMarker("Curve", mesh, "Length");
          await this.onHighlight.trigger({ mesh, point });

          if (this.view === "vertical") {
            // Add markers elevation

            // Create defSegments desde array mesh.geometry.attributes.position.array
            const setDefSegments = (segmentsArray: any) => {
              let defSegments: any = [];
              let slope: any = [];

              // Calcular pendiente desde cada PK
              const calculateSlopeSegment = (
                point1: number[],
                point2: number[]
              ) => {
                const deltaY = point2[1] - point1[1];
                const deltaX = point2[0] - point1[0];
                return deltaY / deltaX;
              };

              // Itera sobre cada segmento y calcula la pendiente
              for (let i = 0; i < segmentsArray.length; i++) {
                const segment = segmentsArray[i];
                let startX: number, startY: number, endX: number, endY: number;

                // Encuentra el primer punto en el segmento
                for (let j = 0; j < Object.keys(segment).length / 3; j++) {
                  if (
                    segment[j * 3] !== undefined &&
                    segment[j * 3 + 1] !== undefined
                  ) {
                    startX = segment[j * 3];
                    startY = segment[j * 3 + 1];
                    break;
                  }
                }

                // Encuentra el último punto en el segmento
                for (let j = Object.keys(segment).length / 3 - 1; j >= 0; j--) {
                  if (
                    segment[j * 3] !== undefined &&
                    segment[j * 3 + 1] !== undefined
                  ) {
                    endX = segment[j * 3];
                    endY = segment[j * 3 + 1];
                    break;
                  }
                }

                const defSlope = calculateSlopeSegment(
                  // @ts-ignore
                  [startX, startY],
                  // @ts-ignore
                  [endX, endY]
                );
                const slopeSegment = (defSlope * 100).toFixed(2);
                slope.push({ slope: slopeSegment });
              }
              segmentsArray.forEach((segment: any) => {
                for (let i = 0; i < segment.length - 3; i += 3) {
                  let startX = segment[i];
                  let startY = segment[i + 1];
                  let startZ = segment[i + 2];

                  let endX = segment[i + 3];
                  let endY = segment[i + 4];
                  let endZ = segment[i + 5];

                  // Calcular la longitud del segmento
                  let segmentLength = Math.sqrt(
                    Math.pow(endX - startX, 2) +
                      Math.pow(endY - startY, 2) +
                      Math.pow(endZ - startZ, 2)
                  );

                  defSegments.push({
                    distance: segmentLength,
                    start: new THREE.Vector3(startX, startY, startZ),
                    end: new THREE.Vector3(endX, endY, endZ),
                  });
                }
              });

              return { defSegments, slope };
            };

            const { alignment } = mesh.curve;
            let positionsVertical = [];

            // Crear lista de alignments verticales
            for (const align of alignment.vertical) {
              const pos = align.mesh.geometry.attributes.position.array;

              positionsVertical.push(pos);
            }

            const { defSegments, slope } = setDefSegments(positionsVertical);

            alignment.vertical.forEach((align, index: number) => {
              this.markerManager.addCivilMarker(
                `S: ${slope[index].slope}`,
                align.mesh,
                "Slope"
              );

              this.markerManager.addCivilMarker(
                `H: ${defSegments[index].end.y.toFixed(2)}`,
                align.mesh,
                "Coordinate"
              );
            });

            this.markerManager.addCivilMarker(
              "KP: 0",
              alignment.vertical[0].mesh,
              "InitialKPV"
            );

            this.markerManager.addCivilMarker(
              `KP: ${alignment.vertical.length}`,
              alignment.vertical[alignment.vertical.length - 1].mesh,
              "FinalKPV"
            );
          }

          return;
        }

        this.highlighter.unSelect();
      });
  }

  async dispose() {
    this.highlighter.dispose();
    this.clear();
    this.onHighlight.reset();
    await this.scene.dispose();
    this._curveMeshes = [];
    this.markerManager.dispose();
  }

  clear() {
    this.highlighter.unSelect();
    this.highlighter.unHover();
    for (const mesh of this._curveMeshes) {
      mesh.removeFromParent();
    }
    this._curveMeshes = [];
  }

  private adjustRaycasterOnZoom() {
    this.scene.controls.addEventListener("update", () => {
      const { zoom, left, right, top, bottom } = this.scene.camera;
      const width = left - right;
      const height = top - bottom;
      const screenSize = Math.max(width, height);
      const realScreenSize = screenSize / zoom;
      const range = 50;
      const { caster } = this.highlighter;
      caster.params.Line.threshold = realScreenSize / range;
    });
  }
}
