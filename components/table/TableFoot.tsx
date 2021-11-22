import { TableContexts } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Table.module.scss"

interface Props {
  children?: React.ReactNode
  context: TableContexts
}

export function TableFoot(props: Props) {
  const { theme } = useUIContext()

  return (
    <tfoot className={styles.tableFoot}>
      <tr style={theme.table[props.context].row.css()}>{props.children}</tr>
    </tfoot>
  )
}
