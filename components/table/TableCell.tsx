import { useUIContext } from "../../lib/uiContext"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import { TableContext } from "./Table"

interface Props {
  scope?: "col" | "row"
  children?: React.ReactNode
  context: TableContext
  sortedBy?: boolean
  sortKey?: string
  ordering?: Ordering
  setSortInformation?: (sortInformation: {
    sortKey: string
    ordering: Ordering
  }) => void
}

export enum Ordering {
  ascending = 1,
  descending = 0,
  given = 2,
}

export default function TableCell(props: Props) {
  const { theme } = useUIContext()
  const [sortKey, ordering, setSortInformation] = [
    props.sortKey ?? undefined,
    props.ordering ?? Ordering.given,
    props.setSortInformation ?? (() => {}),
  ]

  return props.scope ? (
    <th
      onClick={() => {
        if (sortKey) {
          setSortInformation({
            sortKey: sortKey,
            ordering:
              ordering == Ordering.given || ordering == Ordering.descending
                ? Ordering.ascending
                : Ordering.descending,
          })
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
