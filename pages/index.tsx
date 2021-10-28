import type { NextPage } from "next"
import Head from "next/head"
import React from "react"
import Button from "../components/action/Button"
import { Card, CardTitle, CardBody, CardAction } from "../components/card"
import Overlay from "../components/layout/Overlay"
import { fetchJson } from "../lib/api"
import useUser from "../lib/api/useUser"

const Landing: NextPage = () => {
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
