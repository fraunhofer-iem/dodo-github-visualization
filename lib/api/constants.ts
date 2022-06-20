// pagination default values
export const PAGE_SIZE_LIMIT = 5
export const FIRST_PAGE = 1
// query parameter for sort functionality
export const enum PaginationQueryParams {
  ASC = "asc",
  SORT_KEY = "sortKey",
  PAGE_NUMBER = "pageNumber",
  PAGE_SIZE = "pageSize",
}

export const enum Intervals {
  YEAR = "year",
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}

export const USER_COOKIE = "user"

export const enum ApiRoutes {
  USER = "/api/user",
  LOGIN = "/api/login",
  LOGOUT = "/api/logout",
  KPIS = "/api/kpis",
}

export function getReposApiRoute(
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
  filter?: string,
  since?: Date,
  to?: Date,
) {
  const params = new URLSearchParams()
  params.append(
    PaginationQueryParams.PAGE_SIZE,
    `${pageSize ? pageSize : PAGE_SIZE_LIMIT}`,
  )
  params.append(
    PaginationQueryParams.PAGE_NUMBER,
    `${pageNumber ? pageNumber : FIRST_PAGE}`,
  )
  params.append(PaginationQueryParams.SORT_KEY, `${sortKey ? sortKey : "name"}`)
  params.append(PaginationQueryParams.ASC, `${asc == 0 ? 0 : 1}`)
  if (since) {
    params.append("since", since.toISOString().split("T")[0])
  }
  if (to) {
    params.append("to", to.toISOString().split("T")[0])
  }
  if (filter) {
    params.append("filter", filter)
  }
  return `/api/repos?${params.toString()}`
}

export function getRepoApiRoute(repoId: { owner: string; name: string }) {
  return `/api/repos/${repoId.owner}/${repoId.name}`
}

export function getKpisApiRoute(options: {
  owner: string
  repo?: string
  pageSize?: number
  pageNumber?: number
  sortKey?: string
  asc?: number
  filter?: string
  from?: Date
  to?: Date
  kpiIds?: string[]
  children?: boolean
  kinds?: string[]
  data?: boolean
}) {
  const {
    owner,
    repo,
    pageSize,
    pageNumber,
    sortKey,
    asc,
    filter,
    from,
    to,
    kpiIds,
    data,
    children,
    kinds,
  } = options
  const params = new URLSearchParams()
  params.append(
    PaginationQueryParams.PAGE_SIZE,
    `${pageSize ? pageSize : PAGE_SIZE_LIMIT}`,
  )
  params.append(
    PaginationQueryParams.PAGE_NUMBER,
    `${pageNumber ? pageNumber : FIRST_PAGE}`,
  )
  params.append(PaginationQueryParams.SORT_KEY, `${sortKey ? sortKey : "name"}`)
  params.append(PaginationQueryParams.ASC, `${asc == 0 ? 0 : 1}`)
  params.append("owner", owner)
  if (repo) {
    params.append("repo", repo)
  }
  if (kpiIds) {
    for (const kpi of kpiIds) {
      params.append("kpis[]", kpi)
    }
  }
  if (kinds) {
    for (const kind of kinds) {
      params.append("kinds[]", kind)
    }
  }
  if (to) {
    params.append("to", to.toISOString())
  }
  if (from) {
    params.append("from", from.toISOString())
  }
  if (filter) {
    console.log(filter)
    params.append("filter", filter)
  }
  if (data) {
    params.append("history", JSON.stringify(data))
  }
  if (children) {
    params.append("children", JSON.stringify(children))
  }
  return `${ApiRoutes.KPIS}?${params.toString()}`
}

export function getKpiApiRoute(kpiId: string) {
  const params = new URLSearchParams()

  return `${ApiRoutes.KPIS}/${kpiId}?${params.toString()}`
}

export function getKpiDataApiRoute(options: {
  kpiId: string
  at?: Date
  history?: boolean
}) {
  const { kpiId, at, history } = options
  const params = new URLSearchParams()
  if (at) {
    params.append("to", at.toISOString().split("T")[0])
  }
  if (history) {
    params.append("history", JSON.stringify(history))
  }
  params.append("data", JSON.stringify(true))

  return `${ApiRoutes.KPIS}/${kpiId}?${params.toString()}`
}

// the first key is the default sorting key, which is
// used if no sorting is specified by the user's  request
export const SortableTableKeys = ["NAME", "RATING"]

// TODO: Replace with final solution
export function getTrendsApiRoute(
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
) {
  pageSize = pageSize ? pageSize : 9
  pageNumber = pageNumber ? pageNumber : 1
  sortKey = sortKey ? sortKey : "name"
  asc = asc == 0 ? 0 : 1
  return `/api/trends?${PaginationQueryParams.PAGE_SIZE}=${pageSize}&${PaginationQueryParams.PAGE_NUMBER}=${pageNumber}&${PaginationQueryParams.SORT_KEY}=${sortKey}&${PaginationQueryParams.ASC}=${asc}`
}
