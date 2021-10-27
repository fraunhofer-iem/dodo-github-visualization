import type { NextApiRequest, NextApiResponse } from "next"
import projects from "../../../util/data/projects.json"
import { Project } from "../projects"

export type ProjectDetail = Project & {
  url: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectDetail | undefined>,
) {
  const {
    query: { pid },
  } = req

  const project = projects.find((project) => project.id === (pid as string))

  if (project) {
    res.status(200).json({
      ...project,
      url: `github.com/owner/${project.id}`,
    })
  } else {
    res.status(404).json(undefined)
  }
}
