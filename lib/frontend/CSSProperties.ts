import { Color } from "."

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
