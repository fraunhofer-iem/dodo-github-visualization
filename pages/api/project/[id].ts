import type { NextApiRequest, NextApiResponse } from "next"
import { Project } from "../projects"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project>,
) {
  const {
    query: { id },
  } = req

  res
    .status(200)
    .json({ id: id as string, maturityIndex: 2, name: "project A" })
}
