


function setupvor(){

  group = d3.select('svg').attr('width',width).attr('height',height).append("g")


    window.voronoi = d3.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .extent([[0.1*width, .1*height], [width *.9, height *.9]]);

      var voronoi_path = group.selectAll("vornouli.cells")
        .data(nodes)
        .enter().append("g")
        .classed("node", true)
        //.on('click', displayreactions)
        .on('mouseover',function(d){console.log(d)})
          .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

      window.cell = voronoi_path.append("path")
        .data(voronoi.polygons(nodes))
          .attr("d", renderCell)
          .style('stroke','red')
          .style('fill','transparent')
          .attr('opacity',0.2)
          .attr("id", function(d, i) { return "cell-" + i; });

      voronoi_path.append("circle")
              .attr("clip-path", function(d, i) { return "url(#clip-" + i + ")"; });


}

function central(){
  voronoi.polygons(nodes).filter(function(d){v.push( [d3.polygonCentroid(d),d.data.name])},v=[]);
  return v
}

function renderCell(d) {
  return d == null ? null : "M" + d.join("L") + "Z";
}







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
