import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/List.module.scss"

interface Props {
  children?: React.ReactNode
}

export function ListGroupTitle(props: Props) {
  const { theme } = useUIContext()

  return (
    <li className={styles.ListGroupTitle} style={theme.list.listTitle.css()}>
      {props.children}
    </li>
  )
}
