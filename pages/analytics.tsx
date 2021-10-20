import { NextPage } from "next"
import Card from "../components/card/Card"
import CardBody from "../components/card/CardBody"
import Page from "../components/layout/Page"
import Rating from "../components/rating/Rating"

const Analytics: NextPage = () => {
  return (
    <Page title="Analytics - KPI Dashboard">
      <Card width="99%">
        <CardBody>
          <Rating>5</Rating>
          <br />
          <Rating>7.5</Rating>
          <br />
          <Rating>22.5</Rating>
          <br />
          <Rating>25</Rating>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Analytics
