import styles from "../../styles/components/Card.module.scss"

interface Props {
    children: React.ReactNode
}

export function CardBody(props: Props) {
    return <div className={styles.cardBody}>{props.children}</div>
}
