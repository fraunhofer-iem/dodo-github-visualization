import { register } from "./nodeExpansion"

export const nodeExpansion: cytoscape.Ext = register

declare global {
  namespace cytoscape {
    interface NodeSingular {
      expand: () => void
      collapse: () => void
      expanded: () => boolean
    }

    interface Core {
      nodeExpansion: () => void
    }
  }
}
