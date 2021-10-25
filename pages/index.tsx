import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import Button from "../components/action/Button"
import Card from "../components/card/Card"
import CardAction from "../components/card/CardAction"
import CardBody from "../components/card/CardBody"
import CardTitle from "../components/card/CardTitle"
import Overlay from "../components/layout/Overlay"
import fetchJson from "../util/api/fetchJson"
import useUser from "../util/api/useUser"

const Landing: NextPage = () => {
  const router = useRouter()

  const { mutateUser } = useUser({
    redirectTo: "/analytics",
    redirectIfFound: true,
  })
  const handleClick = async () => {
    const body = {
      username: "hardcoded",
      password: "superSecret",
    }

    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      )
    } catch (error) {
      console.error("An unexpected error happened:", error)
    }
  }

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
          <Button action={handleClick} context="primary">
            Dashboard
          </Button>
        </CardAction>
      </Card>
    </Overlay>
  )
}

export default Landing
