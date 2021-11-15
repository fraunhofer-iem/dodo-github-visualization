import { useRouter } from "next/router"
import useSWR from "swr"
import { Spinner, TrendComponent, TrendDirection } from "."
import {
  getAnalyticsForProjectRoute,
  getKpiForProjectRoute,
  getKpisForProjectApiRoute,
  getProjectApiRoute,
  Kpi,
  Project,
} from "../../lib/api"
import { Card } from "../card"
import { RingChart } from "../chart/RingChart"

interface Props {
  projectId: string
  width?: string
}

export function ProjectHealth(props: Props) {
  const { projectId } = props
  const router = useRouter()
  const width = props.width ?? "100px"
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
        name={project.name}
        action={() => router.push(getAnalyticsForProjectRoute(project.id))}
        rating={project.maturityIndex}
        // direction={
        //   [TrendDirection.up, TrendDirection.down, TrendDirection.neutral][
        //     Math.floor(Math.random() * 3)
        //   ]
        // }
        direction={TrendDirection.up}
      />
    </RingChart>
  ) : (
    <Spinner size={width} />
  )
}
