import { ChartDataset } from "chart.js"
import tippyfy, { TooltipControl } from "tooltip-component"
import { colors } from "../../lib/themes/Theme"
import styles from "../../styles/components/RingChart.module.scss"
import { DoughnutChart } from "./DoughnutChart"

interface Props {
  rings: {
    tooltip?: React.ReactNode
    value: number
    action?: () => void
  }[]
  width?: string
  children?: React.ReactNode
}

const colorScheme = [
  colors.steelBlue,
  colors.orange,
  colors.maroon,
  colors.turquoise,
  colors.green,
  colors.yellow,
  colors.purple,
  colors.fuchsia,
  colors.brown,
  colors.silver,
]

const RingChart: (props: Props) => JSX.Element = tippyfy(
  (props: Props & TooltipControl) => {
    const { rings, setTippy, children } = props
    const width = props.width ?? "500px"

    const fontSize = +width.substring(0, width.length - 2) / 10 + "px"

    return (
      <div className={styles.ringChart} style={{ width: width }}>
        <DoughnutChart
          data={{
            datasets: rings.map((currentRing, i) => {
              const { value } = currentRing

              const dataset: ChartDataset<"doughnut"> = {
                data: [100 - value, value],
                backgroundColor: [
                  colors.transparent.rgba(),
                  colorScheme[i % colorScheme.length].rgba(),
                ],
                hoverBackgroundColor: [
                  colors.transparent.rgba(),
                  colorScheme[i % colorScheme.length].alph(0.6).rgba(),
                ],
                borderWidth: 0,
                label: `${i}`,
              }
              return dataset
            }),
          }}
          options={{
            cutout: "80%",
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            onHover: (event, elements, chart) => {
              if (!elements.length) {
                setTippy("tooltip", {
                  content: undefined,
                  popperRef: undefined,
                })
              }
              elements.forEach((currentElement) => {
                if (currentElement.index != 1) {
                  return
                }
                const ring = +chart.getDatasetMeta(currentElement.datasetIndex)
                  .label
                setTippy("tooltip", {
                  content: rings[ring].tooltip,
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
            onClick: (_, elements, chart) => {
              elements.forEach((currentElement) => {
                if (currentElement.index != 1) {
                  return
                }
                const ring = +chart.getDatasetMeta(currentElement.datasetIndex)
                  .label
                const action = rings[ring].action
                if (action) {
                  setTippy("tooltip", {
                    content: undefined,
                    popperRef: undefined,
                  })
                  action()
                }
              })
            },
          }}
          width={width}
        />
        <div
          className={styles.cutout}
          style={{
            fontSize: fontSize,
            textAlign: "center",
          }}
        >
          {children}
        </div>
      </div>
    )
  },
)

export { RingChart }
