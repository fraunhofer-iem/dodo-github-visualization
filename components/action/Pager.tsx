import { useEffect, useRef, useState } from "react"
import { Spinner } from "../content"

interface Props {
  width: string
  height: string
  size: string
  callback: () => void
}

export function Pager(props: Props) {
  const { width, height, size, callback } = props
  const pagerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    const pager = pagerRef.current
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!visible) {
          callback()
        }
        setVisible(true)
      }
    })
    if (pager) {
      observer.observe(pager)
    }
    return () => {
      if (pager) {
        observer.unobserve(pager)
      }
    }
  }, [callback])

  return (
    <div
      ref={pagerRef}
      style={{
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        verticalAlign: "middle",
      }}
    >
      <Spinner size={size} />
    </div>
  )
}
