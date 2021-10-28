import styles from "../../styles/components/List.module.scss"
import { useUIContext } from "../../lib/uiContext"

interface Props {
  children?: React.ReactNode
}

export default function ListGroupItem(props: Props) {
  const { theme } = useUIContext()

  return (
    <li className={styles.listGroupItem} style={theme.list.listItem.css()}>
      {props.children}
    </li>
  )
}
