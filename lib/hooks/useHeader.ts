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
  let atA: string | undefined = undefined
  let atB: string | undefined = undefined
  let kpiIds: string[] | undefined = undefined

  if (typeof window !== "undefined") {
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    )
    const path = window.location.pathname.split("/")
    if (params) {
      pathParams = params(path)
    }

    atA = query.atA
    atB = query.atB
    kpiIds = query.kpiIds?.split(",")
  }

  const [a, setAtA] = useState<Date | undefined>(
    atA ? new Date(atA as string) : undefined,
  )
  const [b, setAtB] = useState<Date | undefined>(
    atB ? new Date(atB as string) : undefined,
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
    atA: a,
    setAtA,
    atB: b,
    setAtB,
    kpiIds,
    updateQuery,
  }
}
