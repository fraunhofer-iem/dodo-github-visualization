import { sortBy } from "lodash"
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
import { ChartComponent } from "../../../../components/chart"
import KpiTable from "../../../../components/KpiTable"
import { Grid, Page, Sidebar } from "../../../../components/layout"
import { Icon } from "../../../../components/rating"
import {
  AuthorizationDetails,
  getKpisForRepoApiRoute,
  getRepoApiRoute,
  Kpi,
  RepoDetail,
  requireAuthorization,
} from "../../../../lib/api"
import {
  Colors,
  getAnalyticsForRepoRoute,
  IconNames,
  PageRoutes,
} from "../../../../lib/frontend"

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
  const router = useRouter()
  const { owner, name } = router.query
  const { data: repo } = useSWR<RepoDetail>(
    getRepoApiRoute({ owner: owner as string, name: name as string }),
  )
  const { data: kpis } = useSWR<Kpi[]>(
    getKpisForRepoApiRoute({ owner: owner as string, name: name as string }),
  )
  const toggleSidebar = useRef<() => void>(() => {})

  const dataPoints: { label: string; value: number }[] = []
  if (kpis) {
    for (const kpi of kpis) {
      dataPoints.push({ label: kpi.name, value: kpi.rating })
    }
    sortBy(dataPoints, (dataPoint) => dataPoint.label)
  }

  return (
    props.user?.isLoggedIn && (
      <Page
        title={`${repo?.name}  - KPI Dashboard`}
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
            name: repo?.name as string,
            route: getAnalyticsForRepoRoute({
              owner: owner as string,
              name: name as string,
            }),
          },
        ]}
      >
        <Grid grow={true}>
          <Sidebar
            control={(control: () => void) => (toggleSidebar.current = control)}
          >
            <Card>
              <CardTitle>List of KPIs</CardTitle>
              <CardBody>
                <KpiTable
                  repoId={{ owner: owner as string, name: name as string }}
                />
              </CardBody>
            </Card>
          </Sidebar>
          <Card>
            <CardTitle>{`${repo?.name}`}</CardTitle>
            <CardSubTitle>{repo?.url as string}</CardSubTitle>
            <CardBody>
              <ChartComponent
                width="800px"
                type={"bar"}
                data={{
                  datasets: [
                    {
                      data: dataPoints.map((dataPoint) => dataPoint.value),
                      backgroundColor: Colors.purple.rgba(),
                      borderColor: Colors.purple.rgba(),
                      borderWidth: 1,
                      pointRadius: 2,
                      showLine: true,
                    },
                  ],
                  labels: dataPoints.map((dataPoint) => dataPoint.label),
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      enabled: false,
                    },
                  },
                  scales: {
                    y: {
                      min: 0,
                    },
                  },
                  aspectRatio: 2,
                }}
              />
            </CardBody>
          </Card>
        </Grid>
      </Page>
    )
  )
})

export default Detail
