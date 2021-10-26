import { useRouter } from "next/router"
import { useState } from "react"
import useSWR from "swr"
import { Kpi } from "../pages/api/projects/[pid]/kpis"
import Button from "./action/Button"
import Table from "./table/Table"

interface Props {
  projectID: string
  kpiID?: string
}

export default function KpiTable(props: Props) {
  const { projectID, kpiID } = props
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const { data: kpis } = useSWR<Kpi[]>(
    `/api/projects/${projectID}/kpis?pageSize=${pageSize}&pageNumber=${pageNumber}`,
  )

  return (
    <Table
      context="striped"
      paginate={true}
      {...{ pageSize, setPageSize, pageNumber, setPageNumber }}
    >
      {{
        columns: [
          { content: "Name", sortable: true },
          { content: "Score", sortable: true },
        ],
        rows: kpis
          ? kpis.map((kpi) => [
              {
                content: (
                  <Button
                    action={() =>
                      router.push(
                        `/analytics/projects/${projectID}/kpis/${kpi.id}`,
                      )
                    }
                    context="neutral"
                    width="100%"
                    display="block"
                    align="left"
                  >
                    {kpiID === kpi.id ? <strong>{kpi.name}</strong> : kpi.name}
                  </Button>
                ),
                sortKey: kpi.name,
              },
              {
                content:
                  kpiID === kpi.id ? <strong>{kpi.score}</strong> : kpi.score,
                sortKey: kpi.score,
              },
            ])
          : [],
      }}
    </Table>
  )
}
