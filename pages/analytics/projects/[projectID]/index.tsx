import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useRef } from "react"
import useSWR from "swr"
import Button from "../../../../components/action/Button"
import {
  Card,
  CardTitle,
  CardBody,
  CardSubTitle,
} from "../../../../components/card"
import { PieChart } from "../../../../components/chart"
import KpiTable from "../../../../components/KpiTable"
import { Grid, Page, Sidebar } from "../../../../components/layout"
import Icon from "../../../../components/rating/Icon"
import { IconName } from "../../../../components/rating/IconName"
import {
  ProjectDetail,
  AuthorizationDetails,
  requireAuthorization,
} from "../../../../lib/api"
import prData from "../../../../lib/data/pullRequestData.json"
import { Color, lime, purple, red, yellow } from "../../../../lib/themes/Theme"

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
  const { data: project } = useSWR<ProjectDetail>(`/api/projects/${projectID}`)
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
              <KpiTable projectID={projectID as string} />
            </CardBody>
          </Card>
        </Sidebar>
        <Card width="99%">
          <CardTitle>{`${project?.name}`}</CardTitle>
          <CardSubTitle>{project?.url as string}</CardSubTitle>
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
