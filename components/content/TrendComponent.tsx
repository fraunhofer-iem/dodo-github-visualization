import { delay } from "lodash"
import { useEffect, useRef } from "react"
import { TrendDirections } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Button } from "../action"
import { Grid } from "../layout"
import { Icon } from "../rating"
interface Props {
  /**
   * Name of the entity whose trend is displayed
   */
  label?: string
  /**
   * Action to perform when clicking the component
   */
  action?: () => void
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
}

export function TrendComponent(props: Props) {
  const { theme } = useUIContext()
  const { label, rating, direction, align, compact } = props
  const domRating = useRef<HTMLElement>(null)

  useEffect(() => {
    for (let i = 0; i <= rating; i++) {
      delay(() => {
        if (domRating.current) {
          domRating.current.textContent = `${i} %`
        }
      }, i * (600 / rating))
    }
  }, [domRating, rating, direction])

  const jsxIndicator = (
    <Icon
      color={theme.trends[direction].color}
      styles={theme.content.trend.icon}
    >
      {theme.trends[direction].icon}
    </Icon>
  )

  const jsxLabel = label && (
    <>
      <Button
        context="neutral"
        action={() => (props.action ? props.action() : () => {})}
        align={props.align}
        padding="0.375rem 0"
      >
        {label}
      </Button>
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
        {jsxLabel}
        {jsxIndicator}
        {jsxRating}
      </div>
    )
  } else {
    return (
      <Grid>
        <div className={styles.trendIcon}>{jsxIndicator}</div>
        <div className={styles.trendInfo} style={{ textAlign: align }}>
          {jsxLabel}
          {jsxRating}
        </div>
      </Grid>
    )
  }
}
