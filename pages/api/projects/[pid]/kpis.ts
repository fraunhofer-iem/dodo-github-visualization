import { reverse, sortBy } from "lodash"
import type { NextApiRequest, NextApiResponse } from "next"
import { getPagination, Kpi } from "../../../../lib/api"
import dummyKpis from "../../../../lib/data/kpis.json"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Kpi[]>,
) {
  const { pageNumber, pageSize, sortKey, asc } = getPagination(req.query, [
    "name",
    "rating",
  ])
  console.log({ pageNumber, pageSize, sortKey, asc })

  let kpis = dummyKpis
  if (sortKey) {
    kpis = sortBy(kpis, [(currentProject: any) => currentProject[sortKey]])
    if (!asc) {
      reverse(kpis)
    }
  }
  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= kpis.length) {
    res.status(404).json([])
    return
  }
  if (endOfChunk >= kpis.length) {
    endOfChunk = kpis.length
  }
  if (startOfChunk < 0) {
    startOfChunk = 0
    endOfChunk = pageSize
  }
  const chunk: Kpi[] = kpis.slice(
    startOfChunk < kpis.length ? startOfChunk : undefined,
    endOfChunk < kpis.length ? endOfChunk : undefined,
  )
  console.log(startOfChunk, endOfChunk)
  console.log(chunk)

  res.status(200).json(chunk)
}
