import styles from "../../styles/components/Layout.module.scss"

interface Props {
    children?: React.ReactNode
}

export default function Grid(props: Props) {
    return <div className={styles.grid}>{props.children}</div>
}