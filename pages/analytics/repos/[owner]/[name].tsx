import { NextPage } from "next"
import React from "react"
import { Section } from "../../../../components/content"
import RepositoryBrowser from "../../../../components/content/RepositoryBrowser"
import { Page } from "../../../../components/layout"
import { AuthorizationDetails, requireAuthorization } from "../../../../lib/api"
import {
  dateToString,
  getAnalyticsForRepoRoute,
} from "../../../../lib/frontend"
import { useHeader } from "../../../../lib/hooks/useHeader"

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
  const { owner, name, rangeA, setRangeA, rangeB, setRangeB, updateQuery } =
    useHeader((owner, name) =>
      getAnalyticsForRepoRoute({ owner: owner ?? "", name: name ?? "" }),
    )

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
