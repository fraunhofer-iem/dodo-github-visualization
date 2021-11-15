import { useEffect } from "react"
import { useSwipeable } from "react-swipeable"
import useSWR from "swr"
import { ApiError } from "../../lib/api"
import usePagination from "../../lib/api/usePagination"
import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"
import Button from "../action/Button"
import { Grid } from "../layout"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"
interface Props<EntityType> {
  children?: React.ReactNode
  generator: (entity: EntityType) => JSX.Element
  route: (pageSize: number, pageNumber: number) => string
}

export function Gallery<EntityType>(props: Props<EntityType>) {
  const { theme } = useUIContext()
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setPageNumber(pageNumber + 1),
    onSwipedRight: () => setPageNumber(pageNumber - 1),
    trackMouse: true,
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
    props.route(pageSize, pageNumber),
  )

  if (error && error.statusCode == 404) {
    setPageNumber(1)
  }

  useEffect(() => {
    const resizeListener = function (this: Window) {
      const displayableEntities = Math.floor(this.innerWidth / 275)
      setPageSize(displayableEntities == 0 ? 1 : displayableEntities)
      setPageNumber(1)
    }
    window.addEventListener("resize", resizeListener)
    window.dispatchEvent(new UIEvent("resize"))
    return () => {
      window.removeEventListener("resize", resizeListener)
    }
  }, [setPageSize, setPageNumber])

  return (
    <div className={styles.gallery} {...swipeHandlers}>
      <Grid align="center">
        {entities &&
          entities.map((currentEntity) => props.generator(currentEntity))}
      </Grid>

      <div className={styles.previous}>
        <Button
          context="neutral"
          display="inline-block"
          action={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <Icon>{IconName.chevronLeft}</Icon>
        </Button>
      </div>
      <div className={styles.forward}>
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
