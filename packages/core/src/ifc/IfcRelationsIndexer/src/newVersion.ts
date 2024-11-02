const actual = {
  186: {
    7: [250, 253, 257],
  },
  250: {
    8: [186],
  },
  253: {
    8: [186],
  },
  257: {
    8: [186],
  },
};

// This new version of the relations map easily allows to delete relations
const newVersion = {
  186: {
    // 7 is IsDefinedBy
    7: [{ 259: [250] }, { 263: [253] }, { 266: [257] }], // 259, 263 and 266 are IfcRelDefinesByProperties | 250, 253 and 257 are IfcPropertySet
  },
  190: {
    // 7 is IsDefinedBy
    7: [{ 259: [250] }], // 259 is IfcRelDefinesByProperties | 250 is IfcPropertySet
  },
  250: {
    // 8 is DefinesOcurrence
    8: [{ 259: [186, 190] }], // 259 is IsRelDefinesByProperties | 186 and 190 are IfcProduct
  },
};

interface V2Schema {
  [expressID: number]: {
    [invAttrIndex: number]: {
      [IfcRelationship: number]: number[];
    };
  };
}

type RelationsMap = Map<number, Map<number, { [ifcRel: number]: number[] }>>;
