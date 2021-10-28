import type { NextApiRequest, NextApiResponse } from "next"
import kpis from "../../../../../lib/data/kpis.json"
import data from "../../../../../lib/data/pullRequestData.json"
import { Kpi } from "../kpis"

export type KpiDetail = Kpi & {
  description: string
  children: Kpi[]
  calculation: string
  // this is custom for each KPI, I guess we need to define a type for each KPI
  // and cast the KPI_Detail as needed
  data?: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiDetail | undefined>,
) {
  const {
    query: { kid },
  } = req

  const kpi = kpis.find((kpi) => kpi.id === (kid as string))

  if (kpi) {
    res.status(200).json({
      ...kpi,
      description: "quality is important",
      calculation: "a + b ",
      children: [],
      data: data,
    })
  } else {
    res.status(404).json(undefined)
  }
}
