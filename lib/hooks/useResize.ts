import { useEffect } from "react"

export const useResize = (listener: (e: UIEvent) => void) => {
  useEffect(() => {
    window.addEventListener("resize", listener)
    window.dispatchEvent(new UIEvent("resize"))
    return () => {
      window.removeEventListener("resize", listener)
    }
  })
}
