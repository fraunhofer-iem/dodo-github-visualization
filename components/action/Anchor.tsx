import Link from "next/link"
import { useState } from "react"
import styles from "../../styles/components/Button.module.scss"
import { useUIContext } from "../../util/uiContext"
import { contexts } from "./Button"

interface Props {
  context: "primary" | "neutral"
  href: string
  children: string
  onClick?: () => void
}

export default function Anchor(props: Props) {
  const { theme } = useUIContext()
  const [hovered, setHovered] = useState(false)
  const context = contexts[props.context](hovered)
  const onClick = props.onClick ?? (() => {})

  return (
    <Link href={props.href}>
      <a
        className={styles.btn}
        style={theme.button[context].css()}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        href={props.href}
      >
        {props.children}
      </a>
    </Link>
  )
}
