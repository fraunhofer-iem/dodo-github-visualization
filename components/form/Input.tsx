import { ChangeEvent } from "react"
import styles from "../../styles/components/Input.module.scss"
import { useUIContext } from "../../lib/uiContext"
import Label from "./Label"

interface Props {
  id?: string
  label?: string
  placeholder?: string
  value?: string
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Input(props: Props) {
  const { theme } = useUIContext()

  return (
    <>
      {props.label && props.id && <Label for={props.id}>{props.label}</Label>}
      <input
        id={props.id}
        type={"text"}
        onChange={props.changeHandler}
        placeholder={props.placeholder}
        title={props.placeholder}
        value={props.value}
        className={styles.formControl}
        style={theme.form.input.css()}
      />
    </>
  )
}
