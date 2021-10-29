import cy = require("cytoscape")

declare global {
  namespace cytoscape {
    interface NodeSingular {
      expand: () => void
      collapse: () => void
    }
  }
}
