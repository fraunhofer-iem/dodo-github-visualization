import Icon from "./Icon"

interface Props {
  children?: string
}

export default function Rating(props: Props) {
  const rating = parseFloat(props.children ?? "25")

  return (
    <>
      {[5, 10, 15, 20, 25].map((limit) => (
        <Icon>
          {rating - limit >= 0
            ? "star"
            : rating - limit > -5
            ? "star_half"
            : "star_border"}
        </Icon>
      ))}
      {rating}
    </>
  )
}
