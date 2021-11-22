import { Icon } from "."
import { IconNames } from "../../lib/frontend"

interface Props {
  children?: string
}

export default function Rating(props: Props) {
  const rating = parseFloat(props.children ?? "25")

  return (
    <>
      {[5, 10, 15, 20, 25].map((limit) => (
        <Icon key={limit}>
          {rating - limit >= 0
            ? IconNames.star
            : rating - limit > -5
            ? IconNames.starHalf
            : IconNames.starBorder}
        </Icon>
      ))}
      {rating}
    </>
  )
}
