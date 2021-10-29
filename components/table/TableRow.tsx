import { useUIContext } from "../../lib/uiContext"
import { TableContext } from "./Table"

interface Props {
  children?: React.ReactNode
  context: TableContext
}

export default function TableRow(props: Props) {
  const { theme } = useUIContext()

  return <tr style={theme.table[props.context].row.css()}>{props.children}</tr>
}
