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
  return `/api/repos?${params.toString()}`
}

export function getRepoApiRoute(repoId: { owner: string; name: string }) {
  return `/api/repos/${repoId.owner}/${repoId.name}`
}

export function getKpisApiRoute(
  id: { owner: string; name?: string },
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
  since?: Date,
  to?: Date,
  interval?: Intervals,
  kpiIds?: string[],
  data: boolean = false,
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
  params.append("owner", id.owner)
  if (id.name) {
    params.append("repos[]", id.name)
  }
  if (kpiIds) {
    for (const kpi of kpiIds) {
      params.append("kpis[]", kpi)
    }
  }
  if (since) {
    params.append("since", since.toISOString().split("T")[0])
  }
  if (to) {
    params.append("to", to.toISOString().split("T")[0])
  }
  if (interval) {
    params.append("interval", interval)
  }
  params.append("data", `${data}`)
  return `${ApiRoutes.KPIS}?${params.toString()}`
}

export function getKpiApiRoute(
  id: { owner: string; name?: string },
  kpiId: string,
  since?: Date,
  to?: Date,
  interval?: Intervals,
) {
  const params = new URLSearchParams()
  params.append("owner", id.owner)
  if (id.name) {
    params.append("repo", id.name)
  }
  if (since) {
    params.append("since", since.toISOString().split("T")[0])
  }
  if (to) {
    params.append("to", to.toISOString().split("T")[0])
  }
  if (interval) {
    params.append("interval", interval)
  }
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
