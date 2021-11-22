import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Card.module.scss"
import { Button } from "../action"

interface Props {
  dismiss: () => void
}

export function CardDismissal(props: Props) {
  const { theme } = useUIContext()
  return (
    <div className={styles.cardDismissal} style={theme.card.dismissal.css()}>
      <Button type="button" context={"neutral"} action={() => props.dismiss()}>
        &times;
      </Button>
    </div>
  )
}
