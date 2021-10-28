import styles from "../../styles/components/Card.module.scss"

interface Props {
    children?: React.ReactNode
}

export function CardAction(props: Props) {
    return <div className={styles.cardAction}>{props.children}</div>
}
