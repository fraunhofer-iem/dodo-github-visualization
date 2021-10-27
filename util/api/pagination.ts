import { NextApiRequestQuery } from "next/dist/server/api-utils"

export const PAGE_SIZE_LIMIT = 50
export const FIRST_PAGE = 1

export type Pagination = {
  pageSize: number
  pageNumber: number
}

export type Sort = {
  asc: boolean
  sortKey: string
}

const SortableTableKeys = ["NAME", "RATING"]

export function getSortedTablePagination(
  query: NextApiRequestQuery,
): Pagination & Sort {
  return { ...getSortedPagination(query), ...getTableSortKey(query) }
}

function getSortedPagination(query: NextApiRequestQuery) {
  return { ...getPagination(query), asc: isAsc(query) }
}

const isAsc = (query: NextApiRequestQuery) => {
  if (query.hasOwnProperty("asc") && isNumber(query["asc"])) {
    return +query["asc"] === 1 ? true : false
  }
  return true
}

function getTableSortKey(query: NextApiRequestQuery) {
  if (hasSortKey(query)) {
    const key = query["sortKey"] as string
    if (SortableTableKeys.includes(key)) {
      return { sortKey: key }
    }
  }
  return { sortKey: SortableTableKeys[0] }
}

function hasSortKey(query: NextApiRequestQuery) {
  return query.hasOwnProperty("sortKey") && typeof query["sortKey"] == "string"
}

export const getPagination = (query: NextApiRequestQuery): Pagination => {
  if (hasValidPageNumber(query)) {
    if (hasValidPageSize(query)) {
      return { pageNumber: +query.pageNumber, pageSize: +query.pageSize }
    } else {
      return { pageNumber: +query.pageNumber, pageSize: PAGE_SIZE_LIMIT }
    }
  } else {
    return { pageSize: PAGE_SIZE_LIMIT, pageNumber: FIRST_PAGE }
  }
}

const hasValidPageNumber = (query: NextApiRequestQuery) => {
  return (
    query.hasOwnProperty("pageNumber") &&
    isNumber(query["pageNumber"]) &&
    +query["pageNumber"] >= FIRST_PAGE
  )
}

const hasValidPageSize = (query: NextApiRequestQuery) => {
  if (query.hasOwnProperty("pageSize") && isNumber(query["pageSize"])) {
    const pageSize = +query["pageSize"]
    // check if pageSize is in a valid range
    return pageSize >= FIRST_PAGE && pageSize <= PAGE_SIZE_LIMIT
  }
  return false
}

const isNumber = (numVal: string | string[]) => {
  return typeof numVal == "string" && !isNaN(+numVal)
}
