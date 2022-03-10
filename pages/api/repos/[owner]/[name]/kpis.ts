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

  let kpis = await fetchJson(
    new Request(`${process.env.HOST}/api/repositories/${owner}/${name}/kpis`),
  )

  const chunk = paginate<Kpi>(kpis, paginationParams)
  if (!chunk.length) {
    res.status(404).json([])
  }
  res.status(200).json(chunk)
}
