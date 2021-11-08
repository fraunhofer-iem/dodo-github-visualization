import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"
import { Grid } from "../layout"
import Icon from "../rating/Icon"
interface Props {
  name?: string
  rating: number
  direction: TrendDirection
  width?: string
  align?: "left" | "center" | "right"
}

export enum TrendDirection {
  down = "down",
  neutral = "neutral",
  up = "up",
}

export function TrendComponent(props: Props) {
  const { theme } = useUIContext()
  const { name, rating, direction, align } = props
  const width = props.width ?? "150px"

  return (
    <Grid width={width} align={align}>
      <div className={styles.trendIcon}>
        <Icon
          color={theme.trends[direction].color}
          styles={theme.content.trend.icon}
        >
          {theme.trends[direction].icon}
        </Icon>
      </div>
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
