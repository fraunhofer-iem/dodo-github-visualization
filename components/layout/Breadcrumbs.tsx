import { useRouter } from "next/router"
import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Layout.module.scss"
import Button from "../action/Button"
import Icon from "../rating/Icon"
import { IconName } from "../rating/IconName"

export type Crumb = {
  name: string
  route: string
}

interface Props {
  crumbs: Crumb[]
}

export function Breadcrumbs(props: Props) {
  const { theme } = useUIContext()
  const router = useRouter()
  const { crumbs } = props

  return (
    <div className={styles.breadcrumbs} style={theme.layout.breadcrumbs.css()}>
      You are here:
      {crumbs.map((currentCrumb, i) => (
        <>
          {i > 0 && <Icon>{IconName.chevronRight}</Icon>}
          <Button
            type="button"
            context="anchor"
            display="inline-block"
            action={() => router.push(currentCrumb.route)}
          >
            {currentCrumb.name}
          </Button>
        </>
      ))}
    </div>
  )
}
