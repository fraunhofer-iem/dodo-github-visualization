import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Layout.module.scss"

interface Props {
  title: React.ReactNode
  children?: React.ReactNode
}

/**
 * Title bar
 */
export function Header(props: Props) {
  const { theme } = useUIContext()

  return (
    <div className={styles.header} style={theme.layout.header.css()}>
      <h1 style={theme.layout.title.css()}>{props.title}</h1>
      {props.children}
    </div>
  )
}
