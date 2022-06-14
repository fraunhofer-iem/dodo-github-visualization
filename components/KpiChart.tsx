import { ChartData } from "chart.js"
import { sortBy } from "lodash"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Kpi } from "../lib/api"
import { ColorScheme, dateToString } from "../lib/frontend"
import { LineChart } from "./chart"

interface Props {
  route: () => string | null
  clickHandler?: (kpiId: string, label: string) => void
}

export default function KpiChart(props: Props) {
  const { route } = props
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
        dataPoints: { label: string; value: number }[]
      }[] = []
      kpis.map((currentKpi) => {
        if (currentKpi.data) {
          const dataPoints = []
          for (const [timestamp, { label: l, value }] of sortBy(
            Object.entries(currentKpi.data),
            [(entry) => new Date(entry[0])],
          )) {
            let label = l as string
            try {
              label = dateToString(new Date(l), false)
            } catch {}
            dataPoints.push({ label: label, value: value })
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
            data: labels.map((label) => {
              const dataPoint = dataPoints.find(
                (dataPoint) => dataPoint.label === label,
              )
              if (dataPoint) {
                return dataPoint.value
              }
              return null
            }),
            borderWidth: 1,
            pointRadius: 5,
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
  }, [kpis])

  return (
    <LineChart
      data={dataset}
      options={{
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            min: 0,
          },
        },
        aspectRatio: 3.5,
        onClick: (event, elements) => {
          if (elements.length) {
            clickHandler(
              dataset.datasets[elements[0].datasetIndex].label ?? "",
              dataset.labels
                ? (dataset.labels[elements[0].index] as string)
                : "",
            )
          }
        },
      }}
    />
  )
}
