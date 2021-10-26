import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import useSWR from "swr"
import Button from "../../components/action/Button"
import Card from "../../components/card/Card"
import CardBody from "../../components/card/CardBody"
import CardTitle from "../../components/card/CardTitle"
import SectionTitle from "../../components/heading/SectionTitle"
import Page from "../../components/layout/Page"
import Rating from "../../components/rating/Rating"
import Table from "../../components/table/Table"
import {
  AuthorizationDetails,
  requireAuthorization,
} from "../../util/api/requireAuthorization"
import { Project } from "../api/projects"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(5)
    const { data: projects, error: error } = useSWR<Project[]>(
      `/api/projects?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    )
    if (error) {
      setPageNumber(pageNumber - 1)
    }
    return (
      props.user?.isLoggedIn && (
        <Page title="Analytics - KPI Dashboard">
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
                                router.push(`/analytics/projects/${project.id}`)
                              }
                              context="neutral"
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
