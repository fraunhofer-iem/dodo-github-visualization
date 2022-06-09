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
      if (req.query.data) {
        const data = await fetchJson(
          new Request(
            `${process.env.HOST}/api/runs/${kid}?at=${req.query.at}&history=${req.query.history}`,
          ),
        )
        res.status(200).json(data)
      } else {
        const kpi = await fetchJson(
          new Request(`${process.env.HOST}/api/kpis/${kid}`),
        )
        res.status(200).json(kpi)
      }
    }
  },
)
