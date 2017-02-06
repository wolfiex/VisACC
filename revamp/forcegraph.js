//simulation!!
window.simulation = d3.forceSimulation()
    //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
    .force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))
    .force("center", d3.forceCenter(width/2,height/2))
    .force("x", d3.forceX(width/2).strength(center))
		.force("y", d3.forceY(height/2).strength(center))
    .alphaDecay(1-Math.pow(0.0001,1/3000));//timesteps


//d3.json("./ics/Nhe_144.json", function(error, graph) { if (error) throw error; console.log('aaa',graph);window.graph=graph;run()});
function center (d) {return (concs[d.id] > 0 )? 0.1   : 0  }

run()

function run(){

  simulation.force('collide', d3.forceCollide().radius(function(d){return (concs[d.id] > 0 )? 7   : 0  } ))


var link = svg.append("g")
    .attr("class", "links")
  .selectAll("line")
  .data(graphlinks)
  .enter().append("line")
    .attr("stroke-width",(d)=>d.v)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
    //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
    //.attr("opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.0 })
.attr('fill','red');



var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", function(d){return (node_size[d.id] > 0 )?   node_size[d.id] * 7 : 02  }  )// remove tertiary operator and just multiply
      .attr("fill", (d)=> (window.ncdata.concentration.row(0)[d.id]>0)?  ((d.names == 'OH')? 'green':'steelblue'):'red' )// function(d) { return color(concs[d.id]); })
.attr("id", (d)=> 'node'+d.id)
      .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
    .on('mouseover',print);

node.append("title")
.text(function(d) { return d.id; });





/// d.index for edge length

  simulation
      .nodes(nodes)




      .on("tick", ticked);

//send ipc links to other
//graph.links.forEach(function(d){var dv= d.value;dummy.push(eval(linkleneq))},dummy=[]);
//ipc.send('forwarder',['prefsWindow',window.linkleneq,dummy]);

  var charge = -80 ;


  simulation.force("link")
        .links(graphlinks)
        .distance( (d) => 1 + 300.*d.v)//*eval(window.linkleneq)}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
        .strength(1)//function(d){return(isFinite(edge_length[d.index])? 1 : 0 )});//edge_length.map((d)=>(d==Infinity)? 0:1 ));


simulation.force("charge", d3.forceManyBody().strength(function(d){return (concs[d.id] > 0 )? charge   : 0  }));//function(d) {return(isFinite(concs[d.id]))? charge : 0}))


console.log('here');

/// CLEAR THE LINKS PER SIMULATION
//http://stackoverflow.com/questions/40018270/d3js-v4-add-nodes-to-force-directed-graph


  function ticked() {

    node
.attr("cx", function(d) { return nodes[d.id].x })
.attr("cy", function(d) { return nodes[d.id].y });

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });





          if (simulation.alpha() < 0.001) { simulation.stop(); // 0.012
          function dragstarted(d) {};
          function dragended(d) {};

           };


    }






ipc.on('command', (event,arg)=> {
  console.log(event,arg);
  eval(arg); })



};
