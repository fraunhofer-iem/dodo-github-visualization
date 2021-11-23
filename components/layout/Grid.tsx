import styles from "../../styles/components/Layout.module.scss"

interface Props {
  align?: "left" | "center" | "right"
  children?: React.ReactNode
}

/**
 * Simple Grid layout using `display: flex` and `flex-direction: flex-wrap`.
 */
export function Grid(props: Props) {
  return (
    <div className={styles.grid} style={{ justifyContent: props.align }}>
      {props.children}
    </div>
  )
}
