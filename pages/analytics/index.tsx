import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import useSWR from "swr"
import Button from "../../components/action/Button"
import { Card, CardBody, CardTitle } from "../../components/card"
import SectionTitle from "../../components/heading/SectionTitle"
import { Page } from "../../components/layout"
import Rating from "../../components/rating/Rating"
import Table from "../../components/table/Table"
import {
  AuthorizationDetails,
  getAnalyticsForProjectRoute,
  getProjectsApiRoute,
  Project,
  requireAuthorization,
} from "../../lib/api"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(5)
    const { data: projects, error: error } = useSWR<Project[]>(
      getProjectsApiRoute(pageSize, pageNumber),
    )
    if (error) {
      setPageNumber(pageNumber - 1)
    }
    return (
      props.user?.isLoggedIn && (
        <Page
          title="Analytics - KPI Dashboard"
          crumbs={[{ name: "Analytics", route: "/analytics" }]}
        >
          <Card width="99%">
            <CardTitle>KPI Analytics</CardTitle>
            <CardBody>
              <SectionTitle>Project Overview</SectionTitle>
              <Table
                width="50%"
                context={"striped"}
                paginate={true}
                {...{ pageSize, setPageSize, pageNumber, setPageNumber }}
              >
                {{
                  columns: [
                    { content: "Project", sortable: true },
                    { content: "Rating", sortable: true },
                  ],
                  rows: projects
                    ? projects.map((project) => [
                        {
                          content: (
                            <Button
                              action={() =>
                                router.push(
                                  getAnalyticsForProjectRoute(project.id),
                                )
                              }
                              context="anchor"
                              width="100%"
                              display="block"
                              align="left"
                            >
                              {project.name}
                            </Button>
                          ),
                          sortKey: project.name,
                        },
                        {
                          content: (
                            <Rating>{`${project.maturityIndex}`}</Rating>
                          ),
                          sortKey: project.maturityIndex,
                        },
                      ])
                    : [],
                }}
              </Table>
            </CardBody>
          </Card>
        </Page>
      )
    )
  },
)

export default Analytics
