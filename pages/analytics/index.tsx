import { sum } from "lodash"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"
import { Card } from "../../components/card"
import { RingChart } from "../../components/chart"
import {
  Gallery,
  ProjectHealth,
  Section,
  Spinner,
  TrendComponent,
} from "../../components/content"
import { SectionTitle } from "../../components/heading"
import { Grid, Page } from "../../components/layout"
import {
  ApiError,
  AuthorizationDetails,
  getProjectsApiRoute,
  getTrendsApiRoute,
  Project,
  requireAuthorization,
  Trend,
} from "../../lib/api"
import {
  getAnalyticsForProjectRoute,
  PageRoutes,
  TrendDirections,
} from "../../lib/frontend"
import { usePagination } from "../../lib/hooks"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const {
      pageNumber,
      setPageNumber,
      pageSize,
      setPageSize,
      sortInformation,
      setSortInformation,
    } = usePagination("name")
    const { data: projects, error: error } = useSWR<Project[], ApiError>(
      getProjectsApiRoute(
        pageSize,
        pageNumber,
        sortInformation.sortKey,
        sortInformation.ordering,
      ),
    )
    if (error && error.statusCode == 404) {
      setPageNumber(pageNumber - 1)
    }

    return (
      props.user?.isLoggedIn && (
        <Page
          title="Analytics - KPI Dashboard"
          crumbs={[{ name: "Analytics", route: PageRoutes.ANALYTICS }]}
        >
          <Section>
            <SectionTitle>Organization</SectionTitle>
            <Grid align="center">
              <Card>
                {projects ? (
                  <RingChart
                    rings={projects.map((currentProject) => ({
                      value: currentProject.maturityIndex,
                      tooltip: <Card>{currentProject.name}</Card>,
                      action: () =>
                        router.push(
                          getAnalyticsForProjectRoute(currentProject.id),
                        ),
                    }))}
                    width="250px"
                  >
                    <TrendComponent
                      label="Health"
                      rating={
                        sum(
                          projects.map(
                            (currentProject) => currentProject.maturityIndex,
                          ),
                        ) / projects.length
                      }
                      direction={TrendDirections.UP}
                      compact={true}
                    />
                  </RingChart>
                ) : (
                  <Spinner size="250px" />
                )}
              </Card>
              <Gallery<Trend>
                rows={3}
                width={"50%"}
                boxSize={150}
                sortKeys={["name", "direction", "value"]}
                route={getTrendsApiRoute}
                generator={(currentTrend: Trend, size: number, key: number) => (
                  <Card key={key} width={`${size}px`}>
                    <TrendComponent
                      direction={currentTrend.direction}
                      label={currentTrend.name}
                      rating={currentTrend.value}
                      align="left"
                    />
                  </Card>
                )}
              />
            </Grid>
          </Section>
          <Section>
            <SectionTitle>Projects</SectionTitle>
            <Gallery<Project>
              rows={1}
              boxSize={250}
              sortKeys={["name", "maturity Index"]}
              generator={(
                currentProject: Project,
                size: number,
                key: number,
              ) => (
                <Card key={key}>
                  <ProjectHealth
                    projectId={currentProject.id}
                    width={`${size}px`}
                  />
                </Card>
              )}
              route={getProjectsApiRoute}
            />
          </Section>
        </Page>
      )
    )
  },
)

export default Analytics
