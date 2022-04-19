import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, RepoDetail } from "../../../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RepoDetail>,
) {
  const {
    query: { owner, name },
  } = req
  const repo = await fetchJson(
    new Request(`${process.env.HOST}/api/repositories/${owner}/${name}`),
  )

  res.status(200).json(repo)
}