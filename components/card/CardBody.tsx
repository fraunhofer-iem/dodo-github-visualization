import styles from "../../styles/components/Card.module.scss"

interface Props {
    children: React.ReactNode
}

export default function CardBody(props: Props) {
    return <div className={styles.cardBody}>{props.children}</div>
}
