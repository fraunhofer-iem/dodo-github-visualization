import { useRouter } from "next/router"
import useSWR from "swr"
import { Spinner, TrendComponent } from "."
import {
  getAnalyticsForProjectRoute,
  getKpiForProjectRoute,
  getKpisForProjectApiRoute,
  getProjectApiRoute,
  Kpi,
  Project,
} from "../../lib/api"
import { TrendDirection } from "../../lib/frontend"
import { Card } from "../card"
import { RingChart } from "../chart"

interface Props {
  /**
   * The ID of the project to be displayed
   */
  projectId: string
  /**
   * The ring chart's size
   *
   * Defaults to 100px
   */
  width?: string
}

/**
 * Simple wrapper component that fetches the project's data from the API
 * and displays it in a ring chart.
 */
export function ProjectHealth(props: Props) {
  const { projectId } = props
  const router = useRouter()
  const width = props.width ?? "100px"
  // Note: in the future, the necessary information should be obtained via the /api/project/[pid]
  // endpoint alone. Currently, the trend direction is set to "up" by default and the (first 5)
  // KPIs are used for the dummy rings.
  const { data: project } = useSWR<Project>(getProjectApiRoute(projectId))
  const { data: kpis } = useSWR<Kpi[]>(getKpisForProjectApiRoute(projectId))

  return project && kpis ? (
    <RingChart
      rings={kpis.map((currentKpi) => ({
        value: currentKpi.rating,
        tooltip: <Card>{currentKpi.name}</Card>,
        action: () =>
          router.push(getKpiForProjectRoute(project.id, currentKpi.id)),
      }))}
      width={width}
    >
      <TrendComponent
        compact={true}
        label={project.name}
        action={() => router.push(getAnalyticsForProjectRoute(project.id))}
        rating={project.maturityIndex}
        direction={TrendDirection.UP}
      />
    </RingChart>
  ) : (
    <Spinner size={width} />
  )
}
