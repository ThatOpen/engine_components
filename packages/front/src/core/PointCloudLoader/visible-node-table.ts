/**
 * Writes the table the point shader reads to find each point's deepest visible level: one RGBA texel per visible
 * octree node.
 * - R: one bit per child octant that is visible too.
 * - G, B: how many texels after this one its first visible child sits (high byte, then low byte).
 * - A: the node's density term, which shifts the level the shader estimates; 100 when the node has none.
 *
 * Nodes are laid out level by level and by name within a level ("r", "r0", "r4", "r04"...), so a parent always
 * comes before its children and its first child is the nearest one after it.
 *
 * @param nodes the visible nodes, in any order.
 * @param texels four bytes per node; cleared first.
 * @param nameOf the node's octree name: "r" and then one octant digit per level.
 * @param densityOf the node's density, or undefined.
 * @returns the texel of every node.
 */
export function writeVisibleNodeTable<T>(
  nodes: T[],
  texels: Uint8Array,
  nameOf: (node: T) => string,
  densityOf: (node: T) => number | undefined,
): Map<T, number> {
  texels.fill(0);
  const names = new Map<T, string>();
  for (const node of nodes) names.set(node, nameOf(node));
  const ordered = [...nodes].sort((a, b) => {
    const x = names.get(a)!;
    const y = names.get(b)!;
    if (x.length !== y.length) return x.length - y.length;
    if (x === y) return 0;
    return x < y ? -1 : 1;
  });

  const slotOfName = new Map<string, number>();
  const slotOfNode = new Map<T, number>();
  const firstChild: number[] = [];
  ordered.forEach((node, slot) => {
    const name = names.get(node)!;
    slotOfName.set(name, slot);
    slotOfNode.set(node, slot);
    const parent = slotOfName.get(name.slice(0, -1));
    if (slot > 0 && parent !== undefined) {
      texels[parent * 4] |= 1 << Number(name[name.length - 1]);
      firstChild[parent] ??= slot;
    }
    const density = densityOf(node);
    texels[slot * 4 + 3] =
      typeof density === "number" && !Number.isNaN(density)
        ? 10 * (Math.log2(density) / 2 + 8.5)
        : 100;
  });

  firstChild.forEach((child, parent) => {
    const gap = child - parent;
    texels[parent * 4 + 1] = gap >> 8;
    texels[parent * 4 + 2] = gap & 0xff;
  });
  return slotOfNode;
}
