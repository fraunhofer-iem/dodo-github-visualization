import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/List.module.scss"

interface Props {
  children?: React.ReactNode
  borderColor?: string
}

export function ListGroupItem(props: Props) {
  const { theme } = useUIContext()

  const css = theme.list.listItem.css()
  if (props.borderColor) {
    css.borderColor = props.borderColor
  }

  return (
    <li className={styles.listGroupItem} style={css}>
      {props.children}
    </li>
  )
}
