import type { NextApiRequest, NextApiResponse } from "next"
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
  res.status(200).json(projects)
}
