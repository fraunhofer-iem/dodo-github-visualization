// registers the extension on a cytoscape lib ref
export const register = function (cytoscape: any) {
  if (!cytoscape) {
    return
  } // can't register if cytoscape unspecified

  // In the future, this function might take some options object,
  // in order to set the desired visual style of expandable nodes
  // and if collapsed nodes are actually hidden or just styled differently
  cytoscape("core", "nodeExpansion", function (this: cytoscape.Core) {
    this.nodes().forEach((currentNode) => {
      currentNode.data("expanded", false)
      if (currentNode.incomers().length) {
        currentNode.style("visibility", "hidden")
      }
      if (currentNode.outgoers().length) {
        currentNode.style("shape", "diamond")
      }
    })
    this.edges().forEach((currentEdge) => {
      currentEdge.style("visibility", "hidden")
    })
  })

  cytoscape("collection", "expanded", function (this: cytoscape.Collection) {
    if (this.length > 0) {
      const node = this[0]
      if (node.isNode()) {
        return node.data("expanded")
      }
      return false
    }
  })

  // register with cytoscape.js
  cytoscape("collection", "expand", function (this: cytoscape.Collection) {
    if (this.length > 0) {
      const node = this[0]
      if (node.isNode()) {
        if (node.outgoers().length) {
          node.data("expanded", true)
          node.style("shape", "ellipse")
          node
            .outgoers("edge")
            .forEach((currentEdge: cytoscape.EdgeSingular) => {
              currentEdge.style("visibility", "visible")
              currentEdge.target().style("visibility", "visible")
            })
        }
      }
    }
  })

  cytoscape("collection", "collapse", function (this: cytoscape.Collection) {
    if (this.length > 0) {
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
    }
  })
}

if (typeof cytoscape !== "undefined") {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape)
}
