import styles from "../../styles/components/Table.module.scss"
import { useUIContext } from "../../util/uiContext"
import { TableContext } from "./Table"

interface Props {
  children?: React.ReactNode
  context: TableContext
}

export default function TableFoot(props: Props) {
  const { theme } = useUIContext()

  return (
    <tfoot className={styles.tableFoot}>
      <tr style={theme.table[props.context].row.css()}>{props.children}</tr>
    </tfoot>
  )
}
