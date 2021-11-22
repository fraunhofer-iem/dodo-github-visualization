import { ElementDefinition, NodeDataDefinition } from "cytoscape"

export const Node = (
  kind: string,
  id: number,
  label: string,
  additionalAttributes: Omit<
    NodeDataDefinition,
    "id" | "label" | "kind" | "entity"
  > = {},
): ElementDefinition => {
  const node: ElementDefinition = {
    data: {
      id: `${id}`,
      label: `${label}`,
      kind: `${kind}`,
      entity: `${id}`,
      ...additionalAttributes,
    },
  }
  return node
}
