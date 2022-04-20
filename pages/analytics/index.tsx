import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { Gallery, Section } from "../../components/content"
import RepositoryCard from "../../components/content/RepositoryCard"
import { Grid, Page } from "../../components/layout"
import {
  AuthorizationDetails,
  getReposApiRoute,
  Repo,
  requireAuthorization,
} from "../../lib/api"
import { PageRoutes } from "../../lib/frontend"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const [rangeA, setRangeA] = useState<{ since: Date; to: Date }>({
      since: new Date(),
      to: new Date(),
    })
    const [rangeB, setRangeB] = useState<{ since: Date; to: Date }>({
      since: new Date(),
      to: new Date(),
    })

    return (
      props.user?.isLoggedIn && (
        <Page
          title="Analytics - KPI Dashboard"
          user={props.user}
          crumbs={[{ name: "Analytics", route: PageRoutes.ANALYTICS }]}
          setRangeA={(since, to) => {
            setRangeA({ since, to })
          }}
          setRangeB={(since, to) => {
            setRangeB({ since, to })
          }}
        >
          <Section width="75%">
            <Grid align="left">
              <Gallery<Repo>
                rows={3}
                width={"100%"}
                gap={25}
                minBoxSize={150}
                itemsPerRow={3}
                sortKeys={["name", "health"]}
                route={getReposApiRoute}
                range={rangeB}
                generator={(currentRepo: Repo, size: number, key: number) => (
                  <RepositoryCard
                    key={key}
                    repo={currentRepo}
                    width={`${size}px`}
                    margin={"0"}
                    rangeA={rangeA}
                    rangeB={rangeB}
                  />
                )}
              />
            </Grid>
          </Section>
        </Page>
      )
    )
  },
)

export default Analytics
