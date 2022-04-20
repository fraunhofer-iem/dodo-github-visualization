import type { NextApiResponse } from "next"
import {
  fetchJson,
  getPagination,
  NextIronRequest,
  paginate,
  Repo,
  USER_COOKIE,
  withSession,
} from "../../lib/api"

export default withSession(
  async (req: NextIronRequest, res: NextApiResponse<Repo[]>) => {
    const user = req.session.get(USER_COOKIE)
    if (!user) {
      res.status(403).json("Access denied" as any)
    } else {
      const paginationParams = getPagination(req.query, ["name", "health"])
      const { since, to } = req.query
      let params: URLSearchParams | undefined = undefined
      if (since && to) {
        params = new URLSearchParams({
          since: since as string,
          to: to as string,
        })
      }
      let repos = await fetchJson(
        new Request(
          `${process.env.HOST}/api/organizations/${
            user.organization
          }/repositories${params ? `?${params.toString()}` : ""}`,
        ),
      )

      const chunk = paginate<Repo>(repos, paginationParams)
      if (!chunk.length) {
        res.status(404).json([])
      }
      res.status(200).json(chunk)
    }
  },
)
