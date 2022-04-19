import type { NextPage } from "next"
import Head from "next/head"
import React from "react"
import { Button } from "../components/action"
import { Card, CardAction, CardBody, CardTitle } from "../components/card"
import { Overlay } from "../components/layout"
import { ApiRoutes, fetchJson } from "../lib/api"
import { PageRoutes } from "../lib/frontend"
import { useUser } from "../lib/hooks"

const Landing: NextPage = () => {
  const { mutateUser } = useUser({
    redirectTo: PageRoutes.ANALYTICS,
    redirectIfFound: true,
  })
  const handleClick = async () => {
    const body = {
      username: "Demo",
      password: "superSecret",
    }

    try {
      mutateUser(
        await fetchJson(ApiRoutes.LOGIN, {
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
