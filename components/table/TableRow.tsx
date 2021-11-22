import { TableContexts } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"

interface Props {
  children?: React.ReactNode
  context: TableContexts
}

export function TableRow(props: Props) {
  const { theme } = useUIContext()

  return <tr style={theme.table[props.context].row.css()}>{props.children}</tr>
}
