var canvas = document.querySelector("canvas"),
context = canvas.getContext("2d"),
width = window.innerWidth,
height = window.innerHeight;

//window.mapped = new Map(saved.nodes.map(d=>{return [d.names,d] }))
window.simulation={}
const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(
    Array.isArray(val) ? flatten(val) : val
  ),
  []
);





function run(t) {
  window.graph = window.data[t];
  var nds = new Set(flatten(window.graph.links.map(d=>{return [d.source,d.target]})))
  window.graph.nodes = window.nodes.filter(d=> {if(nds.has(d.id)) return 1})




  /*window.nodes = window.nodes.map(d=>{
  var sub = window.mapped.get(d.names)
  d.x = sub.x;
  d.y = sub.y;
  return d
})*/
var center= 0.1
window.simulation = d3
.forceSimulation()
.force("collide", d3.forceCollide())
.alphaDecay(1 - Math.pow(0.0001, 1 / 3000)) //timesteps
.force(
  "link",
  d3
  .forceLink()
  .iterations(9)
  .id(d => parseInt(d.id))
  //.strength(1)
  .strength(d =>0.3 + 2*((1 - d.v) / 3))
  .distance(d => d.v * 200)
)
.force(
  "charge",
  d3
  .forceManyBody()
  .strength(function(d) {
    console.log(d);
    return window.graph.node_size[d.id] > 0 ? -1000 : 0;
  })
  //.theta([1000])
)
//.force("center", d3.forceCenter(width / 2, height / 2));
.force("x", d3.forceX(width / 2))
.force("y", d3.forceY(height / 2))

simulation.nodes(window.graph.nodes).on("tick", ticked);


window.graph.nodes= window.graph.nodes.map(d=>{
  if (d.names === 'NO'){
    d.fx = 295
    d.fy= 267
  }
  if (d.names === 'NO2'){
    d.fx = 431
    d.fy= 240
  }
  if (d.names === 'NO3'){
    d.fx = 338
    d.fy= 449
  }

  return d
})


simulation.force("link").links(window.graph.links);

d3
.select(canvas)
.call(
  d3
  .drag()
  .container(canvas)
  .subject(dragsubject)
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended)
);

function ticked() {
  context.clearRect(0, 0, width, height);

  context.beginPath();
  graph.links.forEach(drawLink);
  context.strokeStyle = "#aaa";
  context.stroke();

  context.beginPath();
  window.nodes.forEach(drawNode);
  context.fill();
  context.strokeStyle = "#fff";
  context.stroke();


  sample()


}

function dragsubject() {
  return simulation.find(d3.event.x, d3.event.y);
}
}

/*




*/

function save() {
  mxy = d3
  .nest()
  .key(d => d)
  .rollup(e => d3.max(e, s => parseFloat(s.y)))
  .entries(window.graph.nodes)[0].value;
  mxx = d3
  .nest()
  .key(d => d)
  .rollup(e => d3.max(e, s => parseFloat(s.x)))
  .entries(window.graph.nodes)[0].value;

  mny = d3
  .nest()
  .key(d => d)
  .rollup(e => d3.min(e, s => parseFloat(s.y)))
  .entries(window.graph.nodes)[0].value;
  mnx = d3
  .nest()
  .key(d => d)
  .rollup(e => d3.min(e, s => parseFloat(s.x)))
  .entries(window.graph.nodes)[0].value;

  var x = d3.scaleLinear().domain([mnx, mxx]).range([0, 1]);

  var y = d3.scaleLinear().domain([mny, mxy]).range([0, 1]);

  var nnodes = graph.nodes.map(d => {
    d.x = x(d.x);
    d.y = y(d.y);
    d.z = window.graph.node_size[d.id];
    return d;
  });

  var fs = require('fs');

  fs.writeFile("./locations.json",
  ("data = "+JSON.stringify({nodes:window.graph.nodes,links:window.graph.links})),
  function(err) { if(err) { return console.log(err);}
  console.log("The file was saved!");
});


}

/*

















*/
function dragstarted() {
  console.log(d3.event.subject);
  //if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //d3.event.subject.fx = d3.event.subject.x;
  //d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  //d3.event.subject.fx = d3.event.x;
  //d3.event.subject.fy = d3.event.y;
}

function dragended() {
  //if (!d3.event.active) simulation.alphaTarget(0);
  //d3.event.subject.fx = null;
  //d3.event.subject.fy = null;
}

function drawLink(d) {
  context.beginPath();
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
  // set line color
  context.strokeStyle = window.color(d.v);
  context.stroke();
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}


function sample(){
  if (simulation.alpha()<0.006) {
    simulation.stop()


    console.log('end')

    mxy = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.max(e, s => parseFloat(s.y)))
    .entries(window.graph.nodes)[0].value;
    mxx = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.max(e, s => parseFloat(s.x)))
    .entries(window.graph.nodes)[0].value;

    mny = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.min(e, s => parseFloat(s.y)))
    .entries(window.graph.nodes)[0].value;
    mnx = d3
    .nest()
    .key(d => d)
    .rollup(e => d3.min(e, s => parseFloat(s.x)))
    .entries(window.graph.nodes)[0].value;

    var x = d3.scaleLinear().domain([mnx, mxx]).range([0, 1]);

    var y = d3.scaleLinear().domain([mny, mxy]).range([0, 1]);
/*
    var nnodes = window.graph.nodes.map(d => {
      d.x = x(d.x);
      d.y = y(d.y);
      return d;
    });
*/

    mymap = new Map(window.graph.nodes.map(d=>{return [d.names,d]}))


    //write
    //JSON.stringify([...mymap.keys()])
    nd = ["CH4","CH3O2NO2","H2","N2O5","H2O2","CH3OH","HONO","CO","HO2NO2","CH3O","CH3NO3","HNO3","CH3OOH","HCHO","CH3O2","NO3","OH","NO2","NO","O3","HO2"]


    var f='global.csv',
    fs=require('fs');

    if (window.location.hash===''){

      var text ='id,'
      nd.forEach(d=> {text+=d+'_x,'+d+'_y,'})


      fs.writeFile(f,text+'\n',function(err){
        if(err)
        console.error(err);
        console.log('Written!');
      });
      window.location.hash=0
    }

    var text = window.location.hash+','
    nd.forEach(e=> {var d = mymap.get(e);console.log(d);text+=x(d.x)+','+y(d.y)+','})
    fs.appendFile(f,text+'\n',function(err){
      if(err)
      console.error(err);
      console.log('Appended!');
    });


    window.location.hash=parseInt(window.location.hash.replace('#',''))+1
    window.location.reload()
  }}
