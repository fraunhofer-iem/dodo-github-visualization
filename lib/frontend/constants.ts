import { Color } from "."

export const colors = {
  // small collection of HTML colors
  white: new Color(255, 255, 255),
  ghostWhite: new Color(248, 248, 255),
  black: new Color(0, 0, 0),
  red: new Color(255, 0, 0),
  blue: new Color(0, 0, 255),
  green: new Color(0, 255, 0),
  lime: new Color(191, 255, 0),
  yellow: new Color(255, 255, 0),
  orange: new Color(255, 165, 0),
  gold: new Color(255, 215, 0),
  indigo: new Color(75, 0, 130),
  purple: new Color(128, 0, 128),
  fuchsia: new Color(255, 0, 255),
  cyan: new Color(0, 255, 255),
  turquoise: new Color(64, 224, 208),
  steelBlue: new Color(70, 130, 180),
  navy: new Color(0, 0, 128),
  brown: new Color(165, 42, 42),
  maroon: new Color(128, 0, 0),
  silver: new Color(192, 192, 192),
  gray: new Color(128, 128, 128),
  transparent: new Color(0, 0, 0, 0),
  // IEM specific colors
  fraunhoferGreen: new Color(23, 156, 125),
  hniBlue: new Color(0, 70, 150),
}

const colorScheme = [
  colors.steelBlue,
  colors.orange,
  colors.maroon,
  colors.turquoise,
  colors.green,
  colors.yellow,
  colors.purple,
  colors.fuchsia,
  colors.brown,
  colors.silver,
]

export function ColorScheme(i: number) {
  return colorScheme[i % colorScheme.length]
}

export enum TrendDirection {
  DOWN = "down",
  NEUTRAL = "neutral",
  UP = "up",
}
