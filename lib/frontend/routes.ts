export const enum PageRoutes {
  ANALYTICS = "/analytics",
  HIERARCHY = "/hierarchy",
}

export function getAnalyticsForRepoRoute(repoId: {
  owner: string
  name: string
}) {
  return `/analytics/repos/${repoId.owner}/${repoId.name}`
}

export function getKpiForRepoRoute(
  repoId: {
    owner: string
    name: string
  },
  kpiId: string,
) {
  return `/analytics/repos/${repoId.owner}/${repoId.name}/kpis/${kpiId}`
}
