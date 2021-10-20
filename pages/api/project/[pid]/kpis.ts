import type { NextApiRequest, NextApiResponse } from "next"
import kpis from "../../../../util/data/kpis.json"

export type KPI = {
  name: string
  score: number
  id: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KPI[]>,
) {
  console.log(req.query)
  res.status(200).json(kpis)
}
