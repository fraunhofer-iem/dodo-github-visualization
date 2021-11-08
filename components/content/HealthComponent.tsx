import { ChartDataset } from "chart.js"
import { TrendComponent, TrendDirection } from "."
import { Color, transparent } from "../../lib/themes/Theme"
import styles from "../../styles/components/Content.module.scss"
import { DoughnutChart } from "../chart/DoughnutChart"

interface Props {
  name?: string
  rating: number
  values: number[]
  colors: Color[]
  direction: TrendDirection
  width?: string
}

export function HealthComponent(props: Props) {
  const { name, rating, direction, values, colors } = props
  const width = props.width ?? "500px"

  const textboxSize = +width.substring(0, width.length - 2) * 0.6 + "px"
  const fontSize = +width.substring(0, width.length - 2) / 10 + "px"

  return (
    <div className={styles.health} style={{ width: width }}>
      <DoughnutChart
        data={{
          datasets: values.map((currentValue, i) => {
            const dataset: ChartDataset<"doughnut"> = {
              data: [100 - currentValue, currentValue],
              backgroundColor: [transparent.rgba(), colors[i].rgba()],
              borderColor: [transparent.rgba(), colors[i].rgba()],
            }
            return dataset
          }),
        }}
        options={{
          cutout: "90%",
          animation: {
            animateRotate: true,
          },
          plugins: {
            tooltip: {
              enabled: false,
            },
          },
        }}
        width={width}
      />
      <div className={styles.healthRating} style={{ fontSize: fontSize }}>
        <TrendComponent
          name={name}
          rating={rating}
          direction={direction}
          width={width}
          align={"center"}
        />
      </div>
    </div>
  )
}
