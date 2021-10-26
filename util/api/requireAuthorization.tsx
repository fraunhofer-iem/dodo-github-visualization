import { NextPage } from "next"
import Head from "next/head"
import React from "react"
import Card from "../../components/card/Card"
import CardBody from "../../components/card/CardBody"
import Overlay from "../../components/layout/Overlay"
import { User } from "../../pages/api/login"
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
                <svg
                  version="1.1"
                  id="L9"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                  enableBackground="new 0 0 0 0"
                  xmlSpace="preserve"
                >
                  <path
                    fill="#000"
                    d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
                  >
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      dur="1s"
                      from="0 50 50"
                      to="360 50 50"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
                Please wait while you are being redirected
              </CardBody>
            </Card>
          </Overlay>
        )}
      </>
    )
  }
}
