import { useRouter } from "next/router"
import useSWR from "swr"
import { Spinner, TrendComponent } from "."
import {
  getKpisForRepoApiRoute,
  getRepoApiRoute,
  Kpi,
  RepoDetail,
} from "../../lib/api"
import {
  getAnalyticsForRepoRoute,
  getKpiForRepoRoute,
  TrendDirections,
} from "../../lib/frontend"
import { Card } from "../card"
import { RingChart } from "../chart"

interface Props {
  /**
   * The ID of the repository to be displayed
   */
  repoId: { owner: string; name: string }
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
  const { repoId } = props
  const router = useRouter()
  const width = props.width ?? "100px"
  const { data: repo } = useSWR<RepoDetail>(getRepoApiRoute(repoId))
  const { data: kpis } = useSWR<Kpi[]>(getKpisForRepoApiRoute(repoId))
  return repo && kpis ? (
    <RingChart
      rings={kpis.map((currentKpi) => ({
        value: currentKpi.rating,
        tooltip: <Card>{currentKpi.name}</Card>,
        action: () => router.push(getKpiForRepoRoute(repoId, currentKpi.id)),
      }))}
      width={width}
    >
      <TrendComponent
        compact={true}
        label={repo.name}
        action={() =>
          router.push(
            getAnalyticsForRepoRoute({ owner: repo.owner, name: repo.name }),
          )
        }
        rating={repo.maturityIndex}
        direction={TrendDirections.UP}
      />
    </RingChart>
  ) : (
    <Spinner size={width} />
  )
}
