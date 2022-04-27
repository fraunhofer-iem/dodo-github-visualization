import { useRouter } from "next/router"
import { useState } from "react"

export function useHeader(
  path: (owner?: string, name?: string, kpi?: string) => string,
  params?: (path: string[]) => {
    owner?: string
    name?: string
    kpi?: string
  },
) {
  const router = useRouter()
  let pathParams: {
    owner?: string
    name?: string
    kpi?: string
  } = {}
  let sinceA: string | undefined = undefined
  let sinceB: string | undefined = undefined
  let toA: string | undefined = undefined
  let toB: string | undefined = undefined
  let kpiIds: string[] | undefined = undefined

  if (typeof window !== "undefined") {
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    )
    const path = window.location.pathname.split("/")
    if (params) {
      pathParams = params(path)
    }

    sinceA = query.sinceA
    toA = query.toA
    sinceB = query.sinceB
    toB = query.toB
    // console.log(query.kpiIds)
    kpiIds = query.kpiIds?.split(",")
  }

  const [rangeA, setRangeA] = useState<{ since: Date; to: Date } | undefined>(
    sinceA && toA
      ? {
          since: new Date(sinceA as string),
          to: new Date(toA as string),
        }
      : undefined,
  )
  const [rangeB, setRangeB] = useState<{ since: Date; to: Date } | undefined>(
    sinceB && toB
      ? {
          since: new Date(sinceB as string),
          to: new Date(toB as string),
        }
      : undefined,
  )

  const updateQuery = (params: { [key: string]: string | string[] }) => {
    const query = { ...router.query }
    for (const [param, value] of Object.entries(params)) {
      if (!Array.isArray(value)) {
        query[param] = value
      } else {
        query[param] = value.join(",")
      }
    }
    router.push({
      pathname: path(pathParams.owner, pathParams.name, pathParams.kpi),
      query: query,
    })
  }

  return {
    ...pathParams,
    rangeA,
    setRangeA,
    rangeB,
    setRangeB,
    kpiIds,
    updateQuery,
  }
}
