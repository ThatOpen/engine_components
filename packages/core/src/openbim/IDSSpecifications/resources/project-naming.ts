import { IIDS } from ".."

export const specification: IIDS = {
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
            name: "Project naming",
            ifcVersion: "IFC4",
            identifier: 1,
            description: "Projects shall be named correctly for the purposes of identification, project archival, and model federation.",
            instructions: "Each discipline is responsible for naming their own project.",
            minOccurs: 1,
            maxOccurs: 1,
            applicability: [
                {
                    type: "entity",
                    name: {type: "simpleValue", value: "IFCPROJECT"},
                },
            ],
            requirements: [
                {
                    type: "attribute",
                    name: {type: "simpleValue", value: "Name"},
                    value: {type: "simpleValue", value: "TEST"},
                }
            ]
        }
    ]
}