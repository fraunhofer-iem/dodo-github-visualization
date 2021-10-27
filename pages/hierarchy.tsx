import { NextPage } from "next"
import { useCallback, useRef } from "react"
import useSWR from "swr"
import tippyfy, { TooltipControl } from "tooltip-component"
import Card from "../components/card/Card"
import CardTitle from "../components/card/CardTitle"
import CytoscapeComponent, {
  edgeDefinition,
  nodeDefinition,
} from "../components/cytoscape/CytoscapeComponent"
import Page from "../components/layout/Page"
import {
  AuthorizationDetails,
  requireAuthorization,
} from "../util/api/requireAuthorization"
import { useUIContext } from "../util/uiContext"
import { KpiType } from "./api/kpis"

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
