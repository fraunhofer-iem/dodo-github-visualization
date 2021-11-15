import { ActiveElement, Chart, ChartDataset, ChartEvent } from "chart.js"
import deepEqual from "deep-equal"
import { useCallback, useRef } from "react"
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
    const { setTippy, children } = props

    const rings = useRef<
      {
        tooltip?: React.ReactNode
        value: number
        action?: () => void
      }[]
    >([])

    if (!deepEqual(rings.current, props.rings)) {
      rings.current = props.rings
    }

    const width = props.width ?? "500px"

    const fontSize = +width.substring(0, width.length - 2) / 10 + "px"

    const handleHover = useCallback(
      (
        event: ChartEvent,
        elements: ActiveElement[],
        chart: Chart<"doughnut">,
      ) => {
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
          const ring = +chart.getDatasetMeta(currentElement.datasetIndex).label
          setTippy("tooltip", {
            content: rings.current[ring].tooltip,
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
      [setTippy],
    )

    const handleClick = useCallback(
      (
        event: ChartEvent,
        elements: ActiveElement[],
        chart: Chart<"doughnut">,
      ) => {
        elements.forEach((currentElement) => {
          if (currentElement.index != 1) {
            return
          }
          const ring = +chart.getDatasetMeta(currentElement.datasetIndex).label
          const action = rings.current[ring].action
          if (action) {
            setTippy("tooltip", {
              content: undefined,
              popperRef: undefined,
            })
            action()
          }
        })
      },
      [setTippy],
    )

    return (
      <div className={styles.ringChart} style={{ width: width }}>
        <DoughnutChart
          data={{
            datasets: rings.current.map((currentRing, i) => {
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
            onHover: handleHover,
            onClick: handleClick,
          }}
          width={width}
          height={width}
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
