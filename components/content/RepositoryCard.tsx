import useSWR from "swr"
import { getKpiApiRoute, Repo } from "../../lib/api"
import {
  CSSProperties,
  IconNames,
  KpiAbbreviations,
  KpiIds,
  TrendDirections,
} from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import { Card } from "../card"
import { Icon } from "../rating"
import { Table } from "../table"
import { TrendComponent } from "./TrendComponent"

interface Props {
  repo: Repo
  width: string
  margin?: string
  height?: string
  rangeB: { since: Date; to: Date }
  rangeA: { since: Date; to: Date }
}

export default function RepositoryCard(props: Props) {
  const { theme } = useUIContext()
  const { repo, width, margin, height, rangeA, rangeB } = props
  const { data } = useSWR(
    getKpiApiRoute(
      { owner: repo.owner, name: repo.name },
      KpiIds.REPOSITORY_HEALTH,
      rangeA.since,
      rangeA.to,
    ),
  )

  const evaluateHealth = (health: number) => {
    if (health >= 95) {
      return TrendDirections.UP
    }
    if (health >= 80) {
      return TrendDirections.NEUTRAL
    }
    return TrendDirections.DOWN
  }

  return (
    <Card
      width={width}
      height={height}
      margin={margin}
      background={
        evaluateHealth(repo.health) !== TrendDirections.UP
          ? `radial-gradient(circle at center, white, ${theme.trends[
              evaluateHealth(repo.health)
            ].color.rgba()} 500%)`
          : undefined
      }
    >
      <div style={{ width: "100%", textAlign: "center" }}>
        <Icon styles={new CSSProperties({ fontSize: "125px" })}>
          {IconNames.helpOutline}
        </Icon>
        <br />
        <strong>{repo.id}</strong>
      </div>
      <br />
      <Table>
        {{
          columns: [],
          rows: [
            [
              {
                content: (
                  <>
                    {rangeB.since.toLocaleString("en-IN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {rangeB.to.toLocaleString("en-IN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </>
                ),
              },
              {
                content: (
                  <strong>
                    <TrendComponent
                      label={KpiAbbreviations.repoHealth}
                      rating={repo.health}
                      direction={evaluateHealth(repo.health)}
                      compact={true}
                    />
                  </strong>
                ),
              },
            ],
            [
              {
                content: (
                  <>
                    {rangeA.since.toLocaleString("en-IN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {rangeA.to.toLocaleString("en-IN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </>
                ),
              },
              {
                content: (
                  <strong>
                    {data && (
                      <TrendComponent
                        label={KpiAbbreviations.repoHealth}
                        rating={data.value}
                        direction={evaluateHealth(data.value)}
                        compact={true}
                      />
                    )}
                  </strong>
                ),
              },
            ],
          ],
        }}
      </Table>
    </Card>
  )
}
