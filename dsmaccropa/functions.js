/*

Universal Fucntions

*/

var x = d3
  .scaleLinear()
  .domain([0, ncdata.dims.time])
  .range([0, window.innerWidth * 0.49]);

var y = d3.scaleLinear().domain([0, 1]).range([20, 0]);

var valueline = d3
  .line()
  .x(function(d, i) {
    return x(i);
  })
  .y(function(d) {
    return y(d);
  });

//fn to create mini concentration plot
function miniplot(spec) {
  var spec = ncdata.dict[spec], conc = [];
  for (var j = 0; j < ncdata.dims.time; j++) {
    conc.push(
      ncdata.concentration.row(j).map(d => d > 0 ? Math.log10(d) : 0)[spec]
    );
  }

  var min = d3.min(conc);
  var max = d3.max(conc) - min;
  var conc = conc.map(d => (d - min + 1e-6) / max);

  var svg = d3.select("#miniplot");
  svg.select("path").remove();
  svg
    .append("path")
    .data([conc])
    .attr("class", "line")
    .style("stroke", "green")
    .style("stroke-width", "2px")
    .style("fill", "none")
    .attr("d", valueline);
}

function sortedData(data) {
  return data.sort((a, b) => a.value - b.value);
}

////////// animate
function animate() {
  var start = 0;
  var end = dims.time - 1;
  document.getElementById("animate").disabled = true;
  const interval = d3.interval(
    () => {
      const t = d3.transition().duration(100);
      start += 1;
      document.getElementById("valueslider").value = start;
      document.getElementById("output").value = ncdata.datetime[start];
      draw(spec, start);

      if (start === end) {
        interval.stop();
        document.getElementById("animate").disabled = false;
      }
    },
    200
  );
}

////
//// get data for plots
function topfew(data, production, selectedflux) {
  var tally = 0;
  data = [...data]
    .filter(d => {
      if (selectedflux[d] > 0) return d;
    })
    .map(function(d) {
      var val = selectedflux[d];
      tally += val;
      return {
        reaction: ncdata.rates[d],
        value: val,
        prod: production
      };
    });

  data = sortedData(data);

  var sum = 0;
  for (var i = 0; i < data.length - topn; i++) {
    if (data[i].prod === production) {
      sum += data[i].value;
    }
  }
  data = data.splice(data.length - topn, data.length);

  data.unshift({
    reaction: production ? "Total Other Prod" : "Total Other Loss",
    value: sum,
    prod: production
  });

  return [data, tally];
}

function overall(per) {
  g = d3.select("svg").selectAll("g");

  areaGradient = g
    .append("defs")
    .append("linearGradient")
    .attr("id", "colorgradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

  areaGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#E30B5D")
    .attr("stop-opacity", 1);
  areaGradient
    .append("stop")
    .attr("offset", parseInt(100 * per) + "%")
    .attr("stop-color", "#3864EB")
    .attr("stop-opacity", 1);
}

g
  .append("rect")
  .attr("class", "bar")
  .attr("width", width)
  .attr("x", height / 2)
  .attr("y", 0)
  .attr("mask", d => /Other/.test(d.reaction) ? "url(#mask)" : "")
  .attr("height", 10)
  .attr("fill", "url(#colorgradient)");
