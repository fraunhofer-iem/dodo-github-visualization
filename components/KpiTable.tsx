import { useRouter } from "next/router"
import useSWR from "swr"
import {
  getKpiForProjectRoute,
  getKpisForProjectApiRoute,
  Kpi,
} from "../lib/api"
import usePagination from "../lib/api/usePagination"
import Button from "./action/Button"
import Table from "./table/Table"

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
  const { data: kpis, error: error } = useSWR<Kpi[]>(
    getKpisForProjectApiRoute(
      projectID,
      pageSize,
      pageNumber,
      sortInformation.sortKey,
      sortInformation.ordering,
    ),
  )
  if (error && error.stack.status == 404) {
    setPageNumber(pageNumber - 1)
  }

  return (
    <Table
      width="50%"
      context={"striped"}
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
