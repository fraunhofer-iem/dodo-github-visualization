import { useState } from "react"
import styles from "../../styles/components/Button.module.scss"
import { useUIContext } from "../../util/uiContext"

export interface Props {
  context: "primary" | "neutral"
  action?: () => void
  cxtAction?: () => void
  children: React.ReactNode
  type?: "button" | "submit"
  width?: string
  display?: string
  align?: "left" | "right" | "center"
  href?: string
}

export const contexts = {
  primary: (hovered: boolean) => (hovered ? "primary:hover" : "primary"),
  neutral: (hovered: boolean) => (hovered ? "neutral:hover" : "neutral"),
}

export default function Button(props: Props) {
  const { theme } = useUIContext()
  const [hovered, setHovered] = useState(false)
  const context = contexts[props.context](hovered)
  const action = props.action ?? (() => {})
  const cxtAction = props.cxtAction ?? (() => {})

  const css = theme.button[context].css()
  if (props.width) {
    css["width"] = props.width
  }
  if (props.display) {
    css["display"] = props.display
  }
  if (props.align) {
    css["textAlign"] = props.align
  }

  return props.href ? (
    <a
      className={styles.btn}
      style={css}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={(e) => {
        cxtAction()
        e.preventDefault()
      }}
      href={props.href}
    >
      {props.children}
    </a>
  ) : (
    <button
      className={styles.btn}
      style={css}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={action}
      onContextMenu={(e) => {
        cxtAction()
        e.preventDefault()
      }}
      type={props.type}
    >
      {props.children}
    </button>
  )
}
