import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useRef } from "react"
import useSWR from "swr"
import Button from "../../../../../components/action/Button"
import {
  Card,
  CardTitle,
  CardBody,
  CardSubTitle,
} from "../../../../../components/card"
import { LineChart } from "../../../../../components/chart"
import SectionTitle from "../../../../../components/heading/SectionTitle"
import KpiTable from "../../../../../components/KpiTable"
import { Page, Sidebar, Grid } from "../../../../../components/layout"
import Icon from "../../../../../components/rating/Icon"
import { IconName } from "../../../../../components/rating/IconName"
import {
  ProjectDetail,
  KpiDetail,
  AuthorizationDetails,
  requireAuthorization,
  getKpiForProjectApiRoute,
  getProjectApiRoute,
  getAnalyticsForProjectRoute,
} from "../../../../../lib/api"
import { purple, turquoise } from "../../../../../lib/themes/Theme"

const timeline = (prData: number[]): ChartData<"line"> => {
  const labels: number[] = []
  prData.forEach((_, i) => labels.push(i))
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
    //TODO: proper type cast needed
    const { projectID, kpiID } = router.query
    const { data: project } = useSWR<ProjectDetail>(
      getProjectApiRoute(projectID as string),
    )
    const { data: kpi } = useSWR<KpiDetail>(
      getKpiForProjectApiRoute(projectID as string, kpiID as string),
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
                <KpiTable
                  projectID={projectID as string}
                  kpiID={kpiID as string}
                />
              </CardBody>
            </Card>
          </Sidebar>
          <Card width="99%">
            <CardTitle>
              {`${project?.name}`}
              <Button
                action={() =>
                  project
                    ? router.push(getAnalyticsForProjectRoute(project.id))
                    : router.push("/")
                }
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
