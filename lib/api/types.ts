import { TrendDirections } from "../frontend"

export type Project = {
  name: string
  maturityIndex: number
  id: string
}

export type Sort = {
  asc: boolean
  sortKey: string
}

export type User = {
  name: string
  admin: boolean
  id: string
  isLoggedIn: boolean
}

export type KpiType = {
  id: string
  type: string
  name: string
  children: string[]
  parents: string[]
  description: string
}

export type ProjectDetail = Project & {
  url: string
}

export type Kpi = {
  name: string
  rating: number
  id: string
}

export type KpiDetail = Kpi & {
  description: string
  children: Kpi[]
  calculation: string
  // this is custom for each KPI, I guess we need to define a type for each KPI
  // and cast the KPI_Detail as needed
  data?: any
}

export type Pagination = {
  pageSize: number
  pageNumber: number
}

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message?: string) {
    super(message)
    this.statusCode = statusCode
  }
}

// TODO: This is just for testing purposes and probably not the final type
export type Trend = {
  name: string
  direction: TrendDirections
  value: number
}
