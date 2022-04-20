import { delay } from "lodash"
import { useEffect, useRef } from "react"
import { TrendDirections } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Grid } from "../layout"
import { Icon } from "../rating"
interface Props {
  /**
   * Text to be displayed next to the trend
   */
  label?: string
  /**
   * The calculated trend
   */
  rating: number
  /**
   * The direction of the trend
   */
  direction: TrendDirections
  /**
   * Fine-tune the text layout
   */
  align?: "left" | "center" | "right"
  /**
   * A compact TrendComponent displays the trend direction
   * next to the rating
   */
  compact?: boolean

  /**
   * Display trend arrow
   */
  displayArrow?: boolean
}

export function TrendComponent(props: Props) {
  const { theme } = useUIContext()
  const { label, rating, direction, align, compact } = props
  const domRating = useRef<HTMLElement>(null)

  useEffect(() => {
    for (let i = 0; i <= rating; i++) {
      delay(() => {
        if (domRating.current) {
          domRating.current.textContent = `${label ?? ""} ${i}%`
        }
      }, i * (600 / rating))
    }
  }, [domRating, rating, direction, label])

  const jsxIndicator = (
    <Icon
      color={theme.trends[direction].color}
      styles={theme.content.trend.icon}
    >
      {theme.trends[direction].icon}
    </Icon>
  )

  const jsxRating = (
    <span
      style={{
        color: theme.trends[direction].color.rgba(),
      }}
      ref={domRating}
    >
      0 %
    </span>
  )

  if (compact) {
    return (
      <div
        className={styles.trendInfo}
        style={{ textAlign: align, display: "inline" }}
      >
        {props.displayArrow && jsxIndicator}
        {jsxRating}
      </div>
    )
  } else {
    return (
      <Grid>
        {props.displayArrow && (
          <div className={styles.trendIcon}>{jsxIndicator}</div>
        )}
        <div className={styles.trendInfo} style={{ textAlign: align }}>
          {jsxRating}
        </div>
      </Grid>
    )
  }
}
