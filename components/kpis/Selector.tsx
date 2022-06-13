import { useEffect, useState } from "react"
import useSWR from "swr"
import { getKpiDataApiRoute, Kpi } from "../../lib/api"
import { DatePicker } from "../action"

interface Props {
  at?: Date
  owner: string
  name?: string
  kpiId: string
  setValue: (value: number) => void
  setAt?: (at: Date) => void
  pickerControl: (control: (dates: Date[] | undefined) => void) => void
}

export function Selector(props: Props) {
  const { setValue, at, setAt } = props
  const [date, setDate] = useState<Date | undefined>(at)

  const { data } = useSWR<Kpi>(
    getKpiDataApiRoute({ kpiId: props.kpiId, at: date ?? new Date() }),
  )

  useEffect(() => {
    if (data && data.value) {
      setValue(data.value)
    }
    if (setAt && date) {
      setAt(date)
    }
  }, [data])

  return (
    <DatePicker at={at} setAt={setDate} pickerControl={props.pickerControl} />
  )
}
