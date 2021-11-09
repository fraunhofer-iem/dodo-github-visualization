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

export const USER_COOKIE = "user"

export const enum ApiRoutes {
  USER = "/api/user",
  LOGIN = "/api/login",
  KPIS = "/api/kpis",
}

export const enum PageRoutes {
  ANALYTICS = "/analytics",
}

export function getAnalyticsForProjectRoute(projectId: string) {
  return `/analytics/projects/${projectId}`
}

export function getKpiForProjectRoute(projectId: string, kpiId: string) {
  return `/analytics/projects/${projectId}/kpis/${kpiId}`
}

export function getProjectsApiRoute(
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
) {
  pageSize = pageSize ? pageSize : PAGE_SIZE_LIMIT
  pageNumber = pageNumber ? pageNumber : FIRST_PAGE
  sortKey = sortKey ? sortKey : "name"
  asc = asc == 0 ? 0 : 1
  return `/api/projects?${PaginationQueryParams.PAGE_SIZE}=${pageSize}&${PaginationQueryParams.PAGE_NUMBER}=${pageNumber}&${PaginationQueryParams.SORT_KEY}=${sortKey}&${PaginationQueryParams.ASC}=${asc}`
}

export function getProjectApiRoute(projectId: string) {
  return `/api/projects/${projectId}`
}

export function getKpisForProjectApiRoute(
  projectId: string,
  pageSize?: number,
  pageNumber?: number,
  sortKey?: string,
  asc?: number,
) {
  pageSize = pageSize ? pageSize : PAGE_SIZE_LIMIT
  pageNumber = pageNumber ? pageNumber : FIRST_PAGE
  sortKey = sortKey ? sortKey : "name"
  asc = asc == 0 ? 0 : 1
  return `/api/projects/${projectId}/kpis?${PaginationQueryParams.PAGE_SIZE}=${pageSize}&${PaginationQueryParams.PAGE_NUMBER}=${pageNumber}&${PaginationQueryParams.SORT_KEY}=${sortKey}&${PaginationQueryParams.ASC}=${asc}`
}

export function getKpiForProjectApiRoute(projectId: string, kpiId: string) {
  return `/api/projects/${projectId}/kpis/${kpiId}`
}

// the first key is the default sorting key, which is
// used if no sorting is specified by the user's  request
export const SortableTableKeys = ["NAME", "RATING"]
