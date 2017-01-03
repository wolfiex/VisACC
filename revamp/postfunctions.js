//use js to laod required libraries here

  function edgebundle(){

    print('open new -analysis- window, apply tranformations there')
    simulation.stop();

    d3.selectAll('svg').select('g').remove()


    var canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#000'



    nodes.forEach(function(d){node_data[d.names]={'x':d.x ,'y':d.y , 'col':d.x}},node_data ={});
    graphlinks.forEach(function(d){link_data.push({'source':d.source.names ,'target':d.target.names , 'col':d.x})},link_data =[]);


    var fbundling = ForceEdgeBundling()
    .step_size(0.1)
    .compatibility_threshold(0.55)
    .nodes(node_data).edges(link_data);
    var results = fbundling();



    var d3line = d3.line()
           .x(function (d) {
               return d.x;
           })
           .y(function (d) {
               return d.y;
           })
           .curve(d3.curveLinear);
       //plot the data
       for (var i = 0; i < results.length; i++) {
           svg.append("path")
               .attr("d", d3line(results[i]))
               .attr('id', 'link'+i)
               .style("stroke-width", 1.23)
               .style("stroke", '#999')//"steelblue")
               .style("fill", "none")
               .style('stroke-opacity', 0.315);


          var p = new Path2D(d3line(results[i]));
          ctx.stroke(p)
//ctx.fill(p);


       }

}
