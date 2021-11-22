import styles from "../../styles/components/Table.module.scss"

interface Props {
  children?: React.ReactNode
}

export function TableBody(props: Props) {
  return <tbody className={styles.tableBody}>{props.children}</tbody>
}
