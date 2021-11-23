export const enum PageRoutes {
  ANALYTICS = "/analytics",
  HIERARCHY = "/hierarchy",
}

export function getAnalyticsForProjectRoute(projectId: string) {
  return `/analytics/projects/${projectId}`
}

export function getKpiForProjectRoute(projectId: string, kpiId: string) {
  return `/analytics/projects/${projectId}/kpis/${kpiId}`
}
