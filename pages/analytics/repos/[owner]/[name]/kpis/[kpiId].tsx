import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React from "react"
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
  getKpiForRepoRoute,
  KpiNames,
} from "../../../../../../lib/frontend"
import { useHeader, useUIContext } from "../../../../../../lib/hooks"

const KPIDetail: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const {
      owner,
      name: repo,
      kpi: kpiId,
      rangeA,
      setRangeA,
      rangeB,
      setRangeB,
      updateQuery,
    } = useHeader(
      (owner, name) =>
        getKpiForRepoRoute(
          { owner: owner ?? "", name: name ?? "" },
          kpiId ?? "",
        ),
      (path) => {
        return {
          owner: path[path.length - 4],
          name: path[path.length - 3],
          kpi: path[path.length - 1],
        }
      },
    )
    const { theme } = useUIContext()

    return (
      props.user?.isLoggedIn && (
        <Page
          title={`${name}  - KPI Dashboard`}
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
          {owner && repo && kpiId && (
            <>
              <Section width="150px" padding="0">
                <Browser<Kpi>
                  route={(pageSize, pageNumber, sortKey, asc, filter) =>
                    getKpisApiRoute(
                      { owner: owner },
                      pageSize,
                      pageNumber,
                      sortKey,
                      asc,
                      filter,
                      rangeB?.since,
                      rangeB?.to,
                    )
                  }
                  sortKey={"id"}
                  generator={(kpi) => (
                    <Card
                      key={`${kpi.owner}/${kpi.repo}/${kpi.id}`}
                      margin="0"
                      height="100px"
                      width="100%"
                      background={
                        kpi.owner === owner &&
                        kpi.repo === repo &&
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
                          <strong>{KpiNames[kpi.id]}</strong>
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
                    { name: "Analytics", route: "" },
                    { name: `${owner}/${repo}`, route: "" },
                    { name: KpiNames[kpiId], route: "" },
                  ]}
                />
                <Card>
                  <KpiChart
                    route={() =>
                      getKpisApiRoute(
                        { owner, name: repo },
                        1,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        rangeB?.since,
                        rangeB?.to,
                        undefined,
                        [kpiId],
                        true,
                      )
                    }
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
                      getKpisApiRoute(
                        { owner: owner, name: repo },
                        1,
                        1,
                        undefined,
                        undefined,
                        undefined,
                        rangeB?.since,
                        rangeB?.to,
                        undefined,
                        [kpiId],
                      )
                    }
                    rowGenerator={(kpi) => {
                      return [
                        {
                          content: (
                            <>
                              <strong>{KpiNames[kpi.id]}</strong>
                            </>
                          ),
                          sortKey: "name",
                        },
                        {
                          content: <>{kpi.value}</>,
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
