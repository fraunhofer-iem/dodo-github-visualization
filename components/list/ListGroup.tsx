import styles from "../../styles/components/List.module.scss"
import { useUIContext } from "../../lib/uiContext"

interface Props {
  children?: React.ReactNode
  width?: string
}

export default function ListGroup(props: Props) {
  const { theme } = useUIContext()
  const css = theme.list.list.css()
  if (props.width) {
    css.width = props.width
  }

  return (
    <ul className={styles.listGroup} style={css}>
      {props.children}
    </ul>
  )
}
