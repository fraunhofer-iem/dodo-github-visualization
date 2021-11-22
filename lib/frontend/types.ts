export type Ring = {
  /**
   * The value to be displayed
   * Expected to be a positive number less than or equal to 100
   */
  value: number
  /**
   * An optional tooltip that is displayed if this ring is hovered
   */
  tooltip?: React.ReactNode
  /**
   * An optional action to be performed if this ring is clicked
   */
  action?: () => void
}

export type Crumb = {
  name: string
  route: string
}

export type TableContext = "neutral" | "striped"
