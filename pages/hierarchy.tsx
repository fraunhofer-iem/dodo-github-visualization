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
            children: currentKpi.children,
            parents: currentKpi.parents,
            description: currentKpi.description,
            hidden: currentKpi.parents.length != 0,
            expandable: currentKpi.children.length,
            expanded: false,
            hover: false,
          },
        ),
      )
      currentKpi.children.forEach((currentChild) => {
        elements.push(
          edgeDefinition(currentKpi.id, currentChild, true, { hidden: true }),
        )
      })
    })

    const expandNode = useCallback((node: cytoscape.NodeSingular) => {
      node.data("expanded", true)
      node.data("expandable", false)
      node.data("children").forEach((currentChild: string) => {
        if (cy.current) {
          cy.current.getElementById(currentChild).data("hidden", false)
          cy.current
            .getElementById(`${node.id()}-${currentChild}`)
            .data("hidden", false)
        }
      })
    }, [])

    const collapseNode = useCallback((node: cytoscape.NodeSingular) => {
      node.data("expanded", false)
      node.data("children").forEach((currentChild: string) => {
        node.data("expandable", true)

        //hide child only if all of its parents are collapsed
        if (cy.current) {
          const childNode = cy.current.getElementById(currentChild)
          childNode.data("hidden", true)
          childNode.data("parents").forEach((currentParent: string) => {
            if (cy.current) {
              const parentNode = cy.current.getElementById(currentParent)
              if (!node.same(parentNode)) {
                if (parentNode.data("expanded")) {
                  childNode.data("hidden", false)
                }
              }
            }
          })
          // hide edge to child node
          cy.current
            .getElementById(`${node.id()}-${currentChild}`)
            .data("hidden", true)

          collapseNode(childNode)
        }
      })
    }, [])

    const cytoscapeControl = useCallback(
      (c: cytoscape.Core) => {
        if (cy.current == c) {
          return
        }

        c.on("tap", "node", (event) => {
          const node: cytoscape.NodeSingular = event.target
          if (!node.data("expanded")) {
            if (node.data("expandable")) {
              expandNode(node)
            }
          } else {
            collapseNode(node)
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
      [collapseNode, expandNode, setTippy],
    )

    return (
      props.user?.isLoggedIn && (
        <Page
          title="Hierarchy- KPI Dashboard"
          crumbs={[{ name: "Hierarchy", route: "/hierarchy" }]}
        >
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
