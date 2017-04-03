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

console.log(window.location.hash)



function run(t) {
  window.graph = window.data[t];
  var nds = new Set(flatten(window.graph.links.map(d=>{return [d.source,d.target]})))
  window.graph.nodes = window.nodes.filter(d=> {if(nds.has(d.id)) return 1})

//abs(nm-i)


window.graph.nodes=[{"names":"CH4","id":0,"x":318.47427895337387,"y":501.22525613086054,"z":0.04652910387166509,"index":0,"vy":0.0001921463824623354,"vx":0.00019963032460465534},{"names":"CH3O2NO2","id":2,"x":234.00287859628898,"y":450.5964355910841,"z":-0.2923811447183644,"index":1,"vy":0.00011964072627583046,"vx":0.00047592869519216883},{"names":"H2","id":3,"x":322.5267642675267,"y":297.9068942033408,"z":0.1421278225475726,"index":2,"vy":0.0004639850708828226,"vx":0.00021223945345940961},{"names":"N2O5","id":4,"x":162.35897110428283,"y":353.8695156291021,"z":0.423260167157282,"index":3,"vy":0.0004402093826469675,"vx":0.00039211178994096176},{"names":"H2O2","id":5,"x":345.8093510917314,"y":318.8059080267571,"z":0.34975141416452193,"index":4,"vy":0.00036336115560934126,"vx":0.000049821084877717596},{"names":"CH3OH","id":6,"x":347.8469019125421,"y":411.5290113280007,"z":-0.35887048074058603,"index":5,"vy":0.00024642283950752073,"vx":-0.00001669164947746427},{"names":"HONO","id":7,"x":164.88643317308058,"y":403.6046503519541,"z":0.4445152438766611,"index":6,"vy":0.00029909803193286095,"vx":0.0005327664233817433},{"names":"CO","id":8,"x":280.17656925884944,"y":362.25708955763446,"z":-0.3066523382819626,"index":7,"vy":0.0003571486108665107,"vx":0.00016815356618743658},{"names":"HO2NO2","id":9,"x":248.875802538596,"y":344.2980857777637,"z":0.11011291725684202,"index":8,"vy":0.00043866475124414194,"vx":0.00029051106672462466},{"names":"CH3O","id":10,"x":271.0138982397768,"y":406.29368286150805,"z":-0.48138426131488354,"index":9,"vy":0.0002722891434189339,"vx":0.00016625951101958378},{"names":"CH3NO3","id":11,"x":243.30231901779564,"y":472.43343516053756,"z":0.1299302795410573,"index":10,"vy":0.00005992498179807834,"vx":0.00025454572306343216},{"names":"HNO3","id":12,"x":235.86418407336984,"y":413.3830115172808,"z":-0.09015413710406195,"index":11,"vy":0.00017121832944849146,"vx":0.00021600726142365355},{"names":"CH3OOH","id":13,"x":318.53392615487036,"y":393.8674169472686,"z":0.03672996888172597,"index":12,"vy":0.000331613307869868,"vx":0.00006614250282839205},{"names":"HCHO","id":14,"x":309.32625586943897,"y":427.65684439643843,"z":0.11943360150291338,"index":13,"vy":0.0001696245231840067,"vx":0.00007086065042629764},{"names":"CH3O2","id":15,"x":292.8294568758958,"y":461.71408098485364,"z":-0.18662644512867277,"index":14,"vy":0.00013349036441960422,"vx":0.00025503139076934014},{"names":"NO3","id":16,"x":208.6025444941906,"y":351.02092347129576,"z":0.29874480746132237,"index":15,"vy":0.0004975039804992051,"vx":0.0003969282476289207},{"names":"OH","id":18,"x":243.5931727587617,"y":381.9166275499316,"z":0.43620116203664927,"index":16,"vy":0.0003674634748065841,"vx":0.00032272632869695985},{"names":"NO2","id":19,"x":203.08730323508485,"y":394.0310199785491,"z":-0.4413057183705551,"index":17,"vy":0.000326976494312191,"vx":0.00039367192480981445},{"names":"NO","id":20,"x":189.80271819618105,"y":435.06140016497153,"z":-0.48593161390893513,"index":18,"vy":0.00016337292090202215,"vx":0.0004425914131443345},{"names":"O3","id":21,"x":233.15534683808113,"y":319.78957218826866,"z":-0.06934287078896606,"index":19,"vy":0.0006133899206297866,"vx":0.0002497460060800989},{"names":"HO2","id":22,"x":304.012236456972,"y":341.57999104063344,"z":-0.31085469890940276,"index":20,"vy":0.00043567487129035246,"vx":0.0001410335178776645}]
//sort by v

window.graph.links = window.graph.links.sort(function(x, y){
     return d3.ascending(x.v, y.v);
  })


var nm = window.graph.links.length
window.graph.links = window.graph.links.map((d,i)=> {i<nm/2? d.v= Math.abs(i)*(2/nm):d.v= Math.abs((nm-i))*(2/nm);console.log(d.v); return d })

//abs(nm-i)




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
  .strength(1)
  //.strength(d =>0.3 + 2*((1 - d.v) / 3))
  .distance(d => 2*d.v)
)
.force(
  "charge",
  d3
  .forceManyBody()
  .strength(function(d) {
    return window.graph.node_size[d.id] > 0 ? -1000 : 0;
  })
  //.theta([1000])
)
//.force("center", d3.forceCenter(width / 2, height / 2));
.force("x", d3.forceX(width / 2))
.force("y", d3.forceY(height / 2))

simulation.nodes(window.graph.nodes).on("tick", ticked);

/*
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
*/

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


  //sample()


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
  if (simulation.alpha()<0.005) {
    simulation.stop()


    console.log('end')
/*
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
    nd.forEach(e=> {var d = mymap.get(e);console.log(d);text+=d.x+','+d.y+','})
    fs.appendFile(f,text+'\n',function(err){
      if(err)
      console.error(err);
      console.log('Appended!');
    });


    window.location.hash=parseInt(window.location.hash.replace('#',''))+1

    window.location.reload()
  }}




///degree
//var degrees = window.nodes.map(q=>{d=q.names;num = graph.links.filter(e=>{if (e.source.names==d | e.target.names==d)return 1 }).length; return {name:d,degree:num}})

//var degrees = window.nodes.map(q=>{d=q.names;num = graph.links.filter(e=>{if (e.source.names==d | e.target.names==d)return 1 }).length; return [d,num]})


console.log('degree')
