import type { FragmentsModels } from "@thatopen/fragments";
import type { Material } from "three";

type Materials = FragmentsModels["models"]["materials"]["list"];
type Original = Pick<Material, "opacity" | "transparent" | "depthWrite">;

export class IsolationMaterials {
  private originals = new WeakMap<Material, Original>();
  private opacity = 1;

  constructor(
    private materials: Materials,
    private getStyle: () => string | null,
  ) {}

  setOpacity(opacity: number) {
    this.opacity = opacity;
    this.materials.onItemSet.remove(this.update);
    if (opacity < 1) this.materials.onItemSet.add(this.update);
    for (const value of this.materials.values()) this.update({ value });
  }

  dispose() {
    this.setOpacity(1);
  }

  private update = ({ value }: { value: Material }) => {
    const opacity =
      value.userData.customId === this.getStyle() ? 1 : this.opacity;
    let original = this.originals.get(value);
    if (!original) {
      if (opacity === 1) return;
      original = {
        opacity: value.opacity,
        transparent: value.transparent,
        depthWrite: value.depthWrite,
      };
      this.originals.set(value, original);
    }
    const transparent = opacity < 1 || original.transparent;
    if (value.transparent !== transparent) value.needsUpdate = true;
    value.opacity = original.opacity * opacity;
    value.transparent = transparent;
    value.depthWrite = opacity < 1 ? false : original.depthWrite;
    if (opacity === 1) this.originals.delete(value);
  };
}
