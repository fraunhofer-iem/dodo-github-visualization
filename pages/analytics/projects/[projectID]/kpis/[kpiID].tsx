import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useRef, useState } from "react"
import useSWR from "swr"
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
import { purple, turquoise } from "../../../../../util/themes/Theme"
import { ProjectDetail } from "../../../../api/projects/[pid]"
import { Kpi } from "../../../../api/projects/[pid]/kpis"
import { KpiDetail } from "../../../../api/projects/[pid]/kpis/[kid]"

const timeline = (prData: number[]): ChartData<"line"> => {
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

const cluster = (prData: number[]): ChartData<"line"> => {
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
    const { data: project } = useSWR<ProjectDetail>(
      `/api/projects/${projectID}`,
    )
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(5)
    const { data: kpis } = useSWR<Kpi[]>(
      `/api/projects/${projectID}/kpis?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    )
    const { data: kpi } = useSWR<KpiDetail>(
      `/api/projects/${projectID}/kpis/${kpiID}`,
    )
    const toggleSidebar = useRef<() => void>(() => {})

    return (
      props.user?.isLoggedIn && (
        <Page
          title={`${kpi?.name} - ${project?.id} - KPI Dashboard`}
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
                <Table
                  context="striped"
                  paginate={true}
                  {...{ pageSize, setPageSize, pageNumber, setPageNumber }}
                >
                  {{
                    columns: [
                      { content: "Name", sortable: true },
                      { content: "Score", sortable: true },
                    ],
                    rows: kpis
                      ? kpis.map((kpi) => [
                          {
                            content: (
                              <Button
                                action={() =>
                                  router.push(
                                    `/analytics/projects/${project?.id}/kpis/${kpi.id}`,
                                  )
                                }
                                context="neutral"
                                width="100%"
                                display="block"
                                align="left"
                              >
                                {kpiID === kpi.id ? (
                                  <strong>{kpi.name}</strong>
                                ) : (
                                  kpi.name
                                )}
                              </Button>
                            ),
                            sortKey: kpi.name,
                          },
                          {
                            content:
                              kpiID === kpi.id ? (
                                <strong>{kpi.score}</strong>
                              ) : (
                                kpi.score
                              ),
                            sortKey: kpi.score,
                          },
                        ])
                      : [],
                  }}
                </Table>
              </CardBody>
            </Card>
          </Sidebar>
          <Card width="99%">
            <CardTitle>
              {`${project?.name}`}
              <Button
                action={() => router.push(`/analytics/projects/${project?.id}`)}
                context="neutral"
              >
                <Icon>{IconName.keyboardArrowUp}</Icon>
              </Button>
            </CardTitle>
            <CardSubTitle>{project?.url as string}</CardSubTitle>
            <CardBody>
              <SectionTitle>{`${kpi?.name}`}</SectionTitle>
              Description: {kpi?.description}
              <br />
              Calculation: {kpi?.calculation}
              <br />
              Children: {kpi?.children}
              <br />
              {kpi?.data && (
                <Grid>
                  <LineChart
                    data={timeline(kpi.data)}
                    width="500px"
                    height="500px"
                  />
                  <LineChart
                    data={cluster(kpi.data)}
                    width="500px"
                    height="500px"
                  />
                </Grid>
              )}
            </CardBody>
          </Card>
        </Page>
      )
    )
  },
)

export default KPIDetail
