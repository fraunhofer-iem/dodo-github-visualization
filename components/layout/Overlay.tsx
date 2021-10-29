import styles from "../../styles/components/Layout.module.scss"
import { useUIContext } from "../../lib/uiContext"
import { useKey } from "../../lib/uiHooks"

interface Props {
  context: "opaque" | "translucent"
  children?: React.ReactNode
  dismiss?: () => void
}

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
