import { useState } from "react"
import { useUIContext } from "../../util/uiContext"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import { TableContext } from "./Table"

interface Props {
  scope?: "col" | "row"
  children?: React.ReactNode
  context: TableContext
  column?: number
  callback?: (column: number, ordering: Ordering) => void
  sortedBy?: boolean
}

export enum Ordering {
  ascending,
  descending,
  given,
}

export default function TableCell(props: Props) {
  const { theme } = useUIContext()
  const [ordering, setOrdering] = useState<Ordering>(Ordering.given)

  const toggleOrdering = () => {
    switch (ordering) {
      case Ordering.ascending:
        setOrdering(Ordering.descending)
        return Ordering.descending
      case Ordering.descending:
        setOrdering(Ordering.ascending)
        return Ordering.ascending
      default:
        setOrdering(Ordering.ascending)
        return Ordering.ascending
    }
  }

  return props.scope ? (
    <th
      onClick={() => {
        if (props.column && props.callback) {
          props.callback(props.column - 1, toggleOrdering())
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
      ) : (
        <Icon>{IconName.arrowRight}</Icon>
      )}
    </th>
  ) : (
    <td style={theme.table[props.context].headCell.css()}>{props.children}</td>
  )
}
