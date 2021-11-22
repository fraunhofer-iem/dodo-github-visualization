import Tippy from "@tippyjs/react"
import { useEffect, useRef, useState } from "react"
import { useSwipeable } from "react-swipeable"
import useSWR from "swr"
import { ApiError } from "../../lib/api"
import { Ordering } from "../../lib/frontend"
import { usePagination, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Button } from "../action"
import { Grid } from "../layout"
import ListGroup from "../list/ListGroup"
import ListGroupAction from "../list/ListGroupAction"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
interface Props<EntityType> {
  /**
   * Number of rows within the gallery
   */
  rows: number
  /**
   * Width of a single gallery item
   */
  boxSize: number
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
  ) => string
  /**
   * Names of the database entities props that can be used for sorting
   */
  sortKeys?: string[]
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
    ),
  )
  const width = props.width ?? "100%"
  const [preferences, showPreferences] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  if (error && error.statusCode == 404) {
    setPageNumber(1)
  }

  useEffect(() => {
    const resizeListener = () => {
      /**
       * Determine how many items fit within a single row
       * Then fetch the total amount of items displayable.
       */
      if (container.current) {
        const displayableEntities = Math.floor(
          container.current.clientWidth / (props.boxSize + 40),
        )
        setPageSize(
          displayableEntities == 0 ? 1 : displayableEntities * props.rows,
        )
      }
    }
    window.addEventListener("resize", resizeListener)
    window.dispatchEvent(new UIEvent("resize"))
    return () => {
      window.removeEventListener("resize", resizeListener)
    }
  }, [props.boxSize, props.rows, setPageSize, setPageNumber])

  return (
    <div
      className={styles.gallery}
      {...swipeHandlers}
      ref={container}
      style={{ width: width }}
    >
      <Grid align="center">
        {entities &&
          entities.map((currentEntity, i) =>
            props.generator(currentEntity, props.boxSize, i),
          )}
      </Grid>
      <div className={styles.preferences}>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <Icon>{IconName.chevronLeft}</Icon>
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
              <Icon>{IconName.tune}</Icon>
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
              ? IconName.sort
              : IconName.segment}
          </Icon>
        </Button>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber + 1)}
        >
          <Icon>{IconName.chevronRight}</Icon>
        </Button>
      </div>
    </div>
  )
}
