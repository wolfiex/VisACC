var canvas = document.querySelector("canvas"),
  context = canvas.getContext("2d"),
  width = window.innerWidth,
  height = window.innerHeight;

function run(t) {
  window.graph = window.data[t];

  var simulation = d3
    .forceSimulation()
    .force("collide", d3.forceCollide())
    .alphaDecay(1 - Math.pow(0.0001, 1 / 3000)) //timesteps
    .force(
      "link",
      d3
        .forceLink()
        .iterations(9)
        .id(d => parseInt(d.id))
        .strength(d => 0.3 + (1 - d.v) / 3)
        .distance(d => d.v * 100)
    )
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(function(d) {
          console.log(d);
          return window.graph.node_size[d.id] > 0 ? -1010 : 0;
        })
        .theta([40])
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

  simulation.nodes(window.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  d3
    .select(canvas)
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

    context.beginPath();
    graph.links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    window.nodes.forEach(drawNode);
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();
  }

  function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  }
}

/*




*/

function save() {
  mxy = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.max(e, s => parseFloat(s.y)))
    .entries(window.nodes)[0].value;
  mxx = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.max(e, s => parseFloat(s.x)))
    .entries(window.nodes)[0].value;

  mny = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.min(e, s => parseFloat(s.y)))
    .entries(window.nodes)[0].value;
  mnx = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.min(e, s => parseFloat(s.x)))
    .entries(window.nodes)[0].value;

  var x = d3.scaleLinear().domain([mnx, mxx]).range([0, 1]);

  var y = d3.scaleLinear().domain([mny, mxy]).range([0, 1]);

  var nnodes = nodes.map(d => {
    d.x = x(d.x);
    d.y = y(d.y);
    d.z = window.graph.node_size[d.id];
    return d;
  });
}

/*

















*/
function dragstarted() {
  console.log(d3.event.subject);
  //if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //d3.event.subject.fx = d3.event.subject.x;
  //d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  //d3.event.subject.fx = d3.event.x;
  //d3.event.subject.fy = d3.event.y;
}

function dragended() {
  //if (!d3.event.active) simulation.alphaTarget(0);
  //d3.event.subject.fx = null;
  //d3.event.subject.fy = null;
}

function drawLink(d) {
  context.beginPath();
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
  // set line color
  context.strokeStyle = window.color(d.v);
  context.stroke();
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}
