





function zoomed() {
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(d3.event.transform.x, d3.event.transform.y);
      context.scale(-d3.event.transform.k, -d3.event.transform.k);
      drawPoints();
      context.restore();
    };

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y
  //window.cell = window.cell.data(voronoi.polygons(graph.nodes)).attr("d", renderCell);
};
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
};

//stats window

(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='./src/stats.js';document.head.appendChild(script);})()
const cp = require('child_process');


function center (d) {return (concs[d.id] > 0 )? 0.1   : 0  }
