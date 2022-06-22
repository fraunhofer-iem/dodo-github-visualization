import { ChartData } from "chart.js"
import { max, sortBy } from "lodash"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Kpi } from "../lib/api"
import { ColorScheme, dateToString } from "../lib/frontend"
import { LineChart } from "./chart"

interface Props {
  route: () => string | null
  clickHandler?: (kpiId: string, pointIndex: number, timestamp?: string) => void
  activePoint?: number
  scale?: boolean
}

const scaleValues = (values: (number | null)[]) => {
  const maximum = max(values)
  return values.map((value) => {
    if (value && maximum) {
      return value / maximum
    }
    return null
  })
}

export default function KpiChart(props: Props) {
  const { route, activePoint, scale } = props
  const clickHandler = props.clickHandler ?? (() => {})
  const { data: kpis } = useSWR<Kpi[]>(route())
  const [dataset, setDataset] = useState<ChartData<"line">>({
    datasets: [],
  })

  useEffect(() => {
    if (kpis) {
      const labels: string[] = []
      const data: {
        kpi: string
        dataPoints: Map<string, number>
      }[] = []
      kpis.map((currentKpi) => {
        if (currentKpi.data) {
          const dataPoints = new Map<string, number>()
          for (const [timestamp, { label: l, value }] of sortBy(
            Object.entries(currentKpi.data),
            [(entry) => new Date(entry[0])],
          )) {
            let label = l as string
            try {
              label = dateToString(new Date(l), false)
            } catch {}
            dataPoints.set(label, value)
            if (!labels.includes(label)) {
              labels.push(label)
            }
          }
          data.push({ kpi: currentKpi.id, dataPoints })
        }
      })
      setDataset({
        datasets: data.map(({ kpi, dataPoints }, i) => {
          return {
            data: scale
              ? scaleValues(
                  labels.map((label) => {
                    return dataPoints.get(label) ?? null
                  }),
                )
              : labels.map((label) => {
                  return dataPoints.get(label) ?? null
                }),
            borderWidth: 1,
            pointRadius: (ctx, options) => {
              if (!activePoint) {
                if (ctx.dataIndex === labels.length - 1) {
                  return 6
                }
              }
              if (activePoint === ctx.dataIndex) {
                return 6
              }
              return 4
            },
            pointHoverRadius: (ctx, options) => {
              if (!activePoint) {
                if (ctx.dataIndex === labels.length - 1) {
                  return 8
                }
              }
              if (activePoint === ctx.dataIndex) {
                return 8
              }
              return 6
            },
            backgroundColor: ColorScheme(i).rgba(),
            borderColor: ColorScheme(i).rgba(),
            showLine: true,
            label: kpi,
          }
        }),
        labels: labels,
      })
    } else {
      setDataset({ datasets: [], labels: [] })
    }
  }, [scale, kpis, activePoint])

  return (
    <LineChart
      data={dataset}
      options={{
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label(this, tooltipItems) {
                return tooltipItems.formattedValue
              },
            },
          },
        },
        animation: false,
        scales: {
          y: {
            min: 0,
            ticks: {
              display: !scale,
            },
          },
        },
        aspectRatio: 3.5,
        onClick: (event, elements) => {
          if (elements.length) {
            let timestamp = undefined
            if (kpis) {
              for (const kpi of kpis) {
                if (
                  kpi.id === dataset.datasets[elements[0].datasetIndex].label
                ) {
                  if (kpi.data) {
                    for (const entry of Object.entries(kpi.data)) {
                      if (
                        dataset.labels &&
                        entry[1].label === dataset.labels[elements[0].index]
                      ) {
                        timestamp = entry[0]
                      }
                    }
                  }
                }
              }
            }
            clickHandler(
              dataset.datasets[elements[0].datasetIndex].label ?? "",
              elements[0].index,
              timestamp,
            )
          }
        },
      }}
    />
  )
}
