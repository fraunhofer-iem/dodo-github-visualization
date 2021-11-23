import styles from "../../styles/components/Table.module.scss"

interface Props {
  children?: React.ReactNode
}

export function TableHead(props: Props) {
  return (
    <thead className={styles.tableHead}>
      <tr>{props.children}</tr>
    </thead>
  )
}
