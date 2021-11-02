import { useUIContext } from "../../lib/uiContext"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import { TableContext } from "./Table"

interface Props {
  scope?: "col" | "row"
  children?: React.ReactNode
  context: TableContext
  sortKey?: string
  sortedBy?: boolean
  ordering?: Ordering
  setOrdering?: (ordering: Ordering) => void
  setSortKey?: (sortKey: string) => void
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
  // const [ordering, setOrdering] = [
  //   props.ordering ?? Ordering.given,
  //   props.setOrdering ?? (() => {}),
  // ]
  // const [sortKey, setSortKey] = [props.sortKey, props.setSortKey ?? (() => {})]

  const [sortKey, ordering, setSortInformation] = [
    props.sortKey ?? undefined,
    props.ordering ?? Ordering.given,
    props.setSortInformation ?? (() => {}),
  ]

  // const toggleOrdering = () => {
  //   switch (ordering) {
  //     case Ordering.ascending:
  //       setOrdering(Ordering.descending)
  //       break
  //     case Ordering.descending:
  //       setOrdering(Ordering.ascending)
  //       break
  //     default:
  //       setOrdering(Ordering.ascending)
  //       break
  //   }
  // }

  return props.scope ? (
    <th
      onClick={() => {
        if (sortKey) {
          // toggleOrdering()
          // setSortKey(sortKey)
          setSortInformation({
            sortKey: sortKey,
            ordering:
              ordering == Ordering.given
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
