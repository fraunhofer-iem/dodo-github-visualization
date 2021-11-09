import { ChartDataset } from "chart.js/auto"
import { TrendComponent, TrendDirection } from "."
import tippyfy, { TooltipControl } from "../../.yalc/tooltip-component/dist"
import { Color } from "../../lib/themes/Theme"
import styles from "../../styles/components/Content.module.scss"
import { Card } from "../card"
import { DoughnutChart } from "../chart/DoughnutChart"

interface Props {
  name?: string
  rating: number
  values: number[]
  colors: Color[]
  direction: TrendDirection
  width?: string
}

const HealthComponent = tippyfy(function HealthComponent(
  props: Props & TooltipControl,
) {
  const { name, rating, direction, values, colors } = props
  const width = props.width ?? "500px"

  const fontSize = +width.substring(0, width.length - 2) / 10 + "px"

  return (
    <div className={styles.health} style={{ width: width }}>
      <DoughnutChart
        data={{
          datasets: values.map((currentValue, i) => {
            const dataset: ChartDataset<"doughnut"> = {
              data: [currentValue, 100 - currentValue],
              backgroundColor: [colors[i].rgba(), colors[i].alph(0.1).rgba()],
              label: i == 0 ? "Technical Debt" : "Performance",
            }
            return dataset
          }),
        }}
        options={{
          cutout: "85%",
          animation: {
            animateRotate: true,
          },
          onHover: (event, elements, chart) => {
            if (!elements.length) {
              props.setTippy("kpi", {
                content: undefined,
                popperRef: undefined,
              })
            }
            elements.forEach((currentElement) => {
              const label = chart.getDatasetMeta(
                currentElement.datasetIndex,
              ).label
              props.setTippy("kpi", {
                content: <Card width="auto">{label}</Card>,
                popperRef: {
                  getBoundingClientRect: () => ({
                    width: 0,
                    height: 0,
                    bottom: (event.native as MouseEvent).clientY,
                    top: (event.native as MouseEvent).clientY,
                    left: (event.native as MouseEvent).clientX,
                    right: (event.native as MouseEvent).clientX,
                    x: (event.native as MouseEvent).clientX,
                    y: (event.native as MouseEvent).clientY,
                    toJSON: () => {},
                  }),
                },
                tippyProps: {
                  placement: "auto",
                },
              })
            })
          },

          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
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
})

export { HealthComponent }
