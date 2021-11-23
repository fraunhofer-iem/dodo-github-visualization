import deepEqual from "deep-equal"

/**
 * Function that deeply compares two props Objects of type P.
 *
 * Used in order to prevent unnecessary rerenders of Cytoscape and ChartJS.
 */
export function compareProps<P>(prev: P | null | undefined, curr: P) {
  if (!prev) {
    return false
  }
  return deepEqual(prev, curr, { strict: true })
}
