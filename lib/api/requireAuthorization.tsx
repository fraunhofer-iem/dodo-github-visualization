import { NextPage } from "next"
import Head from "next/head"
import React from "react"
import { Card, CardBody } from "../../components/card"
import { Spinner } from "../../components/content"
import { Overlay } from "../../components/layout"
import { User } from "./types"
import useUser from "./useUser"

export interface AuthorizationDetails {
  user: User
}
/**
 * HOC that wraps any page component with the useUser hook. The page component
 * is given the current User object as an additional prop.
 * As of now, the page component needs to render conditionally based on the isLoggedIn
 * field of the User object.
 * More elegant solutions fail if the page component uses hooks.
 * @param page The React component to be rendered if the user is authorized
 * @returns Loading screen while the user information is being retrieved, parameter page otherwise
 */
export function requireAuthorization(
  page: (props: any) => React.ReactNode,
): NextPage {
  return (props: { [key: string]: any }) => {
    const { user } = useUser({ redirectTo: "/" })

    return (
      <>
        {page({ user: user, ...props })}
        {!user?.isLoggedIn && (
          <Overlay context="opaque">
            <Head>
              <title>Authorization required - KPI Dashboard</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Card width="30%">
              <CardBody>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Spinner size="100px" />
                </div>
                Please wait while you are being redirected
              </CardBody>
            </Card>
          </Overlay>
        )}
      </>
    )
  }
}
