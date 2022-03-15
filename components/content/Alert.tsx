import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Alert.module.scss"
import { Button } from "../action"

interface Props {
  children?: React.ReactNode
  successMessage?: string
  errorMessage?: string
}

export default function Alert(props: Props) {
  const { theme } = useUIContext()

  const dismissButton = (
    <Button type="button" context={"neutral"} action={() => {}}>
      &times;
    </Button>
  )

  if (props.errorMessage) {
    return (
      <div className={styles.alert} style={theme.alert.error.css()}>
        {props.errorMessage}
      </div>
    )
  } else if (props.successMessage) {
    return (
      <div className={styles.alert} style={theme.alert.success.css()}>
        {props.successMessage}
      </div>
    )
  }
  return <></>
}
