import React, { useCallback, useState } from "react"
import { TableBody, TableCell, TableHead, TableRow } from "."
import {
  CSSProperties,
  IconNames,
  Ordering,
  TableContexts,
} from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Table.module.scss"
import { Button } from "../action"
import { Select } from "../form"
import { Icon } from "../rating"

interface Props {
  children?: {
    columns: {
      content: React.ReactNode
      sortable: boolean
      sortKey?: string
      width?: string
      textAlign?: "left" | "right" | "center"
      vAlign?: "top" | "middle" | "bottom"
    }[]
    sections: {
      title?: React.ReactNode
      rows: {
        content: React.ReactNode
        sortKey?: string | number
        textAlign?: "left" | "right" | "center"
        vAlign?: "top" | "middle" | "bottom"
        collapsible?: boolean
      }[][]
    }[]
  }
  context?: TableContexts
  width?: string
  styles?: CSSProperties
  /**
   * Display pagination controls
   */
  paginate?: boolean
  /**
   * State variables and methods passed to the Table by the parent component.
   */
  pageNumber?: number
  setPageNumber?: (pageNumber: number) => void
  pageSize?: number
  setPageSize?: (pageSize: number) => void
  sortKey?: string
  setSortKey?: (sortKey: string) => void
  ordering?: Ordering
  setOrdering?: (ordering: Ordering) => void
  setSortInformation?: (sortInformation: {
    sortKey: string
    ordering: Ordering
  }) => void
}

export function Table(props: Props) {
  const { theme } = useUIContext()
  const tableData = props.children ?? {
    columns: [],
    sections: [{ rows: [] }],
  }
  const context = props.context ?? TableContexts.NEUTRAL
  const width = props.width ?? "100%"
  // extract state variables and methods from props passed to the Table
  // by the parent component; this way, the Table can be reused
  // and relay the pagination controls to the parent, which then
  // issues the respective API request (or otherwise generates a data chunk)
  const [pageNumber, setPageNumber] = [
    props.pageNumber ?? 0,
    props.setPageNumber ?? (() => {}),
  ]
  const [pageSize, setPageSize] = [
    props.pageSize ?? 0,
    props.setPageSize ?? (() => {}),
  ]
  const [sortKey, ordering, setSortInformation] = [
    props.sortKey ?? undefined,
    props.ordering ?? Ordering.GIVEN,
    props.setSortInformation ?? (() => {}),
  ]

  const [collapsedSections, setCollapsedSections] = useState<number[]>([])
  const [collapsedRows, setCollapsedRows] = useState<
    { section: number; row: number }[]
  >([])

  const toggleSection = useCallback(
    (section) => {
      if (collapsedSections.includes(section)) {
        collapsedSections.splice(
          collapsedSections.findIndex((s) => section === s),
          1,
        )
      } else {
        collapsedSections.push(section)
      }
      setCollapsedSections([...collapsedSections])
    },
    [collapsedSections],
  )

  const toggleRow = useCallback(
    (section, row) => {
      const isCollapsed = collapsedRows.some(
        (entry) => entry.section === section && entry.row === row,
      )
      if (isCollapsed) {
        collapsedRows.splice(
          collapsedRows.findIndex(
            (entry) => entry.section === section && entry.row === row,
          ),
          1,
        )
      } else {
        collapsedRows.push({ section, row })
      }
      setCollapsedRows([...collapsedRows])
    },
    [collapsedRows],
  )

  return (
    <div className={styles.tableContainer} style={{ width: width }}>
      <table
        className={styles.table}
        style={{ ...theme.table[context].table.css(), ...props.styles?.css() }}
      >
        <TableHead>
          {tableData.columns.map((column, i) => (
            <TableCell
              context={context}
              scope="col"
              key={i}
              sortKey={column.sortable ? column.sortKey : undefined}
              sortedBy={column.sortable && column.sortKey == sortKey}
              ordering={
                column.sortable && column.sortKey == sortKey
                  ? ordering
                  : Ordering.GIVEN
              }
              setSortInformation={
                column.sortable ? setSortInformation : undefined
              }
              width={column.width}
            >
              {column.content}
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {tableData.sections.map((section, i) => {
            const rowsToColor = section.title ? 1 : 0
            return (
              <React.Fragment key={i}>
                {section.title && (
                  <TableRow context={TableContexts.STRIPED} key={i}>
                    <TableCell
                      context={TableContexts.STRIPED}
                      colSpan={tableData.columns.length}
                      onClick={() => toggleSection(i)}
                    >
                      {section.title}
                    </TableCell>
                  </TableRow>
                )}
                {!collapsedSections.includes(i) &&
                  section.rows.map((cells, j) => (
                    <TableRow
                      context={
                        context === TableContexts.STRIPED
                          ? i % 2 == rowsToColor
                            ? context
                            : TableContexts.NEUTRAL
                          : context
                      }
                      key={j}
                    >
                      {cells.map((cell, k) => (
                        <TableCell
                          context={context}
                          key={k}
                          textAlign={cell.textAlign}
                          vAlign={cell.vAlign}
                          onClick={
                            cell.collapsible ? undefined : () => toggleRow(i, j)
                          }
                        >
                          {cell.collapsible &&
                          collapsedRows.some(
                            (entry) => entry.section === i && entry.row === j,
                          )
                            ? "..."
                            : cell.content}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </React.Fragment>
            )
          })}
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
            <Icon>{IconNames.chevronLeft}</Icon>
          </Button>
          Page {pageNumber}
          <Button
            context="neutral"
            display="inline-block"
            action={() => setPageNumber(pageNumber + 1)}
          >
            <Icon>{IconNames.chevronRight}</Icon>
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
