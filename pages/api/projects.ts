import type { NextApiRequest, NextApiResponse } from "next"
import { getPagination, Project, SortableTableKeys } from "../../lib/api"
import projects from "../../lib/data/projects.json"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>,
) {
  const { pageNumber, pageSize, sortKey, asc } = getPagination(
    req.query,
    SortableTableKeys,
  )
  // console.log("api call, ordering: ", asc)
  console.log({ pageNumber, pageSize, sortKey, asc })
  // console.log(projects)
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
    // console.log(projects)
    if (!asc) {
      projects.reverse()
    }
  }
  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= projects.length) {
    res.status(404).json([])
    return
  }
  if (endOfChunk >= projects.length) {
    endOfChunk = projects.length
  }
  if (startOfChunk < 0) {
    startOfChunk = 0
    endOfChunk = pageSize
  }
  const chunk: Project[] = projects.slice(
    startOfChunk < projects.length ? startOfChunk : undefined,
    endOfChunk < projects.length ? endOfChunk : undefined,
  )
  // console.log(startOfChunk, endOfChunk)
  // console.log(chunk)

  res.status(200).json(chunk)
}
