import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, getPagination, paginate, Repo } from "../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Repo[]>,
) {
  const paginationParams = getPagination(req.query, [
    "owner",
    "name",
    "maturityIndex",
  ])
  let repos = await fetchJson(
    new Request(`${process.env.HOST}/api/repositories`),
  )

  const chunk = paginate<Repo>(repos, paginationParams)
  if (!chunk.length) {
    res.status(404).json([])
  }
  res.status(200).json(chunk)
}
