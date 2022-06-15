import { NextPage } from "next"
import { useRouter } from "next/router"
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
  PageRoutes,
} from "../../lib/frontend"
import { useHeader } from "../../lib/hooks"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const { atA, setAtA, atB, setAtB, updateQuery } = useHeader(
      () => PageRoutes.ANALYTICS,
    )

    return (
      props.user?.isLoggedIn && (
        <Page
          title="Analytics - KPI Dashboard"
          user={props.user}
          atA={atA}
          setAtA={(at) => {
            updateQuery({
              atA: dateToString(at, false),
            })
            setAtA(at)
          }}
          atB={atB}
          setAtB={(at) => {
            updateQuery({
              atB: dateToString(at, false),
            })
            setAtB(at)
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
                generator={(currentRepo: Repo, size: number, key: number) => (
                  <RepositoryCard
                    key={key}
                    repo={currentRepo}
                    width={`${size}px`}
                    margin={"0"}
                    atA={atA}
                    atB={atB}
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
                  getKpisApiRoute({
                    owner: props.user.organization,
                    pageSize,
                    pageNumber,
                    sortKey,
                    asc,
                    to: atB,
                    kinds: ["orga", "repo"],
                  })
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
                          <strong>{kpi.name}</strong>
                          <br />
                          <span style={{ fontSize: "10pt" }}>
                            {kpi.owner}/{kpi.repo}
                          </span>
                        </Button>
                      ),
                      sortKey: "name",
                    },
                    {
                      content: (
                        <>
                          {kpi.value && kpi.value > Math.floor(kpi.value)
                            ? kpi.value.toFixed(2)
                            : kpi.value}
                        </>
                      ),
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
