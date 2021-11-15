import { sum } from "lodash"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"
import { Card } from "../../components/card"
import { RingChart } from "../../components/chart/RingChart"
import {
  Gallery,
  ProjectHealth,
  Section,
  Spinner,
  TrendComponent,
  TrendDirection,
} from "../../components/content"
import SectionTitle from "../../components/heading/SectionTitle"
import { Grid, Page } from "../../components/layout"
import {
  ApiError,
  AuthorizationDetails,
  getAnalyticsForProjectRoute,
  getProjectsApiRoute,
  Project,
  requireAuthorization,
} from "../../lib/api"
import usePagination from "../../lib/api/usePagination"

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
          crumbs={[{ name: "Analytics", route: "/analytics" }]}
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
                      name="Health"
                      rating={
                        sum(
                          projects.map(
                            (currentProject) => currentProject.maturityIndex,
                          ),
                        ) / projects.length
                      }
                      direction={TrendDirection.up}
                      compact={true}
                    />
                  </RingChart>
                ) : (
                  <Spinner size="250px" />
                )}
              </Card>
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
