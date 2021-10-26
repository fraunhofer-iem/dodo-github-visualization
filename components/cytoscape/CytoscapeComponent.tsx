import cytoscape, {
  EdgeDataDefinition,
  ElementDefinition,
  NodeDataDefinition,
} from "cytoscape"
import cxtmenu from "cytoscape-cxtmenu"
import dagre from "cytoscape-dagre"
import edgehandles from "cytoscape-edgehandles"
import popper from "cytoscape-popper"
import deepEqual from "deep-equal"
import { useEffect, useRef } from "react"

interface Props {
  cy?: (cy: cytoscape.Core) => void | undefined
  elements: cytoscape.ElementDefinition[]
  layout?: cytoscape.LayoutOptions | dagre.DagreLayoutOptions | undefined
  stylesheet?: cytoscape.Stylesheet[] | undefined
}

const equals = (prev: Props | null | undefined, curr: Props) => {
  if (!prev) {
    return false
  }
  return deepEqual(prev, curr)
}

export const nodeDefinition = (
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

export const edgeDefinition = (
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

export const panToSide = (
  c: cytoscape.Core,
  extent: cytoscape.BoundingBox12 & cytoscape.BoundingBoxWH,
) => {
  const xDist = extent.w - extent.x2
  const yDist =
    Math.max(extent.y2, c.height() / 2) - Math.min(extent.y2, c.height() / 2)
  c.panBy({
    x: xDist,
    y: extent.y2 > c.height() / 2 ? -yDist : yDist,
  })
}

export default function CytoscapeComponent(props: Props) {
  const container = useRef(null)
  const prevProps = useRef<Props | null>()
  const cy = useRef<cytoscape.Core | null>()
  const { elements, layout, stylesheet } = props

  useEffect(() => {
    if (!equals(prevProps.current, props)) {
      cytoscape.use(dagre)
      cy.current = cytoscape({
        container: container.current,
        layout: layout,
        elements: elements,
        style: stylesheet,
      })
      cy.current.fit()
      if (!Object.getPrototypeOf(cy.current).popper) {
        cytoscape.use(popper)
      }
      if (!Object.getPrototypeOf(cy.current).cxtmenu) {
        cytoscape.use(cxtmenu)
      }
      if (!Object.getPrototypeOf(cy.current).edgehandles) {
        cytoscape.use(edgehandles)
      }

      prevProps.current = props
    }
    if (props.cy) {
      props.cy(cy.current as cytoscape.Core)
    }
    return () => {
      if (!equals(prevProps.current, props)) {
        cy.current?.destroy()
      }
    }
  })

  return <div ref={container} style={{ width: "100%", height: "100%" }} />
}
