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

    kpis?.forEach((currentKpi) => {
      elements.push(
        nodeDefinition(
          currentKpi.type,
          parseInt(currentKpi.id),
          currentKpi.name,
          {
            description: currentKpi.description,
            expanded: false,
            hover: false,
          },
        ),
      )
      currentKpi.children.forEach((currentChild) => {
        elements.push(edgeDefinition(currentKpi.id, currentChild))
      })
    })

    const cytoscapeControl = useCallback(
      (c: cytoscape.Core) => {
        if (cy.current == c) {
          return
        }

        c.on("tap", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          if (!node.data("expanded")) {
            node.expand()
          } else {
            node.collapse()
          }
        })

        c.on("mouseover", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          setTippy(node.id(), {
            content: <Card width="250px">{node.data("description")}</Card>,
            popperRef: node.popperRef(),
            dispose: () => node.data("hover", false),
            tippyProps: { placement: "right" },
          })
          node.data("hover", true)
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
