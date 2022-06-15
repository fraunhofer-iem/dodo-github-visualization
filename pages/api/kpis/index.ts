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
      params.append("owner", req.query.owner as string)
      if (req.query.repo) {
        params.append("repo", req.query.repo as string)
      }
      if (req.query.children) {
        params.append("children", req.query.children as string)
      } else {
        params.append("children", JSON.stringify(false))
      }
      if (req.query.to) {
        params.append("to", req.query.to as string)
      }
      if (req.query.from) {
        params.append("from", req.query.from as string)
      }
      if (req.query.history) {
        params.append("history", req.query.history as string)
      }
      if (req.query["kinds[]"]) {
        if (Array.isArray(req.query["kinds[]"])) {
          for (const kind of req.query["kinds[]"]) {
            params.append("kinds", kind)
          }
        } else {
          params.append("kinds", req.query["kinds[]"])
        }
      }
      let kpis: Kpi[] = await fetchJson(
        new Request(`${process.env.HOST}/api/kpis?${params.toString()}`),
      )
      if (req.query["kpis[]"]) {
        kpis = kpis.filter((kpi) => req.query["kpis[]"].includes(kpi.id))
      }
      if (req.query.filter) {
        params.append("filter", req.query.filter as string)
      }
      const chunk = paginate<Kpi>(
        kpis,
        paginationParams,
        (elem) =>
          params.get("filter") === null ||
          (elem.name
            ? elem.name
                .toLowerCase()
                .includes((params.get("filter") as string).toLowerCase())
            : false),
      )
      if (!chunk.length) {
        res.status(404).json([])
      } else {
        res.status(200).json(chunk)
      }
    }
  },
)
