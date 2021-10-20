import { useState } from "react"
import styles from "../../styles/components/Table.module.scss"
import { useUIContext } from "../../util/uiContext"
import Button from "../action/Button"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import TableBody from "./TableBody"
import TableCell from "./TableCell"
import TableFoot from "./TableFoot"
import TableHead from "./TableHead"
import TableRow from "./TableRow"

export type TableContext = "neutral" | "striped"

interface Props {
  children?: {
    columns: React.ReactNode[]
    rows: React.ReactNode[][]
  }
  pageLimit?: number
  context?: TableContext
  width?: string
}

export default function Table(props: Props) {
  const { theme } = useUIContext()
  const [page, setPage] = useState<number>(0)
  const tableData = props.children ?? { columns: [], rows: [] }
  const context = props.context ?? "neutral"
  const limit = props.pageLimit ?? tableData.rows.length
  const width = props.width ?? "100%"
  const css = theme.table[context].table.css()
  css.width = width

  const previousPage = () => {
    if ((page - 1) * limit >= 0) {
      setPage(page - 1)
    }
  }
  const nextPage = () => {
    if ((page + 1) * limit < tableData.rows.length) {
      setPage(page + 1)
    }
  }

  return (
    <table className={styles.table} style={css}>
      <TableHead>
        {tableData.columns.map((columnContent, i) => (
          <TableCell context={context} scope="col" key={i}>
            {columnContent}
          </TableCell>
        ))}
      </TableHead>
      <TableBody>
        {tableData.rows.map((cellContents, i) =>
          i >= page * limit && i < page * limit + limit ? (
            <TableRow
              context={
                context === "striped"
                  ? (i - page * limit) % 2 == 0
                    ? context
                    : "neutral"
                  : context
              }
              key={i}
            >
              {cellContents.map((cellContent, i) => (
                <TableCell context={context} key={i}>
                  {cellContent}
                </TableCell>
              ))}
            </TableRow>
          ) : undefined,
        )}
      </TableBody>
      {limit != tableData.rows.length && (
        <TableFoot context={"neutral"}>
          <TableCell context={context}>
            <Button
              context="neutral"
              width="100%"
              display="block"
              align="left"
              action={previousPage}
            >
              <Icon>{IconName.keyboardArrowLeft}</Icon>
            </Button>
          </TableCell>
          <TableCell context={context}>
            <Button
              context="neutral"
              width="100%"
              display="block"
              align="right"
              action={nextPage}
            >
              <Icon>{IconName.keyboardArrowRight}</Icon>
            </Button>
          </TableCell>
        </TableFoot>
      )}
    </table>
  )
}
