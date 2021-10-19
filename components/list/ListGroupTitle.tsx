import styles from "../../styles/components/List.module.scss"
import { useUIContext } from "../../util/uiContext"

interface Props {
  children?: React.ReactNode
}

export default function ListGroupTitle(props: Props) {
  const { theme } = useUIContext()

  return (
    <li className={styles.ListGroupTitle} style={theme.list.listTitle.css()}>
      {props.children}
    </li>
  )
}
