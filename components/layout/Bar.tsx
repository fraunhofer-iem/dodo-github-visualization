import styles from "../../styles/components/Layout.module.scss"
import { useUIContext } from "../../util/uiContext"

interface Props {
  title: string
  children?: React.ReactNode
}

export default function Bar(props: Props) {
  const { theme } = useUIContext()

  return (
    <div className={styles.bar} style={theme.layout.bar.css()}>
      <div className={styles.barTitle}>{props.title}</div>
      <div className={styles.barChildren}>{props.children}</div>
    </div>
  )
}
