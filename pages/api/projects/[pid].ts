import type { NextApiRequest, NextApiResponse } from "next"
import { ProjectDetail } from "../../../lib/api"
import projects from "../../../lib/data/projects.json"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectDetail | undefined>,
) {
  const {
    query: { pid },
  } = req

  const project = projects.find(
    (currentProject) => currentProject.id === (pid as string),
  )

  if (project) {
    res.status(200).json({
      ...project,
      url: `github.com/owner/${project.id}`,
    })
  } else {
    res.status(404).json(undefined)
  }
}
