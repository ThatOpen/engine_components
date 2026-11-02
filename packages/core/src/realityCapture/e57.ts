// E57 (ASTM E2807) point-cloud reading — the other input to the Potree pipeline
// (see {@link decodeLasStream} for LAS).
//
// E57 is a PAGED, random-access container, so unlike LAS it cannot be consumed as a forward
// byte stream. The environment-specific part is therefore INJECTED: the caller supplies
// {@link E57Source.readBytes}, which returns `len` bytes at a PHYSICAL file offset. Back it
// with `fs.read` in Node, an HTTP `Range` request against a signed URL, or `File.slice()` in
// the browser — the library itself stays free of `fs` and of any transport.
//
// Paging: the file is split into `pageSize`-byte pages whose last 4 bytes are a CRC, leaving
// `pageSize - 4` CONTENT bytes per page. Every offset stored inside the file is PHYSICAL
// (CRC bytes counted), but all arithmetic over the content must happen in LOGICAL space
// (CRC bytes stripped). {@link openE57} handles the conversion; callers only see logical reads.
//
// Scope: reads the single `CompressedVector` points section — cartesian XYZ + optional RGB.
// That is what a reality-capture scan carries and what the Potree octree consumes.

/** Byte source for the E57 file. `offset` is a PHYSICAL file offset. */
export interface E57Source {
  /** Read exactly `length` bytes at physical `offset` (short reads are treated as EOF). */
  readBytes: (offset: number, length: number) => Promise<Uint8Array>;
}

/** A field of the CompressedVector prototype (one bytestream per field, per packet). */
export interface E57Field {
  name: string;
  type: "ScaledInteger" | "Integer" | "Float";
  /** Raw attribute text of the XML element, for scale/offset/min/max extraction. */
  attrs: string;
}

/** An open E57 file: parsed header + XML prototype, positioned at the points section. */
export interface E57File {
  /** Total number of point records in the points section. */
  recordCount: number;
  /** LOGICAL offset of the first data packet. */
  dataLogical: number;
  /** The CompressedVector prototype fields, in bytestream order. */
  fields: E57Field[];
  /** Index of each field in {@link fields} (-1 when absent). */
  iX: number; iY: number; iZ: number;
  iR: number; iG: number; iB: number;
  /** `scale` / `minimum` of the cartesianX field (ScaledInteger encoding). */
  xScale: number;
  xMinAttr: number;
  /** Read `len` bytes at a LOGICAL offset (CRC pages stripped). */
  logicalRead: (logicalOffset: number, len: number) => Promise<Uint8Array>;
}

/** One decoded data packet: the concatenated per-field bytestreams. */
export interface E57Packet {
  /** All field bytestreams, back to back. */
  body: Uint8Array;
  /** Byte offset of field `f`'s stream within {@link body}. */
  off: number[];
  /** Number of points in this packet. */
  n: number;
}

const ascii = (bytes: Uint8Array, start: number, end: number): string => {
  let s = "";
  for (let i = start; i < end; i++) s += String.fromCharCode(bytes[i]);
  return s;
};

const attr = (attrs: string, name: string, fallback: number): number => {
  const m = attrs.match(new RegExp(`${name}="([^"]+)"`));
  return m ? Number(m[1]) : fallback;
};

/**
 * Open an E57 file: parse the header + XML, locate the points section, and return a handle
 * whose {@link E57File.logicalRead} hides the CRC paging.
 *
 * @param source Byte source (physical offsets) — see {@link E57Source}.
 * @throws If the file is not E57, or carries no `<points>` CompressedVector section.
 */
export async function openE57(source: E57Source): Promise<E57File> {
  const head = await source.readBytes(0, 48);
  if (ascii(head, 0, 8) !== "ASTM-E57") throw new Error("Not an E57 file (bad ASTM-E57 signature).");
  const hv = new DataView(head.buffer, head.byteOffset, head.byteLength);

  const PAGE = Number(hv.getBigUint64(40, true));
  const CONTENT = PAGE - 4; // last 4 bytes of every page are a CRC
  const xmlPhysicalOffset = Number(hv.getBigUint64(24, true));
  const xmlLogicalLength = Number(hv.getBigUint64(32, true));

  const physToLogical = (p: number) => Math.floor(p / PAGE) * CONTENT + (p % PAGE);

  // Read across page boundaries, skipping each page's trailing CRC.
  const logicalRead = async (logical: number, len: number): Promise<Uint8Array> => {
    const out = new Uint8Array(len);
    let got = 0;
    let L = logical;
    while (got < len) {
      const page = Math.floor(L / CONTENT);
      const withinPage = L % CONTENT;
      const take = Math.min(len - got, CONTENT - withinPage);
      const bytes = await source.readBytes(page * PAGE + withinPage, take);
      if (bytes.length === 0) break; // EOF
      out.set(bytes.subarray(0, Math.min(bytes.length, take)), got);
      got += bytes.length;
      L += bytes.length;
    }
    return out;
  };

  const xmlBytes = await logicalRead(physToLogical(xmlPhysicalOffset), xmlLogicalLength);
  const xml = new TextDecoder().decode(xmlBytes);

  const offsetMatch = xml.match(/<points\b[^>]*fileOffset="(\d+)"/);
  const countMatch = xml.match(/<points\b[^>]*recordCount="(\d+)"/);
  if (!offsetMatch || !countMatch) throw new Error("E57: no <points ... fileOffset/recordCount> in XML.");
  const pointsFileOffset = Number(offsetMatch[1]);
  const recordCount = Number(countMatch[1]);

  // The E57 <prototype> element declares the fields, in the order their bytestreams appear in each packet.
  const protoStart = xml.indexOf("<prototype", xml.indexOf("<points"));
  const proto = xml.slice(protoStart, xml.indexOf("</prototype>", protoStart) + 12);
  const fields: E57Field[] = [...proto.matchAll(/<([a-zA-Z:]+)\s+type="(ScaledInteger|Integer|Float)"([^>]*)/g)]
    .map((m) => ({ name: m[1], type: m[2] as E57Field["type"], attrs: m[3] }));

  const indexOf = (pattern: string) => fields.findIndex((f) => new RegExp(pattern).test(f.name));
  const iX = indexOf("cartesianX");
  if (iX < 0) throw new Error("E57: prototype has no cartesianX field.");

  // CompressedVectorSectionHeader (32 bytes): dataPhysicalOffset at byte 16.
  const sectionHeader = await logicalRead(physToLogical(pointsFileOffset), 32);
  const shv = new DataView(sectionHeader.buffer, sectionHeader.byteOffset, sectionHeader.byteLength);
  const dataLogical = physToLogical(Number(shv.getBigUint64(16, true)));

  return {
    recordCount,
    dataLogical,
    fields,
    iX,
    iY: indexOf("cartesianY"),
    iZ: indexOf("cartesianZ"),
    iR: indexOf("colorRed"),
    iG: indexOf("colorGreen"),
    iB: indexOf("colorBlue"),
    xScale: attr(fields[iX].attrs, "scale", 1),
    xMinAttr: attr(fields[iX].attrs, "minimum", 0),
    logicalRead,
  };
}

/**
 * Iterate every data packet of the points section, in bounded memory.
 *
 * Non-data packets (index/ignored) are skipped by their length; each logical offset is
 * 4-byte aligned, per the spec. Stops once {@link E57File.recordCount} points are yielded.
 *
 * @param file An {@link openE57} handle.
 */
export async function* e57Packets(file: E57File): AsyncGenerator<E57Packet> {
  let L = file.dataLogical;
  let done = 0;

  while (done < file.recordCount) {
    const head = await file.logicalRead(L, 6);
    const hv = new DataView(head.buffer, head.byteOffset, head.byteLength);
    const packetType = hv.getUint8(0);
    const packetLength = hv.getUint16(2, true) + 1;
    const streamCount = hv.getUint16(4, true);

    if (packetType !== 1) {
      // Not a data packet — skip it whole (guarding against a zero/short length loop).
      if (packetLength <= 6) break;
      L += packetLength;
      if (L % 4) L += 4 - (L % 4);
      continue;
    }

    // Per-stream byte lengths, then the streams themselves back to back.
    const lens = await file.logicalRead(L + 6, streamCount * 2);
    const lv = new DataView(lens.buffer, lens.byteOffset, lens.byteLength);
    const off: number[] = [];
    let total = 0;
    let xStreamBytes = 0;
    for (let i = 0; i < streamCount; i++) {
      const len = lv.getUint16(i * 2, true);
      off.push(total);
      total += len;
      if (i === file.iX) xStreamBytes = len;
    }

    const streamsStart = L + 6 + streamCount * 2;
    const body = await file.logicalRead(streamsStart, total);
    const n = (xStreamBytes / 4) | 0; // 32-bit X values → 4 bytes per point

    yield { body, off, n };

    done += n;
    L = streamsStart + total;
    if (L % 4) L += 4 - (L % 4);
  }
}
