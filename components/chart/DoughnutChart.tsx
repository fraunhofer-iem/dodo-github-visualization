import { ChartData, ChartOptions } from "chart.js"
import { ChartComponent } from "."

interface Props {
  /**
   * The data to be displayed.
   * See [ChartJS](https://www.chartjs.org/docs/latest/charts/doughnut.html#dataset-properties)
   * for more information.
   */
  data: ChartData<"doughnut">
  /**
   * Additional options for this chart, i.e. displaying the legend or enabling tooltips.
   * [General chart options](https://www.chartjs.org/docs/latest/general/options.html#option-resolution)
   * [Options specific to doughnut charts](https://www.chartjs.org/docs/latest/charts/doughnut.html#config-options)
   */
  options?: ChartOptions<"doughnut">
  width?: string
  height?: string
}

/**
 * Displays a [pie chart](https://www.chartjs.org/docs/latest/charts/doughnut.html#pie)
 */
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
