import * as FRAGS from "@thatopen/fragments";
import { IDS_MEASURE_UNITS } from "./unit-types";
const prefixes: Record<string, number> = {
  EXA: 1e18,
  PETA: 1e15,
  TERA: 1e12,
  GIGA: 1e9,
  MEGA: 1e6,
  KILO: 1e3,
  HECTO: 1e2,
  DECA: 10,
  DECI: 0.1,
  CENTI: 1e-2,
  MILLI: 1e-3,
  MICRO: 1e-6,
  NANO: 1e-9,
  PICO: 1e-12,
  FEMTO: 1e-15,
  ATTO: 1e-18,
};
const value = (item: FRAGS.ItemData, name: string) => {
  const attr = item[name];
  return attr && !Array.isArray(attr) ? attr.value : undefined;
};
const refs = (item: FRAGS.ItemData, name: string) =>
  Array.isArray(item[name]) ? (item[name] as FRAGS.ItemData[]) : [];

/** Read explicit property units and project units. Convert numerical IDS values to SI. */
export async function idsUnitConverter(model: FRAGS.FragmentsModel) {
  const ids = Object.values(
    await model.getItemsOfCategories([
      /UNIT/,
      /MEASUREWITHUNIT$/,
      /^IFCPROJECT$/,
    ]),
  ).flat();
  const options = {
    attributesDefault: true,
    relations: Object.fromEntries(
      [
        "UnitsInContext",
        "Units",
        "ConversionFactor",
        "UnitComponent",
        "Elements",
        "Unit",
      ].map((name) => [name, { attributes: true, relations: false }]),
    ),
  };
  const data = (
    await Promise.all(ids.map((id) => model.getItemsData([id], options)))
  ).flat();
  const byId = new Map<number, FRAGS.ItemData>();
  for (const item of data) {
    const id = value(item, "_localId");
    if (typeof id === "number") byId.set(id, item);
  }
  const read = (item: FRAGS.ItemData) =>
    byId.get(value(item, "_localId") as number) ?? item;
  const unitType = (type: string | undefined) =>
    IDS_MEASURE_UNITS[type ?? ""] ??
    IDS_MEASURE_UNITS[
      (type ?? "")
        .replace("IFCPOSITIVE", "IFC")
        .replace("IFCNONNEGATIVE", "IFC")
    ];
  const projectUnits = new Map<string, FRAGS.ItemData>();
  for (const project of data.filter(
    (item) => value(item, "_category") === "IFCPROJECT",
  ))
    for (const assignment of refs(project, "UnitsInContext"))
      for (const unit of refs(read(assignment), "Units")) {
        const full = read(unit);
        projectUnits.set(String(value(full, "UnitType")), full);
      }
  const factor = (
    ref: FRAGS.ItemData,
    seen = new Set<number>(),
  ): { scale: number; offset: number } => {
    const unit = read(ref),
      id = value(unit, "_localId") as number;
    if (seen.has(id)) throw new Error("IDS: cyclic unit definition");
    seen.add(id);
    const category = value(unit, "_category");
    if (category === "IFCSIUNIT") {
      const prefix = prefixes[String(value(unit, "Prefix"))] ?? 1;
      const name = value(unit, "Name");
      let power = 1;
      if (name === "SQUARE_METRE") power = 2;
      if (name === "CUBIC_METRE") power = 3;
      return {
        scale: prefix ** power * (name === "GRAM" ? 0.001 : 1),
        offset: name === "DEGREE_CELSIUS" ? 273.15 : 0,
      };
    }
    if (
      category === "IFCCONVERSIONBASEDUNIT" ||
      category === "IFCCONVERSIONBASEDUNITWITHOFFSET"
    ) {
      const measure = refs(unit, "ConversionFactor")[0];
      if (!measure) throw new Error("IDS: missing unit conversion factor");
      const full = read(measure),
        component = refs(full, "UnitComponent")[0];
      if (!component) throw new Error("IDS: missing unit component");
      const base = factor(component, seen),
        coefficient = Number(value(full, "ValueComponent"));
      return {
        scale: coefficient * base.scale,
        offset:
          Number(value(unit, "ConversionOffset") ?? 0) *
            coefficient *
            base.scale +
          base.offset,
      };
    }
    if (category === "IFCDERIVEDUNIT") {
      let scale = 1;
      for (const element of refs(unit, "Elements")) {
        const full = read(element),
          component = refs(full, "Unit")[0];
        if (!component) throw new Error("IDS: missing derived unit component");
        scale *=
          factor(component, new Set(seen)).scale **
          Number(value(full, "Exponent"));
      }
      return { scale, offset: 0 };
    }
    throw new Error("IDS: unsupported unit definition");
  };
  return (
    actual: unknown,
    type: string | undefined,
    property: FRAGS.ItemData,
    name: string,
  ) => {
    if (typeof actual !== "number") return actual;
    const expectedUnit = unitType(type);
    if (!expectedUnit) return actual;
    let unit: FRAGS.ItemData | undefined = refs(
      property,
      name === "DefiningValues"
        ? "DefiningUnit"
        : name === "DefinedValues"
          ? "DefinedUnit"
          : "Unit",
    )[0];
    unit ??= projectUnits.get(expectedUnit);
    if (!unit) return actual;
    const { scale, offset } = factor(unit);
    return actual * scale + offset;
  };
}
