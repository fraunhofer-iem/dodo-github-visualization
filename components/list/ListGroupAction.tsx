import styles from "../../styles/components/List.module.scss"
import { useUIContext } from "../../util/uiContext"
import Button from "../action/Button"

interface Props {
  children?: React.ReactNode
  action?: () => void
  cxtAction?: () => void
}

export default function ListGroupAction(props: Props) {
  const { theme } = useUIContext()

  return (
    <li className={styles.listGroupAction} style={theme.list.listItem.css()}>
      <Button
        action={props.action}
        cxtAction={props.cxtAction}
        context={"neutral"}
      >
        {props.children}
      </Button>
    </li>
  )
}