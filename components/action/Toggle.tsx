import { useState } from "react"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Toggle.module.scss"

interface Props {
  active: boolean
  action: () => void
}

export function Toggle(props: Props) {
  const { theme } = useUIContext()
  const [active, setActive] = useState<boolean>(props.active)

  return (
    <div
      onClick={() => {
        setActive(!active)
        props.action()
      }}
      className={styles.toggle}
      style={
        active
          ? theme.form.toggle["frame:active"].css()
          : theme.form.toggle.frame.css()
      }
    >
      <div
        className={`${styles.slider} ${active ? styles.active : ""}`}
        style={theme.form.toggle.slider.css()}
      />
    </div>
  )
}
