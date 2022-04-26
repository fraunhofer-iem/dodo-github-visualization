import { useRouter } from "next/router"
import useSWR from "swr"
import { getKpiApiRoute, Repo } from "../../lib/api"
import {
  CSSProperties,
  dateToString,
  getAnalyticsForRepoRoute,
  IconNames,
  KpiAbbreviations,
  KpiIds,
  TrendDirections,
} from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import { Button } from "../action"
import { Card } from "../card"
import { Icon } from "../rating"
import { Table } from "../table"
import { TrendComponent } from "./TrendComponent"

interface Props {
  repo: Repo
  width: string
  margin?: string
  height?: string
  iconSize?: string
  rangeB?: { since: Date; to: Date }
  rangeA?: { since: Date; to: Date }
  minified?: boolean
  background?: string
  backgroundHover?: string
}

export function RepositoryCard(props: Props) {
  const { theme } = useUIContext()
  const { repo, minified, width, margin, height, rangeA, rangeB } = props
  const router = useRouter()
  const { data } = useSWR(() => {
    if (minified) {
      return null
    } else {
      return getKpiApiRoute(
        { owner: repo.owner, name: repo.name },
        KpiIds.REPOSITORY_HEALTH,
        rangeA?.since,
        rangeA?.to,
      )
    }
  })

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
        minified
          ? props.background
          : evaluateHealth(repo.health) !== TrendDirections.UP
          ? `radial-gradient(circle at center, white, ${theme.trends[
              evaluateHealth(repo.health)
            ].color.rgba()} 500%)`
          : undefined
      }
      backgroundHover={props.backgroundHover}
    >
      <div style={{ width: "100%", textAlign: "center" }}>
        <Button
          context={"neutral"}
          type={"button"}
          action={() =>
            router.push({
              pathname: getAnalyticsForRepoRoute({
                owner: repo.owner,
                name: repo.name,
              }),
              query: { ...router.query },
            })
          }
          padding={"0"}
        >
          <Icon
            styles={new CSSProperties({ fontSize: props.iconSize ?? "125px" })}
          >
            {IconNames.helpOutline}
          </Icon>
          <br />
          <strong>{repo.id}</strong>
        </Button>
      </div>
      {!minified && (
        <>
          <br />
          <Table>
            {{
              columns: [],
              rows: [
                [
                  {
                    content: (
                      <>
                        {rangeB && dateToString(rangeB.since, false)} -{" "}
                        {rangeB && dateToString(rangeB.to, false)}
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
                        {rangeA && dateToString(rangeA.since, false)} -{" "}
                        {rangeA && dateToString(rangeA.to, false)}
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
        </>
      )}
    </Card>
  )
}
