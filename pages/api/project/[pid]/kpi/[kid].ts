import type { NextApiRequest, NextApiResponse } from "next"

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
  res: NextApiResponse<KpiDetail>,
) {
  const {
    query: { kid },
  } = req

  res.status(200).json({
    id: kid as string,
    score: 2,
    name: "Quality",
    description: "quality is important",
    calculation: "a + b ",
    children: [],
  })
}
