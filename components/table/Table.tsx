import { useState } from "react"
import styles from "../../styles/components/Table.module.scss"
import { useUIContext } from "../../lib/uiContext"
import Button from "../action/Button"
import Select from "../form/Select"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import TableBody from "./TableBody"
import TableCell, { Ordering } from "./TableCell"
import TableHead from "./TableHead"
import TableRow from "./TableRow"

export type TableContext = "neutral" | "striped"

interface Props {
  children?: {
    columns: { content: React.ReactNode; sortable: boolean }[]
    rows: { content: React.ReactNode; sortKey: string | number }[][]
  }
  context?: TableContext
  width?: string
  paginate?: boolean
  pageNumber?: number
  setPageNumber?: (pageNumber: number) => void
  pageSize?: number
  setPageSize?: (pageSize: number) => void
}

export default function Table(props: Props) {
  const { theme } = useUIContext()
  const tableData = props.children ?? { columns: [], rows: [] }
  const [sortColumn, setSortColumn] = useState<number>(-1)
  const [ordering, setOrdering] = useState<Ordering>(Ordering.given)
  const context = props.context ?? "neutral"
  const width = props.width ?? "100%"
  const [pageNumber, setPageNumber] = [
    props.pageNumber ?? 0,
    props.setPageNumber ?? (() => {}),
  ]
  const [pageSize, setPageSize] = [
    props.pageSize ?? 0,
    props.setPageSize ?? (() => {}),
  ]

  if (ordering != Ordering.given) {
    tableData.rows.sort((a, b) => {
      if (a[sortColumn].sortKey < b[sortColumn].sortKey) {
        return -1
      } else if (a[sortColumn].sortKey > b[sortColumn].sortKey) {
        return 1
      } else {
        return 0
      }
    })
    if (ordering == Ordering.descending) {
      tableData.rows.reverse()
    }
  }

  return (
    <div className={styles.tableContainer} style={{ width: width }}>
      <table className={styles.table} style={theme.table[context].table.css()}>
        <TableHead>
          {tableData.columns.map((column, i) => (
            <TableCell
              context={context}
              scope="col"
              key={i}
              column={i + 1}
              sortedBy={i == sortColumn}
              setSortColumn={column.sortable ? setSortColumn : undefined}
              ordering={i == sortColumn ? ordering : Ordering.given}
              setOrdering={column.sortable ? setOrdering : undefined}
            >
              {column.content}
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {tableData.rows.map((cells, i) => (
            <TableRow
              context={
                context === "striped"
                  ? i % 2 == 0
                    ? context
                    : "neutral"
                  : context
              }
              key={i}
            >
              {cells.map((cell, i) => (
                <TableCell context={context} key={i}>
                  {cell.content}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
      {props.paginate && (
        <>
          <Button
            context="neutral"
            display="inline-block"
            action={() => setPageNumber(pageNumber - 1)}
            disabled={pageNumber <= 1}
          >
            <Icon>{IconName.chevronLeft}</Icon>
          </Button>
          Page {pageNumber}
          <Button
            context="neutral"
            display="inline-block"
            action={() => setPageNumber(pageNumber + 1)}
          >
            <Icon>{IconName.chevronRight}</Icon>
          </Button>
          <br />
          Show{" "}
          <Select
            multiple={false}
            options={Array.from(Array(50).keys()).map((_, i) => ({
              id: i + 1,
              name: `${i + 1}`,
              selected: pageSize == i + 1,
            }))}
            changeHandler={(selection) => {
              if (!Array.isArray(selection)) {
                setPageSize(selection)
              }
            }}
          />
          elements
        </>
      )}
    </div>
  )
}
