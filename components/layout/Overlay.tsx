import { useKey, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Layout.module.scss"

interface Props {
  context: "opaque" | "translucent"
  children?: React.ReactNode
  dismiss?: () => void
}

/**
 * Fills the whole screen centering its children both horizontally and vertically.
 */
export function Overlay(props: Props) {
  const { theme } = useUIContext()
  const dismiss = props.dismiss ?? (() => {})

  useKey("Escape", dismiss)

  return (
    <div
      className={styles.overlay}
      style={theme.layout.overlay[props.context].css()}
    >
      {props.children}
    </div>
  )
}
