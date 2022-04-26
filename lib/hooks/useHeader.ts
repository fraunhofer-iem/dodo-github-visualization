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

  const updateQuery = (params: { [key: string]: string }) => {
    router.push({
      pathname: path(pathParams.owner, pathParams.name, pathParams.kpi),
      query: {
        ...router.query,
        ...params,
      },
    })
  }

  return { ...pathParams, rangeA, setRangeA, rangeB, setRangeB, updateQuery }
}
