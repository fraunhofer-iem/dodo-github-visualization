import { ChartData, ChartOptions } from "chart.js"
import { ChartComponent } from "."

interface Props {
  /**
   * The data to be displayed.
   * See [ChartJS](https://www.chartjs.org/docs/latest/charts/line.html#dataset-properties)
   * for more information.
   */
  data: ChartData<"line">
  /**
   * Additional options for this chart, i.e. displaying the legend or enabling tooltips.
   * [General chart options](https://www.chartjs.org/docs/latest/general/options.html#option-resolution)
   * [Options specific to doughnut charts](https://www.chartjs.org/docs/latest/charts/line.html#config-options)
   */
  options?: ChartOptions<"line">
  width?: string
  height?: string
}

/**
 * Displays a [line chart](https://www.chartjs.org/docs/latest/charts/line.html)
 */
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
