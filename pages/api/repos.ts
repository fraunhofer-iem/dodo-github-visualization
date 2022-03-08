import { reverse, sortBy } from "lodash"
import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, getPagination, Repo } from "../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Repo[]>,
) {
  const { pageNumber, pageSize, sortKey, asc } = getPagination(req.query, [
    "owner",
    "name",
    "maturityIndex",
  ])
  let repos = await fetchJson(
    new Request(`${process.env.HOST}/api/repositories`),
  )

  if (sortKey) {
    repos = sortBy(repos, [(currentRepo: any) => currentRepo[sortKey]])
    if (!asc) {
      reverse(repos)
    }
  }
  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= repos.length) {
    res.status(404).json([])
    return
  }
  if (endOfChunk >= repos.length) {
    endOfChunk = repos.length
  }
  if (startOfChunk < 0) {
    startOfChunk = 0
    endOfChunk = pageSize
  }
  const chunk: Repo[] = repos.slice(
    startOfChunk < repos.length ? startOfChunk : undefined,
    endOfChunk < repos.length ? endOfChunk : undefined,
  )

  res.status(200).json(chunk)
}
