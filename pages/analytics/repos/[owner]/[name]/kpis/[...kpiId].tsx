import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "../../../../../../components/action"
import { Card } from "../../../../../../components/card"
import {
  Breadcrumbs,
  Browser,
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
          { owner: owner ?? "", name: name ?? "" },
          kpiId ?? "",
        ),
      (path) => {
        return {
          owner: path[3],
          name: path[4],
          kpi: path.slice(6).join("/"),
        }
      },
    )
    const { theme } = useUIContext()

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
          {owner && name && kpiId && (
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
                    })
                  }
                  sortKey={"id"}
                  generator={(kpi) => (
                    <Card
                      key={`${kpi.owner}/${kpi.repo}/${kpi.id}`}
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
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          context={"neutral"}
                          type={"button"}
                          action={() =>
                            router.push({
                              pathname: getKpiForRepoRoute(
                                {
                                  owner: kpi.owner,
                                  name: kpi.repo as string,
                                },
                                kpi.id,
                              ),
                              query: { ...router.query },
                            })
                          }
                          padding={"0"}
                        >
                          <strong>{kpi.name}</strong>
                          <br />
                          <span style={{ fontSize: "10pt" }}>
                            {kpi.owner}/{kpi.repo}
                          </span>
                        </Button>
                      </div>
                    </Card>
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
                    {
                      name: kpiId,
                      route: getKpiForRepoRoute(
                        {
                          owner: owner,
                          name: name,
                        },
                        kpiId,
                      ),
                    },
                  ]}
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
                      })
                    }
                    clickHandler={(kpiId, label) => {
                      alert(
                        `TODO: Show children of ${kpiId} for release ${label}`,
                      )
                    }}
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
                        to: atB,
                        kpiIds: [kpiId],
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
  },
)

export default KPIDetail
