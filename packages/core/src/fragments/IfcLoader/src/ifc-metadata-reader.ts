import * as WEBIFC from "web-ifc";

// https://standards.buildingsmart.org/documents/Implementation/ImplementationGuide_IFCHeaderData_Version_1.0.2.pdf

export class IfcMetadataReader {
  getNameInfo(webIfc: WEBIFC.IfcAPI) {
    const data: Record<string, any> = {};
    const { arguments: dataArguments } =
      webIfc.GetHeaderLine(0, WEBIFC.FILE_NAME) || {};
    if (!dataArguments) return data;
    const [
      name,
      timeStamp,
      author,
      organization,
      preprocessorVersion,
      originatingSystem,
      authorization,
    ] = dataArguments;
    if (name?.value) data.name = name.value;
    if (timeStamp?.value) data.creationDate = new Date(timeStamp.value);
    if (author) {
      data.author = {} as Record<string, any>;
      const [authorName, authorEmail] = author;
      if (authorName?.value) data.author.name = authorName.value;
      if (authorEmail?.value) data.author.email = authorEmail.value;
    }
    if (organization && organization[0]?.value) {
      data.organization = organization[0].value;
    }
    if (preprocessorVersion?.value) {
      data.preprocessorVersion = preprocessorVersion?.value;
    }
    if (originatingSystem?.value) {
      data.originatingSystem = originatingSystem?.value;
    }
    if (authorization?.value) {
      data.authorization = authorization?.value;
    }
    return data;
  }

  getDescriptionInfo(webIfc: WEBIFC.IfcAPI) {
    const data: Record<string, any> = {};
    const { arguments: dataArguments } =
      webIfc.GetHeaderLine(0, WEBIFC.FILE_DESCRIPTION) || {};
    if (!dataArguments) return data;
    const [description, implementationLevel] = dataArguments;
    if (Array.isArray(description) && description[0]?.value) {
      const viewDefinition = description[0].value.match(/\[([^\]]+)\]/);
      if (viewDefinition && viewDefinition[1]) {
        data.viewDefinition = viewDefinition[1];
      }
    }
    if (implementationLevel?.value)
      data.implementationLevel = implementationLevel.value;
    return data;
  }
}
