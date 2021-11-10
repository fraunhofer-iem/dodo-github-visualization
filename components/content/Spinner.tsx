import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Spinner.module.scss"
interface Props {
  size?: string
}

export function Spinner(props: Props) {
  const { theme } = useUIContext()
  const size = props.size ?? "500px"

  return (
    <div
      className={styles.spinner}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        ...theme.content.spinner.css(),
      }}
    />
  )
}
