import { delay } from "lodash"
import { useEffect, useRef } from "react"
import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"
import { Grid } from "../layout"
import Icon from "../rating/Icon"
interface Props {
  name?: string
  rating: number
  direction: TrendDirection
  align?: "left" | "center" | "right"
  compact?: boolean
}

export enum TrendDirection {
  down = "down",
  neutral = "neutral",
  up = "up",
}

export function TrendComponent(props: Props) {
  const { theme } = useUIContext()
  const { name, rating, direction, align, compact } = props
  const domRating = useRef<HTMLElement>(null)

  useEffect(() => {
    for (let i = 0; i <= rating; i++) {
      delay(() => {
        if (domRating.current) {
          domRating.current.textContent = `${i}`
        }
      }, i * (600 / rating))
    }
  }, [domRating, rating])

  const jsxIndicator = (
    <Icon
      color={theme.trends[direction].color}
      styles={theme.content.trend.icon}
    >
      {theme.trends[direction].icon}
    </Icon>
  )

  const jsxName = name && (
    <>
      {name}
      <br />
    </>
  )

  const jsxRating = (
    <strong
      style={{
        color: theme.trends[direction].color.rgba(),
      }}
      ref={domRating}
    >
      0 %
    </strong>
  )

  if (compact) {
    return (
      <div className={styles.trendInfo} style={{ textAlign: align }}>
        {jsxName}
        {jsxIndicator}
        {jsxRating}
      </div>
    )
  } else {
    return (
      <Grid>
        <div className={styles.trendIcon}>{jsxIndicator}</div>
        <div className={styles.trendInfo} style={{ textAlign: align }}>
          {jsxName}
          {jsxRating}
        </div>
      </Grid>
    )
  }
}
