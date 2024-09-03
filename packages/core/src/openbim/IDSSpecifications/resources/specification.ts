import { Ids, IdsEntityFacet, IdsPropertyFacet } from ".."

export const specification: Ids = {
    title: "Bimply Sample IDS",
    copyright: "Bimply",
    version: "1.0.0",
    description: "These are example specifications for those learning how to use IDS. The goal is to be able to automate IFC requirements.",
    author: "juan.hoyos4@gmail.com",
    date: new Date(),
    purpose: "Contractual requirements",
    milestone: "Design",
    specifications: [
        {
            name: "Fire rating",
            ifcVersion: "IFC4",
            description: "All wall and floor finishes must not be load bearing.",
            applicability: [
                {
                    type: new IdsEntityFacet({
                        name: { type: "simpleValue", value: "IFCWALL" },
                        predefinedType: { type: "simpleValue", value: "SOLIDWALL" }
                    })
                },
            ],
            requirements: [
                {
                    type: new IdsPropertyFacet({
                        name: { type: "simpleValue", value: "LoadBearing" },
                        dataType: "IfcBoolean",
                        propertySet: { type: "simpleValue", value: "Pset_WallCommon" },
                        value: { type: "simpleValue", value: "T" }
                    }), 
                }
            ]
        },
    ]
}