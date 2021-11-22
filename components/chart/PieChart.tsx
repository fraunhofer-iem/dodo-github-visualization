import { ChartData, ChartOptions } from "chart.js"
import { ChartComponent } from "."

interface Props {
  /**
   * The data to be displayed.
   * See [ChartJS](https://www.chartjs.org/docs/latest/charts/doughnut.html#dataset-properties)
   * for more information.
   */
  data: ChartData<"pie">
  /**
   * Additional options for this chart, i.e. displaying the legend or enabling tooltips.
   * [General chart options](https://www.chartjs.org/docs/latest/general/options.html#option-resolution)
   * [Options specific to pie charts](https://www.chartjs.org/docs/latest/charts/doughnut.html#config-options)
   */
  options?: ChartOptions<"pie">
  width?: string
  height?: string
}

export function PieChart(props: Props) {
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
