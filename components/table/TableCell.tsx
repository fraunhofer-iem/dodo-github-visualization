import { useUIContext } from "../../util/uiContext"
import { TableContext } from "./Table"

interface Props {
  scope?: "col" | "row"
  children?: React.ReactNode
  context: TableContext
}

export default function TableCell(props: Props) {
  const { theme } = useUIContext()

  return props.scope ? (
    <th scope={props.scope} style={theme.table[props.context].headCell.css()}>
      {props.children}
    </th>
  ) : (
    <td style={theme.table[props.context].headCell.css()}>{props.children}</td>
  )
}
