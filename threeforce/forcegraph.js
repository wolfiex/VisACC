//simulation!!
window.simulation = d3.forceSimulation()
    //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
    .force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))
    .force("center", d3.forceCenter(0,0))
    .force('collide', d3.forceCollide())
    .alphaDecay(1-Math.pow(0.0001,1/3000));//timesteps


d3.json("./ics/pro_144.json", function(error, graph) { if (error) throw error; console.log(graph);window.graph=graph;run()});




function run(){
window.graph.nodes.forEach(function(d){d.z = 20+100.20*d.s;return d })

graph = window.graph;
  //scale factor
  var ptsize = 300;((width*height)/graph.nodes.length)/100000; //300
  console.log(ptsize)


  //simulation.force('collide', d3.forceCollide().radius(function(d,i){return  (plus_ns+node_sizes[i])/8 + plus_ns + node_sizes[i]}))

//move further out
graph.nodes = graph.nodes.filter(function(d){node_sizes.push( d.s * ptsize );d.x = 100*d.x;d.y=100*d.y;return d}, node_sizes=[]);


  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

//send ipc links to other
//graph.links.forEach(function(d){var dv= d.value;dummy.push(eval(linkleneq))},dummy=[]);
//ipc.send('forwarder',['prefsWindow',window.linkleneq,dummy]);

  var charge = -300 ;
  simulation.force("link")
        .links(graph.links)
        .distance(function(d){var dv= d.value;return 10*eval(window.linkleneq)}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
        .strength(function(d){var dv = d.value;return 1});


  simulation.force("charge", d3.forceManyBody().strength(charge))

  var ThreeObj = new THREE.Object3D();
  window.plotobject = new ThreeLayout.Graph(ThreeObj,window.graph)

  scene.add(ThreeObj);


  function ticked() {


          if (simulation.alpha() < 0.001) { simulation.stop(); // 0.012
          function dragstarted(d) {};
          function dragended(d) {};
          //alert('simulation completed'); UDE On.end
           };

           window.plotobject.setNodePositions(graph)
           window.plotobject.update();
    }



ipc.on('command', (event,arg)=> {
  console.log(event,arg);
  eval(arg); })



};






window.simulation.vert = d3.forceSimulation()
    //.force("charge", d3.forceManyBody().strength(-30))//- 18 -550 -32 -34
    .force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))
    .force("center", d3.forceCenter(0,0))
    .force('collide', d3.forceCollide())
    .alphaDecay(1-Math.pow(0.0001,1/3000));//timesteps
