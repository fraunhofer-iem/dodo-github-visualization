import { useEffect, useState } from "react"
import useSWR from "swr"
import { getKpiDataApiRoute, Kpi } from "../../lib/api"
import { DatePicker } from "../action"

interface Props {
  at: Date
  owner: string
  name?: string
  kpiId: string
  setValue: (value: number) => void
  setAt?: (at: Date) => void
}

export function Selector(props: Props) {
  const { setValue, setAt } = props
  const [date, setDate] = useState<Date>(props.at)

  const { data } = useSWR<Kpi>(getKpiDataApiRoute(props.kpiId, date))

  useEffect(() => {
    if (data && data.value) {
      setValue(data.value)
    }
    if (setAt) {
      setAt(date)
    }
  }, [data])

  return <DatePicker at={date} setAt={setDate} />
}
