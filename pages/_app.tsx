import type { AppProps } from "next/app"
import React, { useState } from "react"
import { SWRConfig } from "swr"
import { fetchJson } from "../lib/api"
import { locales, themes, UIContext } from "../lib/hooks"
import "../styles/globals.css"

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
