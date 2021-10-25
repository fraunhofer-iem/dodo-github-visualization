import type { NextApiRequest, NextApiResponse } from "next"
import kpis from "../../../../util/data/kpis.json"

export type Kpi = {
  name: string
  score: number
  id: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Kpi[]>,
) {
  console.log(req.query)
  res.status(200).json(kpis)
}
