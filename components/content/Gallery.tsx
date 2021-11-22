import Tippy from "@tippyjs/react"
import { useEffect, useRef, useState } from "react"
import { useSwipeable } from "react-swipeable"
import useSWR from "swr"
import { ApiError } from "../../lib/api"
import usePagination from "../../lib/api/usePagination"
import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"
import { Button } from "../action"
import { Grid } from "../layout"
import ListGroup from "../list/ListGroup"
import ListGroupAction from "../list/ListGroupAction"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
import { Ordering } from "../table/TableCell"
interface Props<EntityType> {
  rows: number
  boxSize: number
  width?: string
  generator: (entity: EntityType, size: number, key: number) => JSX.Element
  route: (
    pageSize?: number,
    pageNumber?: number,
    sortKey?: string,
    asc?: number,
  ) => string
  sortKeys?: string[]
}

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

      {/* <div className={styles.previous}>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <Icon>{IconName.chevronLeft}</Icon>
        </Button>
      </div> */}
      {/* <div className={styles.forward}>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber + 1)}
        >
          <Icon>{IconName.chevronRight}</Icon>
        </Button>
      </div> */}
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
                sortInformation.ordering == Ordering.ascending
                  ? Ordering.descending
                  : Ordering.ascending,
            })
          }
        >
          <Icon>
            {sortInformation.ordering == Ordering.ascending
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
