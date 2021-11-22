import { useRouter } from "next/router"
import useSWR from "swr"
import { ApiError, getKpisForProjectApiRoute, Kpi } from "../lib/api"
import { getKpiForProjectRoute, TableContexts } from "../lib/frontend"
import { usePagination } from "../lib/hooks"
import { Button } from "./action"
import { Table } from "./table"

interface Props {
  projectID: string
  kpiID?: string
}

export default function KpiTable(props: Props) {
  const { projectID, kpiID } = props
  const router = useRouter()
  const {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    sortInformation,
    setSortInformation,
  } = usePagination("name")
  const { data: kpis, error: error } = useSWR<Kpi[], ApiError>(
    getKpisForProjectApiRoute(
      projectID,
      pageSize,
      pageNumber,
      sortInformation.sortKey,
      sortInformation.ordering,
    ),
  )
  if (error && error.statusCode == 404) {
    setPageNumber(pageNumber - 1)
  }

  return (
    <Table
      width="50%"
      context={TableContexts.STRIPED}
      paginate={true}
      {...{
        pageSize,
        setPageSize,
        pageNumber,
        setPageNumber,
        ordering: sortInformation.ordering,
        sortKey: sortInformation.sortKey,
        setSortInformation,
      }}
    >
      {{
        columns: [
          { content: "Name", sortable: true, sortKey: "name" },
          { content: "Score", sortable: true, sortKey: "rating" },
        ],
        rows: kpis
          ? kpis.map((kpi) => [
              {
                content: (
                  <Button
                    action={() =>
                      router.push(getKpiForProjectRoute(projectID, kpi.id))
                    }
                    context="anchor"
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
                  kpiID === kpi.id ? <strong>{kpi.rating}</strong> : kpi.rating,
                sortKey: kpi.rating,
              },
            ])
          : [],
      }}
    </Table>
  )
}
