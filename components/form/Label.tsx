import { useUIContext } from "../../lib/hooks"

interface Props {
  for: string
  children?: React.ReactNode
}

export function Label(props: Props) {
  const { theme } = useUIContext()

  return (
    <label htmlFor={props.for} style={theme.form.label.css()}>
      {props.children}
    </label>
  )
}
