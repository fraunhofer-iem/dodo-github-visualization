import { useState } from "react"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Toggle.module.scss"

interface Props {
  active: boolean
  action: () => void
}

export default function Toggle(props: Props) {
  const { theme } = useUIContext()
  const [active, setActive] = useState<boolean>(props.active)

  return (
    <div
      className={styles.toggle}
      style={
        active
          ? theme.form.toggle["frame:active"].css()
          : theme.form.toggle.frame.css()
      }
    >
      <div
        onClick={() => {
          setActive(!active)
          props.action()
        }}
        className={`${styles.slider} ${active ? styles.active : ""}`}
        style={theme.form.toggle.slider.css()}
      />
    </div>
  )
}
