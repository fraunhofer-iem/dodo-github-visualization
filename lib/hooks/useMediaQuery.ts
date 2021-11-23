import { useEffect, useState } from "react"

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
  }, [callback, matches, query])

  return matches
}
