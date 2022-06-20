import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"
import { getKpiApiRoute, getKpisApiRoute, Kpi } from "../../lib/api"
import { getKpiForRepoRoute, TableContexts } from "../../lib/frontend"
import { Button } from "../action"
import { Card, CardTitle } from "../card"
import { ListGroup, ListGroupItem } from "../list"
import { Table } from "../table"

interface Props {
  kpiId: string
  at?: Date
}

export function KpiInspector(props: Props) {
  const router = useRouter()
  const { kpiId, at } = props
  const { data: kpi } = useSWR<Kpi>(getKpiApiRoute(kpiId))
  const { data: children } = useSWR<Kpi[]>(
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
          kinds: ["orga", "repo", "data"],
        })
      : null,
  )

  return kpi && kpi.children && kpi.children.length && children ? (
    <>
      {children.filter((child) => child.kind !== "data").length > 0 && (
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
              rows: children
                .filter((child) => child.kind !== "data")
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
                            query: { ...router.query },
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
                        {child.value && child.value > Math.floor(child.value)
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
            }}
          </Table>
        </Card>
      )}
      {children.filter((child) => child.kind === "data").length > 0 && (
        <Card>
          <CardTitle>Used Data</CardTitle>
          {children
            .filter((child) => child.kind === "data")
            .map((child) => (
              <ListGroup>
                <ListGroupItem borderColor="none">
                  {child.value && (
                    <Table context={TableContexts.STRIPED}>
                      {{
                        columns: [
                          {
                            content: <strong>{child.name}</strong>,
                            sortable: false,
                            width: "25%",
                          },
                          {
                            content: <></>,
                            sortable: false,
                          },
                        ],
                        rows: Object.entries(child.value as any).map(
                          ([label, value]) => [
                            {
                              content: <strong>{label}</strong>,
                            },
                            {
                              content: Array.isArray(value) ? (
                                value.map((element, index) => (
                                  <React.Fragment key={index}>
                                    {element}
                                    <br />
                                  </React.Fragment>
                                ))
                              ) : (
                                <>{value}</>
                              ),
                            },
                          ],
                        ),
                      }}
                    </Table>
                  )}
                </ListGroupItem>
              </ListGroup>
            ))}
        </Card>
      )}
    </>
  ) : (
    <></>
  )
}
