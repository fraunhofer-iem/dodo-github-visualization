import { NextApiRequestQuery } from "next/dist/server/api-utils"

export const PAGE_SIZE_LIMIT = 50

export type Pagination = {
  pageSize: number
  pageNumber: number
}

export const getPagination = (query: NextApiRequestQuery): Pagination => {
  if (hasValidPageNumber(query)) {
    if (hasValidPageSize(query)) {
      return { pageNumber: +query.pageNumber, pageSize: +query.pageSize }
    } else {
      return { pageNumber: +query.pageNumber, pageSize: PAGE_SIZE_LIMIT }
    }
  } else {
    return { pageSize: PAGE_SIZE_LIMIT, pageNumber: 1 }
  }
}

const hasValidPageNumber = (query: NextApiRequestQuery) => {
  return query.hasOwnProperty("pageNumber") && isNumber(query["pageNumber"])
}

const hasValidPageSize = (query: NextApiRequestQuery) => {
  if (query.hasOwnProperty("pageSize")) {
    return isNumber(query["pageSize"])
  }
  return false
}

const isNumber = (numVal: string | string[]) => {
  return typeof numVal == "string" && !isNaN(+numVal)
}
