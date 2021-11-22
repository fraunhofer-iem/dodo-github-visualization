import { EdgeDataDefinition, ElementDefinition } from "cytoscape"

export const Edge = (
  source: string,
  target: string,
  directed: boolean = true,
  additionalAttributes: Omit<
    EdgeDataDefinition,
    "id" | "source" | "target" | "directed"
  > = {},
): ElementDefinition => {
  return {
    data: {
      id: `${source}-${target}`,
      source: source,
      target: target,
      directed: directed,
      ...additionalAttributes,
    },
  }
}
