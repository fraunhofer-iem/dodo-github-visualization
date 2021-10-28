import { useUIContext } from "../../lib/uiContext"

interface Props {
  for: string
  children?: React.ReactNode
}

export default function Label(props: Props) {
  const { theme } = useUIContext()

  return (
    <label htmlFor={props.for} style={theme.form.label.css()}>
      {props.children}
    </label>
  )
}
