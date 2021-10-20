import type { NextApiRequest, NextApiResponse } from "next"
import { Project } from "../projects"
import { KPI_Detail } from "./kpi/[id]"
import { KPI } from "./kpis"

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
    query: { id },
  } = req

  res.status(200).json({
    id: id as string,
    maturityIndex: 2,
    name: "project A",
    url: "github.com/ownerA/projectA",
    KPIs: [],
    selectedKPIs: [],
  })
}
