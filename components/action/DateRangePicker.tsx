import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "."
import { IconNames } from "../../lib/frontend"
import styles from "../../styles/components/Content.module.scss"
import { Icon } from "../rating"

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
      <div>
        <DatePicker
          maxDate={new Date()}
          selected={since}
          onChange={(date) => {
            if (date) {
              setSince(date)
            }
          }}
          customInput={
            <div>
              <Button context={"light"} width="150px">
                {since.toLocaleString("en-IN", {
                  weekday: "short",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </Button>
            </div>
          }
        />
      </div>
      <Icon>{IconNames.calendarToday}</Icon>
      <div>
        <DatePicker
          minDate={since}
          maxDate={new Date()}
          selected={to}
          onChange={(date) => {
            if (date) {
              setTo(date)
            }
          }}
          customInput={
            <div>
              <Button context={"light"} width="150px">
                {to.toLocaleString("en-IN", {
                  weekday: "short",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}
