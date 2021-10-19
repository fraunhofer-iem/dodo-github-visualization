import styles from "../../styles/components/Card.module.scss"

interface Props {
    src: string
    width?: number
    height?: number
    alt?: string
}

export default function CardImage(props: Props) {
    return (
        <div className={styles.cardImage}>
            <img
                src={props.src}
                width={props.width}
                height={props.height}
                alt={props.alt}
            />
        </div>
    )
}
