import styles from "../../styles/components/Select.module.scss"
import { useUIContext } from "../../lib/uiContext"

export interface Option {
  id: number
  name: string
  selected?: boolean
}

interface Props {
  id?: string
  options: Option[]
  multiple: boolean
  width?: string
  changeHandler: (selection: number | number[]) => void
}

export function Select(props: Props) {
  const { theme } = useUIContext()
  const { id, options, multiple, width, changeHandler } = props

  const css = theme.form.input.css()
  css["width"] = width ?? ""

  let defaultValue: string[] | string
  if (multiple) {
    const selection: string[] = []
    options.forEach((option) => {
      if (option.selected) {
        selection.push(`${option.id}`)
      }
    })
    defaultValue = selection
  } else {
    let selection = ""
    options.forEach((option) => {
      if (option.selected) {
        selection = `${option.id}`
      }
    })
    defaultValue = selection
  }

  return (
    <select
      id={id}
      multiple={multiple}
      onChange={(e) => {
        const selection = Object.values(e.target.selectedOptions).map(
          (option) => parseInt(option.value),
        )
        changeHandler(multiple ? selection : selection[0])
      }}
      className={styles.formSelect}
      style={css}
      defaultValue={defaultValue}
    >
      {options.map((option) => (
        <option value={option.id} key={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  )
}
