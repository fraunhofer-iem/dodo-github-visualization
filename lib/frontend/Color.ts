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
