import styles from "../../styles/components/Card.module.scss"
import { useUIContext } from "../../util/uiContext"

interface Props {
  children: string
}

export default function CardSubTitle(props: Props) {
  const { theme } = useUIContext()

  return (
    <h5 className={styles.cardSubTitle} style={theme.card.subTitle.css()}>
      {props.children}
    </h5>
  )
}
