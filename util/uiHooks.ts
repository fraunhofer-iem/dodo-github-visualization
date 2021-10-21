import { useEffect, useState } from "react"

export const useKey = (key: string, action: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!key) {
        return action(e)
      } else if (e.key === key) {
        action(e)
      }
    }
    window.addEventListener("keypress", listener)
    return () => {
      window.removeEventListener("keypress", listener)
    }
  })
}

export const useClick = (
  type: "click" | "dblclick" | "contextmenu",
  listener: (e: MouseEvent) => void,
) => {
  useEffect(() => {
    window.addEventListener(type, listener)
    return () => {
      window.removeEventListener(type, listener)
    }
  })
}

export const useMediaQuery = (
  query: string,
  callback?: (matches: boolean) => void,
) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      if (callback) {
        callback(media.matches)
      }
      setMatches(media.matches)
    }
    const listener = () => {
      if (callback) {
        callback(media.matches)
      }
      setMatches(media.matches)
    }
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}
