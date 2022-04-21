import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useState } from "react"
import { Section } from "../../../../components/content"
import RepositoryBrowser from "../../../../components/content/RepositoryBrowser"
import { Page } from "../../../../components/layout"
import { AuthorizationDetails, requireAuthorization } from "../../../../lib/api"
import {
  dateToString,
  getAnalyticsForRepoRoute,
} from "../../../../lib/frontend"

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
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
    owner = path[path.length - 2]
    name = path[path.length - 1]
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
      pathname: getAnalyticsForRepoRoute({
        owner: owner as string,
        name: name as string,
      }),
      query: {
        ...router.query,
        ...params,
      },
    })
  }

  return (
    props.user?.isLoggedIn && (
      <Page
        title={`${name}  - KPI Dashboard`}
        user={props.user}
        rangeA={rangeA}
        setRangeA={(since, to) => {
          updateQuery({
            sinceA: dateToString(since, false),
            toA: dateToString(to, false),
          })
          setRangeA({ since, to })
        }}
        rangeB={rangeB}
        setRangeB={(since, to) => {
          updateQuery({
            sinceB: dateToString(since, false),
            toB: dateToString(to, false),
          })
          setRangeB({ since, to })
        }}
      >
        {owner && name && (
          <Section width="150px" padding="0">
            <RepositoryBrowser repoId={{ owner: owner, name: name }} />
          </Section>
        )}
      </Page>
    )
  )
})

export default Detail
