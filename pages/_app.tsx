import type { AppProps } from "next/app"
import React, { useState } from "react"
import "../styles/globals.css"
import { locales, themes, UIContext } from "../util/uiContext"
import myFetch from "../util/api/fetchJson"
import { SWRConfig } from "swr"

export default function KPIDashboard({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(themes.light)
  const [locale, setLocale] = useState(locales.english)

  return (
    <SWRConfig
      value={{
        fetcher: myFetch,
        onError: (err: any) => {
          console.error(err)
        },
      }}
    >
      <UIContext.Provider
        value={{
          theme: theme,
          locale: locale,
          toggleTheme: () => {},
        }}
      >
        <Component {...pageProps} />
      </UIContext.Provider>
    </SWRConfig>
  )
}
