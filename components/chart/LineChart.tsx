import { ChartData, ChartOptions } from "chart.js"
import { ChartComponent } from "./ChartComponent"

interface Props {
  data: ChartData<"line">
  options?: ChartOptions<"line">
  width?: string
  height?: string
}

export function LineChart(props: Props) {
  return (
    <ChartComponent
      type="line"
      data={props.data}
      options={props.options}
      width={props.width}
      height={props.height}
    />
  )
}
