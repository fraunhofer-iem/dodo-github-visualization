import { IconNames, Ordering, TableContexts } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import { Icon } from "../rating"

interface Props {
  scope?: "col" | "row"
  children?: React.ReactNode
  context: TableContexts
  sortedBy?: boolean
  sortKey?: string
  ordering?: Ordering
  setSortInformation?: (sortInformation: {
    sortKey: string
    ordering: Ordering
  }) => void
}

export function TableCell(props: Props) {
  const { theme } = useUIContext()
  const [sortKey, ordering, setSortInformation] = [
    props.sortKey ?? undefined,
    props.ordering ?? Ordering.GIVEN,
    props.setSortInformation ?? (() => {}),
  ]

  return props.scope ? (
    <th
      onClick={() => {
        if (sortKey) {
          setSortInformation({
            sortKey: sortKey,
            ordering:
              ordering == Ordering.GIVEN || ordering == Ordering.DESCENDING
                ? Ordering.ASCENDING
                : Ordering.DESCENDING,
          })
        }
      }}
      scope={props.scope}
      style={theme.table[props.context].headCell.css()}
    >
      {props.children}
      {props.sortedBy ? (
        ordering == Ordering.ASCENDING ? (
          <Icon>{IconNames.arrowDropUp}</Icon>
        ) : ordering == Ordering.DESCENDING ? (
          <Icon>{IconNames.arrowDropDown}</Icon>
        ) : undefined
      ) : undefined}
    </th>
  ) : (
    <td style={theme.table[props.context].headCell.css()}>{props.children}</td>
  )
}
