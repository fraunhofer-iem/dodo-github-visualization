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
