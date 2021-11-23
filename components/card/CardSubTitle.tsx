import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Card.module.scss"

interface Props {
  children: string
}

export function CardSubTitle(props: Props) {
  const { theme } = useUIContext()

  return (
    <h5 className={styles.cardSubTitle} style={theme.card.subTitle.css()}>
      {props.children}
    </h5>
  )
}
