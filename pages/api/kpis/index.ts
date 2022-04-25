import type { NextApiResponse } from "next"
import {
  fetchJson,
  getPagination,
  Kpi,
  NextIronRequest,
  paginate,
  USER_COOKIE,
  withSession,
} from "../../../lib/api"

export default withSession(
  async (req: NextIronRequest, res: NextApiResponse<Kpi[]>) => {
    const user = req.session.get(USER_COOKIE)
    if (!user) {
      res.status(403).json("Access denied" as any)
    } else {
      const paginationParams = getPagination(req.query, ["id", "value"])
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(req.query)) {
        if (Array.isArray(value)) {
          for (const elem of value) {
            params.append(`${key}[]`, elem)
          }
        } else {
          params.append(key, value)
        }
      }
      if (!user.admin) {
        params.set("owner", user.organization)
      }
      const kpis = await fetchJson(
        new Request(
          `${process.env.HOST}/api/organizations/${
            user.organization
          }/kpis?${params.toString()}`,
        ),
      )
      const chunk = paginate<Kpi>(kpis, paginationParams)
      if (!chunk.length) {
        res.status(404).json([])
      } else {
        res.status(200).json(chunk)
      }
    }
  },
)
