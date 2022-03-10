import { sortBy } from "lodash"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useRef } from "react"
import useSWR from "swr"
import { Button } from "../../../../../../components/action"
import {
  Card,
  CardBody,
  CardSubTitle,
  CardTitle,
} from "../../../../../../components/card"
import { LineChart } from "../../../../../../components/chart"
import { SectionTitle } from "../../../../../../components/heading"
import KpiTable from "../../../../../../components/KpiTable"
import { Grid, Page, Sidebar } from "../../../../../../components/layout"
import { Icon } from "../../../../../../components/rating"
import {
  AuthorizationDetails,
  getKpiForRepoApiRoute,
  getRepoApiRoute,
  KpiDetail,
  RepoDetail,
  requireAuthorization,
} from "../../../../../../lib/api"
import {
  Colors,
  getAnalyticsForRepoRoute,
  getKpiForRepoRoute,
  IconNames,
  PageRoutes,
} from "../../../../../../lib/frontend"

const KPIDetail: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    //TODO: proper type cast needed
    const { owner, name, kpiId } = router.query
    const repoId = { owner: owner as string, name: name as string }
    const { data: repo } = useSWR<RepoDetail>(getRepoApiRoute(repoId))
    const { data: kpi } = useSWR<KpiDetail>(
      getKpiForRepoApiRoute(repoId, kpiId as string),
    )
    const toggleSidebar = useRef<() => void>(() => {})

    const dataPoints: { label: string; value: number }[] = []
    if (kpi && kpi.data) {
      for (const year of Object.keys(kpi.data)) {
        for (const ident of Object.keys(kpi.data[year])) {
          dataPoints.push({
            label: `${year}-${ident}`,
            value: kpi.data[year][ident].avg,
          })
        }
      }
      sortBy(dataPoints, (dataPoint) => dataPoint.label)
    }

    return (
      props.user?.isLoggedIn && (
        <Page
          title={`${kpi?.name} - ${repo?.id} - KPI Dashboard`}
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
              route: getAnalyticsForRepoRoute(repoId),
            },
            {
              name: kpi?.name as string,
              route: getKpiForRepoRoute(repoId, kpiId as string),
            },
          ]}
        >
          <Grid>
            <Sidebar
              control={(control: () => void) =>
                (toggleSidebar.current = control)
              }
            >
              <Card width="95%">
                <CardTitle>List of KPIs</CardTitle>
                <CardBody>
                  <KpiTable repoId={repoId} kpiId={kpiId as string} />
                </CardBody>
              </Card>
            </Sidebar>
            <Card width="calc(100% - 400px)">
              <CardTitle>
                {`${repo?.name}`}
                <Button
                  action={() =>
                    repo
                      ? router.push(getAnalyticsForRepoRoute(repoId))
                      : router.push("/")
                  }
                  context="neutral"
                >
                  <Icon>{IconNames.keyboardArrowUp}</Icon>
                </Button>
              </CardTitle>
              <CardSubTitle>{repo?.url as string}</CardSubTitle>
              <CardBody>
                <SectionTitle>{`${kpi?.name}`}</SectionTitle>
                <LineChart
                  data={{
                    datasets: [
                      {
                        data: dataPoints.map((dataPoint) => dataPoint.value),
                        backgroundColor: Colors.purple.rgba(),
                        borderColor: Colors.purple.rgba(),
                        borderWidth: 1,
                        pointRadius: 1,
                        showLine: false,
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
                    aspectRatio: 3.5,
                  }}
                />
              </CardBody>
            </Card>
          </Grid>
        </Page>
      )
    )
  },
)

export default KPIDetail
