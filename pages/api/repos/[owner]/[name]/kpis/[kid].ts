import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, KpiDetail } from "../../../../../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiDetail | undefined>,
) {
  const {
    query: { owner, name, kid },
  } = req

  let kpiData = await fetchJson(
    new Request(
      `${process.env.HOST}/api/kpis/${kid}?owner=${owner}&repo=${name}&since=2022-01-01`,
    ),
  )

  const kpi: KpiDetail = {
    id: kid as string,
    name: kid === "devSpread" ? "Developer Spread" : "Release Cycle",
    rating: kpiData.avg,
    data: kpiData.data,
  }

  res.status(200).json(kpi)
}
