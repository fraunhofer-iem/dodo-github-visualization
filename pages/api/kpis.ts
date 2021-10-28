import type { NextApiRequest, NextApiResponse } from "next"
import hierarchy from "../../lib/data/kpiExample.json"

export type KpiType = {
  id: string
  type: string
  name: string
  children: string[]
  description: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiType[]>,
) {
  res.status(200).json(hierarchy)
}
