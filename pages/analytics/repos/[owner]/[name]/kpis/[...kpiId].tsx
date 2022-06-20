import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
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
  PageRoutes,
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

    const [inspectionDetails, setInspectionDetails] = useState<
      { date?: Date; pointIndex?: number } | undefined
    >({ date: atB })

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
                      kinds: ["orga", "repo"],
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
                          { name: `${owner}`, route: PageRoutes.ANALYTICS },
                          {
                            name: `${name}`,
                            route: getAnalyticsForRepoRoute({
                              owner: owner,
                              name: name,
                            }),
                          },
                          {
                            name: kpiId.split("@")[0],
                            route: getKpiForRepoRoute(
                              {
                                owner: owner,
                                name: name,
                              },
                              kpiId,
                            ),
                          },
                        ]
                      : [
                          { name: `${owner}`, route: PageRoutes.ANALYTICS },
                          {
                            name: kpiId.split("@")[0],
                            route: getKpiForRepoRoute(
                              {
                                owner: owner,
                                name: "undefined",
                              },
                              kpiId,
                            ),
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
                        kinds: ["repo", "orga"],
                      })
                    }
                    clickHandler={(kpiId, pointIndex, timestamp) => {
                      if (timestamp) {
                        setInspectionDetails({
                          date: new Date(timestamp),
                          pointIndex: pointIndex,
                        })
                      }
                    }}
                    activePoint={inspectionDetails?.pointIndex}
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
                        width: "40%",
                      },
                      {
                        content: "Value",
                        sortable: false,
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
                    ]}
                    route={(pageSize, pageNumber, sortKey, asc) =>
                      getKpisApiRoute({
                        owner: owner,
                        repo: name,
                        pageSize: 1,
                        pageNumber: 1,
                        to: inspectionDetails?.date,
                        kpiIds: [kpiId],
                        kinds: ["repo", "orga"],
                      })
                    }
                    rowGenerator={(kpi) => {
                      return [
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
                <KpiInspector kpiId={kpiId} at={inspectionDetails?.date} />
              </Section>
            </>
          )}
        </Page>
      )
    )
  },
)

export default KPIDetail
