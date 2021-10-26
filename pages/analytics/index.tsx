import { NextPage } from "next"
import Anchor from "../../components/action/Anchor"
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

const Analytics: NextPage = requireAuthorization(
  (props: AuthorizationDetails) => {
    return (
      props.user?.isLoggedIn && (
        <Page title="Analytics - KPI Dashboard">
          <Card width="99%">
            <CardTitle>KPI Analytics</CardTitle>
            <CardBody>
              <SectionTitle>Project Overview</SectionTitle>
              <Table width="50%" context={"striped"} paginate={true}>
                {{
                  columns: [
                    { content: "Project", sortable: true },
                    { content: "Rating", sortable: true },
                  ],
                  rows: [
                    [
                      {
                        content: (
                          <Anchor
                            href="/analytics/projects/a"
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            Project A
                          </Anchor>
                        ),
                        sortKey: "a",
                      },
                      { content: <Rating>1.3</Rating>, sortKey: 1.3 },
                    ],
                    [
                      {
                        content: (
                          <Anchor
                            href="/analytics/projects/b"
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            Project B
                          </Anchor>
                        ),
                        sortKey: "b",
                      },
                      { content: <Rating>8.5</Rating>, sortKey: 8.5 },
                    ],
                    [
                      {
                        content: (
                          <Anchor
                            href="/analytics/projects/c"
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            Project C
                          </Anchor>
                        ),
                        sortKey: "c",
                      },
                      { content: <Rating>25</Rating>, sortKey: 25 },
                    ],
                    [
                      {
                        content: (
                          <Anchor
                            href="/analytics/projects/d"
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            Project D
                          </Anchor>
                        ),
                        sortKey: "d",
                      },
                      { content: <Rating>21.6</Rating>, sortKey: 21.6 },
                    ],
                    [
                      {
                        content: (
                          <Anchor
                            href="/analytics/projects/e"
                            context="neutral"
                            width="100%"
                            display="block"
                            align="left"
                          >
                            Project E
                          </Anchor>
                        ),
                        sortKey: "e",
                      },
                      { content: <Rating>15.7</Rating>, sortKey: 15.7 },
                    ],
                  ],
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
