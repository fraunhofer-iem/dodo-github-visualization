import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"
import { Card } from "../../components/card"
import { RingChart } from "../../components/chart"
import {
  Gallery,
  RepositoryHealth,
  Section,
  Spinner,
  TrendComponent,
} from "../../components/content"
import { SectionTitle } from "../../components/heading"
import { Grid, Page } from "../../components/layout"
import {
  ApiError,
  AuthorizationDetails,
  getReposApiRoute,
  getTrendsApiRoute,
  Repo,
  requireAuthorization,
  Trend,
} from "../../lib/api"
import {
  getAnalyticsForRepoRoute,
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
    const { data: repos, error: error } = useSWR<Repo[], ApiError>(
      getReposApiRoute(
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
          user={props.user}
          crumbs={[{ name: "Analytics", route: PageRoutes.ANALYTICS }]}
        >
          <Section>
            <SectionTitle>Organization</SectionTitle>
            <Grid align="center">
              <Card>
                {repos ? (
                  <RingChart
                    rings={repos.map((currentRepo) => ({
                      value: 98,
                      tooltip: <Card>{currentRepo.name}</Card>,
                      action: () =>
                        router.push(getAnalyticsForRepoRoute(currentRepo)),
                    }))}
                    width="250px"
                  >
                    <TrendComponent
                      label="Health"
                      rating={42}
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
            <SectionTitle>Repositories</SectionTitle>
            <Gallery<Repo>
              rows={1}
              boxSize={250}
              sortKeys={["name", "owner", "maturity Index"]}
              generator={(currentRepo: Repo, size: number, key: number) => (
                <Card key={key}>
                  <RepositoryHealth repoId={currentRepo} width={`${size}px`} />
                </Card>
              )}
              route={getReposApiRoute}
            />
          </Section>
        </Page>
      )
    )
  },
)

export default Analytics
