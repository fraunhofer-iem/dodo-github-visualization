import { useState } from "react"
import { FIRST_PAGE, PAGE_SIZE_LIMIT } from "../api"
import { Ordering } from "../frontend"

/**
 * Enables the user to control a paginated API endpoint
 */
export function usePagination(
  defaultSortKey: string,
  initialPageSize?: number,
) {
  const [pageNumber, setPageNumber] = useState<number>(FIRST_PAGE)
  const [pageSize, setPageSize] = useState<number>(
    initialPageSize ?? PAGE_SIZE_LIMIT,
  )
  const [sortInformation, setSortInformation] = useState<{
    sortKey: string
    ordering: Ordering
  }>({ sortKey: defaultSortKey, ordering: Ordering.ASCENDING })

  return {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    sortInformation,
    setSortInformation,
  }
}
