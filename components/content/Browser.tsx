import { useCallback, useRef } from "react"
import useSWRInfinite from "swr/infinite"
import { ApiError } from "../../lib/api"
import { usePagination, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Pager } from "../action"

interface Props<EntityType> {
  route: (
    pageSize?: number,
    pageNumber?: number,
    sortKey?: string,
    asc?: number,
  ) => string
  generator: (entity: EntityType) => JSX.Element
  sortKey?: string
}

export function Browser<EntityType>(props: Props<EntityType>) {
  const { theme } = useUIContext()
  const { route, generator, sortKey } = props
  const { pageSize, sortInformation } = usePagination(sortKey ?? "name", 1)

  const {
    data: pages,
    size: pageNumber,
    setSize: setPageNumber,
  } = useSWRInfinite<EntityType[], ApiError>(
    (pageIndex: any, previousPage: any) => {
      if (previousPage && !previousPage.length) {
        return null
      }
      return route(
        pageSize,
        pageIndex + 1,
        sortInformation.sortKey,
        sortInformation.ordering,
      )
    },
  )

  const getPage = useCallback(() => {
    setPageNumber(pageNumber + 2)
  }, [pageNumber, setPageNumber])

  const containerRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   let scrollOffset = -100
  //   repoPages?.forEach((currentPage) => {
  //     currentPage.forEach((currentRepo) => {
  //       scrollOffset += 100
  //       if (
  //         currentRepo.owner === props.repoId.owner &&
  //         currentRepo.name === props.repoId.name
  //       ) {
  //         if (containerRef.current) {
  //           containerRef.current.scrollTop = scrollOffset
  //         }
  //       }
  //     })
  //   })
  //   if (scrollOffset < 0) {
  //     getPage()
  //   }
  // }, [repoPages])

  return (
    <div
      ref={containerRef}
      className={styles.browser}
      style={theme.browser.browser.css()}
    >
      {pages &&
        pages.map((currentPage) =>
          currentPage.map((currentEntity) => generator(currentEntity)),
        )}
      {pages && pages[pages.length - 1].length ? (
        <Pager width="100%" height="100px" size="50px" callback={getPage} />
      ) : (
        <></>
      )}
    </div>
  )
}
