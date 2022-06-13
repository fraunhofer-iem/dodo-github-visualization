import { useEffect, useState } from "react"
import DateSelector from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "."
import { dateToString } from "../../lib/frontend"

interface Props {
  at?: Date
  setAt: (at: Date | undefined) => void
  pickerControl: (control: (dates: Date[] | undefined) => void) => void
}

export function DatePicker(props: Props) {
  const { at, setAt } = props
  const [dates, setDates] = useState<Date[] | undefined>(undefined)

  if (props.pickerControl) {
    props.pickerControl(setDates)
  }

  useEffect(() => {
    setAt(at)
  }, [at])

  return (
    <div style={{ width: "240px" }}>
      <DateSelector
        maxDate={new Date()}
        selected={at}
        onChange={(date) => {
          if (date) {
            setAt(date)
          }
        }}
        includeDates={dates}
        customInput={
          <div>
            <Button context={"light"} width="100%">
              {at && dateToString(at)}
            </Button>
          </div>
        }
      />
    </div>
  )
}
