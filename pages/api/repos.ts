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
      const { since, to, filter } = req.query
      let params: URLSearchParams | undefined = undefined
      if (since && to) {
        params = new URLSearchParams({
          since: since as string,
          to: to as string,
        })
      }
      let repos = await fetchJson(
        new Request(
          `${process.env.HOST}/api/users/${user.id}/targets${
            params ? `?${params.toString()}` : ""
          }`,
        ),
      )
      const chunk = paginate<Repo>(
        repos,
        paginationParams,
        (elem) =>
          filter === undefined ||
          elem.owner.includes(filter as string) ||
          elem.name.includes(filter as string),
      )
      if (!chunk.length) {
        res.status(200).json([])
      } else {
        res.status(200).json(chunk)
      }
    }
  },
)
