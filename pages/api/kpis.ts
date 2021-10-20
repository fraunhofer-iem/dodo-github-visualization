import type { NextApiRequest, NextApiResponse } from "next"
import { KPI_Detail } from "./project/[pid]/kpi/[kid]"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KPI_Detail[]>,
) {
  res.status(200).json([
    {
      id: "1234kl",
      score: -1,
      name: "Quality",
      description: "quality is important",
      calculation: "a + b ",
      children: [],
    },
  ])
}
