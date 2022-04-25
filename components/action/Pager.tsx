import { useEffect, useRef } from "react"
import { Spinner } from "../content"

interface Props {
  width: string
  height: string
  size: string
  callback: () => void
}

export default function Pager(props: Props) {
  const pagerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pager = pagerRef.current
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        props.callback()
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
  })

  return (
    <div
      ref={pagerRef}
      style={{
        width: props.width,
        height: props.height,
        display: "flex",
        justifyContent: "center",
        verticalAlign: "middle",
      }}
    >
      <Spinner size={props.size} />
    </div>
  )
}
