import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Spinner.module.scss"
interface Props {
  size?: string
}

/**
 * Simple spinning wheel which is animated using CSS3.
 *
 * Used by components while they wait on API responses.
 */
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
