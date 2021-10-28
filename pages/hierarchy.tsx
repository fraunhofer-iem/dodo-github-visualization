import { NextPage } from "next"
import React, { useCallback, useRef } from "react"
import useSWR from "swr"
import tippyfy, { TooltipControl } from "tooltip-component"
import { Card, CardTitle } from "../components/card"
import CytoscapeComponent, {
  edgeDefinition,
  nodeDefinition,
} from "../components/cytoscape/CytoscapeComponent"
import { Page } from "../components/layout"
import { ApiRoutes, KpiType } from "../lib/api"
import {
  AuthorizationDetails,
  requireAuthorization,
} from "../lib/api/requireAuthorization"
import { useUIContext } from "../lib/uiContext"

const Hierarchy: NextPage = requireAuthorization(
  tippyfy((props: TooltipControl & AuthorizationDetails) => {
    const { theme } = useUIContext()
    const cy = useRef<cytoscape.Core | null>()
    const { setTippy } = props
    const { data: kpis } = useSWR<KpiType[]>(ApiRoutes.KPIS)
    const elements: cytoscape.ElementDefinition[] = []

    kpis?.forEach((currKpi) => {
      elements.push(
        nodeDefinition(currKpi.type, parseInt(currKpi.id), currKpi.name, {
          description: currKpi.description,
          hover: "false",
        }),
      )
      currKpi.children.forEach((currChild) => {
        elements.push(edgeDefinition(currKpi.id, currChild))
      })
    })

    const cytoscapeControl = useCallback(
      (c: cytoscape.Core) => {
        if (cy.current == c) {
          return
        }

        const showNode = (node: cytoscape.NodeSingular) => {
          node.data("hidden", "false")
          node.incomers("edge").forEach((currEdge) => {
            currEdge.data("hidden", "false")
            showNode(currEdge.source())
          })
        }

        const hideNode = (node: cytoscape.NodeSingular) => {
          node.data("hidden", "true")
          node.data("expanded", false)
          node.incomers("edge").forEach((currEdge) => {
            currEdge.data("hidden", "true")
            collapseNode(currEdge.source())
          })
        }

        const collapseNode = (node: cytoscape.NodeSingular) => {
          node.data("expanded", false)
          node.outgoers("edge").forEach((currEdge) => {
            currEdge.data("hidden", "true")
            currEdge.target().data("hidden", "true")
          })
        }

        c.nodes().forEach((currNode: cytoscape.NodeSingular) => {
          if (!currNode.predecessors().length) {
            currNode.successors().forEach((currSuccessor) => {
              currSuccessor.data("hidden", "true")
            })
          }
        })

        c.on("tap", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          if (node.data("expanded")) {
            node
              .outgoers("edge")
              .forEach((currEdge: cytoscape.EdgeSingular) => {
                hideNode(currEdge.target())
              })
          } else {
            node
              .outgoers("edge")
              .forEach((currEdge: cytoscape.EdgeSingular) => {
                showNode(currEdge.target())
              })
          }

          node.data("expanded", !node.data("expanded"))
        })

        c.on("mouseover", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          setTippy(node.id(), {
            content: <Card width="250px">{node.data("description")}</Card>,
            popperRef: node.popperRef(),
            dispose: () => node.data("hover", "false"),
            tippyProps: { placement: "right" },
          })
          node.data("hover", "true")
        })
        c.on("mouseout", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          setTippy(node.id(), { content: undefined, popperRef: undefined })
        })

        cy.current = c
      },
      [setTippy],
    )

    return (
      props.user?.isLoggedIn && (
        <Page title="Hierarchy- KPI Dashboard">
          <Card width="99%">
            <CardTitle>KPI Hierarchy</CardTitle>
            <CytoscapeComponent
              cy={cytoscapeControl}
              elements={elements}
              layout={{
                name: "dagre",
                nodeDimensionsIncludeLabels: true,
                fit: false,
              }}
              stylesheet={theme.cytoscape?.canvas}
            />
          </Card>
        </Page>
      )
    )
  }),
)

export default Hierarchy
