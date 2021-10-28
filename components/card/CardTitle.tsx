import styles from "../../styles/components/Card.module.scss"
import { useUIContext } from "../../lib/uiContext"

interface Props {
  children: React.ReactNode
}

export function CardTitle(props: Props) {
  const { theme } = useUIContext()

  return (
    <h4 className={styles.cardTitle} style={theme.card.title.css()}>
      {props.children}
    </h4>
  )
}
