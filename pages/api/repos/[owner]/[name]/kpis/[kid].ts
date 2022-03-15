import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, KpiDetail } from "../../../../../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiDetail | undefined>,
) {
  const {
    query: {
      owner,
      name,
      kid,
      since,
      to,
      interval,
      fileFilter,
      couplingSize,
      occurences,
    },
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
  if (fileFilter) {
    if (Array.isArray(fileFilter)) {
      for (const fileName of fileFilter) {
        params.append("fileFilter[]", fileName)
      }
    }
  }
  if (couplingSize) {
    params.append("couplingSize", couplingSize as string)
  }
  if (occurences) {
    params.append("occs", occurences as string)
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
    name: KpiNames.get(kid as string) as string,
    rating: kpiData.avg,
    data: kpiData.data,
  }

  res.status(200).json(kpi)
}

const KpiNames = new Map<string, string>([
  ["devSpread", "Developer Spread"],
  ["releaseCycle", "Release Cycle"],
  ["coc", "Coupling of Components"],
])
