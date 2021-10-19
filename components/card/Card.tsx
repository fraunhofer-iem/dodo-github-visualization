import styles from "../../styles/components/Card.module.scss"
import { useUIContext } from "../../util/uiContext"
interface Props {
  width: string
  height?: string
  children: React.ReactNode
}

export default function Card(props: Props) {
  const { theme } = useUIContext()

  const style = theme.card.card.css()
  style.width = props.width
  style.height = props.height ?? ""

  return (
    <div className={styles.card} style={style}>
      {props.children}
    </div>
  )
}
