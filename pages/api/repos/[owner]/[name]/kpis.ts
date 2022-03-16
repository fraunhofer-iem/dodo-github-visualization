import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, getPagination, Kpi, paginate } from "../../../../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Kpi[]>,
) {
  const {
    query: { owner, name },
  } = req

  const paginationParams = getPagination(req.query, ["name", "rating"])

  let kpis: Kpi[] = await fetchJson(
    new Request(`${process.env.HOST}/api/repositories/${owner}/${name}/kpis`),
  )

  // TODO: have this as part of the KPI object returned by owner/repo/kpis
  // Sadly, this requires more changes than I feel comfortable doing right now
  const params = new URLSearchParams({
    owner: owner as string,
    repo: name as string,
    since: new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    ).toISOString(),
  })
  for (const kpi of kpis) {
    const data = await fetchJson(
      new Request(
        `${process.env.HOST}/api/kpis/${kpi.id}?${params.toString()}`,
      ),
    )
    kpi.rating = data.avg ? data.avg : Number.NEGATIVE_INFINITY
  }

  const chunk = paginate<Kpi>(kpis, paginationParams)
  if (!chunk.length) {
    res.status(404).json([])
  }
  res.status(200).json(chunk)
}
