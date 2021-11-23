import { useRouter } from "next/router"
import React from "react"
import { Crumb, IconNames } from "../../lib/frontend"
import styles from "../../styles/components/Layout.module.scss"
import { Button } from "../action"
import { Icon } from "../rating"

interface Props {
  crumbs: Crumb[]
}

export function Breadcrumbs(props: Props) {
  const router = useRouter()
  const { crumbs } = props

  return (
    <div className={styles.breadcrumbs}>
      You are here:
      {crumbs.map((currentCrumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon>{IconNames.chevronRight}</Icon>}
          <Button
            key={i}
            type="button"
            context="anchor"
            display="inline-block"
            action={() => router.push(currentCrumb.route)}
          >
            {currentCrumb.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  )
}
