import Link from "next/link"
import Button, { Props } from "./Button"

interface AnchorProps extends Omit<Props, "type"> {
  href: string
}

export default function Anchor(props: AnchorProps) {
  return (
    <Link href={props.href}>
      <Button {...props}>{props.children}</Button>
    </Link>
  )
}
