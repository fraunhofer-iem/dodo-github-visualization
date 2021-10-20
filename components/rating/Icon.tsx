interface Props {
  children: string
}

export default function Icon(props: Props) {
  return <span className="material-icons">{props.children}</span>
}
