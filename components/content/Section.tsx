import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Content.module.scss"

interface Props {
  width?: string
  padding?: string
  children?: React.ReactNode
}

export function Section(props: Props) {
  const { theme } = useUIContext()

  const css = theme.content.section.css()
  if (props.width) {
    css.width = props.width
  }
  if (props.padding) {
    css.padding = props.padding
  }

  return (
    <div className={styles.section} style={css}>
      {props.children}
    </div>
  )
}
