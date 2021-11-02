import { useState } from "react"
import { Ordering } from "../../components/table/TableCell"

export default function usePagination(defaultSortKey: string) {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [sortInformation, setSortInformation] = useState<{
    sortKey: string
    ordering: Ordering
  }>({ sortKey: defaultSortKey, ordering: Ordering.ascending })

  return {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    sortInformation,
    setSortInformation,
  }
}
