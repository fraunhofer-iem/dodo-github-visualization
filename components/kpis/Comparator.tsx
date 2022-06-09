import { useState } from "react"
import useSWR from "swr"
import { getKpiApiRoute, Kpi } from "../../lib/api"
import { CSSProperties, IconNames } from "../../lib/frontend"
import styles from "../../styles/components/Content.module.scss"
import { Icon } from "../rating"
import { Selector } from "./Selector"

interface Props {
  repoId: { owner: string; name?: string }
  kpiId: string
  atA?: Date
  atB?: Date
  setAtA?: (at: Date) => void
  setAtB?: (at: Date) => void
}

export function Comparator(props: Props) {
  const [A, setA] = useState<number>(0)
  const [B, setB] = useState<number>(0)

  const { data: kpi } = useSWR<Kpi>(getKpiApiRoute(props.kpiId))

  const since = new Date(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth() - 3,
    new Date().getUTCDate(),
  )
  const to = new Date()

  return (
    <div className={styles.comparator}>
      <div className={styles.kpiSelector}>
        <Selector
          at={props.atA ? props.atA : since}
          kpiId={props.kpiId}
          owner={props.repoId.owner}
          name={props.repoId.name}
          setValue={setA}
          setAt={props.setAtA}
        />
        {kpi?.name} {A.toFixed(2)}%
      </div>
      <div className={styles.kpiComparison}>
        <Icon styles={new CSSProperties({ fontSize: "32pt" })}>
          {IconNames.compareArrows}
        </Icon>
        {B - A > 0 ? "+" : ""}
        {(B - A).toFixed(2)}
      </div>
      <div className={styles.kpiSelector}>
        <Selector
          kpiId={props.kpiId}
          at={props.atB ? props.atB : to}
          owner={props.repoId.owner}
          name={props.repoId.name}
          setValue={setB}
          setAt={props.setAtB}
        />
        {kpi?.name} {B.toFixed(2)}%
      </div>
    </div>
  )
}
