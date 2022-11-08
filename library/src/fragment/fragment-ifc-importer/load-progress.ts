import * as WEBIFC from "web-ifc";
import { Event, Progress } from "../../core";

export class LoadProgress {
  event = new Event<Progress>();

  private load = {
    total: 0,
    current: 0,
    step: 0,
  };

  setupLoadProgress(webIfc: WEBIFC.IfcAPI) {
    const shapeType = WEBIFC.IFCPRODUCTDEFINITIONSHAPE;
    const shapes = webIfc.GetLineIDsWithType(0, shapeType);
    this.load.total = shapes.size();
    this.load.current = 0;
    this.load.step = 0.1;
  }

  updateLoadProgress() {
    const loadedItems = Math.min(this.load.current++, this.load.total);
    const isStepReached = loadedItems / this.load.total >= this.load.step;
    if (isStepReached) {
      const total = this.load.total;
      const current = Math.ceil(total * this.load.step);
      this.event.trigger({ current, total });
      this.load.step += 0.1;
    }
  }
}
