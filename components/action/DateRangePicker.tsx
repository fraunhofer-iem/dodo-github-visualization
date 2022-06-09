import React from "react"
import { IconNames } from "../../lib/frontend"
import styles from "../../styles/components/Content.module.scss"
import { Icon } from "../rating"
import { DatePicker } from "./DatePicker"

interface Props {
  since: Date
  to: Date
  setSince: (since: Date) => void
  setTo: (to: Date) => void
}

export function DateRangePicker(props: Props) {
  const { since, to, setSince, setTo } = props
  return (
    <div className={styles.dateRangePicker}>
      <DatePicker at={since} setAt={setSince} />
      <Icon>{IconNames.calendarToday}</Icon>
      <DatePicker at={to} setAt={setTo} />
    </div>
  )
}
