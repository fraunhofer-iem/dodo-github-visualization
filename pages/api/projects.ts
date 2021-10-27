import type { NextApiRequest, NextApiResponse } from "next"
import { getSortedTablePagination } from "../../util/api/pagination"
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
  const { pageNumber, pageSize, sortKey, asc } = getSortedTablePagination(
    req.query,
  )
  console.log({ pageNumber, pageSize, sortKey, asc })
  if (sortKey) {
    projects.sort((a: any, b: any) => {
      if (a[sortKey] < b[sortKey]) {
        return -1
      } else if (a[sortKey] > b[sortKey]) {
        return 1
      } else {
        return 0
      }
    })
    if (!asc) {
      projects.reverse()
    }
  }
  console.log(projects)
  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= projects.length) {
    res.status(404).json([])
    return
  }
  if (endOfChunk >= projects.length) {
    endOfChunk = projects.length
    startOfChunk = projects.length - pageSize
  }
  if (startOfChunk < 0) {
    startOfChunk = 0
    endOfChunk = pageSize
  }
  const chunk: Project[] = projects.slice(
    startOfChunk < projects.length ? startOfChunk : undefined,
    endOfChunk < projects.length ? endOfChunk : undefined,
  )
  console.log(startOfChunk, endOfChunk)
  console.log(chunk)

  res.status(200).json(chunk)
}
