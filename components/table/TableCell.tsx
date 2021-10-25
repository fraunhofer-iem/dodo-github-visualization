import { useUIContext } from "../../util/uiContext"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import { TableContext } from "./Table"

interface Props {
  scope?: "col" | "row"
  children?: React.ReactNode
  context: TableContext
  column?: number
  sortedBy?: boolean
  ordering?: Ordering
  setOrdering?: (ordering: Ordering) => void
  setSortColumn?: (column: number) => void
}

export enum Ordering {
  ascending,
  descending,
  given,
}

export default function TableCell(props: Props) {
  const { theme } = useUIContext()
  const [ordering, setOrdering] = [
    props.ordering ?? Ordering.given,
    props.setOrdering ?? (() => {}),
  ]
  const [column, setSortColumn] = [
    props.column,
    props.setSortColumn ?? (() => {}),
  ]

  const toggleOrdering = () => {
    switch (ordering) {
      case Ordering.ascending:
        setOrdering(Ordering.descending)
        break
      case Ordering.descending:
        setOrdering(Ordering.ascending)
        break
      default:
        setOrdering(Ordering.ascending)
        break
    }
  }

  return props.scope ? (
    <th
      onClick={() => {
        if (column) {
          toggleOrdering()
          setSortColumn(column - 1)
        }
      }}
      scope={props.scope}
      style={theme.table[props.context].headCell.css()}
    >
      {props.children}
      {props.sortedBy ? (
        ordering == Ordering.ascending ? (
          <Icon>{IconName.arrowDropUp}</Icon>
        ) : ordering == Ordering.descending ? (
          <Icon>{IconName.arrowDropDown}</Icon>
        ) : undefined
      ) : undefined}
    </th>
  ) : (
    <td style={theme.table[props.context].headCell.css()}>{props.children}</td>
  )
}
