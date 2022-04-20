import Tippy from "@tippyjs/react"
import { useRef, useState } from "react"
import { useSwipeable } from "react-swipeable"
import useSWR from "swr"
import { ApiError } from "../../lib/api"
import { IconNames, Ordering } from "../../lib/frontend"
import { usePagination, useResize, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Button } from "../action"
import { Grid } from "../layout"
import { ListGroup, ListGroupAction } from "../list"
import { Icon } from "../rating"
interface Props<EntityType> {
  /**
   * Number of rows within the gallery
   */
  rows: number
  /**
   * Minimal width of a single gallery item
   */
  minBoxSize: number

  /**
   * Gap between gallery items
   */
  gap?: number

  /**
   * Desired amount of gallery items displayed per row
   */
  itemsPerRow: number
  /**
   * Width of the gallery
   */
  width?: string
  /**
   * Function that, given a database entity, returns a JSX element
   * that is displayed as one of the gallery's items
   */
  generator: (entity: EntityType, size: number, key: number) => JSX.Element
  /**
   * Function that returns a paginated API route
   */
  route: (
    pageSize?: number,
    pageNumber?: number,
    sortKey?: string,
    asc?: number,
    since?: Date,
    to?: Date,
  ) => string
  /**
   * Names of the database entities props that can be used for sorting
   */
  sortKeys?: string[]
  /**
   * Limit API response to entities from specific date range
   */
  range?: { since: Date; to: Date }
}

/**
 * Asynchronous, responsive carousel component.
 *
 * Displays paginated API endpoints in custom components.
 */
export function Gallery<EntityType>(props: Props<EntityType>) {
  const { theme } = useUIContext()
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setPageNumber(pageNumber + 1),
    onSwipedRight: () => setPageNumber(pageNumber - 1),
    trackMouse: true,
    trackTouch: true,
  })

  const [boxSize, setBoxSize] = useState<number>(props.minBoxSize)

  const {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    sortInformation,
    setSortInformation,
  } = usePagination("name")
  const { data: entities, error: error } = useSWR<EntityType[], ApiError>(
    props.route(
      pageSize,
      pageNumber,
      sortInformation.sortKey,
      sortInformation.ordering,
      props.range ? props.range.since : undefined,
      props.range ? props.range.to : undefined,
    ),
  )
  const width = props.width ?? "100%"
  const [preferences, showPreferences] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  if (error && error.statusCode == 404) {
    setPageNumber(1)
  }

  useResize(() => {
    if (container.current) {
      const effectiveBoxSize =
        Math.floor(container.current.clientWidth / props.itemsPerRow) -
        (props.gap ?? 0)
      if (effectiveBoxSize <= props.minBoxSize) {
        setBoxSize(container.current.clientWidth - (props.gap ?? 0))
      } else {
        setBoxSize(effectiveBoxSize)
      }
    }
    // Determine how many items fit within a single row.
    // Then fetch the total amount of items displayable.
    if (container.current) {
      const displayableEntities = Math.floor(
        container.current.clientWidth /
          (boxSize + (props.gap ? props.gap * 2 : 0)),
      )
      setPageSize(
        displayableEntities == 0 ? 1 : displayableEntities * props.rows,
      )
    }
  })

  return (
    <div
      className={styles.gallery}
      {...swipeHandlers}
      ref={container}
      style={{ width: width }}
    >
      <Grid align="left" gap={`${props.gap}px`}>
        {entities &&
          entities.map((currentEntity, i) =>
            props.generator(currentEntity, boxSize, i),
          )}
      </Grid>
      <div className={styles.preferences}>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <Icon>{IconNames.chevronLeft}</Icon>
        </Button>
        <Tippy
          visible={preferences}
          content={
            <ListGroup>
              {props.sortKeys &&
                props.sortKeys.map((currentKey, i) => (
                  <ListGroupAction
                    key={i}
                    action={() =>
                      setSortInformation({
                        sortKey: currentKey.replace(" ", ""),
                        ordering: sortInformation.ordering,
                      })
                    }
                  >
                    {sortInformation.sortKey === currentKey.replace(" ", "") ? (
                      <strong>
                        {currentKey.charAt(0).toUpperCase() +
                          currentKey.substring(1)}
                      </strong>
                    ) : (
                      currentKey.charAt(0).toUpperCase() +
                      currentKey.substring(1)
                    )}
                  </ListGroupAction>
                ))}
            </ListGroup>
          }
          interactive={true}
          onClickOutside={() => showPreferences(false)}
          placement="right"
        >
          <div style={{ display: "inline-block" }}>
            <Button context="neutral" action={() => showPreferences(true)}>
              <Icon>{IconNames.tune}</Icon>
            </Button>
          </div>
        </Tippy>
        <Button
          context="neutral"
          action={() =>
            setSortInformation({
              sortKey: "" + sortInformation.sortKey,
              ordering:
                sortInformation.ordering == Ordering.ASCENDING
                  ? Ordering.DESCENDING
                  : Ordering.ASCENDING,
            })
          }
        >
          <Icon>
            {sortInformation.ordering == Ordering.ASCENDING
              ? IconNames.sort
              : IconNames.segment}
          </Icon>
        </Button>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber + 1)}
        >
          <Icon>{IconNames.chevronRight}</Icon>
        </Button>
      </div>
    </div>
  )
}
