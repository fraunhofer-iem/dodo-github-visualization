import { ChartData } from "chart.js"
import { find, max, sortBy } from "lodash"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { getKpisApiRoute, Kpi } from "../lib/api"
import {
  ColorScheme,
  dateToString,
  KpiKinds,
  prepareKpiValue,
  toFixed,
} from "../lib/frontend"
import { LineChart } from "./chart"
import { Spinner } from "./content"

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

const getKpi = (kpis?: Kpi[], kpiId?: string) => {
  if (kpis) {
    for (const kpi of kpis) {
      if (kpi.id === kpiId) {
        return kpi
      }
    }
  }
  return undefined
}

export default function KpiChart(props: Props) {
  const { route, activePoint, scale } = props
  const clickHandler = props.clickHandler ?? (() => {})
  const { data: kpis, error: kpisError } = useSWR<Kpi[]>(route())
  const { data: children, error: childrenError } = useSWR<Kpi[]>(
    kpis
      ? getKpisApiRoute({
          owner: kpis[0].owner,
          pageSize: kpis
            .map((kpi) => {
              return kpi.children ?? []
            })
            .flat().length,
          pageNumber: 1,
          data: true,
          kpiIds: kpis
            .map((kpi) => {
              return kpi.children ?? []
            })
            .flat(),
          kinds: [KpiKinds.ORGA, KpiKinds.REPO, KpiKinds.DATA],
        })
      : null,
  )
  const [dataset, setDataset] = useState<ChartData<"line">>({
    datasets: [],
  })

  const isLoadingKpis = !kpis && !kpisError
  const isLoadingChildren = !children && !childrenError

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
            let label = dateToString(new Date(timestamp), true, true)
            dataPoints.set(label, prepareKpiValue(value))
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
              : labels.map((label, i) => {
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

  return isLoadingKpis || isLoadingChildren ? (
    <div style={{ textAlign: "center" }}>
      <Spinner size="100px" />
    </div>
  ) : (
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
              title(this, tooltipItems) {
                const kpi = getKpi(
                  kpis,
                  dataset.datasets[tooltipItems[0].datasetIndex].label,
                )
                if (kpi && kpi.data) {
                  const values = sortBy(Object.entries(kpi.data), [
                    (entry) => new Date(entry[0]),
                  ])
                  return `${values[tooltipItems[0].dataIndex][1].label}`
                }
                return tooltipItems[0].formattedValue
              },
              label(this, tooltipItem) {
                const kpi = getKpi(
                  kpis,
                  dataset.datasets[tooltipItem.datasetIndex].label,
                )
                if (kpi && kpi.data) {
                  const values = sortBy(Object.entries(kpi.data), [
                    (entry) => new Date(entry[0]),
                  ])
                  return `${toFixed(
                    prepareKpiValue(values[tooltipItem.dataIndex][1].value),
                    3,
                  )}${kpi.unit === "percent" ? "%" : ` ${kpi.unit}`}`
                }
                return ""
              },
              afterLabel(this, tooltipItem) {
                const kpi = getKpi(
                  kpis,
                  dataset.datasets[tooltipItem.datasetIndex].label,
                )
                if (kpi && kpi.children) {
                  const content: string[] = []
                  if (children) {
                    for (const childId of kpi.children) {
                      const child = find(children, (c) => c.id === childId)
                      if (child && child.data) {
                        const entry = find(
                          Object.entries(child.data),
                          (entry) =>
                            dateToString(new Date(entry[0]), true, true) ===
                            tooltipItem.label,
                        )
                        if (entry) {
                          const value = prepareKpiValue(entry[1].value)
                          content.push(
                            `${child.type}: ${toFixed(value, 3)}${
                              child.unit === "percent" ? "%" : ` ${child.unit}`
                            }`,
                          )
                        }
                      }
                    }
                  }
                  return content
                }
                return ""
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
                        dateToString(new Date(entry[0]), true, true) ===
                          dataset.labels[elements[0].index]
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
