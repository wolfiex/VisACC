//simulation!!
window.simulation = d3
  .forceSimulation()
  //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
  .force(
    "link",
    d3.forceLink().id(function(d) {
      return parseFloat(d.id);
    })
  )
  //.force("center", d3.forceCenter(width / 2, height / 2))
  //.force("x", d3.forceX(width / 2).strength(center))
  //.force("y", d3.forceY(height / 2).strength(center))
  .alphaDecay(1 - Math.pow(0.0001, 1 / 3000)); //timesteps

function center(d) {
  return concs[d.id] > 0 ? 0.01 : 0;
}

var charge = -80;

function run() {
  nodes = nodes.map(function(d) {
    if (d.names === "CO") {
      d.fx = window.innerWidth / 2;
      d.fy = window.innerHeight / 2;
    }
    else if (d.names === "C5H8") {
      d.fx = window.innerWidth /8;
      d.fy = window.innerHeight / 8;
    }
    return d;
  });
  var species_left = new Set(nodes.map(i => i.id));
  var links = graphlinks.filter(function(d) {
    if (species_left.has(d.source) && species_left.has(d.target)) return d;
  });

  /*
  var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke-width",(d)=>d.v)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
  //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
  //.attr("opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.0 })
  .attr('fill','red');
  */

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", function(d) {
      return node_size[d.id] > 0 ? node_size[d.id] * 7 : 2;
    }) // remove tertiary operator and just multiply
    //.attr("fill", (d)=> (window.ncdata.concentration.row(0)[d.id]>0)?  ((d.names == 'OH')? 'green':'steelblue'):'red' )// function(d) { return color(concs[d.id]); })
    .style("fill", "white")
    .style("stroke", d => window.color1(node_size[d.id]))
    .style("stroke-width", "2")
    .style("fill-opacity", ".3")
    .attr("id", d => "node" + d.id)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mouseover", print);

  node.append("title").text(function(d) {
    return d.id;
  });

  setupvor();
  /// d.index for edge length

  simulation.nodes(nodes).on("tick", ticked);

  simulation
    .force("link")
    .links(links)
    .distance(function(d) {
      return 1.1 * d.v;
    })
    .strength(0);

  d3.transition().duration(7000).tween("strength", function() {
    //.delay(1000)
    var i = d3.interpolate(0, 1);
    return function(t) {
      simulation.force("link").strength(i(t));
    };
  });

  //function(d){return(isFinite(edge_length[d.index])? 1 : 0 )});//edge_length.map((d)=>(d==Infinity)? 0:1 ));//*eval(window.linkleneq)}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
  setTimeout(
    function() {
      simulation.force("link").strength(1);
    },
    1000
  );

  simulation.force(
    "charge",
    d3.forceManyBody().strength(function(d) {
      return concs[d.id] > 0 ? charge : 0;
    })
  ); //function(d) {return(isFinite(concs[d.id]))? charge : 0}))

  /// CLEAR THE LINKS PER SIMULATION
  //http://stackoverflow.com/questions/40018270/d3js-v4-add-nodes-to-force-directed-graph

  var rsz = true;

  function ticked() {
    window.cell = window.cell
      .data(voronoi.polygons(nodes))
      .attr("d", renderCell);
    voronoi.polygons(nodes).filter(
      function(d) {
        window.v.push(d3.polygonCentroid(d));
      },
      window.v = []
    );

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });

    /*    link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
    */

    //canvas
    context.clearRect(0, 0, width, height);
    context.save();

    //context.translate(width / 2, height / 2);
    ///graph.links.forEach(drawLink);
    //context.setLineDash([1,0]);
    //graph.nodes.forEach(drawNodes);

    //context.fillStyle = window.textcolour;
    drawLink();
    labels();

    context.restore();

    if (rsz) {
      if (simulation.alpha() < 0.3) {
        resize();
        rsz = false;
      }
    }

    if (simulation.alpha() < 0.001) {
      simulation.stop(); // 0.012
      function dragstarted(d) {}
      function dragended(d) {}
    }
  }
}
