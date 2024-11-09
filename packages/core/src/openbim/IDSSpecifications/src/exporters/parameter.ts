import { IDSFacetParameterName, IDSFacetParameter } from "../types";

export const getParameterXML = (
  name: IDSFacetParameterName,
  parameter?: IDSFacetParameter,
) => {
  let parameterXML = "";
  if (!parameter) return parameterXML;
  if (parameter.type === "simple") {
    parameterXML = `<ids:simpleValue>${parameter.parameter}</ids:simpleValue>`;
  }

  if (parameter.type === "enumeration") {
    const value = parameter.parameter;
    parameterXML = `<xs:restriction base="xs:string">
    ${value.map((v) => `<xs:enumeration value="${v}" />`).join("\r\n")}
    </xs:restriction>`;
  }

  if (parameter.type === "pattern") {
    const value = parameter.parameter;
    parameterXML = `<xs:restriction base="xs:string">
      <xs:pattern value="${value}" />
    </xs:restriction>`;
  }

  const xml = `<ids:${name[0].toLowerCase() + name.slice(1)}>
    ${parameterXML}
  </ids:${name[0].toLowerCase() + name.slice(1)}>`;

  return xml;
};
