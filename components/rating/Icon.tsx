import { IconName } from "./IconName"

interface Props {
  style?: "outlined" | "rounded" | "filled" | "sharp" | undefined
  children: IconName
}

export default function Icon(props: Props) {
  let style: string = props.style ?? ""
  if (style === "filled") {
    style = ""
  }

  const className = style ? `material-icons-${style}` : "material-icons"

  return <span className={className}>{props.children.toString()}</span>
}
