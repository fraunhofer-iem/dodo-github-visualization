import { useCallback, useEffect, useRef, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { ApiError } from "../../lib/api"
import { IconNames } from "../../lib/frontend"
import { usePagination, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Pager } from "../action"
import { Input } from "../form"

interface Props<EntityType> {
  route: (
    pageSize?: number,
    pageNumber?: number,
    sortKey?: string,
    asc?: number,
    filter?: string,
  ) => string
  generator: (entity: EntityType) => JSX.Element
  sortKey?: string
}

export function Browser<EntityType>(props: Props<EntityType>) {
  const { theme } = useUIContext()
  const { route, generator, sortKey } = props
  const { pageSize, sortInformation } = usePagination(sortKey ?? "name", 5)
  const [filter, setFilter] = useState<string>("")

  const {
    data: pages,
    error,
    size: pageNumber,
    setSize: setPageNumber,
    mutate,
  } = useSWRInfinite<EntityType[], ApiError>(
    (pageIndex: any, previousPage: any) => {
      if (previousPage && previousPage.length < pageSize) {
        return null
      }
      return route(
        pageSize,
        pageIndex + 1,
        sortInformation.sortKey,
        sortInformation.ordering,
        filter,
      )
    },
  )

  const isLoadingInitialData = !pages && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (pageNumber > 0 && pages && typeof pages[pageNumber - 1] === "undefined")

  const getPage = useCallback(() => {
    setPageNumber(pageNumber + 2)
  }, [pageNumber, setPageNumber])

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      if (scrollRef.current) {
        let childrenHeight = -scrollRef.current.clientHeight
        Array.from(containerRef.current.children).forEach((child) => {
          childrenHeight += child.clientHeight
        })
        containerRef.current.style.height =
          document.body.clientHeight - 100 + "px"
        scrollRef.current.style.height =
          document.body.clientHeight -
          childrenHeight +
          containerRef.current.children[0].clientHeight +
          "px"
        if (!filter) {
          containerRef.current.scrollTop =
            containerRef.current.children[0].clientHeight
        }
      }
    }
  }, [pages])

  return (
    <div
      ref={containerRef}
      className={styles.browser}
      style={theme.browser.browser.css()}
    >
      <Input
        value={filter}
        changeHandler={(e) => {
          mutate([])
          setFilter(e.currentTarget.value)
        }}
        width="95%"
        placeholder="Search"
        icon={IconNames.search}
      />
      {pages &&
        pages.map((currentPage) =>
          currentPage.map((currentEntity) => generator(currentEntity)),
        )}
      {!isLoadingMore &&
      pages &&
      pages.length > 0 &&
      pages[pages.length - 1].length == pageSize ? (
        <Pager width="100%" height="100px" size="50px" callback={getPage} />
      ) : (
        <></>
      )}
      <div style={{ height: "0px" }} ref={scrollRef}></div>
    </div>
  )
}
