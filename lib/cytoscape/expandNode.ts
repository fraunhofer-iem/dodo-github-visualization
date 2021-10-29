// registers the extension on a cytoscape lib ref
const register = function (cytoscape: any) {
  if (!cytoscape) {
    return
  } // can't register if cytoscape unspecified

  // register with cytoscape.js
  cytoscape("collection", "expand", function (this: cytoscape.Collection) {
    const node = this[0]
    if (node.isNode()) {
      if (node.outgoers().length) {
        node.data("expanded", true)
        node.style("shape", "ellipse")
        node.outgoers("edge").forEach((currentEdge: cytoscape.EdgeSingular) => {
          currentEdge.style("visibility", "visible")
          currentEdge.target().style("visibility", "visible")
        })
      }
    }
  })

  cytoscape("collection", "collapse", function (this: cytoscape.Collection) {
    const node = this[0]
    if (node.isNode()) {
      node.data("expanded", false)
      node.outgoers("edge").forEach((currentEdge: cytoscape.EdgeSingular) => {
        node.style("shape", "diamond")

        const childNode = currentEdge.target()
        childNode.style("visibility", "hidden")
        childNode.incomers("edge").forEach((currentEdge) => {
          const parentNode = currentEdge.source()
          if (!node.same(parentNode)) {
            if (parentNode.data("expanded")) {
              childNode.style("visibility", "visible")
            }
          }
        })

        currentEdge.style("visibility", "hidden")
        childNode.collapse()
      })
    }
  })
}

if (typeof cytoscape !== "undefined") {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape)
}

export const nodeExpansion: cytoscape.Ext = register

declare global {
  namespace cytoscape {
    interface NodeSingular {
      expand: () => void
      collapse: () => void
    }
  }
}
