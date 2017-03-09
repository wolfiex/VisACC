"use strict";

///////////
/////program code
////////////

var glob = require("glob");
var files = [];
glob("../netcdf_results/**.nc", function(er, f) {
  console.log("loading", f);
  var x = f.sort().reverse().map(d => {
    var e = d.split("/")[2];
    return { name: e, data: newfile(e) };
  });

  console.log(x);
  window.x = x;

  window.species = "OH";

  //window.colour = ColourScheme(visual_cinnamon, false); //colourScale
  // window.colour  = ColourScheme(viridis,true); //colourScale
  //window.colour = d3.interpolate("#F6089E", "#3864EB");    //https://github.com/d3/d3-scale
  //window.colour = ColourScheme(    ["#3864EB", "#eb3864", "#aceb38"].reverse(),    true  ); ///'blue',"#F6089E");
  window.colour = ColourScheme(
    ["#3864EB", "#eb3864", "#aceb38"].reverse(),
    false
  );

  var start, end, steps;

  window.time = [];
  var startt = 2 * 144;
  var endt = dims.time;
  print(endt - startt);
  var range = endt - startt;
  //floor: ~~4.9 === 4  //true
  //var variable2 = variable1  || '';
  //if([1,5,7,22].indexOf(myvar)!=-1) alert('yeah baby!')

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var valueline = d3
    .line()
    .curve(d3.cardinal - closed) ///remove this line for full plot or use curveLinear
    .x(function(d) {
      return x(d[0]);
    })
    .y(function(d) {
      return y(d[1]);
    });

  var startindex, endindex, range;

  window.x = window.x.map(d => {
    var dict = d.data.dict;
    var time = d.data.datetime;
    var conc = Array.from(new Array(d.data.dims.time)).map((_, i) => {
      return d.data.concentration.row(i);
    });
    d.data = { conc, dict, time };
    time.forEach(function(d) {
      window.time.push(d);
    });
    return d;
    //concentration.map(e=> e.row(specnum))
  });

  legend(x, svg);

  var max = -999, min = 999;

  var plotdata = window.x.map(d => {
    var specnum = d.data.dict[window.species];
    var log = d.data.conc.map(n => {
      return Math.log10(n[specnum]);
      //var e = Math.log10(n[specnum]);
      //return isFinite(e) ? e : 0;
    });
    /// reduce accuracy
    d.max = d3.max(log.map(e => isFinite(e) ? e : -99));
    d.min = d3.min(log.map(e => isFinite(e) ? e : 99));
    if (d.max > max) max = d.max;
    if (d.min < min) min = d.min;

    return { name: d.name, log, time: d.data.time };
  });

  var radius = 0.35 * d3.min([window.innerWidth, window.innerHeight]);

  window.time = [...new Set(window.time)];

  window.sti = window.time[startt];
  window.eni = window.time[endt];

  console.log(plotdata, min, max);

  window.scale = d3.scaleLinear().domain([min, max]).range([10, radius]);
  window.thickness = d3
    .scaleLinear()
    .domain([0, window.x.length])
    .range([10, 2]);

  window.startindex = d3.min(
    time.map((d, i) => {
      if (window.sti === d) return i;
    })
  );
  window.endindex = d3.min(
    time.map((d, i) => {
      if (window.eni === d) return i;
    })
  );
  //window.p = plotdata;
  plotdata.forEach((d, n) => drawpath(d, n));

  ///AXIS

  svg
    .append("text")
    .attr("y", window.innerHeight / 2 + 15)
    .attr("x", window.innerWidth / 2)
    .style("text-anchor", "middle")
    .style("text-align", "center")
    .style("align", "middle")
    .style("font", "80px sans-serif")
    .text(window.species);
  stripesandtime(radius, startindex, range);
  annular(radius);
  //console.log(startindex, range);
});
