import { IconName } from "../../components/rating/IconName"
import { Color, CSSProperties } from "../frontend"

export type Theme = {
  name: string
  layout: {
    overlay: {
      opaque: CSSProperties
      translucent: CSSProperties
    }
    bar: CSSProperties
    container: CSSProperties
    sidebar: CSSProperties
  }
  card: {
    card: CSSProperties
    title: CSSProperties
    subTitle: CSSProperties
    dismissal: CSSProperties
  }
  button: {
    primary: CSSProperties
    "primary:hover": CSSProperties
    neutral: CSSProperties
    "neutral:hover": CSSProperties
    anchor: CSSProperties
    "anchor:hover": CSSProperties
  }
  list: {
    list: CSSProperties
    listItem: CSSProperties
    listTitle: CSSProperties
  }
  table: {
    neutral: {
      table: CSSProperties
      row: CSSProperties
      headCell: CSSProperties
      dataCell: CSSProperties
    }
    striped: {
      table: CSSProperties
      row: CSSProperties
      headCell: CSSProperties
      dataCell: CSSProperties
    }
  }
  form: {
    label: CSSProperties
    input: CSSProperties
    select: CSSProperties
  }
  content: {
    trend: {
      icon: CSSProperties
    }
    section: CSSProperties
    spinner: CSSProperties
  }
  trends: {
    down: {
      color: Color
      icon: IconName
    }
    neutral: {
      color: Color
      icon: IconName
    }
    up: {
      color: Color
      icon: IconName
    }
  }
  cytoscape?: {
    canvas: cytoscape.Stylesheet[]
  }
}
