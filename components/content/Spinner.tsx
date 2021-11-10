import { colors } from "../../lib/themes/Theme"
import styles from "../../styles/components/Spinner.module.scss"
interface Props {
  size?: string
}

export function Spinner(props: Props) {
  const size = props.size ?? "500px"
  return (
    <div
      className={styles.spinner}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderColor: colors.black.rgba(),
        borderTopColor: colors.transparent.rgba(),
      }}
    />
  )
}
