import { Color } from "."

export const Colors = {
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
  Colors.steelBlue,
  Colors.orange,
  Colors.maroon,
  Colors.turquoise,
  Colors.green,
  Colors.yellow,
  Colors.purple,
  Colors.fuchsia,
  Colors.brown,
  Colors.silver,
]

export function ColorScheme(i: number) {
  return colorScheme[i % colorScheme.length]
}

export enum TrendDirections {
  DOWN = "down",
  NEUTRAL = "neutral",
  UP = "up",
}

export enum Ordering {
  ASCENDING = 1,
  DESCENDING = 0,
  GIVEN = 2,
}

export enum SidebarStates {
  DEPEND_ON_SCREEN,
  REQUESTED_BY_USER,
}

export enum TableContexts {
  NEUTRAL = "neutral",
  STRIPED = "striped",
}

export function dateToString(date: Date, includeDayName: boolean = true) {
  const indexToDay: { [key: number]: string } = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  }

  return `${includeDayName ? `${indexToDay[date.getUTCDay()]}, ` : ""}${
    date.toISOString().split("T")[0]
  }`
}

export enum KpiIds {
  ORGANIZATION_HEALTH = "orgHealth",
  REPOSITORY_HEALTH = "repoHealth",
}

export const KpiNames: { [key: string]: string } = {
  orgHealth: "Organization Health",
  repoHealth: "Repository Health",
  devSpread: "Developer Spread",
  releaseCycle: "Release Cycle",
  mttr: "Mean Time to Resolution",
  coc: "Coupling of Components",
}

export const KpiAbbreviations = {
  orgHealth: "OH",
  repoHealth: "RH",
}
