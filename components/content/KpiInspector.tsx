import { useRouter } from "next/router"
import useSWR from "swr"
import { getKpiApiRoute, getKpisApiRoute, Kpi } from "../../lib/api"
import { getKpiForRepoRoute, KpiKinds, TableContexts } from "../../lib/frontend"
import { Button } from "../action"
import { Card, CardTitle } from "../card"
import { DataTable } from "../DataTable"
import { Table } from "../table"
import { Spinner } from "./Spinner"

interface Props {
  kpiId: string
  at?: Date
}

export function KpiInspector(props: Props) {
  const router = useRouter()
  const { kpiId, at } = props
  const { data: kpi, error: kpiError } = useSWR<Kpi>(getKpiApiRoute(kpiId))
  const { data: children, error: childrenError } = useSWR<Kpi[]>(
    kpi
      ? getKpisApiRoute({
          owner: kpi.owner,
          repo: kpi.repo,
          pageSize: kpi.children?.length,
          pageNumber: 1,
          data: false,
          children: false,
          kpiIds: kpi.children,
          to: at,
          kinds: [KpiKinds.ORGA, KpiKinds.REPO, KpiKinds.DATA],
        })
      : null,
  )

  const isLoadingKpi = !kpi && !kpiError
  const isLoadingChildren = !children && !childrenError

  return isLoadingKpi ? (
    <div style={{ textAlign: "center" }}>
      <Spinner size="100px" />
    </div>
  ) : isLoadingChildren ? (
    <div style={{ textAlign: "center" }}>
      <Spinner size="100px" />
    </div>
  ) : kpi && kpi.children && kpi.children.length && children ? (
    <>
      {children.filter((child) => child.kind !== KpiKinds.DATA).length > 0 && (
        <Card>
          <CardTitle>Aggregated KPIs</CardTitle>
          <Table paginate={false} context={TableContexts.STRIPED}>
            {{
              columns: [
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
              ],
              sections: [
                {
                  rows: children
                    .filter((child) => child.kind !== KpiKinds.DATA)
                    .map((child) => [
                      {
                        content: (
                          <Button
                            context={"anchor"}
                            display="block"
                            width="100%"
                            align="left"
                            padding="0"
                            action={() =>
                              router.push({
                                pathname: getKpiForRepoRoute(
                                  {
                                    owner: child.owner,
                                    name: child.repo as string,
                                  },
                                  child.id,
                                ),
                                query: {
                                  atA: router.query.atA,
                                  atB: router.query.atB,
                                  owner: child.owner,
                                  name: child.name,
                                },
                              })
                            }
                          >
                            <strong>{child.name}</strong>
                            <br />
                            <span style={{ fontSize: "10pt" }}>
                              {child.owner}/{child.repo}
                            </span>
                          </Button>
                        ),
                        sortKey: "name",
                      },
                      {
                        content: (
                          <>
                            {child.value &&
                            child.value > Math.floor(child.value)
                              ? child.value.toFixed(2)
                              : child.value}
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
                    ]),
                },
              ],
            }}
          </Table>
        </Card>
      )}
      {children.filter((child) => child.kind === KpiKinds.DATA).length > 0 && (
        <Card>
          <CardTitle>Used Data</CardTitle>
          <DataTable>
            {children.filter((child) => child.kind === KpiKinds.DATA)}
          </DataTable>
        </Card>
      )}
    </>
  ) : (
    <></>
  )
}
