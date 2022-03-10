import { reverse, sortBy } from "lodash"
import { NextApiRequestQuery } from "next/dist/server/api-utils"
import { FIRST_PAGE, PAGE_SIZE_LIMIT, PaginationQueryParams } from "./constants"
import { Pagination, Sort } from "./types"

/**
 *
 * @param query
 * @param validKeys the first key in the array is the default sorting key,
 * which is used if no sorting is specified by the user's query
 * @returns
 */
export function getPagination(
  query: NextApiRequestQuery,
  validKeys: string[],
): Pagination & Sort {
  return { ...getPaginationInfo(query), ...getSortKey(query, validKeys) }
}

function getPaginationInfo(query: NextApiRequestQuery) {
  return { ...getPageNumberAndSize(query), asc: isAsc(query) }
}

const isAsc = (query: NextApiRequestQuery) => {
  if (
    query.hasOwnProperty(PaginationQueryParams.ASC) &&
    isNumber(query[PaginationQueryParams.ASC])
  ) {
    return +query[PaginationQueryParams.ASC] === 1 ? true : false
  }
  return true
}

function getSortKey(query: NextApiRequestQuery, validKeys: string[]) {
  if (hasSortKey(query)) {
    const key = query[PaginationQueryParams.SORT_KEY] as string
    if (validKeys.includes(key)) {
      return { sortKey: key }
    }
  }
  return { sortKey: validKeys[0] }
}

function hasSortKey(query: NextApiRequestQuery) {
  return (
    query.hasOwnProperty(PaginationQueryParams.SORT_KEY) &&
    typeof query[PaginationQueryParams.SORT_KEY] == "string"
  )
}

const getPageNumberAndSize = (query: NextApiRequestQuery): Pagination => {
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
    query.hasOwnProperty(PaginationQueryParams.PAGE_NUMBER) &&
    isNumber(query[PaginationQueryParams.PAGE_NUMBER]) &&
    +query[PaginationQueryParams.PAGE_NUMBER] >= FIRST_PAGE
  )
}

const hasValidPageSize = (query: NextApiRequestQuery) => {
  if (
    query.hasOwnProperty(PaginationQueryParams.PAGE_SIZE) &&
    isNumber(query[PaginationQueryParams.PAGE_SIZE])
  ) {
    const pageSize = +query[PaginationQueryParams.PAGE_SIZE]
    // check if pageSize is in a valid range
    return pageSize >= FIRST_PAGE && pageSize <= PAGE_SIZE_LIMIT
  }
  return false
}

const isNumber = (numVal: string | string[]) => {
  return typeof numVal == "string" && !isNaN(+numVal)
}

export function paginate<T>(
  collection: T[],
  paginationParams: {
    sortKey: string
    asc: boolean
    pageSize: number
    pageNumber: number
  },
): T[] {
  const { sortKey, asc, pageSize, pageNumber } = paginationParams
  if (sortKey) {
    collection = sortBy(collection, [
      (currentElem: any) => currentElem[sortKey],
    ])
    if (!asc) {
      reverse(collection)
    }
  }
  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= collection.length) {
    return []
  }
  if (endOfChunk >= collection.length) {
    endOfChunk = collection.length
  }
  if (startOfChunk < 0) {
    startOfChunk = 0
    endOfChunk = pageSize
  }
  const chunk: T[] = collection.slice(
    startOfChunk < collection.length ? startOfChunk : undefined,
    endOfChunk < collection.length ? endOfChunk : undefined,
  )

  return chunk
}
