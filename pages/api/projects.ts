import type { NextApiRequest, NextApiResponse } from "next"
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
  const pagination = getPagination(req);
  res.status(200).json(projects)
}

const getPagination = (req: NextApiRequest): Pagination => {
  if(hasPageNumber(req)){
    if(hasValidPageSize(req)){
      return {pageNumber: req.query.pageNumber, pageSize: req.query.pageSize}
    } else {
      return {pageNumber: req.query.pageNumber, pageSize: PAGE_SIZE_LIMIT}
    }
  } else {
    return {pageSize: PAGE_SIZE_LIMIT, pageNumber: 1}
  }
}

const hasPageNumber = (req: NextApiRequest) => {
  return req.hasOwnProperty('pageNumber') ;
}


const hasValidPageSize = (req: NextApiRequest) => {
  return (req.hasOwnProperty('pageSize') && ObjectpageSize > PAGE_SIZE_LIMIT)
}
