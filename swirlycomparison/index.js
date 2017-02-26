"use strict";

///////////
/////program code
////////////

var glob = require("glob");
var files = [];
glob("../netcdf_results/*.nc", function(er, f) {
  console.log("loading");
  var x = f.map(d => {
    var e = d.split("/")[2];
    return { name: e, data: newfile(e) };
  });

  console.log(x);
  window.x = x;


  //window.y = x[1].data.concentration.row(4);
  //use scale linear , and math.log
  ///get max from all 3 files



 window.species = 'CO'

 //window.colour = ColourScheme(visual_cinnamon, false); //colourScale
// window.colour  = ColourScheme(viridis,true); //colourScale
 //window.colour = d3.interpolate("#F6089E", "#3864EB");    //https://github.com/d3/d3-scale
 window.colour = d3.interpolate('#3864EB','red') ///'blue',"#F6089E");


 var start, end, steps;

window.time=[]
 window.sti = 0
  window.eni = dims.time
 document.getElementById("end").value = eni;
 document.getElementById("by").value = by;
 print((eni - sti) / by);

//floor: ~~4.9 === 4  //true
  //var variable2 = variable1  || '';
  //if([1,5,7,22].indexOf(myvar)!=-1) alert('yeah baby!')






  var svg = d3.select("body").append("svg")
      .attr("width", width )
      .attr("height", height);


      var valueline = d3.line()
          .curve(d3.cardinal-closed) ///remove this line for full plot or use curveLinear
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]) });

var startindex,endindex,range




window.x =   window.x.map(d=>{
  var dict = d.data.dict
  var time = d.data.datetime
  var conc = Array.from(new Array(d.data.dims.time)).map((_,i)=>{return d.data.concentration.row(i)})
  d.data={conc,dict,time};
  time.forEach(function(d){ window.time.push(d)})
  return d
  //concentration.map(e=> e.row(specnum))
  })

/*
  var select = document.getElementById("end");
  var select1 = document.getElementById("start");

  datetime.forEach((d, i) => {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = formatTime(d);
    select.appendChild(opt);

    var opt1 = document.createElement("option");
    opt1.value = i;
    opt1.innerHTML = formatTime(d);
    select1.appendChild(opt1);
*/


///function draw

var max = -999,min=999;

var plotdata = window.x.map(d=>{
  var specnum = d.data.dict[window.species]
  var log = d.data.conc.map(n=> { var e = Math.log10(n[specnum]); return isFinite(e)?  e : 0})
  /// reduce accuracy
console.log('log 10 ro ln ')
  d.max= d3.max(log);
  d.min = d3.min(log);
  console.log(d.max,d.min,min,max)
    if(d.max>max) max=d.max; if(d.min<min)min=d.min;

    return {'name':d.name,log,'time':d.data.time}


  })





var radius = 0.35*d3.min([window.innerWidth,window.innerHeight]);

window.time = [...new Set(window.time)]

window.sti = window.time[4]
window.eni = window.time[dims.time]


console.log(plotdata, min, max)

window.scale = d3.scaleLinear().domain([min,max]).range([10, radius])



plotdata.forEach((d,i)=>{




//console.log(line(d.log),d.log.map(d=>scale(d)), d.log.map((d,i)=>angle(i)))

 startindex=d3.min(time.map((d,i)=>{if (window.sti===d) return i}))
 endindex =d3.min(time.map((d,i)=>{if (window.eni===d) return i}))
range= endindex-startindex

var angle = d3.scaleLinear().domain([0,range]).range([0, 2 * Math.PI])


var line = d3.radialLine()
  //.curve(d3.curveCardinalClosed.tension(0.75) )
  .radius(q=>0.95*q)
  .angle((_,i) => angle(i));


window.path = svg.append('path')
.attr('id',d.name)
.attr("d", line(d3.range(startindex,endindex,1).map(q=> scale(d.log[q]))))
.attr("fill", "#fff")
.attr("stroke", window.colour(i/x.length))
    .attr('stroke-width', 7-2*i)
    .style("stroke-dasharray", (""+(2*i+6)+","+(6-2*i)))
    //attr('fill', window.colour(i/x.length))
    .attr('fill-opacity',0.2)
    .attr('transform', 'translate(' + width/2 +','+ height/2 +')')






})


x.map((d,i)=>{
// Add the Legend
svg.append("text")
    .attr("x", width/2)  // space legend
    .attr("y", 20 + ( i * 20))
    .attr("class", "legend")
    .style("text-anchor", "middle")
    .style("stroke-dasharray", (""+(i+6)+","+(6-i)))  // style the legend
    //.attr("stroke", window.colour(i/x.length))

    .attr("fill", window.colour(i/x.length))
    .text(d.name);


})

///AXIS



var raxis = svg.append("g")
    .attr('id','axis')
    .attr("class", "r axis")
  .selectAll("g")
    .data(scale.ticks(5).slice(1))
  .enter().append("g");

raxis.append("circle")
    .attr("r", scale)
    .attr('transform',"translate(" + width/2+","+height/2+ ")");


d3.range(0,360,360/3).forEach(i=>{

    raxis.append("text")
        .attr("y", function(d) { return -scale(d) - 4; })
        .attr("transform", "translate(" + width/2+","+height/2+ ")"+"rotate("+i+")")
        .style("text-anchor", "middle")
        .text(function(d) { return d3.format(".2e")(10**d ); });

})

svg.append("text")
    .attr("y", width/2)
    .attr('x',height/2)
    .style("text-anchor", "middle")
    .text(window.species);





var ga = svg.append("g")
.attr('id','axis2')
    .attr("class", "a axis")
  .selectAll("g")
    .data(d3.range(0, 360, 30))
  .enter().append("g")
    .attr("transform", function(d) { return "translate(" + width/2+","+height/2+ ")"+"rotate(" + (-90+d) + ")"; })


ga.append("line")
    .attr("x2", radius);

ga.append("text")
    .attr("x", radius + 6)
    .attr("dy", ".35em")
    .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
    .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
    .text(function(d) { return window.formatTime(window.time[startindex +parseInt(d * range/360)]) });


console.log(startindex,range)

});
