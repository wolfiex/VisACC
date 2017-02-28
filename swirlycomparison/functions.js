function legend(x, svg) {
  x.map((d, i) => {
    // Add the Legend
    svg
      .append("g")
      .append("text")
      .attr("x", width / 2) // space legend
      .attr("y", 20 + i * 20)
      .attr("class", "legend")
      .style("text-anchor", "middle")
      .style("stroke-dasharray", "" + (i + 6) + "," + (6 - i)) // style the legend
      //.attr("stroke", window.colour(i/x.length))

      .attr("fill", window.colour(i / x.length))
      .text(d.name);
  });
}

function stripesandtime(radius, startindex, range) {
  var ga = d3
    .selectAll("svg")
    .append("g")
    .attr("id", "axis2")
    .selectAll("g")
    .data(d3.range(0, 360, 30))
    .enter()
    .append("g")
    .attr("transform", function(d) {
      return "translate(" +
        width / 2 +
        "," +
        height / 2 +
        ")" +
        "rotate(" +
        (-90 + d) +
        ")";
    });

  ga
    .append("line")
    .attr("x2", radius)
    .attr("fill", "none")
    .attr("stroke", "#777")
    .attr("stroke-dasharray", "1,4");

  var extralabels = 20;

  ga
    .append("text")
    .attr("x", radius + extralabels)
    .attr("y", ".4em")
    .attr("dy", ".35em")
    .style("text-anchor", function(d) {
      return d < 270 + 90 && d > 90 + 90 ? "end" : null;
    })
    .attr("transform", function(d) {
      return d < 270 + 90 && d > 90 + 90
        ? "rotate(180 " + (radius + extralabels) + ",0)"
        : null;
    })
    .text(function(d) {
      return d3.timeFormat(
        ". %H:%M"
      )(window.time[window.startindex + parseInt(d * range / 360)]);
    });

  ga
    .append("text")
    .attr("x", radius + extralabels)
    .attr("y", "-.4em")
    .attr("dy", ".35em")
    .style("text-anchor", function(d) {
      return d < 270 + 90 && d > 90 + 90 ? "end" : null;
    })
    .attr("transform", function(d) {
      return d < 270 + 90 && d > 90 + 90
        ? "rotate(180 " + (radius + extralabels) + ",0)"
        : null;
    })
    .text(function(d) {
      return d3.timeFormat(
        "%b %d"
      )(window.time[window.startindex + parseInt(d * range / 360)]);
    });
}

function annular(radius) {
  var raxis = d3
    .select("svg")
    .append("g")
    .attr("id", "axis")
    .attr("class", "axis")
    .selectAll("g")
    .data(scale.ticks(5).slice(1))
    .enter()
    .append("g");

  raxis
    .append("circle")
    .attr("r", scale)
    .attr("x2", radius)
    .attr("fill", "none")
    .attr("stroke", "#777")
    .attr("stroke-dasharray", "1,4")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.range(0, 360, 360 / 3).forEach(i => {
    raxis
      .append("text")
      .attr("font", "10px sans-serif")
      .attr("y", function(d) {
        return -scale(d) - 4;
      })
      .attr(
        "transform",
        "translate(" + width / 2 + "," + height / 2 + ")" + "rotate(" + i + ")"
      )
      .style("text-anchor", "middle")
      .text(function(d) {
        return d3.format(".2e")(10 ** d);
      });
  });
}

/*




*/

function drawpath(d, n) {
  //console.log(line(d.log),d.log.map(d=>scale(d)), d.log.map((d,i)=>angle(i)))

  range = endindex - startindex;

  var angle = d3.scaleLinear().domain([0, range]).range([0, 2 * Math.PI]);

  var line = d3
    .radialLine()
    //.curve(d3.curveCardinalClosed.tension(0.75) )
    .radius(q => q)
    .angle((_, i) => angle(i));

  window.path = d3
    .select("svg")
    .append("path")
    .attr("id", d.name)
    .attr(
      "d",
      line(
        d3.range(startindex, endindex, 1).map(q => {
          var e = 0.95 * scale(d.log[q]);
          return isFinite(e) ? e : 0;
        })
      )
    )
    .attr("fill", "none")
    .style("stroke", window.colour(n / x.length))
    //.style("stroke-width", d => {        return "" + 2 * window.thickness(n) + "px";      })
    .style("stroke-width", window.thickness(n))
    .style("stroke-alignment", "inside")
    //.style("stroke-linecap", "round")
    /*
    .attr(
      "stroke-dasharray",
      "" + window.thickness(n) + "," + (9 - window.thickness(n))
    )
    */
    //.attr("fill", window.colour(i / x.length))
    //.attr("fill-opacity", 0.2)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
}
