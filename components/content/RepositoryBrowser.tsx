import { useEffect, useRef } from "react"
import useSWR from "swr"
import { getReposApiRoute, Repo } from "../../lib/api"
import { CSSProperties, IconNames } from "../../lib/frontend"
import { usePagination, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"
import { Card } from "../card"
import { Icon } from "../rating"
import { Spinner } from "./Spinner"

interface Props {
  repoId: { owner: string; name: string }
}

export default function RepositoryBrowser(props: Props) {
  const { theme } = useUIContext()
  const {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    sortInformation,
    setSortInformation,
  } = usePagination("name", 10)

  const { data: repos } = useSWR<Repo[]>(
    getReposApiRoute(
      pageSize,
      pageNumber,
      sortInformation.sortKey,
      sortInformation.ordering,
    ),
  )

  const pagerRef = useRef(null)
  useEffect(() => {
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("pimmel")
      }
    })
    if (pagerRef.current) {
      observer.observe(pagerRef.current)
    }
    return () => {
      if (pagerRef.current) {
        observer.unobserve(pagerRef.current)
      }
    }
  })

  return (
    <div className={styles.browser} style={theme.browser.browser.css()}>
      {repos &&
        repos.map((currentRepo) => (
          <Card
            key={currentRepo.id}
            margin="0"
            width="100%"
            height="100px"
            background={
              currentRepo.id === `${props.repoId.owner}/${props.repoId.name}`
                ? `radial-gradient(circle at center, white, ${theme.browser.activeElement.rgba()} 500%)`
                : undefined
            }
          >
            <div style={{ width: "100%", textAlign: "center" }}>
              <Icon styles={new CSSProperties({ fontSize: "75px" })}>
                {IconNames.helpOutline}
              </Icon>
              <br />
              <strong>{currentRepo.id}</strong>
            </div>
          </Card>
        ))}
      <div ref={pagerRef}>
        <Spinner size="150px" />
      </div>
    </div>
  )
}
