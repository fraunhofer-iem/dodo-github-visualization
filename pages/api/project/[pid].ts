import type { NextApiRequest, NextApiResponse } from "next"
import { Project } from "../projects"
import { KPI_Detail } from "./[pid]/kpi/[kid]"
import { KPI } from "./[pid]/kpis"

export type ProjectDetail = Project & {
  KPIs: KPI[]
  selectedKPIs: KPI_Detail[]
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
