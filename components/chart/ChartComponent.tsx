import Chart from "chart.js/auto"
import { ChartData, ChartOptions, ChartType } from "chart.js"
import { useEffect, useRef } from "react"
import deepEqual from "deep-equal"

interface Props {
  type: ChartType
  data: ChartData
  options?: ChartOptions
  width?: string
  height?: string
}

const equals = (prev: Props | null | undefined, curr: Props) => {
  if (!prev) {
    return false
  }
  return deepEqual(prev, curr, { strict: true })
}

export function ChartComponent(props: Props) {
  const container = useRef(null)
  const prevProps = useRef<Props | null>()
  const chart = useRef<Chart | null>()

  useEffect(() => {
    if (!equals(prevProps.current, props) && container.current !== null) {
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
      if (!equals(prevProps.current, props)) {
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
