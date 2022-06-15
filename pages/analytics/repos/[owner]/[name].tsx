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
    [shownKpis],
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
                  { name: "Analytics", route: PageRoutes.ANALYTICS },
                  {
                    name: `${owner}/${name}`,
                    route: getAnalyticsForRepoRoute({
                      owner: owner,
                      name: name,
                    }),
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
                          kinds: ["repo"],
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
                    },
                    {
                      content: "Name",
                      sortable: true,
                      sortKey: "name",
                      width: "40%",
                    },
                    {
                      content: "Value",
                      sortable: true,
                      sortKey: "value",
                      width: "20%",
                    },
                    {
                      content: "Limits",
                      sortable: false,
                      width: "10%",
                    },
                    {
                      content: "Expected Value",
                      sortable: false,
                      width: "10%",
                    },
                    {
                      content: "Difference",
                      sortable: false,
                      width: "10%",
                    },
                    {
                      content: "",
                      sortable: false,
                      width: "10%",
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
                      kinds: ["repo"],
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
                      },
                      {
                        content: (
                          <>
                            <strong>{kpi.name}</strong>
                          </>
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
                      {
                        content: <>limits</>,
                      },
                      {
                        content: <>exp</>,
                      },
                      {
                        content: <>diff</>,
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
                                    name: name,
                                  },
                                  kpi.id,
                                ),
                                query: { ...router.query },
                              })
                            }
                          >
                            Show details
                          </Button>
                        ),
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
