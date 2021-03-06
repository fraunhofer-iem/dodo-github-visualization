import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/List.module.scss"
import { Button } from "../action"

interface Props {
  children?: React.ReactNode
  action?: () => void
  cxtAction?: () => void
}

export function ListGroupAction(props: Props) {
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
