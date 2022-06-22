import { useRouter } from "next/router"
import useSWR from "swr"
import { ApiError, Kpi } from "../lib/api"
import { TableContexts } from "../lib/frontend"
import { usePagination } from "../lib/hooks"
import { Table } from "./table"

interface Props {
  columns: {
    content: React.ReactNode
    sortable: boolean
    sortKey?: string
    width?: string
  }[]
  rowGenerator: (kpi: Kpi) => {
    content: React.ReactNode
    sortKey?: string | number
    textAlign?: "left" | "right" | "center"
    vAlign?: "top" | "middle" | "bottom"
  }[]
  route: (
    pageSize?: number,
    pageNumber?: number,
    sortKey?: string,
    asc?: number,
    at?: Date,
  ) => string
  kpiId?: string
  paginate?: boolean
}

export default function KpiTable(props: Props) {
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
    props.route(
      pageSize,
      pageNumber,
      sortInformation.sortKey,
      sortInformation.ordering,
    ),
  )
  if (error && error.statusCode == 404 && pageNumber > 1) {
    setPageNumber(pageNumber - 1)
  }

  return (
    <Table
      width="100%"
      context={TableContexts.STRIPED}
      paginate={props.paginate === undefined ? true : props.paginate}
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
        columns: props.columns,
        sections: [
          {
            rows: kpis ? kpis.map((kpi) => props.rowGenerator(kpi)) : [],
          },
        ],
      }}
    </Table>
  )
}
