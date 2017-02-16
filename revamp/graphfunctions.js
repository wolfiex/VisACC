function resize() {
  //readjusts to suit the max distance from the edges
  var x = nodes.map(d => d.x);
  var y = nodes.map(d => d.y);

  var xmultiplier = 0.9 *
    window.innerWidth /
    (Math.abs(d3.max(x)) + Math.abs(d3.min(x)) / 2);
  var ymultiplier = 0.9 *
    window.innerHeight /
    (Math.abs(d3.max(y)) + Math.abs(d3.min(y)) / 2);
  console.log("scaling y,x", ymultiplier, xmultiplier);
  var max = d3.min([xmultiplier, ymultiplier]);

  d3.transition().delay(1000).duration(5000).tween("strength", function() {
    var i = d3.interpolate(1, 1 + max);
    return function(t) {
      simulation
        .force("link")
        .distance(function(d) {
          return 100 * i(t) * d.v;
        })
        .iterations([9])
        .strength(1);
    };

    collide();
  });

  simulation.alpha(2);
  /*)


  */
  //simulation.force("charge", d3.forceManyBody().strength(function(d){return (concs[d.id] > 0 )? charge*1.2   : 0  }).theta([40]));

  d3.transition().delay(9000).duration(4000).tween("strength", function() {
    var i = d3.interpolate(1, 2);
    var j = d3.interpolate(1, 1.2);
    return function(t) {
      simulation.force(
        "charge",
        d3
          .forceManyBody()
          .strength(function(d) {
            return concs[d.id] > 0 ? charge * j(t) : 0;
          })
          .theta([i(t)])
      );
    };

    simulation.force("link").strength(1);
  });
  console.log("finished resizing");
  simulation.alphaTarget(0.3);
}

function setupvor(
  min = [0.1 * width, 0.1 * height],
  max = [width * 0.9, height * 0.9]
) {
  group = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

  window.voronoi = d3
    .voronoi()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    //.extent([[0.1*width, .1*height], [width *.9, height *.9]]);
    .extent([min, max]);

  var voronoi_path = group
    .selectAll("vornouli.cells")
    .data(nodes)
    .enter()
    .append("g")
    .classed("node", true)
    //.on('click', displayreactions)
    .on("mouseover", function(d) {
      console.log(d);
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  window.cell = voronoi_path
    .append("path")
    .data(voronoi.polygons(nodes))
    .attr("d", renderCell)
    .style("stroke", "red")
    .style("fill", "transparent")
    .attr("opacity", 0.2)
    .attr("id", function(d, i) {
      return "cell-" + i;
    });

  voronoi_path.append("circle").attr("clip-path", function(d, i) {
    return "url(#clip-" + i + ")";
  });
} //central voronoi.polygons(nodes).map(function(d){return [d3.polygonCentroid(d),d.data.names] })

function renderCell(d) {
  return d == null ? null : "M" + d.join("L") + "Z";
}

function labels() {
  voronoi.polygons(nodes).map(function(d) {
    context.fillStyle = "black";
    //return [d3.polygonCentroid(d),d.data.names]
    var pos = d3.polygonCentroid(d);
    context.fillText(d.data.names, pos[0], pos[1]);
    context.fillStyle = "#222";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "Bold 8px Open Sans";
  });
}

function collide() {
  simulation.force(
    "collide",
    d3.forceCollide().radius(function(d) {
      return 7;
    })
  );
}

function drawLink() {
  graphlinks.forEach(function(d) {
    //black under line
    context.beginPath();
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
    context.strokeStyle = "#222";
    context.lineWidth = 0.1 + 1.0001 * (0.2 + (1 - d.v) / 3);
    context.filter = "";
    context.stroke(); // draw stroke
    context.closePath();

    context.beginPath();
    context.moveTo(d.source.x, d.source.y);
    //quardratic cubic
    //context.quadraticCurveTo(1.2*(d.source.x+d.target.x)/2 , 1.2*(d.source.y+d.target.y)/2 ,d.target.x, d.target.y);
    context.lineTo(d.target.x, d.target.y);
    context.strokeStyle = window
      .color(d.v)
      .replace(")", "")
      .replace("rgb", "rgba") +
      "," +
      0.9 +
      ")";
    context.lineWidth = 0.1 + 1 * (0.2 + (1 - d.v) / 3);

    if (d.dir === 0) {
      context.setLineDash([5, 2]);
    }
    context.filter = "";
    context.stroke(); // draw stroke
    context.closePath();
  });
}

function zoomed() {
  context.save();
  context.clearRect(0, 0, width, height);
  context.translate(d3.event.transform.x, d3.event.transform.y);
  context.scale(-d3.event.transform.k, -d3.event.transform.k);
  drawPoints();
  context.restore();
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
  //window.cell = window.cell.data(voronoi.polygons(graph.nodes)).attr("d", renderCell);
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//stats window
(function() {
  var script = document.createElement("script");
  script.onload = function() {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "./src/stats.js";
  document.head.appendChild(script);
})();
const cp = require("child_process");
