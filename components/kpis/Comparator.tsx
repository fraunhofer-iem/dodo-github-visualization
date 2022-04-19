import { useState } from "react"
import { CSSProperties, IconNames, KpiIds, KpiNames } from "../../lib/frontend"
import styles from "../../styles/components/Content.module.scss"
import { Icon } from "../rating"
import { Selector } from "./Selector"

interface Props {
  repoId: { owner: string; name?: string }
  kpiId: KpiIds
}

export function Comparator(props: Props) {
  const [A, setA] = useState<number>(0)
  const [B, setB] = useState<number>(0)

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
          since={
            new Date(
              since.getUTCFullYear(),
              since.getUTCMonth() - 3,
              since.getUTCDate(),
            )
          }
          to={since}
          kpiId={props.kpiId}
          owner={props.repoId.owner}
          name={props.repoId.name}
          setValue={setA}
        />
        {KpiNames[props.kpiId]} {A}%
      </div>
      <div className={styles.kpiComparison}>
        <Icon styles={new CSSProperties({ fontSize: "32pt" })}>
          {IconNames.compareArrows}
        </Icon>
        {B - A > 0 ? "+" : ""}
        {B - A}
      </div>
      <div className={styles.kpiSelector}>
        <Selector
          kpiId={props.kpiId}
          since={since}
          to={to}
          owner={props.repoId.owner}
          name={props.repoId.name}
          setValue={setB}
        />
        {KpiNames[props.kpiId]} {B}%
      </div>
    </div>
  )
}
