import { slice, sum } from "lodash"
import { LineChart } from "."
import { black, blue, green, red } from "../../lib/themes/Theme"

interface Props {
  width?: string
  height?: string
  n: number
  k: number
  data: number[]
}

const getLabels = (data: number[], n: number) => {
  const labels: number[] = []
  data.map((_, i) => {
    if (i < n) {
      // not enough data to calculate moving average
      return
    }
    labels.push(i)
  })
  return labels
}

const getBands = (data: number[], n: number, k: number) => {
  const movingAverages: number[] = []
  const lowerBand: number[] = []
  const upperBand: number[] = []
  data.map((_, i) => {
    if (i < n) {
      // not enough data to calculate moving average
      return
    }
    const currentSlice = slice(data, i - n, i)
    const average = sum(currentSlice) / n
    const standardDeviation = Math.sqrt(
      sum(currentSlice.map((value) => Math.pow(value - average, 2))) / n,
    )
    movingAverages.push(average)
    lowerBand.push(average - standardDeviation * k)
    upperBand.push(average + standardDeviation * k)
  })
  return { movingAverages, lowerBand, upperBand }
}

const getPercentB = (
  data: number[],
  n: number,
  lowerBand: number[],
  upperBand: number[],
) => {
  const percentB: number[] = []
  data.map((currentValue, i) => {
    if (i < n) {
      return
    }
    percentB.push((currentValue - lowerBand[i]) / (upperBand[i] - lowerBand[i]))
  })
  return percentB
}

const getBandwidth = (
  movingAverages: number[],
  lowerBand: number[],
  upperBand: number[],
) => {
  const bandwidth: number[] = []

  movingAverages.map((currentAverage, i) => {
    bandwidth.push((upperBand[i] - lowerBand[i]) / currentAverage)
  })
  return bandwidth
}

export function BollingerChart(props: Props) {
  const width = props.width ?? "500px"
  const height = props.height ?? "auto"
  const { n, k, data } = props
  const labels = getLabels(data, n)
  const { movingAverages, lowerBand, upperBand } = getBands(data, n, k)
  const percentB = getPercentB(data, n, lowerBand, upperBand)
  const bandwidth = getBandwidth(movingAverages, lowerBand, upperBand)

  return (
    <>
      <LineChart
        width={width}
        height={height}
        data={{
          datasets: [
            {
              data: movingAverages,
              backgroundColor: blue.rgba(),
              borderColor: blue.rgba(),
              showLine: true,
              borderWidth: 1,
              pointRadius: 0,
              label: `Moving average`,
            },
            {
              data: lowerBand,
              backgroundColor: green.rgba(),
              borderColor: green.rgba(),
              showLine: true,
              borderWidth: 1,
              pointRadius: 0,
              label: `Lower Bollinger Band`,
            },
            {
              data: upperBand,
              backgroundColor: red.rgba(),
              borderColor: red.rgba(),
              showLine: true,
              borderWidth: 1,
              pointRadius: 0,
              label: `Upper Bollinger Band`,
            },
          ],
          labels: labels,
        }}
      />
      <LineChart
        width={width}
        height={height}
        data={{
          datasets: [
            {
              data: percentB,
              backgroundColor: black.rgba(),
              borderColor: black.rgba(),
              showLine: true,
              borderWidth: 1,
              pointRadius: 0,
              label: `%b`,
            },
          ],
          labels: labels,
        }}
      />
      <LineChart
        width={width}
        height={height}
        data={{
          datasets: [
            {
              data: bandwidth,
              backgroundColor: black.rgba(),
              borderColor: black.rgba(),
              showLine: true,
              borderWidth: 1,
              pointRadius: 0,
              label: `Bandwidth`,
            },
          ],
          labels: labels,
        }}
      />
    </>
  )
}
