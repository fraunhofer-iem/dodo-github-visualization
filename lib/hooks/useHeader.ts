import { useRouter } from "next/router"
import { useState } from "react"

export function useHeader(path: (owner?: string, name?: string) => string) {
  const router = useRouter()
  let owner: string | undefined = undefined
  let name: string | undefined = undefined
  let sinceA: string | undefined = undefined
  let sinceB: string | undefined = undefined
  let toA: string | undefined = undefined
  let toB: string | undefined = undefined

  if (typeof window !== "undefined") {
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    )
    const path = window.location.pathname.split("/")
    if (path.length >= 2) {
      owner = path[path.length - 2]
      name = path[path.length - 1]
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
      pathname: path(owner, name),
      query: {
        ...router.query,
        ...params,
      },
    })
  }

  return { owner, name, rangeA, setRangeA, rangeB, setRangeB, updateQuery }
}
