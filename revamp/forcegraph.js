//simulation!!
window.simulation = d3.forceSimulation()
    //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
    .force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))
    .force("center", d3.forceCenter(0,0))//(width/2,height/2))
    .force('collide', d3.forceCollide())
    .alphaDecay(1-Math.pow(0.0001,1/3000));//timesteps


//d3.json("./ics/Nhe_144.json", function(error, graph) { if (error) throw error; console.log('aaa',graph);window.graph=graph;run()});





function run(){
console.log(graphlinks);


  //simulation.force('collide', d3.forceCollide().radius(function(d,i){return  (plus_ns+node_sizes[i])/8 + plus_ns + node_sizes[i]}))


nodes.filter(function(d){if(isFinite(window.concs[d.id])) ; nd.push(d)},nd=[]);

graph.nodes=window.nodes;
graph.links= window.graphlinks;

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", 20)//function (d){ return (!isFinite(concs[d.id]))? 0.01 : 10 + 30. * window.concs[d.id]  }  )
      .attr("fill", 'red')// function(d) { return color(concs[d.id]); })


        var link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data(graphlinks)
          .enter().append("line")
            .attr("stroke-width",10)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
            //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
            //.attr("opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.0 })
.attr('fill','red');



/// d.index for edge length

  simulation
      .nodes(graph.nodes)




      .on("tick", ticked);

//send ipc links to other
//graph.links.forEach(function(d){var dv= d.value;dummy.push(eval(linkleneq))},dummy=[]);
//ipc.send('forwarder',['prefsWindow',window.linkleneq,dummy]);

  var charge = -30 ;


  simulation.force("link")
        .links(graph.links)
        .distance(5)//(isFinite(edge_length[d.index]))? 1+4.*edge_length[d.index] : 0 })//*eval(window.linkleneq)}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
        .strength(1)//function(d){return(isFinite(edge_length[d.index])? 1 : 0 )});//edge_length.map((d)=>(d==Infinity)? 0:1 ));


simulation.force("charge", d3.forceManyBody().strength(charge));//function(d) {return(isFinite(concs[d.id]))? charge : 0}))


console.log('here');

/// CLEAR THE LINKS PER SIMULATION
//http://stackoverflow.com/questions/40018270/d3js-v4-add-nodes-to-force-directed-graph


//len = sum of fluxes






/*
  var ThreeObj = new THREE.Object3D();
  window.plotobject = new ThreeLayout.Graph(ThreeObj,window.graph)

  scene.add(ThreeObj);

*/
  function ticked() {

console.log('tick');
    node
.attr("cx", function(d) { return graph.nodes[d.id].x + window.pw; })
.attr("cy", function(d) { return graph.nodes[d.id].y + window.ph; });

    link
        .attr("x1", function(d) { return d.source.x+ window.pw; })
        .attr("y1", function(d) { return d.source.y+ window.ph; })
        .attr("x2", function(d) { return d.target.x+ window.pw; })






          if (simulation.alpha() < 0.001) { simulation.stop(); // 0.012
          function dragstarted(d) {};
          function dragended(d) {};
          //alert('simulation completed'); UDE On.end
           };

           //window.plotobject.setNodePositions(graph)
           //window.plotobject.update();
    }


console.log('there');

ipc.on('command', (event,arg)=> {
  console.log(event,arg);
  eval(arg); })



};
