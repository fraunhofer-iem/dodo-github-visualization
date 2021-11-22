import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/List.module.scss"

interface Props {
  children?: React.ReactNode
}

export function ListGroupItem(props: Props) {
  const { theme } = useUIContext()

  return (
    <li className={styles.listGroupItem} style={theme.list.listItem.css()}>
      {props.children}
    </li>
  )
}
