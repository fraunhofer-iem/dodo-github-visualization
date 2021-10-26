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
  const { theme } = useUIContext()
  const [page, setPage] = useState<number>(0)
  const [tableData, setTableData] = useState(
    props.children ?? { columns: [], rows: [] },
  )
  const [sortedBy, setSortColumn] = useState<number>(-1)
  const context = props.context ?? "neutral"
  const [elementsPerPage, setElementsPerPage] = useState<number>(
    tableData.rows.length,
  )
  const width = props.width ?? "100%"

  const previousPage = () => {
    if ((page - 1) * elementsPerPage >= 0) {
      setPage(page - 1)
    }
  }
  const nextPage = () => {
    if ((page + 1) * elementsPerPage < tableData.rows.length) {
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
      setTableData({ ...tableData })
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
            i >= page * elementsPerPage &&
            i < page * elementsPerPage + elementsPerPage ? (
              <TableRow
                context={
                  context === "striped"
                    ? (i - page * elementsPerPage) % 2 == 0
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
            action={() => setPage(0)}
            disabled={page == 0}
          >
            <Icon>{IconName.firstPage}</Icon>
          </Button>
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
              for (
                let i = 0;
                i < tableData.rows.length / elementsPerPage;
                i++
              ) {
                options.push({
                  id: i,
                  name: `${i + 1}`,
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
          of {tableData.rows.length / elementsPerPage}
          <Button context="neutral" display="inline-block" action={nextPage}>
            <Icon>{IconName.chevronRight}</Icon>
          </Button>
          <Button
            context="neutral"
            display="inline-block"
            action={() =>
              setPage(Math.ceil(tableData.rows.length / elementsPerPage) - 1)
            }
            disabled={
              page == Math.ceil(tableData.rows.length / elementsPerPage) - 1
            }
          >
            <Icon>{IconName.lastPage}</Icon>
          </Button>
          <br />
          Show{" "}
          <Select
            multiple={false}
            options={(() => {
              const options: Option[] = []
              for (let i = 5; i <= tableData.rows.length; i += 5) {
                options.push({
                  id: i,
                  name: `${i}`,
                  selected: i == elementsPerPage,
                })
              }
              return options
            })()}
            changeHandler={(selection) => {
              if (!Array.isArray(selection)) {
                setElementsPerPage(selection)
              }
            }}
          />
          elements
        </>
      )}
    </div>
  )
}
