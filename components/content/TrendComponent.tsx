import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"
import { Card } from "../card"
import { Grid } from "../layout"
import Icon from "../rating/Icon"
interface Props {
  name: string
  rating: number
  direction: TrendDirection
}

export enum TrendDirection {
  down = "down",
  neutral = "neutral",
  up = "up",
}

export function TrendComponent(props: Props) {
  const { theme } = useUIContext()
  const { name, rating, direction } = props

  return (
    <Card width="150px">
      <Grid>
        <div className={styles.trendIcon}>
          <Icon
            color={theme.trends[direction].color}
            styles={theme.content.trend.icon}
          >
            {theme.trends[direction].icon}
          </Icon>
        </div>
        <div className={styles.trendInfo}>
          {name}
          <br />
          <strong style={{ color: theme.trends[direction].color.rgba() }}>
            {rating} %
          </strong>
        </div>
      </Grid>
    </Card>
  )
}
