import { useRouter } from "next/router"
import useSWR from "swr"
import { Spinner, TrendComponent } from "."
import { getRepoApiRoute, Repo } from "../../lib/api"
import {
  getAnalyticsForProjectRoute,
  getKpiForProjectRoute,
  TrendDirections,
} from "../../lib/frontend"
import { Card } from "../card"
import { RingChart } from "../chart"

interface Props {
  /**
   * The ID of the repository to be displayed
   */
  repoId: string
  /**
   * The ring chart's size
   *
   * Defaults to 100px
   */
  width?: string
}

/**
 * Simple wrapper component that fetches the repository's data from the API
 * and displays it in a ring chart.
 */
export function RepositoryHealth(props: Props) {
  const { repoId: projectId } = props
  const router = useRouter()
  const width = props.width ?? "100px"
  const { data: repo } = useSWR<Repo>(getRepoApiRoute(projectId))
  const kpis = [{ rating: 5, name: "Test", id: "test" }]
  return repo && kpis ? (
    <RingChart
      rings={kpis.map((currentKpi) => ({
        value: currentKpi.rating,
        tooltip: <Card>{currentKpi.name}</Card>,
        action: () =>
          router.push(getKpiForProjectRoute(repo.id, currentKpi.id)),
      }))}
      width={width}
    >
      <TrendComponent
        compact={true}
        label={repo.name}
        action={() => router.push(getAnalyticsForProjectRoute(repo.id))}
        rating={repo.maturityIndex}
        direction={TrendDirections.UP}
      />
    </RingChart>
  ) : (
    <Spinner size={width} />
  )
}
