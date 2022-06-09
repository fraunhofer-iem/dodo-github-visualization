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
import { KpiNames } from "../../../lib/frontend"

export default withSession(
  async (req: NextIronRequest, res: NextApiResponse<Kpi[]>) => {
    const user = req.session.get(USER_COOKIE)
    if (!user) {
      res.status(403).json("Access denied" as any)
    } else {
      const paginationParams = getPagination(req.query, ["id", "value"])
      const params = new URLSearchParams()
      params.append("children", JSON.stringify(false))
      params.append("at", req.query.at as string)
      const kpis = await fetchJson(
        new Request(`${process.env.HOST}/api/kpis?${params.toString()}`),
      )
      const chunk = paginate<Kpi>(
        kpis,
        paginationParams,
        (elem) =>
          params.get("filter") === null ||
          KpiNames[elem.id].includes(params.get("filter") as string),
      )
      if (!chunk.length) {
        res.status(200).json([])
      } else {
        res.status(200).json(chunk)
      }
    }
  },
)
