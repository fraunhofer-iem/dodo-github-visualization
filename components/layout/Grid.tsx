import styles from "../../styles/components/Layout.module.scss"

interface Props {
  children?: React.ReactNode
  width?: string
  align?: string
}

export function Grid(props: Props) {
  return (
    <div
      className={styles.grid}
      style={{ width: props.width, justifyContent: props.align }}
    >
      {props.children}
    </div>
  )
}
