//simulation!!
window.simulation = d3.forceSimulation()
    //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
    .force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide())
    .alphaDecay(1-Math.pow(0.0001,1/3000));//timesteps

d3.json("./ics/but_144.json", function(error, graph) { if (error) throw error; window.graph=graph;run()});

function run(){
 graph=window.graph;
  //scale factor
  var ptsize = ((width*height)/graph.nodes.length)/100000; //300
  console.log(ptsize)


  //simulation.force('collide', d3.forceCollide().radius(function(d,i){return  (plus_ns+node_sizes[i])/8 + plus_ns + node_sizes[i]}))

//move further out
graph.nodes = graph.nodes.filter(function(d){node_sizes.push( d.s * ptsize );d.x = 100*d.x;d.y=100*d.y;return d}, node_sizes=[]);

  window.voronoi = d3.voronoi()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .extent([[-1, -1], [width + 1, height + 1]]);

    var voronoi_path = group.selectAll("vornouli.cells")
      .attr('width',width).attr('height',height)
      .data(graph.nodes)
      .enter().append("g")
      .classed("node", true)
      .on('mouseover',function(d){console.log(d)})
        .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    window.cell = voronoi_path.append("path")
      .data(voronoi.polygons(graph.nodes))
        .attr("d", renderCell)
        .attr("id", function(d, i) { return "cell-" + i; });

    voronoi_path.append("circle")
            .attr("clip-path", function(d, i) { return "url(#clip-" + i + ")"; });


for_print();


  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

simulation.force("link").strength(function(d){0});
simulation.force("charge", d3.forceManyBody().strength(-300000 ))



//send ipc links to other

graph.links.forEach(function(d){var dv= d.value;dummy.push(eval(linkleneq))},dummy=[]);
ipc.send('forwarder',['prefsWindow',window.linkleneq,dummy]);

var charge = -300 ;
simulation.force("link")
      .links(graph.links)
      .distance(function(d){var dv= d.value;return width*eval(window.linkleneq)}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
      .strength(function(d){var dv = d.value;return 1});
/*.distance(function(d){var dv=  1-d.value; return 0.3+(dv*dv)/3 }) // 1-dval
      .strength(function(d){var dv = d.value; return 0.3+(dv*dv)/3 });
*/



window.dummy = {max: width/2, min:width/2, findmax:true, count :0, done:false };
theres_no_limit();



simulation.force("charge", d3.forceManyBody().strength(charge))

//.force("charge", d3.forceManyBody().strength(charge));



  function ticked() {



  if (window.animate){
     window.cell = window.cell.data(voronoi.polygons(graph.nodes)).attr("d", renderCell);
     voronoi.polygons(graph.nodes).filter(function(d){window.v.push( d3.polygonCentroid(d))},window.v=[]);

    /*if (simulation.alpha() < 0.9) simulation.force("charge", d3.forceManyBody().strength(-3000));
    if (simulation.alpha() < 0.80) simulation
    */
    if (simulation.alpha() < 0.001) { simulation.stop(); // 0.012
    function dragstarted(d) {};
    function dragended(d) {};
    canvas2file(canvas);
      //alert('simulation completed');
      //ipc.send('decimate',[]);
  };


    //canvas
      context.clearRect(0, 0, width, height);
      context.save();

      //context.translate(width / 2, height / 2);
      graph.links.forEach(drawLink);
      context.setLineDash([1,0]);


      graph.nodes.forEach(drawNodes);


      context.fillStyle = window.textcolour;
      graph.nodes.forEach(textstyle);
    }

      context.restore();

  }

}


ipc.on('command', (event,arg)=> {
  console.log(event,arg);
  eval(arg); })
/*
   //svg
    svg.selectAll("circle.node")
      .attr("cx", function(d) { return d.x })
      .attr("cy", function(d) { return d.y })
*/
