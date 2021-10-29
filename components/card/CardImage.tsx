import styles from "../../styles/components/Card.module.scss"
import Image from "next/image"
interface Props {
  src: string
  width?: number
  height?: number
  alt?: string
}

export function CardImage(props: Props) {
  return (
    <div className={styles.cardImage}>
      <Image
        src={props.src}
        width={props.width}
        height={props.height}
        alt={props.alt}
      />
    </div>
  )
}
