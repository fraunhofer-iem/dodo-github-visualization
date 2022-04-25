import { useCallback, useRef } from "react"
import useSWRInfinite from "swr/infinite"
import { ApiError, getReposApiRoute, Repo } from "../../lib/api"
import { usePagination, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import Pager from "../action/Pager"
import RepositoryCard from "./RepositoryCard"

interface Props {
  repoId: { owner: string; name: string }
}

export default function RepositoryBrowser(props: Props) {
  const { theme } = useUIContext()
  const { pageSize, sortInformation } = usePagination("name", 1)

  const {
    data: repoPages,
    size: pageNumber,
    setSize: setPageNumber,
  } = useSWRInfinite<Repo[], ApiError>((pageIndex: any, previousPage: any) => {
    if (previousPage && !previousPage.length) {
      return null
    }
    return getReposApiRoute(
      pageSize,
      pageIndex + 1,
      sortInformation.sortKey,
      sortInformation.ordering,
    )
  })

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
      {repoPages &&
        repoPages.map((currentPage) =>
          currentPage.map((currentRepo) => (
            <RepositoryCard
              key={currentRepo.id}
              repo={currentRepo}
              iconSize={"75px"}
              width="100%"
              height="100px"
              minified={true}
              margin="0"
              background={
                currentRepo.id === `${props.repoId.owner}/${props.repoId.name}`
                  ? `radial-gradient(circle at center, white, ${theme.browser.activeElement.rgba()} 500%)`
                  : undefined
              }
            />
          )),
        )}
      {repoPages && repoPages[repoPages.length - 1].length ? (
        <Pager width="100%" height="100px" size="50px" callback={getPage} />
      ) : (
        <></>
      )}
    </div>
  )
}
