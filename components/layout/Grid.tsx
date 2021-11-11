import styles from "../../styles/components/Layout.module.scss"

interface Props {
  align?: "left" | "center" | "right"
  children?: React.ReactNode
}

export function Grid(props: Props) {
  return (
    <div className={styles.grid} style={{ justifyContent: props.align }}>
      {props.children}
    </div>
  )
}
