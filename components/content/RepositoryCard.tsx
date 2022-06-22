import { useRouter } from "next/router"
import useSWR from "swr"
import { getKpiDataApiRoute, Repo } from "../../lib/api"
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
  atB?: Date
  atA?: Date
  minified?: boolean
  background?: string
  backgroundHover?: string
}

export function RepositoryCard(props: Props) {
  const { theme } = useUIContext()
  const { repo, minified, width, margin, height, atA, atB } = props
  const router = useRouter()
  const { data: valueA } = useSWR(() => {
    if (minified) {
      return null
    } else {
      return getKpiDataApiRoute({
        kpiId: `${KpiIds.REPOSITORY_HEALTH}@${repo.owner}/${repo.name}`,
        at: atA,
      })
    }
  })

  const { data: valueB } = useSWR(() => {
    if (minified) {
      return null
    } else {
      return getKpiDataApiRoute({
        kpiId: `${KpiIds.REPOSITORY_HEALTH}@${repo.owner}/${repo.name}`,
        at: atB,
      })
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
          : evaluateHealth(valueB ? valueB.value : 0) !== TrendDirections.UP
          ? `radial-gradient(circle at center, white, ${theme.trends[
              evaluateHealth(valueB ? valueB.value : 0)
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
              sections: [
                {
                  rows: [
                    [
                      {
                        content: <>{atB && dateToString(atB, false)}</>,
                      },
                      {
                        content: (
                          <strong>
                            {valueB && (
                              <TrendComponent
                                label={KpiAbbreviations.repoHealth}
                                rating={valueB.value}
                                direction={evaluateHealth(valueB.value)}
                                compact={true}
                              />
                            )}
                          </strong>
                        ),
                      },
                    ],
                    [
                      {
                        content: <>{atA && dateToString(atA, false)}</>,
                      },
                      {
                        content: (
                          <strong>
                            {valueA && (
                              <TrendComponent
                                label={KpiAbbreviations.repoHealth}
                                rating={valueA.value}
                                direction={evaluateHealth(valueA.value)}
                                compact={true}
                              />
                            )}
                          </strong>
                        ),
                      },
                    ],
                  ],
                },
              ],
            }}
          </Table>
        </>
      )}
    </Card>
  )
}
