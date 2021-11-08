import { ChartData, ChartOptions } from "chart.js"
import { ChartComponent } from "./ChartComponent"

interface Props {
  data: ChartData<"doughnut">
  options?: ChartOptions<"doughnut">
  width?: string
  height?: string
}

export function DoughnutChart(props: Props) {
  return (
    <ChartComponent
      type="doughnut"
      data={props.data}
      options={props.options}
      width={props.width}
      height={props.height}
    />
  )
}
