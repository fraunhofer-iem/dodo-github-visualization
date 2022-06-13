import { reverse, sortBy, uniqBy } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { getKpiApiRoute, getKpiDataApiRoute, Kpi } from "../../lib/api"
import { CSSProperties, dateToString, IconNames } from "../../lib/frontend"
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
  const { atA, setAtA, atB, setAtB } = props
  const [A, setA] = useState<number>(0)
  const [B, setB] = useState<number>(0)

  const leftPickerControl = useRef<(dates: Date[] | undefined) => void>()
  const setLeftPickerControl = useCallback(
    (control: (dates: Date[] | undefined) => void) => {
      leftPickerControl.current = control
    },
    [],
  )

  const rightPickerControl = useRef<(dates: Date[] | undefined) => void>()
  const setRightPickerControl = useCallback(
    (control: (dates: Date[] | undefined) => void) => {
      rightPickerControl.current = control
    },
    [],
  )

  const { data: kpi } = useSWR<Kpi>(getKpiApiRoute(props.kpiId))
  const { data: history } = useSWR<{ [timestamp: string]: number }>(
    getKpiDataApiRoute({ kpiId: props.kpiId, history: true }),
  )

  useEffect(() => {
    if (history) {
      let dates = Object.keys(history).map((timestamp) => {
        const date = new Date(timestamp)
        return new Date(dateToString(date, false))
      })
      dates = reverse(sortBy(uniqBy(dates, (date: Date) => date.toISOString())))

      if (leftPickerControl.current) {
        leftPickerControl.current(dates)
      }
      if (rightPickerControl.current) {
        rightPickerControl.current(dates)
      }
      if (setAtA && !atA) setAtA(dates[1])
      if (setAtB && !atB) setAtB(dates[0])
    }
  }, [history])

  return kpi && history ? (
    <div className={styles.comparator}>
      <div className={styles.kpiSelector}>
        <Selector
          at={atA}
          kpiId={props.kpiId}
          owner={props.repoId.owner}
          name={props.repoId.name}
          setValue={setA}
          setAt={setAtA}
          pickerControl={setLeftPickerControl}
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
          at={atB}
          owner={props.repoId.owner}
          name={props.repoId.name}
          setValue={setB}
          setAt={setAtB}
          pickerControl={setRightPickerControl}
        />
        {kpi?.name} {B.toFixed(2)}%
      </div>
    </div>
  ) : (
    <></>
  )
}
