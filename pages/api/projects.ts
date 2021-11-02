import { reverse, sortBy } from "lodash"
import type { NextApiRequest, NextApiResponse } from "next"
import { getPagination, Project } from "../../lib/api"
import dummyProjects from "../../lib/data/projects.json"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>,
) {
  const { pageNumber, pageSize, sortKey, asc } = getPagination(req.query, [
    "name",
    "maturityIndex",
  ])
  console.log({ pageNumber, pageSize, sortKey, asc })

  let projects = dummyProjects
  if (sortKey) {
    projects = sortBy(projects, [
      (currentProject: any) => currentProject[sortKey],
    ])
    if (!asc) {
      reverse(projects)
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
  console.log(startOfChunk, endOfChunk)
  console.log(chunk)

  res.status(200).json(chunk)
}
