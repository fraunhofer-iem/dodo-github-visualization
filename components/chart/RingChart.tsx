import { ActiveElement, Chart, ChartDataset, ChartEvent } from "chart.js"
import { useCallback, useRef } from "react"
import tippyfy, { TooltipControl } from "tooltip-component"
import { DoughnutChart } from "."
import {
  Colors,
  ColorScheme,
  compareProps,
  getCurrentRing,
  Ring,
} from "../../lib/frontend"
import styles from "../../styles/components/RingChart.module.scss"
interface Props {
  /**
   * Data to be displayed as rings
   */
  rings: Ring[]
  /**
   * The chart's width in px
   *
   * Defaults to 500px
   */
  width?: string
  /**
   * Content to be displayed in the ring's cutout
   */
  children?: React.ReactNode
}

/**
 * RingChart is a doughnut chart configured to display multiple
 * datasets in narrow rings, similar to what can be seen in
 * iOS's Fitness app.
 */
const RingChart: (props: Props) => JSX.Element = tippyfy(
  (props: Props & TooltipControl) => {
    const { setTippy, children } = props

    // The handleHover and handleClick callbacks need to access the hovered/clicked ring's
    // tooltip and action props, making props.rings a dependency.
    // Since it is not desirable to force the user to memoize the rings array, we do that ourselves
    // using a ref.
    // Fun fact: only stuff that would cause a rerender upon change needs to be a dependency.
    const rings = useRef<Ring[]>([])
    if (!compareProps(rings.current, props.rings)) {
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
        const ring = getCurrentRing(elements, chart, rings.current)
        if (!ring) {
          // no ring is hovered, remove the tooltip
          setTippy("tooltip", {
            content: undefined,
            popperRef: undefined,
          })
        } else {
          setTippy("tooltip", {
            content: ring.tooltip,
            popperRef: {
              // create a Popper VirtualElement since ChartJS does not provide us with that
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
        }
      },
      [setTippy],
    )

    const handleClick = useCallback(
      (_, elements: ActiveElement[], chart: Chart<"doughnut">) => {
        // perform the clicked ring's action and remove the tooltip
        const ring = getCurrentRing(elements, chart, rings.current)
        const action = ring?.action
        if (action) {
          setTippy("tooltip", {
            content: undefined,
            popperRef: undefined,
          })
          action()
        }
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
                  Colors.transparent.rgba(),
                  ColorScheme(i).rgba(),
                ],
                hoverBackgroundColor: [
                  Colors.transparent.rgba(),
                  ColorScheme(i).alph(0.6).rgba(),
                ],
                borderWidth: 0,
                // this is used by the hover and click handler to extract the ring's tooltip and action props from props.rings
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
