import { useEffect } from "react"

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
