const cp = require("child_process");

function update(n) {
  graph.links = data[n].links;

  simulation.force(
    "link",
    d3.forceLink().links(graph.links).iterations(9)
    //.id(d => parseInt(d.id))
    //.strength(d => 1 - d.v)
    //.distance(d => d.v * 100)
  );

  simulation.alphaTarget(0.3).restart();
  //ticked();
}
