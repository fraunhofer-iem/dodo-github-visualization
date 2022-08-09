import type { NextApiResponse } from "next"
import {
  fetchJson,
  Kpi,
  NextIronRequest,
  USER_COOKIE,
  withSession,
} from "../../../lib/api"

export default withSession(
  async (req: NextIronRequest, res: NextApiResponse<Kpi>) => {
    const user = req.session.get(USER_COOKIE)
    if (!user) {
      res.status(403).json("Access denied" as any)
    } else {
      const kid = Array.isArray(req.query.kid)
        ? req.query.kid.join("/")
        : req.query.kid
      const params = new URLSearchParams()
      if (req.query.data) {
        params.append("data", JSON.stringify(true))
        if (req.query.from) {
          params.append("from", req.query.from as string)
        }
        if (req.query.to) {
          params.append("to", req.query.to as string)
        }
        if (req.query.history) {
          params.append("history", req.query.history as string)
        }
      }
      const kpi = await fetchJson(
        new Request(`${process.env.HOST}/api/kpis/${kid}?${params.toString()}`),
      )
      if (req.query.data) {
        res.status(200).json(kpi)
      } else {
        res.status(200).json(kpi)
      }
    }
  },
)
