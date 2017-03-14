/// main action script
const width = window.innerWidth;
const height = window.innerHeight;

var canvas = document.querySelector("canvas");
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d"), searchRadius = 400;

var color = d3.scaleOrdinal().range(d3.schemeCategory20);

var simulation = d3
  .forceSimulation()
  .force("charge", d3.forceManyBody().strength(-110).theta([8]))
  //.force("link", d3.forceLink().iterations(4).id(d => parseInt(d.id)))
  .force("x", d3.forceX())
  .force("y", d3.forceY());

function load(graph) {
  simulation.nodes(graph.nodes).on("tick", ticked);
  simulation.force(
    "link",
    d3.forceLink().links(graph.links).id(d => parseInt(d.id))
    //.strength(d => d.v)
    //.distance()
  );
}

d3
  .select(canvas)
  .on("mousemove", mousemoved)
  .call(
    d3
      .drag()
      .container(canvas)
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

function ticked() {
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);

  context.beginPath();
  graph.links.forEach(drawLink);
  context.strokeStyle = "#aaa";
  context.stroke();

  context.restore();
}

function dragsubject() {
  return simulation.find(
    d3.event.x - width / 2,
    d3.event.y - height / 2,
    searchRadius
  );
}

function mousemoved() {
  var a = this.parentNode,
    m = d3.mouse(this),
    d = simulation.find(m[0] - width / 2, m[1] - height / 2, searchRadius);
  if (!d) return a.removeAttribute("href"), a.removeAttribute("title");
  a.setAttribute(
    "href",
    "http://bl.ocks.org/" + (d.user ? d.user + "/" : "") + d.id
  );
  a.setAttribute(
    "title",
    d.id +
      (d.user ? " by " + d.user : "") +
      (d.description ? "\n" + d.description : "")
  );
}

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawLink(d) {
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}

///classes and defns
class nc2D {
  constructor(name, width, arr_type) {
    //Float32Array
    this.width = dims[width];
    this.arr_type = arr_type;
    this.data = new arr_type(reader.getDataVariable(name));
  }
}
nc2D.prototype.row = function(index) {
  var start = index * this.width;
  return new this.arr_type(this.data.slice(start, start + this.width));
};
