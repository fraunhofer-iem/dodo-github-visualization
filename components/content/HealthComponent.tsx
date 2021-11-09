import { ChartDataset } from "chart.js"
import { TrendComponent, TrendDirection } from "."
import { Color } from "../../lib/themes/Theme"
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

  const cutoutSize = +width.substring(0, width.length - 2) * 0.9 + "px"
  const fontSize = +width.substring(0, width.length - 2) / 10 + "px"

  return (
    <div className={styles.health} style={{ width: width }}>
      <DoughnutChart
        data={{
          datasets: values.map((currentValue, i) => {
            const dataset: ChartDataset<"doughnut"> = {
              label: "Test",
              data: [currentValue, 100 - currentValue],
              backgroundColor: [colors[i].rgba(), colors[i].alph(0.1).rgba()],
              borderColor: [colors[i].rgba(), colors[i].alph(0.1).rgba()],
            }
            return dataset
          }),
        }}
        options={{
          cutout: "90%",
          animation: {
            animateRotate: true,
          },
        }}
        width={width}
      />
      <div
        className={styles.healthRating}
        style={{
          fontSize: fontSize,
        }}
      >
        <TrendComponent
          name={name}
          rating={rating}
          direction={direction}
          compact={true}
          align={"center"}
        />
      </div>
    </div>
  )
}
