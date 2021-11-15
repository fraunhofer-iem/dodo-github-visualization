import { useUIContext } from "../../lib/uiContext"
import styles from "../../styles/components/Content.module.scss"

interface Props {
  children?: React.ReactNode
}

export function Section(props: Props) {
  const { theme } = useUIContext()

  return (
    <div className={styles.section} style={theme.content.section.css()}>
      {props.children}
    </div>
  )
}
