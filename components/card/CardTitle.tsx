import styles from "../../styles/components/Card.module.scss"
import { useUIContext } from "../../util/uiContext"

interface Props {
  children: string
}

export default function CardTitle(props: Props) {
  const { theme } = useUIContext()

  return (
    <h5 className={styles.cardTitle} style={theme.card.title.css()}>
      {props.children}
    </h5>
  )
}
