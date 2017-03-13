
function draw(){
//background
d3.select('#svg').append('rect').style('width',width).style('height',height).style('fill','#222')


//edges
edgebundle()


//nodes
d3.select('#svg')
.append('g')
.attr("class", "nodes")
.selectAll('circle')
.data(data.nodes)
.enter().append('circle')
.attr('r',d=>(1+ data.nodesize[d.id]*7)*scale)
.attr('cx',d=>d.x*scale)
.attr('cy',d=>d.y*scale)
.style("fill", "white")
.style("stroke-width", "2")
.style("fill-opacity", ".3")//0.3 norma
.attr("id", d => "node" + d.id)
.call(
  d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
)
.on("mouseover", d=>console.log(d))
.append("title").text(function(d) {
return d.name;
});




}



//use js to laod required libraries here
function edgebundle() {
  var names = data.nodes.map(d => d.names);
  var node_data = data.nodes.map(function(d) {
    return { x: d.x*scale, y: d.y*scale, col: 1 };
  });

  data.links.forEach(
    function(d) {
      if (d.source.id > 0)
        link_data.push({
          source: names.indexOf(d.source.names),
          target: names.indexOf(d.target.names),
          lcol: d.v
        });
    },
    link_data = []
  );

  //console.log(link_data,'fdf',node_data, names)

  var fbundling = ForceEdgeBundling()
    .step_size(0.1)
    .compatibility_threshold(0.3)
    .nodes(node_data)
    .edges(link_data);
  var results = fbundling();

  var d3line = d3
    .line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .curve(d3.curveLinear);
  //plot the data
  for (var i = 0; i < results.length; i++) {
    var svg = d3.select("#svg");
    svg.style("width", width);
    svg.style("height", height);
    svg.style(
      "transform",
      "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")"
    );

    svg
    .append('g')
      .append("path")
      .attr("d", d3line(results[i]))
      .attr("id", "link" + i)
      .style("fill", "none")
      .attr("stroke-width", d => 1.3) //(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
      //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
      .attr("opacity", 0.95)
      //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
      //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
      //.style('stroke', !group? window.blue:window.pink);
      .style("stroke", window.color(link_data[i].lcol));
    var p = new Path2D(d3line(results[i]));
    //ctx.stroke(p)
    //ctx.fill(p);
  }
}
