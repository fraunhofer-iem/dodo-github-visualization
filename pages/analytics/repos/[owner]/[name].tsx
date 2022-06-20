import { NextPage } from "next"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { Button, Toggle } from "../../../../components/action"
import { Card } from "../../../../components/card"
import {
  Breadcrumbs,
  Browser,
  RepositoryCard,
  Section,
} from "../../../../components/content"
import KpiChart from "../../../../components/KpiChart"
import KpiTable from "../../../../components/KpiTable"
import { Page } from "../../../../components/layout"
import {
  AuthorizationDetails,
  getKpisApiRoute,
  getReposApiRoute,
  Repo,
  requireAuthorization,
} from "../../../../lib/api"
import {
  dateToString,
  getAnalyticsForRepoRoute,
  getKpiForRepoRoute,
  KpiKinds,
  PageRoutes,
} from "../../../../lib/frontend"
import { useHeader, useUIContext } from "../../../../lib/hooks"

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
  const router = useRouter()
  const { owner, name, atA, setAtA, atB, setAtB, kpiIds, updateQuery } =
    useHeader(
      (owner, name) =>
        getAnalyticsForRepoRoute({ owner: owner ?? "", name: name ?? "" }),
      (path) => {
        return {
          owner: path[path.length - 2],
          name: path[path.length - 1],
        }
      },
    )
  const { theme } = useUIContext()

  const [shownKpis, setShownKpis] = useState<string[]>(kpiIds ?? [])

  const updateKpis = useCallback(
    (kpiId: string) => {
      if (shownKpis.includes(kpiId)) {
        shownKpis.splice(shownKpis.findIndex((k) => kpiId === k))
        updateQuery({
          kpiIds: shownKpis,
        })
        setShownKpis([...shownKpis])
      } else {
        updateQuery({
          kpiIds: [...shownKpis, kpiId],
        })
        setShownKpis([...shownKpis, kpiId])
      }
    },
    [shownKpis, updateQuery],
  )

  return (
    props.user?.isLoggedIn && (
      <Page
        title={`${name}  - KPI Dashboard`}
        user={props.user}
        atA={atA}
        setAtA={(at: Date) => {
          updateQuery({
            atA: dateToString(at, false),
          })
          setAtA(at)
        }}
        atB={atB}
        setAtB={(at: Date) => {
          updateQuery({
            atB: dateToString(at, false),
          })
          setAtB(at)
        }}
      >
        {owner && name && (
          <>
            <Section width="150px" padding="0">
              <Browser<Repo>
                route={getReposApiRoute}
                generator={(repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repo={repo}
                    iconSize={"75px"}
                    width="100%"
                    minified={true}
                    margin="0"
                    background={
                      repo.id === `${owner}/${name}`
                        ? `radial-gradient(circle at center, white, ${theme.browser.activeElement.rgba()} 500%)`
                        : undefined
                    }
                    backgroundHover={`radial-gradient(circle at center, white, ${theme.browser.activeElement.rgba()} 500%)`}
                  />
                )}
              />
            </Section>
            <Section padding="0 5px">
              <Breadcrumbs
                crumbs={[
                  {
                    name: "Analytics",
                    action: (router) => {
                      router.push({
                        pathname: PageRoutes.ANALYTICS,
                        query: {
                          atA: router.query.atA,
                          atB: router.query.atB,
                        },
                      })
                    },
                  },
                  {
                    name: `${owner}/${name}`,
                    action: (router) => {
                      router.push({
                        pathname: getAnalyticsForRepoRoute({
                          owner: owner,
                          name: name,
                        }),
                        query: {
                          atA: router.query.atA,
                          atB: router.query.atB,
                        },
                      })
                    },
                  },
                ]}
              />
              <Card>
                <KpiChart
                  route={() =>
                    shownKpis.length
                      ? getKpisApiRoute({
                          owner: owner,
                          repo: name,
                          pageSize: shownKpis.length,
                          from: atA,
                          to: atB,
                          kpiIds: shownKpis,
                          data: true,
                          kinds: [KpiKinds.REPO],
                        })
                      : null
                  }
                />
              </Card>
              <Card>
                <KpiTable
                  columns={[
                    {
                      content: "",
                      sortable: false,
                      width: "3%",
                    },
                    {
                      content: "Name",
                      sortable: true,
                      sortKey: "name",
                      width: "50%",
                    },
                    {
                      content: "Value",
                      sortable: true,
                      sortKey: "value",
                      width: "15%",
                    },
                    {
                      content: "Limits",
                      sortable: false,
                      width: "15%",
                    },
                    {
                      content: "Expected Value",
                      sortable: false,
                      width: "15%",
                    },
                    {
                      content: "Difference",
                      sortable: false,
                      width: "15%",
                    },
                  ]}
                  route={(pageSize, pageNumber, sortKey, asc) =>
                    getKpisApiRoute({
                      owner: owner,
                      repo: name,
                      pageSize,
                      pageNumber,
                      sortKey,
                      asc,
                      to: atB,
                      kinds: [KpiKinds.REPO],
                    })
                  }
                  rowGenerator={(kpi) => {
                    return [
                      {
                        content: (
                          <Toggle
                            key={kpi.id}
                            active={shownKpis.includes(kpi.id)}
                            action={() => {
                              updateKpis(kpi.id)
                            }}
                          />
                        ),
                        textAlign: "center",
                        vAlign: "middle",
                      },
                      {
                        content: (
                          <Button
                            context={"anchor"}
                            action={() =>
                              router.push({
                                pathname: getKpiForRepoRoute(
                                  {
                                    owner: owner,
                                    name: name ?? "undefined",
                                  },
                                  kpi.id,
                                ),
                                query: {
                                  atA: router.query.atA,
                                  atB: router.query.atB,
                                },
                              })
                            }
                          >
                            <strong>{kpi.name}</strong>
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
                        textAlign: "right",
                        vAlign: "middle",
                      },
                      {
                        content: <>limits</>,
                        textAlign: "center",
                        vAlign: "middle",
                      },
                      {
                        content: <>exp</>,
                        textAlign: "center",
                        vAlign: "middle",
                      },
                      {
                        content: <>diff</>,
                        textAlign: "center",
                        vAlign: "middle",
                      },
                    ]
                  }}
                />
              </Card>
            </Section>
          </>
        )}
      </Page>
    )
  )
})

export default Detail
