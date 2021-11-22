import { reverse, sortBy } from "lodash"
import { NextApiRequest, NextApiResponse } from "next"
import { getPagination } from "../../lib/api"
import { TrendDirections } from "../../lib/frontend"

// TODO: This is just for testing purposes and probably not the final type
export type Trend = {
  name: string
  direction: TrendDirections
  value: number
}

const dummyTrends = [
  {
    name: "Pikachu",
    direction: TrendDirections.UP,
    value: 28,
  },
  {
    name: "Bisasam",
    direction: TrendDirections.DOWN,
    value: 3,
  },
  {
    name: "Larvitar",
    direction: TrendDirections.NEUTRAL,
    value: 73,
  },
  {
    name: "Papinella",
    direction: TrendDirections.UP,
    value: 87,
  },
  {
    name: "Pudox",
    direction: TrendDirections.NEUTRAL,
    value: 69,
  },
  {
    name: "Donphan",
    direction: TrendDirections.UP,
    value: 12,
  },
  {
    name: "Teddiursa",
    direction: TrendDirections.DOWN,
    value: 21,
  },
  {
    name: "Knogga",
    direction: TrendDirections.UP,
    value: 90,
  },
  {
    name: "Relaxo",
    direction: TrendDirections.NEUTRAL,
    value: 50,
  },
  {
    name: "Porygon",
    direction: TrendDirections.DOWN,
    value: 47,
  },
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Trend[]>,
) {
  const { pageNumber, pageSize, sortKey, asc } = getPagination(req.query, [
    "name",
    "direction",
    "value",
  ])

  console.log({ pageNumber, pageSize, sortKey, asc })

  let trends = dummyTrends
  if (sortKey) {
    trends = sortBy(trends, [(currentProject: any) => currentProject[sortKey]])
    if (!asc) {
      reverse(trends)
    }
  }
  let startOfChunk = pageSize * (pageNumber - 1)
  let endOfChunk = pageSize * (pageNumber - 1) + pageSize
  if (startOfChunk >= trends.length) {
    res.status(404).json([])
    return
  }
  if (endOfChunk >= trends.length) {
    endOfChunk = trends.length
  }
  if (startOfChunk < 0) {
    startOfChunk = 0
    endOfChunk = pageSize
  }
  const chunk: Trend[] = trends.slice(
    startOfChunk < trends.length ? startOfChunk : undefined,
    endOfChunk < trends.length ? endOfChunk : undefined,
  )
  console.log(startOfChunk, endOfChunk)
  console.log(chunk)

  res.status(200).json(chunk)
}
