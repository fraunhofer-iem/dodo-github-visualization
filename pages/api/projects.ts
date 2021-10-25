import type { NextApiRequest, NextApiResponse } from "next"
import { getPagination } from "../../util/api/pagination"
import projects from "../../util/data/projects.json"

export type Project = {
  name: string
  maturityIndex: number
  id: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>,
) {
  const pagination = getPagination(req.query)
  const startOfChunk = pagination.pageSize * (pagination.pageNumber - 1)
  const endOfChunk =
    pagination.pageSize * pagination.pageNumber + pagination.pageSize
  const chunk: Project[] = projects.slice(
    startOfChunk < projects.length ? startOfChunk : undefined,
    endOfChunk < projects.length ? endOfChunk : undefined,
  )
  // query data depending on the pagination
  res.status(200).json(chunk)
}
