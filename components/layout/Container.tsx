import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Layout.module.scss"

interface Props {
  children?: React.ReactNode
  width?: string
  height?: string
}

export function Container(props: Props) {
  const { theme } = useUIContext()
  const css = theme.layout.container.css()
  css.width = props.width ?? css.width
  css.height = props.height ?? css.height

  return (
    <div className={styles.container} style={css}>
      {props.children}
    </div>
  )
}
