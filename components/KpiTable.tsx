import { useRouter } from "next/router"
import useSWR from "swr"
import { ApiError, getKpisForRepoApiRoute, Kpi } from "../lib/api"
import { getKpiForRepoRoute, TableContexts } from "../lib/frontend"
import { usePagination } from "../lib/hooks"
import { Button } from "./action"
import { Table } from "./table"

interface Props {
  repoId: { owner: string; name: string }
  kpiId?: string
}

export default function KpiTable(props: Props) {
  const { repoId, kpiId: kpiID } = props
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
    getKpisForRepoApiRoute(
      repoId,
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
      width="100%"
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
          { content: "Name", sortable: true, sortKey: "name", width: "70%" },
          { content: "Score", sortable: true, sortKey: "rating" },
        ],
        rows: kpis
          ? kpis.map((kpi) => [
              {
                content: (
                  <Button
                    action={() =>
                      router.push(getKpiForRepoRoute(repoId, kpi.id))
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
