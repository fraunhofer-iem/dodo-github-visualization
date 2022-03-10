import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import React, { useRef } from "react"
import useSWR from "swr"
import { Button } from "../../../../components/action"
import {
  Card,
  CardBody,
  CardSubTitle,
  CardTitle,
} from "../../../../components/card"
import KpiTable from "../../../../components/KpiTable"
import { Grid, Page, Sidebar } from "../../../../components/layout"
import { Icon } from "../../../../components/rating"
import {
  AuthorizationDetails,
  getRepoApiRoute,
  RepoDetail,
  requireAuthorization,
} from "../../../../lib/api"
import {
  getAnalyticsForRepoRoute,
  IconNames,
  PageRoutes,
} from "../../../../lib/frontend"

const Detail: NextPage = requireAuthorization((props: AuthorizationDetails) => {
  const router = useRouter()
  const { owner, name } = router.query
  const { data: repo } = useSWR<RepoDetail>(
    getRepoApiRoute({ owner: owner as string, name: name as string }),
  )
  const toggleSidebar = useRef<() => void>(() => {})

  return (
    props.user?.isLoggedIn && (
      <Page
        title={`${repo?.name}  - KPI Dashboard`}
        sidebar={
          <Button
            context="neutral"
            action={() => {
              toggleSidebar.current()
            }}
          >
            <Icon>{IconNames.menu}</Icon>
          </Button>
        }
        crumbs={[
          {
            name: "Analytics",
            route: PageRoutes.ANALYTICS,
          },
          {
            name: repo?.name as string,
            route: getAnalyticsForRepoRoute({
              owner: owner as string,
              name: name as string,
            }),
          },
        ]}
      >
        <Grid>
          <Sidebar
            control={(control: () => void) => (toggleSidebar.current = control)}
          >
            <Card>
              <CardTitle>List of KPIs</CardTitle>
              <CardBody>
                <KpiTable
                  repoId={{ owner: owner as string, name: name as string }}
                />
              </CardBody>
            </Card>
          </Sidebar>
          <Card>
            <CardTitle>{`${repo?.name}`}</CardTitle>
            <CardSubTitle>{repo?.url as string}</CardSubTitle>
            <CardBody>Overview</CardBody>
          </Card>
        </Grid>
      </Page>
    )
  )
})

export default Detail
