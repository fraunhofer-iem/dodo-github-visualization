import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { Card } from "../../../../components/card"
import { Section } from "../../../../components/content"
import RepositoryBrowser from "../../../../components/content/RepositoryBrowser"
import Toggle from "../../../../components/form/Toggle"
import KpiChart from "../../../../components/KpiChart"
import KpiTable from "../../../../components/KpiTable"
import { Page } from "../../../../components/layout"
import {
  AuthorizationDetails,
  getKpisApiRoute,
  requireAuthorization,
} from "../../../../lib/api"
import {
  dateToString,
  getAnalyticsForRepoRoute,
  KpiNames,
} from "../../../../lib/frontend"
import { useHeader } from "../../../../lib/hooks"

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
  const { owner, name, rangeA, setRangeA, rangeB, setRangeB, updateQuery } =
    useHeader((owner, name) =>
      getAnalyticsForRepoRoute({ owner: owner ?? "", name: name ?? "" }),
    )

  const [shownKpis, setShownKpis] = useState<string[]>([])
  useEffect(() => {
    setShownKpis([])
  }, [owner, name])

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
        {owner && name && (
          <>
            <Section width="150px" padding="0">
              <RepositoryBrowser repoId={{ owner: owner, name: name }} />
            </Section>
            <Section padding="0 5px">
              <Card>
                <KpiChart
                  route={() =>
                    shownKpis.length
                      ? getKpisApiRoute(
                          { owner, name },
                          shownKpis.length,
                          undefined,
                          undefined,
                          undefined,
                          rangeB?.since,
                          rangeB?.to,
                          undefined,
                          shownKpis,
                          true,
                        )
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
                    {
                      content: "",
                      sortable: false,
                      width: "10%",
                    },
                  ]}
                  route={(pageSize, pageNumber, sortKey, asc) =>
                    getKpisApiRoute(
                      { owner: owner, name: name },
                      pageSize,
                      pageNumber,
                      sortKey,
                      asc,
                      rangeB?.since,
                      rangeB?.to,
                    )
                  }
                  rowGenerator={(kpi) => {
                    return [
                      {
                        content: (
                          <Toggle
                            active={shownKpis.includes(kpi.id)}
                            action={() => {
                              if (shownKpis.includes(kpi.id)) {
                                shownKpis.splice(
                                  shownKpis.findIndex((k) => kpi.id === k),
                                )
                                setShownKpis([...shownKpis])
                              } else {
                                setShownKpis([...shownKpis, kpi.id])
                              }
                            }}
                          />
                        ),
                      },
                      {
                        content: (
                          <>
                            {/*@ts-ignore-line*/}
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
                      {
                        content: <>details</>,
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
