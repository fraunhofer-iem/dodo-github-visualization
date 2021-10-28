import styles from "../../styles/components/Card.module.scss"
import { useUIContext } from "../../lib/uiContext"
interface Props {
  width: string
  height?: string
  children: React.ReactNode
}

export default function Card(props: Props) {
  const { theme } = useUIContext()

  const css = theme.card.card.css()
  css.width = props.width
  if (props.height) {
    css.height = props.height
  }

  return (
    <div className={styles.card} style={css}>
      {props.children}
    </div>
  )
}
