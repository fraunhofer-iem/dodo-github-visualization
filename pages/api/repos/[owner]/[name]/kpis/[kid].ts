import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, KpiDetail } from "../../../../../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiDetail | undefined>,
) {
  const {
    query: { owner, name, kid, since, to, interval },
  } = req

  const params = new URLSearchParams()
  if (since) {
    params.append("since", since as string)
  }
  if (to) {
    params.append("to", to as string)
  }
  if (interval) {
    params.append("interval", interval as string)
  }

  let kpiData = await fetchJson(
    new Request(
      `${
        process.env.HOST
      }/api/kpis/${kid}?owner=${owner}&repo=${name}&${params.toString()}`,
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
