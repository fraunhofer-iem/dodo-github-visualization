import { ChangeEvent } from "react"
import { Colors, CSSProperties, IconNames } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Input.module.scss"
import { Icon } from "../rating"
import { Label } from "./Label"

interface Props {
  id?: string
  label?: string
  placeholder?: string
  value?: string
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void
  width?: string
  icon?: IconNames
}

export function Input(props: Props) {
  const { theme } = useUIContext()
  const css = theme.form.input.css()
  if (props.width) {
    css.width = props.width
  }
  if (props.icon) {
    css.textIndent = "20px"
  }

  return (
    <div style={{ position: "relative" }}>
      {props.label && props.id && <Label for={props.id}>{props.label}</Label>}
      <input
        id={props.id}
        type={"text"}
        onChange={props.changeHandler}
        placeholder={props.placeholder}
        title={props.placeholder}
        value={props.value}
        className={styles.formControl}
        style={css}
      />
      {props.icon && (
        <Icon
          styles={
            new CSSProperties({
              position: "absolute",
              left: "10px",
              top: "10px",
              display: "block",
            })
          }
          color={Colors.gray}
        >
          {props.icon}
        </Icon>
      )}
    </div>
  )
}
