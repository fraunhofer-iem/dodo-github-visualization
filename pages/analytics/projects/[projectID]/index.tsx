import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useRef } from "react"
import useSWR from "swr"
import { Button } from "../../../../components/action"
import {
  Card,
  CardBody,
  CardSubTitle,
  CardTitle,
} from "../../../../components/card"
import { PieChart } from "../../../../components/chart"
import KpiTable from "../../../../components/KpiTable"
import { Grid, Page, Sidebar } from "../../../../components/layout"
import { Icon } from "../../../../components/rating"
import {
  AuthorizationDetails,
  getProjectApiRoute,
  ProjectDetail,
  requireAuthorization,
} from "../../../../lib/api"
import prData from "../../../../lib/data/pullRequestData.json"
import {
  Color,
  Colors,
  getAnalyticsForProjectRoute,
  IconNames,
  PageRoutes,
} from "../../../../lib/frontend"

const count = (): ChartData<"pie"> => {
  const data = {
    10: 0,
    20: 0,
    30: 0,
    40: 0,
    50: 0,
  }
  const colors = {
    10: Colors.lime,
    20: Colors.yellow,
    30: Colors.red,
    40: new Color(220, 20, 60),
    50: Colors.purple,
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
  const { data: project } = useSWR<ProjectDetail>(
    getProjectApiRoute(projectID as string),
  )
  const toggleSidebar = useRef<() => void>(() => {})

  return (
    props.user?.isLoggedIn && (
      <Page
        title={`${project?.name}  - KPI Dashboard`}
        sidebar={
          <Button
            context="neutral"
            action={() => {
              toggleSidebar.current()
            }}
          >
            <Icon>{IconNames.menu}</Icon>
          </Button>
        }
        crumbs={[
          {
            name: "Analytics",
            route: PageRoutes.ANALYTICS,
          },
          {
            name: project?.name as string,
            route: getAnalyticsForProjectRoute(projectID as string),
          },
        ]}
      >
        <Grid>
          <Sidebar
            control={(control: () => void) => (toggleSidebar.current = control)}
          >
            <Card>
              <CardTitle>List of KPIs</CardTitle>
              <CardBody>
                <KpiTable projectID={projectID as string} />
              </CardBody>
            </Card>
          </Sidebar>
          <Card>
            <CardTitle>{`${project?.name}`}</CardTitle>
            <CardSubTitle>{project?.url as string}</CardSubTitle>
            <CardBody>
              <Grid>
                <PieChart data={count()} width="500px" height="500px" />
              </Grid>
            </CardBody>
          </Card>
        </Grid>
      </Page>
    )
  )
})

export default Detail
