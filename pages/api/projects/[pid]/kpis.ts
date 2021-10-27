import type { NextApiRequest, NextApiResponse } from "next"
import { getSortedTablePagination } from "../../../../util/api/pagination"
import kpis from "../../../../util/data/kpis.json"

export type Kpi = {
  name: string
  score: number
  id: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Kpi[]>,
) {
  const { pageNumber, pageSize } = getSortedTablePagination(req.query)

  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= kpis.length) {
    res.status(404).json([])
    return
  }
  if (endOfChunk >= kpis.length) {
    endOfChunk = kpis.length
    startOfChunk = kpis.length - pageSize
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
