import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useRef } from "react"
import Anchor from "../../../../../components/action/Anchor"
import Button from "../../../../../components/action/Button"
import Card from "../../../../../components/card/Card"
import CardBody from "../../../../../components/card/CardBody"
import CardSubTitle from "../../../../../components/card/CardSubTitle"
import CardTitle from "../../../../../components/card/CardTitle"
import LineChart from "../../../../../components/chart/LineChart"
import SectionTitle from "../../../../../components/heading/SectionTitle"
import Grid from "../../../../../components/layout/Grid"
import Page from "../../../../../components/layout/Page"
import Sidebar from "../../../../../components/layout/Sidebar"
import Icon from "../../../../../components/rating/Icon"
import { IconName } from "../../../../../components/rating/IconName"
import Table from "../../../../../components/table/Table"
import {
  AuthorizationDetails,
  requireAuthorization,
} from "../../../../../util/api/requireAuthorization"
import prData from "../../../../../util/data/pullRequestData.json"
import { purple, turquoise } from "../../../../../util/themes/Theme"

const timeline = (): ChartData<"line"> => {
  const labels: number[] = []
  prData.forEach((v, i) => labels.push(i))
  const chartData: ChartData<"line"> = {
    datasets: [
      {
        data: prData,
        backgroundColor: purple.rgba(),
        borderColor: purple.rgba(),
        borderWidth: 1,
        pointRadius: 1,
        label: "PR size over time",
        showLine: false,
      },
    ],
    labels: labels,
  }
  return chartData
}

const cluster = (): ChartData<"line"> => {
  const data: [number, number][] = []
  prData.forEach((v, i) => data.push([i, v]))
  data.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
  const values: number[] = []
  const labels: number[] = []
  data.forEach(([label, value]) => {
    values.push(value)
    labels.push(label)
  })
  return {
    datasets: [
      {
        data: values,
        backgroundColor: turquoise.rgba(),
        borderColor: turquoise.rgba(),
        pointRadius: 1,
        showLine: false,
        label: "Sorted PR size",
      },
    ],
    labels: labels,
  }
}

const KPIDetail: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const { projectID, kpiID } = router.query
    const toggleSidebar = useRef<() => void>(() => {})

    return (
      props.user?.isLoggedIn && (
        <Page
          title={`KPI ${kpiID} - Project ${projectID}  - KPI Dashboard`}
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
            <CardTitle>
              {`Project ${projectID}`}
              <Anchor
                href={`/analytics/projects/${projectID}`}
                context="neutral"
              >
                <Icon>{IconName.keyboardArrowUp}</Icon>
              </Anchor>
            </CardTitle>
            <CardSubTitle>{`<Project URL>`}</CardSubTitle>
            <CardBody>
              <SectionTitle>{`KPI ${kpiID}`}</SectionTitle>
              <Grid>
                <LineChart data={timeline()} width="500px" height="500px" />
                <LineChart data={cluster()} width="500px" height="500px" />
              </Grid>
            </CardBody>
          </Card>
        </Page>
      )
    )
  },
)

export default KPIDetail
