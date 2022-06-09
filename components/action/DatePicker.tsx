import DateSelector from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "."
import { dateToString } from "../../lib/frontend"

interface Props {
  at: Date
  setAt: (at: Date) => void
}

export function DatePicker(props: Props) {
  const { at, setAt } = props

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
        customInput={
          <div>
            <Button context={"light"} width="100%">
              {dateToString(at)}
            </Button>
          </div>
        }
      />
    </div>
  )
}
