import { useEffect, useState } from "react"
import useSWR from "swr"
import { getKpiApiRoute, Kpi } from "../../lib/api"
import { DateRangePicker } from "../action"

interface Props {
  since: Date
  to: Date
  owner: string
  name?: string
  kpiId: string
  setValue: (value: number) => void
  setRange?: (since: Date, to: Date) => void
}

export function Selector(props: Props) {
  const [since, setSince] = useState<Date>(
    props.since ??
      new Date(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth() - 3,
        new Date().getUTCDate(),
      ),
  )
  const [to, setTo] = useState<Date>(props.to)

  const { data } = useSWR<Kpi>(
    getKpiApiRoute(
      { owner: props.owner, name: props.name },
      props.kpiId,
      since,
      to,
    ),
  )

  useEffect(() => {
    if (data && data.value) {
      props.setValue(data.value)
    }
    if (props.setRange) {
      props.setRange(since, to)
    }
  }, [data])

  return (
    <DateRangePicker since={since} setSince={setSince} to={to} setTo={setTo} />
  )
}
