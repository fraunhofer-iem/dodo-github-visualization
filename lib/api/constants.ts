// pagination default values
export const PAGE_SIZE_LIMIT = 50
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
  KPIS = "/api/kpis",
}

export function getReposApiRoute(
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
) {
  pageSize = pageSize ? pageSize : PAGE_SIZE_LIMIT
  pageNumber = pageNumber ? pageNumber : FIRST_PAGE
  sortKey = sortKey ? sortKey : "name"
  asc = asc == 0 ? 0 : 1
  return `/api/repos?${PaginationQueryParams.PAGE_SIZE}=${pageSize}&${PaginationQueryParams.PAGE_NUMBER}=${pageNumber}&${PaginationQueryParams.SORT_KEY}=${sortKey}&${PaginationQueryParams.ASC}=${asc}`
}

export function getRepoApiRoute(repoId: { owner: string; name: string }) {
  return `/api/repos/${repoId.owner}/${repoId.name}`
}

export function getKpisForRepoApiRoute(
  repoId: { owner: string; name: string },
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
) {
  pageSize = pageSize ? pageSize : PAGE_SIZE_LIMIT
  pageNumber = pageNumber ? pageNumber : FIRST_PAGE
  sortKey = sortKey ? sortKey : "name"
  asc = asc == 0 ? 0 : 1
  return `/api/repos/${repoId.owner}/${repoId.name}/kpis?${PaginationQueryParams.PAGE_SIZE}=${pageSize}&${PaginationQueryParams.PAGE_NUMBER}=${pageNumber}&${PaginationQueryParams.SORT_KEY}=${sortKey}&${PaginationQueryParams.ASC}=${asc}`
}

export function getKpiForRepoApiRoute(
  repoId: { owner: string; name: string },
  kpiId: string,
  since?: string,
  to?: string,
  interval?: Intervals,
) {
  const params = new URLSearchParams()
  if (since) {
    params.append("since", since)
  }
  if (to) {
    params.append("to", to)
  }
  if (interval) {
    params.append("interval", interval)
  }
  return `/api/repos/${repoId.owner}/${
    repoId.name
  }/kpis/${kpiId}?${params.toString()}`
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

export const KpiNames = new Map<string, string>([
  ["devSpread", "Developer Spread"],
  ["releaseCycle", "Release Cycle"],
  ["coc", "Coupling of Components"],
])
