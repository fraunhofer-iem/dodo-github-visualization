import { ActiveElement, Chart } from "chart.js"
import { Ring } from "."

export const getCurrentRing = (
  elements: ActiveElement[],
  chart: Chart<"doughnut">,
  rings: Ring[],
): Ring | undefined => {
  // ChartJS seems to think that it is possible to click multiple
  // entities at once. In this case, it is not. But we play along.
  for (const currentElement of elements) {
    if (currentElement.index == 1) {
      // Rings are constructed as two elements.
      // The first element is invisible to the user and thus ignored.
      const ring = +chart.getDatasetMeta(currentElement.datasetIndex).label
      return rings[ring]
    }
  }
  return undefined
}
