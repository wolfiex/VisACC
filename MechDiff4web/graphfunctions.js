


function pie(nodes){
 nodes = nodes.map( function(d){

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


function getreact (mech,d){
dummy = [];
for (i = 0; i < mech.rct.length; i++) {
  if ((mech.rct[i].indexOf(d)>-1)|(mech.prd[i].indexOf(d)>-1)) dummy.push(mech[i]);
}
return dummy
}


//print array
var print = (d) => console.log(d);


function displayreactions(d) {
document.getElementById('sidebar').style.display='block'
document.getElementById('species').innerHTML = d.name;
dummy = ''
d.new.forEach(d=>dummy+=d +'<br>')
document.getElementById('oldrxn').innerHTML = dummy;
dummy = ''
d.old.forEach(d=>dummy+=d +'<br>')
document.getElementById('newrxn').innerHTML = dummy;


}


      var d3line = d3.line()
             .x(function (d) {
                 return d.x;
             })
             .y(function (d) {
                 return d.y;
             })
             .curve(d3.curveLinear);



function eb(){

  d3.select('#normal').style('color','white');
  d3.select('#eb').style('color','gray');


dummy  = [[resultstrue,true],[resultsfalse,false]];
for (var i = 0; i < 2; i++) {
  results= dummy[i][0]
  group=dummy[i][1]


         //plot the data
         for (var j = 0; j < results.length; j++) {


           var svg1 = d3.select("#svg1");

           svg1.selectAll('g').remove()
           svg1.style('width', width);
           svg1.style('height', height);
           svg1.style("transform", "translate("+window.innerWidth/2.+","+window.innerHeight/2.+")")

             svg1.append("path")
                 .attr("d", d3line(results[j]))
                 .attr('id', 'link'+j)
                 .style("fill", "none")
                 .attr("stroke-width",(d)=>1.3)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
                 //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
                 .attr("opacity",0.6)
                 //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
                 //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
                 .style('stroke', !group? window.blue:window.pink);

            var p = new Path2D(d3line(results[j]));
            //ctx.stroke(p)




         //ctx.fill(p);

  }

}
}

function ln(){

d3.select('#normal').style('color','grey');
d3.select('#eb').style('color','white');


svg1=d3.select('#svg1')
svg1.selectAll('path').remove()
  svg1.attr('width',width).attr('height',height).append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graphlinks)
    .enter().append("line")
      .attr("stroke-width",(d)=>2)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
      //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
      .attr("opacity",0.6)
      //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
      //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .style('stroke',(d)=> !d.new? window.blue:window.pink);



}
function closesidebar(){if (document.getElementById('sidebar').style.display === 'block') document.getElementById('sidebar').style.display='none'}
