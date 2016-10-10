//simulation!!
window.simulation = d3.forceSimulation()
    //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
    .force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))
    .force("center", d3.forceCenter())//width / 2, height / 2))
    .force('collide', d3.forceCollide())
    .alphaDecay(1-Math.pow(0.0001,1/3000));//timesteps



d3.json("./ics/eth_144.json", function(error, graph) { if (error) throw error;
  this.graph=graph;


  //scale factor
  var ptsize = ((width*height)/graph.nodes.length)/100000; //300
  console.log(ptsize)


  //simulation.force('collide', d3.forceCollide().radius(function(d,i){return  (plus_ns+node_sizes[i])/8 + plus_ns + node_sizes[i]}))

  //node size cocn
graph.nodes.filter(function(d){ node_sizes.push( d.s * ptsize  )}, node_sizes=[]);
//move further out
graph.nodes = graph.nodes.filter(function(d){d.x = 100*d.x;d.y=100*d.y;return d});


  // svg nodes
var circles = group
    .selectAll("circle.node")
    .data(graph.nodes).enter()
    .append('circle')
    .on('mouseover',function(d){console.log(d)})
    .classed("node", true)
    .style('fill','white')
    .style('fill-opacity', 0.15) //0.2 0.15
    .style('stroke-opacity',1)
    .attr('stroke', function(d){return (window.primary.indexOf(d.name) == -1)? 'rgb(0,120,10)': "#2979ff"}) //pink nice ff2979
    .attr('stroke-width',  function(d,i){return (plus_ns*1.8+node_sizes[i])/7})
    .attr("r", function(d,i){return plus_ns + node_sizes[i]})
    .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));


  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

simulation.force("link").strength(function(d){0});
simulation.force("charge", d3.forceManyBody().strength(-300000 ))


var charge = -300   ;
simulation.force("link")
      .links(graph.links)
      .distance(function(d){var dv=  d.value; return 8*dv}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
      .strength(function(d){var dv = d.value;return 1- (dv*dv)+ 0.2});
/*.distance(function(d){var dv=  1-d.value; return 0.3+(dv*dv)/3 }) // 1-dval
      .strength(function(d){var dv = d.value; return 0.3+(dv*dv)/3 });
*/


simulation.force("charge", d3.forceManyBody().strength(charge))

//.force("charge", d3.forceManyBody().strength(charge));




  function ticked() {
  /*if (simulation.alpha() < 0.9) simulation.force("charge", d3.forceManyBody().strength(-3000));
  if (simulation.alpha() < 0.80) simulation
  */
  if (simulation.alpha() < 0.000112) { simulation.stop(); // 0.012
  function dragstarted(d) {};
  function dragended(d) {};
  savecanvas(canvas);
    alert('simulation completed')};


  //canvas
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    graph.links.forEach(drawLink);
    context.fillStyle = window.textcolour;
    graph.nodes.forEach(textstyle);
    context.restore();


   //svg
    svg.selectAll("circle.node")
      .attr("cx", function(d) { return d.x })
      .attr("cy", function(d) { return d.y })

      window.test = svg;
  };






});
