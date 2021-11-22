import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Layout.module.scss"

interface Props {
  title: React.ReactNode
  children?: React.ReactNode
}

export function Bar(props: Props) {
  const { theme } = useUIContext()

  return (
    <div className={styles.bar} style={theme.layout.bar.css()}>
      <div className={styles.barTitle}>{props.title}</div>
      <div className={styles.barChildren}>{props.children}</div>
    </div>
  )
}
