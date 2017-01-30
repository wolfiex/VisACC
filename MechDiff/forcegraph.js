//simulation!!
window.simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(function(d){return both.has(d.id)? -800:-100}))//- 18 -550 -32 -34
    //.force("link", d3.forceLink().id(function(d) { return parseFloat(d.id); }))

    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    //.force("center", d3.forceCenter(width/2,height/2))

    .force("x", d3.forceX(width/2).strength(.6))
		.force("y", d3.forceY(height/2).strength(.6))
    .alphaDecay(1-Math.pow(0.0001,1/300));//timesteps





run ()



function run(){

    simulation
        .nodes(nodes)
        .on("tick", ticked);

simulation.force('collide', d3.forceCollide().radius(17))

simulation.force("link")
.links(window.graphlinks)
//.distance( 500)//function(d){console.log(d);return 1})//*eval(window.linkleneq)}) // 1-dval 500*0.4+(dv*dv*dv)/0.6
//.strength(1)//function(d){return(isFinite(edge_length[d.index])? 1 : 0 )});//edge_length.map((d)=>(d==Infinity)? 0:1 ));
 ///circle
 //tally attractin towards side

var link = svg.append("g")
    .attr("class", "links")
  .selectAll("line")
  .data(graphlinks)
  .enter().append("line")
    .attr("stroke-width",(d)=>2)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
    //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
    .attr("opacity",0.6)
    //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
    //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
    .style('stroke',(d)=> !d.new? window.blue:window.pink);



///// links

    // colour gradient instead of pie charts
    nodes=pie(nodes)

    //nodes = fixmutual(nodes);
    nodes = fixdifferent(nodes);
    //nodes = sortmutual(nodes);





var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", d=>both.has(d.id)? 10:7 )// remove tertiary operator and just multiply
      .attr("fill", (d)=> both.has(d.id)? 'url(#l'+d.id+')' : data.old.species.has(d.id)? window.blue:window.pink )
      .attr("id", (d)=> d.id)
      .attr('opacity', (d)=> !both.has(d.id)? 0.9 :1)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))

     .on('click', displayreactions)

    .on('mouseover',print);

node.append("title")
.text(function(d) { return d.id; });


console.log(node)


/// d.index for edge length


//send ipc links to other
//graph.links.forEach(function(d){var dv= d.value;dummy.push(eval(linkleneq))},dummy=[]);
//ipc.send('forwarder',['prefsWindow',window.linkleneq,dummy]);



//simulation.force("charge", d3.forceManyBody().strength(function(d){return  0  }));//function(d) {return(isFinite(concs[d.id]))? charge : 0}))


console.log('here');

/// CLEAR THE LINKS PER SIMULATION
//http://stackoverflow.com/questions/40018270/d3js-v4-add-nodes-to-force-directed-graph


  function ticked() {

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });



          if (simulation.alpha() < 0.1) { simulation.stop(); // 0.012
          function dragstarted(d) {};
          function dragended(d) {};

           };


    }



ipc.on('command', (event,arg)=> {
  console.log(event,arg);
  eval(arg); })



};