import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useCallback } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Card } from "../../../../../../components/card"
import {
  Breadcrumbs,
  Browser,
  KpiCard,
  KpiInspector,
  Section,
} from "../../../../../../components/content"
import KpiChart from "../../../../../../components/KpiChart"
import KpiTable from "../../../../../../components/KpiTable"
import { Page } from "../../../../../../components/layout"
import {
  AuthorizationDetails,
  getKpisApiRoute,
  Kpi,
  requireAuthorization,
} from "../../../../../../lib/api"
import {
  dateToString,
  getAnalyticsForRepoRoute,
  getKpiForRepoRoute,
  KpiKinds,
  PageRoutes,
  prepareKpiValue,
  toFixed,
} from "../../../../../../lib/frontend"
import { useHeader, useUIContext } from "../../../../../../lib/hooks"

const KPIDetail: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const {
      owner,
      name,
      kpi: kpiId,
      atA,
      setAtA,
      atB,
      setAtB,
      atDate,
      atPoint,
      updateQuery,
    } = useHeader(
      (owner, name) =>
        getKpiForRepoRoute(
          { owner: owner ?? "", name: name ?? "undefined" },
          kpiId ?? "",
        ),
      (path) => {
        return {
          owner: path[3],
          name: path[4] === "undefined" ? undefined : path[4],
          kpi: path.slice(6).join("/"),
        }
      },
    )
    const { theme } = useUIContext()

    const date = atDate ?? atB
    const point = atPoint ? +atPoint : undefined

    const setInspectionDetails = useCallback(
      (atDate, atPoint) => {
        updateQuery({
          atDate: atDate.toUTCString(),
          atPoint: atPoint,
        })
      },
      [updateQuery],
    )

    return (
      props.user?.isLoggedIn && (
        <Page
          title={`${kpiId}  - KPI Dashboard`}
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
          {owner && kpiId && (
            <>
              <Section width="150px" padding="0">
                <Browser<Kpi>
                  route={(pageSize, pageNumber, sortKey, asc, filter) =>
                    getKpisApiRoute({
                      owner: owner,
                      pageSize: pageSize,
                      pageNumber: pageNumber,
                      sortKey: sortKey,
                      asc: asc,
                      filter: filter,
                      kinds: [KpiKinds.ORGA, KpiKinds.REPO],
                    })
                  }
                  sortKey={"id"}
                  generator={(kpi) => (
                    <KpiCard
                      key={kpi.id}
                      kpi={kpi}
                      margin="0"
                      width="100%"
                      background={
                        kpi.owner === owner &&
                        kpi.repo === name &&
                        kpi.id === kpiId
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
                  crumbs={
                    name
                      ? [
                          {
                            name: `${owner}`,
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
                            name: `${name}`,
                            action: (router) => {
                              router.push({
                                pathname: getAnalyticsForRepoRoute({
                                  owner: owner,
                                  name: name,
                                }),
                                query: {
                                  atA: router.query.atA,
                                  atB: router.query.atB,
                                  owner: owner,
                                  name: name,
                                  kpiIds: router.query.kpiIds,
                                },
                              })
                            },
                          },
                          {
                            name: kpiId.split("@")[0],
                            action: (router) => {
                              router.push({
                                pathname: getKpiForRepoRoute(
                                  {
                                    owner: owner,
                                    name: name,
                                  },
                                  kpiId,
                                ),
                                query: {
                                  atA: router.query.atA,
                                  atB: router.query.atB,
                                  owner: owner,
                                  name: name,
                                  kpiIds: router.query.kpiIds,
                                },
                              })
                            },
                          },
                        ]
                      : [
                          {
                            name: `${owner}`,
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
                            name: kpiId.split("@")[0],
                            action: (router) => {
                              router.push({
                                pathname: getKpiForRepoRoute(
                                  {
                                    owner: owner,
                                    name: "undefined",
                                  },
                                  kpiId,
                                ),
                                query: {
                                  atA: router.query.atA,
                                  atB: router.query.atB,
                                  owner: owner,
                                  name: name,
                                  kpiIds: router.query.kpiIds,
                                },
                              })
                            },
                          },
                        ]
                  }
                />
                <Card>
                  <KpiChart
                    route={() =>
                      getKpisApiRoute({
                        owner: owner,
                        repo: name,
                        pageSize: 1,
                        from: atA,
                        to: atB,
                        kpiIds: [kpiId],
                        data: true,
                        children: true,
                        kinds: [KpiKinds.ORGA, KpiKinds.REPO, KpiKinds.DATA],
                      })
                    }
                    clickHandler={(kpiId, pointIndex, timestamp) => {
                      if (timestamp) {
                        setInspectionDetails(new Date(timestamp), pointIndex)
                      }
                    }}
                    activePoint={point}
                  />
                </Card>
                <Card>
                  <KpiTable
                    paginate={false}
                    columns={[
                      {
                        content: "Name",
                        sortable: true,
                        sortKey: "name",
                        width: "60%",
                      },
                      {
                        content: "Value",
                        sortable: false,
                        width: "30%",
                      },
                      {
                        content: "Difference",
                        sortable: false,
                        width: "5%",
                      },
                    ]}
                    route={(pageSize, pageNumber, sortKey, asc) =>
                      getKpisApiRoute({
                        owner: owner,
                        repo: name,
                        pageSize: 1,
                        pageNumber: 1,
                        to: date,
                        kpiIds: [kpiId],
                        kinds: [KpiKinds.ORGA, KpiKinds.REPO, KpiKinds.DATA],
                      })
                    }
                    rowGenerator={(kpi) => {
                      return [
                        {
                          content: (
                            <>
                              <strong>{kpi.name}</strong>
                              <br />
                              {kpi.description}
                            </>
                          ),
                          sortKey: "name",
                        },
                        {
                          content: (
                            <>
                              {kpi.value &&
                                toFixed(prepareKpiValue(kpi.value), 2)}
                              {`${
                                kpi.unit === "percent" ? "%" : ` ${kpi.unit}`
                              }`}
                            </>
                          ),
                          sortKey: "value",
                          textAlign: "right",
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
                <KpiInspector kpiId={kpiId} at={date} />
              </Section>
            </>
          )}
        </Page>
      )
    )
  },
)

export default KPIDetail
