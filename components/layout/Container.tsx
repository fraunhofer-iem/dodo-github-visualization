import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Layout.module.scss"

interface Props {
  children?: React.ReactNode
}

/**
 * Main content container. Simulates the <body> element by
 * stretching to the window's height minus the bar's size.
 * This is necessary because it is not possible to add inline
 * styles to the body element in NextJS.
 */
export function Container(props: Props) {
  const { theme } = useUIContext()
  const css = theme.layout.container.css()

  return (
    <div className={styles.container} style={css}>
      {props.children}
    </div>
  )
}
