import styles from "../../styles/components/Layout.module.scss"
import { useUIContext } from "../../util/uiContext"
import { useKey } from "../../util/uiHooks"

interface Props {
  context: "opaque" | "translucent"
  children?: React.ReactNode
  dismiss?: () => void
}

export default function Overlay(props: Props) {
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
