import type { NextApiRequest, NextApiResponse } from "next"
import { fetchJson, Kpi } from "../../../lib/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Kpi>,
) {
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
  const kpi = await fetchJson(
    new Request(
      `${process.env.HOST}/api/kpis/${req.query.kid}?${params.toString()}`,
    ),
  )

  res.status(200).json(kpi)
}
