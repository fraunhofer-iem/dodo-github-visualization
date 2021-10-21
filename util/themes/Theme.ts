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
  cytoscape?: {
    canvas: cytoscape.Stylesheet[]
  }
}

export class CSSProperties {
  properties: { [property: string]: Color | string }

  constructor(properties: { [property: string]: Color | string }) {
    this.properties = properties
  }

  css = () => {
    let styles: { [property: string]: string } = {}
    Object.entries(this.properties).forEach((entry) => {
      styles[entry[0]] =
        entry[1] instanceof Color
          ? (entry[1] as Color).rgba()
          : (entry[1] as string)
    })
    return styles
  }
}

type ContextComponent = {
  [context: string]: CSSProperties
}

export class Color {
  red: number
  green: number
  blue: number
  alpha?: number

  constructor(red: number, green: number, blue: number, alpha: number = 1) {
    this.red = red > 255 ? 255 : red < 0 ? 0 : red
    this.green = green > 255 ? 255 : green < 0 ? 0 : green
    this.blue = blue > 255 ? 255 : blue < 0 ? 0 : blue
    this.alpha = alpha >= 0 && alpha <= 1 ? alpha : 1
  }

  rgba = (): string => {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
  }

  brighten = (g: number = 0.1): Color => {
    if (g < 0 || g > 1) {
      g = 0.1
    }
    const gamma = Math.floor(255 * g)
    return new Color(
      this.red + gamma,
      this.green + gamma,
      this.blue + gamma,
      this.alpha,
    )
  }

  darken = (g: number = 0.1): Color => {
    if (g < 0 || g > 1) {
      g = 0.1
    }
    const gamma = Math.floor(255 * g)
    return new Color(
      this.red - gamma,
      this.green - gamma,
      this.blue - gamma,
      this.alpha,
    )
  }

  alph = (a: number = 0.9): Color => {
    if (a < 0 || a > 1) {
      a = 0.9
    }

    return new Color(this.red, this.green, this.blue, a)
  }
}

// small collection of HTML colors
export const white = new Color(255, 255, 255)
export const ghostWhite = new Color(248, 248, 255)
export const black = new Color(0, 0, 0)
export const red = new Color(255, 0, 0)
export const blue = new Color(0, 0, 255)
export const green = new Color(0, 255, 0)
export const lime = new Color(191, 255, 0)
export const yellow = new Color(255, 255, 0)
export const orange = new Color(255, 165, 0)
export const gold = new Color(255, 215, 0)
export const indigo = new Color(75, 0, 130)
export const purple = new Color(128, 0, 128)
export const cyan = new Color(0, 255, 255)
export const turquoise = new Color(64, 224, 208)
export const steelBlue = new Color(70, 130, 180)
export const navy = new Color(0, 0, 128)
export const brown = new Color(165, 42, 42)
export const maroon = new Color(128, 0, 0)
export const silver = new Color(192, 192, 192)
export const gray = new Color(128, 128, 128)
export const transparent = new Color(0, 0, 0, 0)

// IEM specific colors
export const fraunhoferGreen = new Color(23, 156, 125)
export const hniBlue = new Color(0, 70, 150)
