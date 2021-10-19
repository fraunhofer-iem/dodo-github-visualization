import type { NextPage } from "next"
import Head from "next/head"
import Anchor from "../components/action/Anchor"
import Card from "../components/card/Card"
import CardAction from "../components/card/CardAction"
import CardBody from "../components/card/CardBody"
import CardTitle from "../components/card/CardTitle"
import Overlay from "../components/layout/Overlay"

const Landing: NextPage = () => {
  return (
    <Overlay context="opaque">
      <Head>
        <title>KPI Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card width="30%">
        <CardTitle>Login</CardTitle>
        <CardBody>Imagine an actual form here</CardBody>
        <CardAction>
          <Anchor href="/analytics" context="primary">
            Dashboard
          </Anchor>
        </CardAction>
      </Card>
    </Overlay>
  )
}

export default Landing
