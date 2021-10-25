import type { NextApiRequest, NextApiResponse } from "next"
import { Project } from "../projects"
import { KpiDetail } from "./[pid]/kpi/[kid]"
import { Kpi } from "./[pid]/kpis"

export type ProjectDetail = Project & {
  KPIs: Kpi[]
  selectedKPIs: KpiDetail[]
  url: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectDetail>,
) {
  const {
    query: { pid },
  } = req

  res.status(200).json({
    id: pid as string,
    maturityIndex: 2,
    name: "project A",
    url: "github.com/ownerA/projectA",
    KPIs: [],
    selectedKPIs: [],
  })
}
