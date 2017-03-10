var community = jLouvain().nodes(nodes.map(d=>d.id)).edges(graphlinks.map(d=>{d.weight=d.v; return d }))
var result = community()
var clr = d3.scaleOrdinal(d3.schemeCategory20);
var max = d3.max(Object.keys(result).map(d=> result[d]))

nodes.forEach(d=>{


document.getElementById('node'+d.id).style.stroke=clr(result[d.id])
//document.getElementById('node'+d.id).r.baseVal.value = parseFloat(result[d.id])
})

/////////////

//// generated graph locations -> save
// psot process and cluster match

////////


var G = new jsnx.Graph(null, {file: window.location.hash});
nodes.forEach(d=>{
  G.addNode(d.id, {name: d.name});
})

graphlinks.forEach(d=>{
  G.addEdge(d.source, d.target, {weight: d.v});
})

///https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map
var clr = d3.scaleLinear().range(['#116cff','#ff1111']);
var ec = jsnx.eigenvectorCentrality(G);

var max = d3.max(nodes.map(d=>ec.get(d.id)))

nodes.forEach(d=>{

document.getElementById('node'+d.id).style.stroke=clr(ec.get(d.id)/max)
//document.getElementById('node'+d.id).r.baseVal.value = 20*(ec.get(d.id)/max)
})


//// betweeness


var bn = jsnx.betweennessCentrality(G, optParameters={normalized:false,weight:'weight'})

var max = d3.max(nodes.map(d=>ec.get(d.id)))

nodes.forEach(d=>{

document.getElementById('node'+d.id).style.stroke=clr(bn.get(d.id)/max)
//document.getElementById('node'+d.id).r.baseVal.value = 20*(ec.get(d.id)/max)
})




//http://jsnetworkx.org/api/#/v/v0.3.4
