import { reverse, sortBy } from "lodash"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Kpi } from "../lib/api"
import {
  getKpiForRepoRoute,
  Ordering,
  TableContexts,
  toFixed,
} from "../lib/frontend"
import { usePagination } from "../lib/hooks"
import { Button } from "./action"
import { Table } from "./table"

interface Props {
  children: Kpi[]
}

export function DataTable(props: Props) {
  const router = useRouter()
  const { children } = props

  const { sortInformation, setSortInformation } = usePagination("ident")
  const [data, setData] = useState<Kpi[] | undefined>(children)

  useEffect(() => {
    const sortedData: Kpi[] = []
    for (const child of children) {
      let value = sortBy(Object.entries(child.value as any), [
        ([label, value]) => {
          if (sortInformation.sortKey === "ident") {
            return label
          } else {
            if (Array.isArray(value)) {
              return (value as any).length
            }
            return value
          }
        },
      ])
      if (sortInformation.ordering === Ordering.DESCENDING) {
        value = reverse(value)
      }
      sortedData.push({
        ...child,
        value: Object.fromEntries(value as any) as any,
      })
      setData(sortedData)
    }
  }, [sortInformation, children])

  return (
    <>
      {data && (
        <Table
          context={TableContexts.STRIPED}
          {...{
            ordering: sortInformation.ordering,
            sortKey: sortInformation.sortKey,
            setSortInformation,
          }}
        >
          {{
            columns: [
              {
                content: <strong>Data Identificator</strong>,
                sortable: true,
                width: "25%",
                sortKey: "ident",
              },
              {
                content: <strong>Value</strong>,
                sortable: true,
                sortKey: "value",
              },
            ],
            sections: data
              .filter((child) => child.kind === "data")
              .map((child) => ({
                title: (
                  <Button
                    type={"button"}
                    context="anchor"
                    // disabled={child.children?.length ? false : true}
                    disabled={false}
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
                          atPoint: router.query.atPoint,
                        },
                      })
                    }
                  >
                    <strong>{child.name}</strong>
                  </Button>
                ),
                rows: Object.entries(child.value as any).map(
                  ([label, value]) => [
                    {
                      content: label,
                    },
                    {
                      collapsible: Array.isArray(value),
                      content: Array.isArray(value) ? (
                        value.length ? (
                          value.map((element, index) => (
                            <React.Fragment key={index}>
                              {element}
                              <br />
                            </React.Fragment>
                          ))
                        ) : (
                          "-"
                        )
                      ) : (
                        <>{toFixed(value as any, 4)}</>
                      ),
                    },
                  ],
                ),
              })),
          }}
        </Table>
      )}
    </>
  )
}
