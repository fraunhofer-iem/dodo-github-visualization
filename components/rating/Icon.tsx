import { Color, CSSProperties } from "../../lib/themes/Theme"
import { IconName } from "./IconName"

interface Props {
  style?: "outlined" | "rounded" | "filled" | "sharp" | undefined
  color?: Color
  styles?: CSSProperties
  children: IconName
}

export default function Icon(props: Props) {
  let style: string = props.style ?? ""
  if (style === "filled") {
    style = ""
  }

  const className = style ? `material-icons-${style}` : "material-icons"

  return (
    <span
      className={className}
      style={{
        verticalAlign: "middle",
        color: props.color?.rgba(),
        ...props.styles?.css(),
      }}
    >
      {props.children.toString()}
    </span>
  )
}
