import { NextPage } from "next"
import React, { useCallback, useRef } from "react"
import useSWR from "swr"
import tippyfy, { TooltipControl } from "tooltip-component"
import { Card } from "../components/card"
import { Section } from "../components/content"
import CytoscapeComponent, {
  edgeDefinition,
  nodeDefinition,
} from "../components/cytoscape/CytoscapeComponent"
import SectionTitle from "../components/heading/SectionTitle"
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
    const domContainer = useRef<HTMLDivElement>(null)
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

        // Initializes nodeExpansion plugin, setting the 'expanded' attribute and hiding all child nodes and their edges
        c.nodeExpansion()

        c.on("tap", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          if (!node.expanded()) {
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
        <Page
          title="Hierarchy- KPI Dashboard"
          crumbs={[{ name: "Hierarchy", route: "/hierarchy" }]}
        >
          <Section>
            <SectionTitle>Hierarchy</SectionTitle>
            <Card width="99%" height="500px">
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
          </Section>
        </Page>
      )
    )
  }),
)

export default Hierarchy
