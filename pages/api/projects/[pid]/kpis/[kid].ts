import type { NextApiRequest, NextApiResponse } from "next"
import { KpiDetail } from "../../../../../lib/api"
import kpis from "../../../../../lib/data/kpis.json"
import data from "../../../../../lib/data/pullRequestData.json"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiDetail | undefined>,
) {
  const {
    query: { kid },
  } = req

  const kpi = kpis.find((currentKpi) => currentKpi.id === (kid as string))

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
