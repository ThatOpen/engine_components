import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core/Components";
import { PropertyTag } from "./property-tag";
import { IfcPropertiesProcessor } from "..";

export class AttributeTag extends PropertyTag {
  name = "AttributeTag";
  model: FragmentsGroup;
  expressID = 0;
  attributeName: string;

  constructor(
    components: Components,
    propertiesProcessor: IfcPropertiesProcessor,
    model: FragmentsGroup,
    expressID: number,
    attributeName = "Name"
  ) {
    super(components, propertiesProcessor, model, expressID);
    this.model = model;
    this.expressID = expressID;
    this.attributeName = attributeName;
    this._propertiesProcessor = propertiesProcessor;
    this.setInitialValues();
    this.setListeners();
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    (this.model as any) = null;
  }

  protected async setListeners() {
    const propertiesManager = this._propertiesProcessor.propertiesManager;
    if (!propertiesManager) return;
    try {
      const event = await propertiesManager.setAttributeListener(
        this.model,
        this.expressID,
        this.attributeName
      );
      event.add((v: any) => (this.value = v));
    } catch (err) {
      // console.log(err);
    }
  }

  protected async setInitialValues() {
    if (!this.model.hasProperties) {
      this.label = `Model ${this.model.ifcMetadata.name} has no properties`;
      this.value = "NULL";
      return;
    }
    const entity = await this.model.getProperties(this.expressID);
    if (!entity) {
      this.label = `ExpressID ${this.expressID} not found`;
      this.value = "NULL";
      return;
    }
    const attributes = Object.keys(entity);
    if (!attributes.includes(this.attributeName)) {
      this.label = `Attribute ${this.attributeName} not found`;
      this.value = "NULL";
      return;
    }
    if (!entity[this.attributeName]) return;
    this.label = this.attributeName;
    this.value = entity[this.attributeName].value;
  }
}
