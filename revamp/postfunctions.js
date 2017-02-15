//use js to laod required libraries here
function edgebundle() {

    simulation.stop()
//    d3.selectAll('svg').selectAll('line').remove()

    var canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#000'


    var names = window.nodes.map(d=> d.names)
    var node_data = window.nodes.map(function(d){return{'x':d.x ,'y':d.y , 'col':1}});

    graphlinks.forEach(function(d){if (d.source.id > 0) link_data.push ( {'source': names.indexOf(d.source.names) ,'target':names.indexOf(d.target.names)  , 'lcol':d.v}) },link_data=[])



//console.log(link_data,'fdf',node_data, names)

    var fbundling = ForceEdgeBundling()
    .step_size(0.1)
    .compatibility_threshold( .3)
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


         var svg1 = d3.select("svg");
         svg1.style('width', width);
         svg1.style('height', height);
         svg1.style("transform", "translate("+window.innerWidth/2.+","+window.innerHeight/2.+")")

           svg1.append("path")
               .attr("d", d3line(results[i]))
               .attr('id', 'link'+i)
               .style("fill", "none")
               .attr("stroke-width",(d)=>1.3)//(d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
               //.attr("stroke-opacity",(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
               .attr("opacity",0.6)
               //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
               //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
               //.style('stroke', !group? window.blue:window.pink);
               .style('stroke', window.color(link_data[i].lcol));
          var p = new Path2D(d3line(results[i]));
          //ctx.stroke(p)

       //ctx.fill(p);
}}




function drawhistogram(){
simulation.stop();
 recieveddata = graphlinks.map(d=>100*d.v);
  //recieveddata.values.filter(function(d){recieveddata.push(100*d)},recieveddata=[]);

  var canvas = document.getElementById('canvas2');
      canvas.width = width;
      canvas.height = height;
  var ctx = canvas.getContext('2d');

  var colour = window.color,
        margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight*0.1 - margin.top - margin.bottom;


    context.translate(margin.left, window.innerHeight*.9);

    var x = d3.scaleLinear().domain([0, 100]).range([0, width]),
        histogram = d3.histogram().domain(x.domain()).thresholds(x.ticks(10)),
        data = histogram(recieveddata),
        kde = kernelDensityEstimator(epanechnikovKernel(15), x.ticks(1000));

    data.filter(function(d){maxarr.push(d.length)},maxarr=[] ) ;

    var y = d3.scaleLinear().domain([0, d3.max(maxarr)*1.1]).range([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]*500); })
        .curve(d3.curveStep)
        .context(context)

    var yTickCount = 5,
        yTicks = y.ticks(yTickCount),
        yTickFormat = y.tickFormat(yTickCount, "%");

        //bars
        data.forEach(function(d) {
           context.fillStyle = colour((d.x0+(d.x1/2))/100);
           context.fillRect(x(d.x0) + 1, y(d.length), (x(data[0].x1 + data[0].x0) - x(data[0].x0) - 2), (height - y(d.length)));
         });

         context.fillStyle='black';
         context.textAlign = "right";
         context.textBaseline = "middle";
         yTicks.forEach(function(d) {
           context.fillText(yTickFormat(d/100), -9, y(d));
         });


   console.log(data);

  context.beginPath();
    line(kde(recieveddata));
    context.lineWidth = 1.5;
    context.strokeStyle = "black";
    context.stroke();
  context.closePath();

}

function kernelDensityEstimator(kernel, x) {
  return function(sample) {
    return x.map(function(x) {
      return [x, d3.mean(sample, function(v) { return kernel(x - v); })];
    });
  };
}

function epanechnikovKernel(scale) {
  return function(u) {
    return Math.abs(u /= scale) <= 1 ? .75 * (1 - u * u) / scale : 0;
  };
}







/*
var fs = require('fs');
var nativeImage = require('electron').nativeImage;
var data = canvas.toDataURL('image/png', 1);
var img = typeof nativeImage.createFromDataURL === 'function'
  ? nativeImage.createFromDataURL(data) // electron v0.36+
  : nativeImage.createFromDataUrl(data) // electron v0.30
var imdata = img.toPng();
fs.writeFile(window.plotname+'.png', imdata, function (err) {throw err});
//electron.remote.getCurrentWindow().close();
*/
