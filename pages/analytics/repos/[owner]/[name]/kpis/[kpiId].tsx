import { sortBy } from "lodash"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useRef, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import useSWR from "swr"
import { Button } from "../../../../../../components/action"
import {
  Card,
  CardBody,
  CardSubTitle,
  CardTitle,
} from "../../../../../../components/card"
import { LineChart } from "../../../../../../components/chart"
import Alert from "../../../../../../components/content/Alert"
import { Select } from "../../../../../../components/form"
import { SectionTitle } from "../../../../../../components/heading"
import KpiTable from "../../../../../../components/KpiTable"
import { Grid, Page, Sidebar } from "../../../../../../components/layout"
import { Icon } from "../../../../../../components/rating"
import {
  AuthorizationDetails,
  getKpiForRepoApiRoute,
  getRepoApiRoute,
  Intervals,
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

const intervals: Intervals[] = [Intervals.MONTH, Intervals.WEEK, Intervals.DAY]

const KPIDetail: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const [since, setSince] = useState<Date>(
      new Date(new Date().setMonth(new Date().getMonth() - 3)),
    )
    const [to, setTo] = useState<Date>(new Date())
    const [interval, setInterval] = useState<Intervals>(Intervals.MONTH)
    //TODO: proper type cast needed
    const { owner, name, kpiId } = router.query
    const repoId = { owner: owner as string, name: name as string }
    const { data: repo } = useSWR<RepoDetail>(getRepoApiRoute(repoId))
    const { data: kpi } = useSWR<KpiDetail>(
      getKpiForRepoApiRoute(
        repoId,
        kpiId as string,
        since.toISOString(),
        to.toISOString(),
        interval,
      ),
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
          <Grid grow={true}>
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
            <Card width="calc(100% - 500px)">
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
                {kpi?.data.length == 0 && (
                  <Alert errorMessage="No data in specified timeframe" />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  Show from{" "}
                  <div>
                    <DatePicker
                      maxDate={to}
                      selected={since}
                      onChange={(date) => {
                        if (date) {
                          setSince(date)
                        }
                      }}
                    />
                  </div>
                  to{" "}
                  <div>
                    <DatePicker
                      minDate={since}
                      maxDate={new Date()}
                      selected={to}
                      onChange={(date) => {
                        if (date) {
                          setTo(date)
                        }
                      }}
                    />
                  </div>
                  calculated for each{" "}
                  <Select
                    id="intervalSelector"
                    multiple={false}
                    options={intervals.map((currentInterval, i) => ({
                      id: i,
                      name: currentInterval,
                      selected: interval === currentInterval,
                    }))}
                    changeHandler={(selection) => {
                      if (!Array.isArray(selection)) {
                        setInterval(intervals[selection])
                      }
                    }}
                  />
                </div>
                <LineChart
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
