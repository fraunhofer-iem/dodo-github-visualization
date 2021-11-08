import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { Card, CardBody, CardTitle } from "../../components/card"
import { TrendComponent, TrendDirection } from "../../components/content"
import SectionTitle from "../../components/heading/SectionTitle"
import { Page } from "../../components/layout"
import { AuthorizationDetails, requireAuthorization } from "../../lib/api"

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    const router = useRouter()
    // const {
    //   pageNumber,
    //   setPageNumber,
    //   pageSize,
    //   setPageSize,
    //   sortInformation,
    //   setSortInformation,
    // } = usePagination("name")
    // const { data: projects, error: error } = useSWR<Project[]>(
    //   getProjectsApiRoute(
    //     pageSize,
    //     pageNumber,
    //     sortInformation.sortKey,
    //     sortInformation.ordering,
    //   ),
    // )
    // if (error) {
    //   setPageNumber(pageNumber - 1)
    // }
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
              {/* <Table
                width="50%"
                context={"striped"}
                paginate={true}
                {...{
                  pageSize,
                  setPageSize,
                  pageNumber,
                  setPageNumber,
                  ordering: sortInformation.ordering,
                  sortKey: sortInformation.sortKey,
                  setSortInformation,
                }}
              >
                {{
                  columns: [
                    {
                      content: "Project",
                      sortable: true,
                      sortKey: "name",
                    },
                    {
                      content: "Rating",
                      sortable: true,
                      sortKey: "maturityIndex",
                    },
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
              </Table> */}
              <TrendComponent
                name="Test1"
                rating={95}
                direction={TrendDirection.down}
              />
              <TrendComponent
                name="Test2"
                rating={95}
                direction={TrendDirection.neutral}
              />
              <TrendComponent
                name="Test3"
                rating={95}
                direction={TrendDirection.up}
              />
            </CardBody>
          </Card>
        </Page>
      )
    )
  },
)

export default Analytics
