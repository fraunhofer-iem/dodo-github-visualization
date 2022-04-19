import { useState } from "react"
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
      since.toISOString().split("T")[0],
      to.toISOString().split("T")[0],
    ),
  )

  if (data && data.value) {
    props.setValue(data.value)
  }

  return (
    <DateRangePicker since={since} setSince={setSince} to={to} setTo={setTo} />
  )
}
