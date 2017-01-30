
function fixmutual(nodes){
  //fix mutual
  sum = d3.sum(nodes.map(d=>both.has(d.id)))
  dummy = 0
  nodes= nodes.map(function(d){  if( both.has(d.id)){dummy += 1 ; d.fx = 0.1*width + .8*width*(dummy/sum); d.fy = height/2}; return d  });
return nodes}


function fixdifferent(nodes){
  //fix mutual
  nwsum = d3.sum( nodes.map(d=>!both.has(d.id) * data.new.species.has(d.id)))
  odsum = d3.sum( nodes.map(d=>!both.has(d.id) * data.old.species.has(d.id)))
  //console.log(nwsum,odsum)
  var nw =0 , od = 0;
  nodes= nodes.map(function(d){  if( !both.has(d.id)){
    if (data.new.species.has(d.id)) {nw+=1; d.fx =  .1*width + .8*width*(nw/nwsum); d.fy = height*0.1}
    if (data.old.species.has(d.id)) {od+=1; d.fx =  .1*width + .8*width*(od/odsum); d.fy = height*0.9}
}return d});

window.simulation.force("charge", d3.forceManyBody().strength(function(d){return both.has(d.id)? -900:0}))
return nodes}

function sortmutual(nodes){
  //fix mutual
  sum = d3.sum(nodes.map(d=>both.has(d.id)))
  dummy = 0
  nodes= nodes.map(function(d){  if( both.has(d.id)){dummy += 1 ; d.fx = 0.1*width + .8*width*d.tally; d.fy = height/2}; return d  });
return nodes}



function pie(nodes){
 nodes = nodes.map( function(d){
    var tally = [];
    graphlinks.forEach((l)=> (l.source === d || l.target === d)? tally.push(l.new): null);
    d.tally = d3.sum(tally)/tally.length;

    //console.log(parseInt(100*d.tally), "l"+d.id)

    var areaGradient = d3.select('#svg0').append("defs")
    .append("linearGradient")
    .attr('id',"l"+d.id)
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");

    areaGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#E30B5D")
    .attr("stop-opacity", 1);
    areaGradient.append("stop")
    .attr("offset", parseInt(100*d.tally)+"%")
    .attr("stop-color", "#3864EB")
    .attr("stop-opacity", 1);



       return d





 })
return nodes



}














function zoomed() {
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(d3.event.transform.x, d3.event.transform.y);
      context.scale(-d3.event.transform.k, -d3.event.transform.k);
      drawPoints();
      context.restore();
    };

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.000003).restart();
  d.fx = d.x;
  d.fy = d.y;
};
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y
  //window.cell = window.cell.data(voronoi.polygons(graph.nodes)).attr("d", renderCell);
};
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  if (simulation.isFixed(d3.event.subject)) simulation.unfix(d3.event.subject);
  d.fx = null;
  d.fy = null;
};

//stats window
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='./src/stats.js';document.head.appendChild(script);})()
const cp = require('child_process');



// class to read netcdf
class nc2D {
  constructor(name, width, arr_type) { //Float32Array
    this.width = dims[width];
    this.arr_type = arr_type
    this.data = new arr_type(reader.getDataVariable(name));
  }
};
nc2D.prototype.row = function (index) {
   start = index*this.width;
   return new this.arr_type(this.data.slice(start,start+this.width))
}

//print array
var print = (d) => console.log(d);


function displayreactions(d) {
 var dummy =[];
  d.old.forEach(e=> dummy.push({'text':e,"col":window.pink}));
  d.new.forEach(e=> dummy.push({'text':e,"col":window.blue}));
textMultipleRows(dummy, '#svgtop', 0.2*width, 0.1*height);
d3.selectAll('svg').attr('opacity',0)
d3.select('#svgtop').attr('opacity',1)

}




function textMultipleRows(textArray, area, xPos, yPos){
    d3.select(area).selectAll('text').remove()

    for(i=0;i<textArray.length;i++){
        svg = d3.select(area) //-area you wish to append the text to
        svg.append("text")
        .attr('fill',textArray[i].col)
        .classed("popUpTextLeft", true) //-CSS class for the text
        .attr("x", xPos)
        .attr("y", yPos+(i*20)) //-new line when going through the loop
        .text(textArray[i].text); //-goes through each element in the text array
    }
}
