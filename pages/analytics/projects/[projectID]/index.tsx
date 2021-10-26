import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useRef } from "react"
import Anchor from "../../../../components/action/Anchor"
import Button from "../../../../components/action/Button"
import Card from "../../../../components/card/Card"
import CardBody from "../../../../components/card/CardBody"
import CardSubTitle from "../../../../components/card/CardSubTitle"
import CardTitle from "../../../../components/card/CardTitle"
import PieChart from "../../../../components/chart/PieChart"
import Grid from "../../../../components/layout/Grid"
import Page from "../../../../components/layout/Page"
import Sidebar from "../../../../components/layout/Sidebar"
import Icon from "../../../../components/rating/Icon"
import { IconName } from "../../../../components/rating/IconName"
import Table from "../../../../components/table/Table"
import {
  AuthorizationDetails,
  requireAuthorization,
} from "../../../../util/api/requireAuthorization"
import prData from "../../../../util/data/pullRequestData.json"
import { Color, lime, purple, red, yellow } from "../../../../util/themes/Theme"

const count = (): ChartData<"pie"> => {
  const data = {
    10: 0,
    20: 0,
    30: 0,
    40: 0,
    50: 0,
  }
  const colors = {
    10: lime,
    20: yellow,
    30: red,
    40: new Color(220, 20, 60),
    50: purple,
  }
  prData.forEach((value) => {
    if (value < 10) {
      data[10] += 1
    } else if (value < 20) {
      data[20] += 1
    } else if (value < 30) {
      data[30] += 1
    } else if (value < 40) {
      data[40] += 1
    } else if (value < 50) {
      data[50] += 1
    }
  })
  const labels: string[] = ["0-9", "10-19", "20-29", "30-39", "40-49"]
  return {
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: Object.entries(colors).map(([range, color]) =>
          color.rgba(),
        ),
        borderColor: Object.entries(colors).map(([range, color]) =>
          color.darken(0.05).rgba(),
        ),
        label: "PR sizes contrasted",
      },
    ],
    labels: labels,
  }
}

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
  const router = useRouter()
  const { projectID } = router.query
  const toggleSidebar = useRef<() => void>(() => {})

  return (
    props.user?.isLoggedIn && (
      <Page
        title={`Project ${projectID}  - KPI Dashboard`}
        sidebar={
          <Button
            context="neutral"
            action={() => {
              toggleSidebar.current()
            }}
          >
            <Icon>{IconName.menu}</Icon>
          </Button>
        }
      >
        <Sidebar
          control={(control: () => void) => (toggleSidebar.current = control)}
        >
          <Card width="95%">
            <CardTitle>List of KPIs</CardTitle>
            <CardBody>
              <Table context="striped">
                {{
                  columns: [
                    { content: "Name", sortable: true },
                    { content: "Score", sortable: true },
                  ],
                  rows: [
                    [
                      {
                        content: (
                          <Anchor
                            href={`/analytics/projects/${projectID}/kpis/1`}
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            KPI 1
                          </Anchor>
                        ),
                        sortKey: 1,
                      },
                      { content: 93, sortKey: 93 },
                    ],
                    [
                      {
                        content: (
                          <Anchor
                            href={`/analytics/projects/${projectID}/kpis/2`}
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            KPI 2
                          </Anchor>
                        ),
                        sortKey: 2,
                      },
                      { content: 23, sortKey: 23 },
                    ],
                    [
                      {
                        content: (
                          <Anchor
                            href={`/analytics/projects/${projectID}/kpis/3`}
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            KPI 3
                          </Anchor>
                        ),
                        sortKey: 3,
                      },
                      { content: 57, sortKey: 57 },
                    ],
                  ],
                }}
              </Table>
            </CardBody>
          </Card>
        </Sidebar>
        <Card width="99%">
          <CardTitle>{`Project ${projectID}`}</CardTitle>
          <CardSubTitle>{`<Project URL>`}</CardSubTitle>
          <CardBody>
            <Grid>
              <PieChart data={count()} width="500px" height="500px" />
            </Grid>
          </CardBody>
        </Card>
      </Page>
    )
  )
})

export default Detail
