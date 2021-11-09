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

  const indicator = (
    <Icon
      color={theme.trends[direction].color}
      styles={theme.content.trend.icon}
    >
      {theme.trends[direction].icon}
    </Icon>
  )

  if (compact) {
    return (
      <div className={styles.trendInfo} style={{ textAlign: align }}>
        {name && (
          <>
            {name}
            <br />
          </>
        )}
        {indicator}
        <strong
          style={{
            color: theme.trends[direction].color.rgba(),
          }}
        >
          {rating} %
        </strong>
      </div>
    )
  } else {
    return (
      <Grid>
        <div className={styles.trendIcon}>{indicator}</div>
        <div className={styles.trendInfo} style={{ textAlign: align }}>
          {name && (
            <>
              {name}
              <br />
            </>
          )}
          <strong
            style={{
              color: theme.trends[direction].color.rgba(),
            }}
          >
            {rating} %
          </strong>
        </div>
      </Grid>
    )
  }
}
