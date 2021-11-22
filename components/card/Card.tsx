import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Card.module.scss"

interface Props {
  width?: string
  height?: string
  children: React.ReactNode
}

export function Card(props: Props) {
  const { theme } = useUIContext()

  const css = theme.card.card.css()
  css.width = props.width ?? "auto"
  if (props.height) {
    css.height = props.height
  }

  return (
    <div className={styles.card} style={css}>
      {props.children}
    </div>
  )
}
