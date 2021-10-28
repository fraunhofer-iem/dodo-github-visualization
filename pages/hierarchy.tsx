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
import { KpiType } from "../lib/api"
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
    const { data: kpis } = useSWR<KpiType[]>(`/api/kpis`)
    const elements: cytoscape.ElementDefinition[] = []

    kpis?.forEach((currKpi) => {
      elements.push(
        nodeDefinition(currKpi.type, parseInt(currKpi.id), currKpi.name, {
          description: currKpi.description,
          hover: false,
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

        const hierarchy = kpis
          ? Object.fromEntries(
              kpis.map((currentKpi) => {
                return [currentKpi.id, currentKpi]
              }),
            )
          : undefined

        const expandNode = (node: cytoscape.NodeSingular) => {
          node.data("expanded", true)
          node.data("expandable", false)
          if (hierarchy) {
            hierarchy[node.id()].children.forEach((currentChild) => {
              c.getElementById(currentChild).data("hidden", false)
              c.getElementById(`${node.id()}-${currentChild}`).data(
                "hidden",
                false,
              )
            })
          }
        }

        const collapseNode = (node: cytoscape.NodeSingular) => {
          node.data("expanded", false)
          if (hierarchy) {
            hierarchy[node.id()].children.forEach((currentChild) => {
              node.data("expandable", true)

              //hide child only if all of its parents are collapsed
              const childNode = c.getElementById(currentChild)
              childNode.data("hidden", true)
              hierarchy[currentChild].parents.forEach((currentParent) => {
                const parentNode = c.getElementById(currentParent)
                if (!node.same(parentNode)) {
                  if (parentNode.data("expanded")) {
                    childNode.data("hidden", false)
                  }
                }
              })

              c.getElementById(`${node.id()}-${currentChild}`).data(
                "hidden",
                true,
              )

              collapseNode(childNode)
            })
          }
        }

        //hide all nodes except root nodes
        if (hierarchy) {
          Object.entries(hierarchy).forEach(([_, currentKpi]) => {
            const node = c.getElementById(currentKpi.id)
            if (currentKpi.children.length) {
              node.data("expandable", true)
              currentKpi.children.forEach((currentChild) => {
                c.getElementById(`${node.id()}-${currentChild}`).data(
                  "hidden",
                  true,
                )
              })
            }
            if (currentKpi.parents.length) {
              node.data("hidden", true)
            }
          })
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
      [setTippy, kpis],
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
