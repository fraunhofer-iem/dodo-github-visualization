import useSWR from "swr"
import usePagination from "../../lib/api/usePagination"
import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"
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
  const {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    sortInformation,
    setSortInformation,
  } = usePagination("name", 1)
  const { data: entities, error: error } = useSWR<EntityType[]>(
    props.route(pageSize, pageNumber),
  )

  return (
    <div className={styles.gallery}>
      <Grid align="center">
        {entities &&
          entities.map((currentEntity) => props.generator(currentEntity))}
      </Grid>

      <div className={styles.previous}>
        <Icon>{IconName.chevronLeft}</Icon>
      </div>
      <div className={styles.forward}>
        <Icon>{IconName.chevronRight}</Icon>
      </div>
    </div>
  )
}
