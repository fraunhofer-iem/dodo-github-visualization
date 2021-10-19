import styles from "../../styles/components/Card.module.scss"
import { useUIContext } from "../../util/uiContext"
// import Button from "../action/Button"

interface Props {
  dismiss: () => void
}

export default function CardDismissal(props: Props) {
  const { theme } = useUIContext()
  return (
    <div className={styles.cardDismissal} style={theme.card.dismissal.css()}>
      {/* <Button
                type="button"
                context={"neutral"}
                action={() => props.dismiss()}
            >
                &times;
            </Button> */}
    </div>
  )
}
