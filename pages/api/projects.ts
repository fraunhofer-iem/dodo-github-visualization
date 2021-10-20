import type { NextApiRequest, NextApiResponse } from "next"
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { PAGE_SIZE_LIMIT, Pagination } from "../../util/commonApiTypes"
import projects from "../../util/data/projects.json"

export type Project = {
  name: string
  maturityIndex: number
  id: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>,
) {
  const pagination = getPagination(req.query);
  console.log(pagination);
  res.status(200).json(projects)
}

const getPagination = (query: NextApiRequestQuery): Pagination => {
  if (hasValidPageNumber(query)) {
    if (hasValidPageSize(query)) {
      return { pageNumber: +query.pageNumber, pageSize: +query.pageSize }
    } else {
      return { pageNumber: +query.pageNumber, pageSize: PAGE_SIZE_LIMIT }
    }
  } else {
    return { pageSize: PAGE_SIZE_LIMIT, pageNumber: 1 }
  }
}

const hasValidPageNumber = (query: NextApiRequestQuery) => {
  return query.hasOwnProperty("pageNumber") && isNumber(query["pageNumber"])
}

const hasValidPageSize = (query: NextApiRequestQuery) => {
  if (query.hasOwnProperty("pageSize")) {
    return isNumber(query["pageSize"]);
  }
  return false
}

const isNumber = (numVal: string | string[]) => {
  return typeof numVal == "string" && !isNaN(+numVal)
}
