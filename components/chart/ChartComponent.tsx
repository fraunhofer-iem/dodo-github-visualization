import { ChartData, ChartOptions, ChartType } from "chart.js"
import Chart from "chart.js/auto"
import { MatrixController, MatrixElement } from "chartjs-chart-matrix"
import { useEffect, useRef } from "react"
import { compareProps } from "../../lib/frontend"

interface Props {
  type: ChartType
  data: ChartData
  options?: ChartOptions
  width?: string
  height?: string
}

/**
 * Function component that integrates ChartJS into React, avoiding
 * rerenders as much as possible.
 *
 * Since ChartJS uses lots of generic types, it is recommended to
 * use the more specific chart components, that wrap this component
 * and instantiate the proper types in their props.
 */
export function ChartComponent(props: Props) {
  const container = useRef(null)
  const prevProps = useRef<Props | null>()
  const chart = useRef<Chart | null>()

  useEffect(() => {
    Chart.register(MatrixController, MatrixElement)
    if (!compareProps(prevProps.current, props) && container.current !== null) {
      chart.current?.destroy()
      chart.current = new Chart(container.current, {
        type: props.type,
        data: { ...props.data },

        options: {
          locale: "en-IN",
          ...props.options,
        },
      })
      prevProps.current = props
    }

    return () => {
      if (!compareProps(prevProps.current, props)) {
        chart.current?.destroy()
      }
    }
  })

  return (
    <div
      className="chart"
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "100%",
      }}
    >
      <canvas id="chart" ref={container} />
    </div>
  )
}
