import type { NextApiRequest, NextApiResponse } from "next"
import { KpiType } from "../../lib/api"
import hierarchy from "../../lib/data/kpiExample.json"

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<KpiType[]>,
) {
  res.status(200).json(hierarchy)
}
