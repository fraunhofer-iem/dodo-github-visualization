import { useState } from "react"
import styles from "../../styles/components/Table.module.scss"
import { useUIContext } from "../../util/uiContext"
import Button from "../action/Button"
import Select, { Option } from "../Form/Select"
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
}

export default function Table(props: Props) {
  console.log(props.children)
  const { theme } = useUIContext()
  const [page, setPage] = useState<number>(0)
  const tableData = props.children ?? { columns: [], rows: [] }
  const [sortedBy, setSortColumn] = useState<number>(-1)
  const context = props.context ?? "neutral"
  const [pageSize, setPageSize] = useState<number>(5)
  const width = props.width ?? "100%"

  const previousPage = () => {
    if ((page - 1) * pageSize >= 0) {
      setPage(page - 1)
    }
  }
  const nextPage = () => {
    if ((page + 1) * pageSize < tableData.rows.length) {
      setPage(page + 1)
    }
  }

  const sortByColumn = (column: number, ordering: Ordering) => {
    if (ordering != Ordering.given) {
      tableData.rows.sort((a, b) => {
        if (a[column].sortKey < b[column].sortKey) {
          return -1
        } else if (a[column].sortKey > b[column].sortKey) {
          return 1
        } else {
          return 0
        }
      })
      if (ordering == Ordering.descending) {
        tableData.rows.reverse()
      }
      setSortColumn(column)
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
              callback={column.sortable ? sortByColumn : undefined}
              sortedBy={i == sortedBy}
            >
              {column.content}
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {tableData.rows.map((cells, i) =>
            i >= page * pageSize && i < page * pageSize + pageSize ? (
              <TableRow
                context={
                  context === "striped"
                    ? (i - page * pageSize) % 2 == 0
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
            ) : undefined,
          )}
        </TableBody>
      </table>
      {props.paginate && (
        <>
          <Button
            context="neutral"
            display="inline-block"
            action={previousPage}
            disabled={page == 0}
          >
            <Icon>{IconName.chevronLeft}</Icon>
          </Button>
          Page{" "}
          <Select
            multiple={false}
            options={(() => {
              const options: Option[] = []
              for (let i = 1; i <= page; i++) {
                options.push({
                  id: i,
                  name: `${i}`,
                  selected: i == page,
                })
              }
              return options
            })()}
            changeHandler={(selection) => {
              if (!Array.isArray(selection)) {
                setPage(selection)
              }
            }}
          />
          <Button context="neutral" display="inline-block" action={nextPage}>
            <Icon>{IconName.chevronRight}</Icon>
          </Button>
          <br />
          Show{" "}
          <Select
            multiple={false}
            options={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((size) => ({
              id: size,
              name: `${size}`,
              selected: pageSize == size,
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
