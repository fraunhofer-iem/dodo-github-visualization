import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { Button } from "../../components/action"
import { Card, CardTitle } from "../../components/card"
import { Gallery, RepositoryCard, Section } from "../../components/content"
import KpiTable from "../../components/KpiTable"
import { Grid, Page } from "../../components/layout"
import {
  AuthorizationDetails,
  getKpisApiRoute,
  getReposApiRoute,
  Repo,
  requireAuthorization,
} from "../../lib/api"
import {
  dateToString,
  getKpiForRepoRoute,
  KpiNames,
  PageRoutes,
} from "../../lib/frontend"
import { useHeader } from "../../lib/hooks"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const { rangeA, setRangeA, rangeB, setRangeB, updateQuery } = useHeader(
      () => PageRoutes.ANALYTICS,
    )

    return (
      props.user?.isLoggedIn && (
        <Page
          title="Analytics - KPI Dashboard"
          user={props.user}
          rangeA={rangeA}
          setRangeA={(since, to) => {
            updateQuery({
              sinceA: dateToString(since, false),
              toA: dateToString(to, false),
            })
            setRangeA({ since, to })
          }}
          rangeB={rangeB}
          setRangeB={(since, to) => {
            updateQuery({
              sinceB: dateToString(since, false),
              toB: dateToString(to, false),
            })
            setRangeB({ since, to })
          }}
        >
          <Section width="75%">
            <Grid align="left">
              <Gallery<Repo>
                rows={3}
                width={"100%"}
                gap={25}
                minBoxSize={150}
                itemsPerRow={3}
                sortKeys={["name", "health"]}
                route={getReposApiRoute}
                range={rangeB}
                generator={(currentRepo: Repo, size: number, key: number) => (
                  <RepositoryCard
                    key={key}
                    repo={currentRepo}
                    width={`${size}px`}
                    margin={"0"}
                    rangeA={rangeA}
                    rangeB={rangeB}
                  />
                )}
              />
            </Grid>
          </Section>
          <Section width="25%">
            <Card margin="0">
              <CardTitle>Repository KPIs</CardTitle>
              <KpiTable
                columns={[
                  {
                    content: "KPI",
                    sortable: true,
                    sortKey: "id",
                    width: "80%",
                  },
                  {
                    content: "Value",
                    sortable: true,
                    sortKey: "value",
                    width: "20%",
                  },
                ]}
                route={(pageSize, pageNumber, sortKey, asc) =>
                  getKpisApiRoute(
                    { owner: props.user.organization },
                    pageSize,
                    pageNumber,
                    sortKey,
                    asc,
                    undefined,
                    rangeB?.since,
                    rangeB?.to,
                  )
                }
                rowGenerator={(kpi) => {
                  return [
                    {
                      content: (
                        <Button
                          context={"anchor"}
                          display="block"
                          width="100%"
                          action={() =>
                            router.push({
                              pathname: getKpiForRepoRoute(
                                { owner: kpi.owner, name: kpi.repo as string },
                                kpi.id,
                              ),
                              query: { ...router.query },
                            })
                          }
                        >
                          <strong>{KpiNames[kpi.id]}</strong>
                          <br />
                          <span style={{ fontSize: "10pt" }}>
                            {kpi.owner}/{kpi.repo}
                          </span>
                        </Button>
                      ),
                      sortKey: "name",
                    },
                    {
                      content: <>{kpi.value}</>,
                      sortKey: "value",
                    },
                  ]
                }}
              />
            </Card>
          </Section>
        </Page>
      )
    )
  },
)

export default Analytics
