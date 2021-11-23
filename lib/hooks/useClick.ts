import { useEffect } from "react"

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
