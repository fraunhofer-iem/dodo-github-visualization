import { ChartData, ChartOptions } from "chart.js"
import ChartComponent from "./ChartComponent"

interface Props {
  data: ChartData<"pie">
  options?: ChartOptions<"pie">
  width?: string
  height?: string
}

export default function PieChart(props: Props) {
  return (
    <ChartComponent
      type="pie"
      data={props.data}
      options={props.options}
      width={props.width}
      height={props.height}
    />
  )
}
