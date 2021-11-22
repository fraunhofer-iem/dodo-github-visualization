import styles from "../../styles/components/Content.module.scss"

interface Props {
  children?: string
}

export function SectionTitle(props: Props) {
  return <h6 className={styles.sectionTitle}>{props.children}</h6>
}
