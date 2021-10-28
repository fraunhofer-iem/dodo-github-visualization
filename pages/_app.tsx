import type { AppProps } from "next/app"
import React, { useState } from "react"
import "../styles/globals.css"
import { locales, themes, UIContext } from "../lib/uiContext"
import { fetchJson } from "../lib/api"
import { SWRConfig } from "swr"

export default function KPIDashboard({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(themes.light)
  const [locale, setLocale] = useState(locales.english)

  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
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
