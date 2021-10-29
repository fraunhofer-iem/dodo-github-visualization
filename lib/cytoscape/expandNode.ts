// registers the extension on a cytoscape lib ref
let register = function (cytoscape: any) {
  if (!cytoscape) {
    return
  } // can't register if cytoscape unspecified

  // register with cytoscape.js
  cytoscape("core", "expand", () => {
    return
  })
  cytoscape("collection", "expand", function (this: cytoscape.NodeCollection) {
    const node: cytoscape.NodeSingular = this[0]
    node.data("expanded", true)
    node.data("expandable", false)
    node.outgoers("edge").forEach((currentEdge: cytoscape.EdgeSingular) => {
      currentEdge.style("visibility", "visible")
      currentEdge.target().style("visibility", "visible")
    })
  }) //Cytoscape Collections
  cytoscape("core", "collapse", () => {
    return
  })

  cytoscape(
    "collection",
    "collapse",
    function (this: cytoscape.NodeCollection) {
      const node: cytoscape.NodeSingular = this[0]
      console.log("collapse")
      node.data("expanded", false)
      node.outgoers("edge").forEach((currentEdge: cytoscape.EdgeSingular) => {
        node.data("expandable", true)

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
    },
  ) //Cytoscape Collections for References
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
