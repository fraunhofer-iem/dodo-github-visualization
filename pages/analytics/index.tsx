import { NextPage } from "next"
import Anchor from "../../components/action/Anchor"
import Card from "../../components/card/Card"
import CardBody from "../../components/card/CardBody"
import CardTitle from "../../components/card/CardTitle"
import SectionTitle from "../../components/heading/SectionTitle"
import Page from "../../components/layout/Page"
import Rating from "../../components/rating/Rating"
import Table from "../../components/table/Table"

const Analytics: NextPage = () => {
  return (
    <Page title="Analytics - KPI Dashboard">
      <Card width="99%">
        <CardTitle>KPI Analytics</CardTitle>
        <CardBody>
          <SectionTitle>Project Overview</SectionTitle>
          <Table width="50%" context={"striped"} pageLimit={3}>
            {{
              columns: ["Project", "Rating"],
              rows: [
                [
                  <Anchor href="/analytics/projects/a" context="neutral">
                    Project A
                  </Anchor>,
                  <Rating>1.3</Rating>,
                ],
                [
                  <Anchor href="/analytics/projects/b" context="neutral">
                    Project B
                  </Anchor>,
                  <Rating>8.5</Rating>,
                ],
                [
                  <Anchor href="/analytics/projects/c" context="neutral">
                    Project C
                  </Anchor>,
                  <Rating>25</Rating>,
                ],
                [
                  <Anchor href="/analytics/projects/d" context="neutral">
                    Project D
                  </Anchor>,
                  <Rating>21.6</Rating>,
                ],
                [
                  <Anchor href="/analytics/projects/e" context="neutral">
                    Project E
                  </Anchor>,
                  <Rating>15.7</Rating>,
                ],
              ],
            }}
          </Table>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Analytics
