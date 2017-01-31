
ln()

pie(nodes)
var dummy = d3.max(nodes.map(d=>d.s))
var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", d=> 10*(d.s/dummy) +  (both.has(d.id)? 10:6) )// remove tertiary operator and just multiply
      .attr("fill", (d)=> both.has(d.id)? 'url(#l'+d.id+')' : !(d.y<113)? window.blue:window.pink )
      .attr("id", (d)=> d.id)
      .attr('opacity', (d)=> !both.has(d.id)? 0.9 :1)
     .on('click', displayreactions)
    .on('mouseover',print)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })  ;

node.append("title")
.text(function(d) { return d.id; });
nodes.map(function(d){
  if (d.fx==null){
    svg.append("text")
    .attr('fill','white')
    .attr('text-align', 'center')
    .attr('text-anchor', 'middle')
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr('text-shadow', '0 1px 0 #fff')
    //.classed("popUpTextLeft", true) //-CSS class for the text
    .attr("x", d.x)
    .attr("y", d.y+24+10*(d.s/dummy)) //-new line when going through the loop
    .text(d.name); //-goes through each element in the text array
  }
})

  group = d3.select('#svg0').attr('opacity',0).attr('width',width).attr('height',height).append("g")


    window.voronoi = d3.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .extent([[0.1*width, .1*height], [width *.9, height *.9]]);

      var voronoi_path = group.selectAll("vornouli.cells")
        .data(nodes)
        .enter().append("g")
        .classed("node", true)
        .on('click', displayreactions)
        .on('mouseover', d=> document.getElementById('mouseover').innerHTML=d.name);


      window.cell = voronoi_path.append("path")
        .data(voronoi.polygons(nodes))
          .attr("d", renderCell)
          //.style('stroke','red')
          .style('fill','transparent')
          .attr('opacity',0.2)
          .attr("id", function(d, i) { return "cell-" + i; });

      voronoi_path.append("circle")
              .attr("clip-path", function(d, i) { return "url(#clip-" + i + ")"; });



function central(){
  voronoi.polygons(nodes).filter(function(d){v.push( [d3.polygonCentroid(d),d.data.name])},v=[]);
  return v
}

function renderCell(d) {
  return d == null ? null : "M" + d.join("L") + "Z";
}




    d3.transition()
    .duration(1500).tween("width", function() {
        var i = d3.interpolate(0,1);
        //var j = d3.interpolate(1,0);
         return function(t) {
            //d3.select('#svg0').style('opacity',i(t));
            d3.select('#svg1').style('opacity',i(t));
              };



      })



    d3.transition().delay(5000)
  .duration(7000)
  .tween("width", function() {
      var i = d3.interpolate(0,1);
      var j = d3.interpolate(1,0);
       return function(t) {
          d3.select('#svg0').style('opacity',i(t));
          d3.select('#svg1').style('opacity',j(t));
          if (j(t)<0.0001) eb()
            };
    })


    d3.transition().delay(5000+6800).duration(7000)
      .tween("width", function() {
          var i = d3.interpolate(0,1);
          //var j = d3.interpolate(1,0);
           return function(t) {
              //d3.select('#svg0').style('opacity',i(t));
              d3.select('#svg1').style('opacity',i(t));
                };
        })






//    window.cell = window.cell.data(voronoi.polygons(nodes)).attr("d", renderCell);
//    voronoi.polygons(nodes).filter(function(d){window.v.push( d3.polygonCentroid(d))},window.v=[]);
