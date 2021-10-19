import type { AppProps } from "next/app"
import { useState } from "react"
import "../styles/globals.css"
import { locales, themes, UIContext } from "../util/uiContext"

export default function KPIDashboard({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(themes.light)
  const [locale, setLocale] = useState(locales.english)

  return (
    <UIContext.Provider
      value={{
        theme: theme,
        locale: locale,
        toggleTheme: () => {},
      }}
    >
      <Component {...pageProps} />
    </UIContext.Provider>
  )
}
