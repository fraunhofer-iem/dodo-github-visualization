import type { NextApiRequest, NextApiResponse } from "next"

import { KPI } from "../kpis"

export type KPI_Detail = KPI & {
  description: string
  children: KPI[]
  calculation: string
  // this is custom for each KPI, I guess we need to define a type for each KPI
  // and cast the KPI_Detail as needed
  data?: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KPI_Detail>,
) {
  const {
    query: { id },
  } = req

  res.status(200).json({
    id: id as string,
    score: 2,
    name: "Quality",
    description: "quality is important",
    calculation: "a + b ",
    children: [],
  })
}
