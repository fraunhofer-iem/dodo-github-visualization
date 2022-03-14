import styles from "../../styles/components/Layout.module.scss"

interface Props {
  align?: "left" | "center" | "right"
  grow?: boolean
  children?: React.ReactNode
}

/**
 * Simple Grid layout using `display: flex` and `flex-direction: flex-wrap`.
 */
export function Grid(props: Props) {
  return (
    <div
      className={props.grow ? styles.gridGrow : styles.grid}
      style={{ justifyContent: props.align }}
    >
      {props.children}
    </div>
  )
}
