import { useState } from "react"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Card.module.scss"

interface Props {
  width?: string
  height?: string
  margin?: string
  background?: string
  backgroundHover?: string
  children: React.ReactNode
}

export function Card(props: Props) {
  const { theme } = useUIContext()
  const [hovered, setHovered] = useState(false)

  const css = theme.card.card.css()
  css.width = props.width ?? "auto"
  if (props.height) {
    css.height = props.height
  }
  if (props.margin) {
    css.margin = props.margin
  }
  if (props.background) {
    css.background = props.background
  }
  if (hovered && props.backgroundHover) {
    css.background = props.backgroundHover
  }

  return (
    <div
      className={styles.card}
      style={css}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {props.children}
    </div>
  )
}
