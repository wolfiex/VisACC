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

  ga
    .append("text")
    .attr("x", radius + 6)
    .attr("y", ".4em")
    .attr("dy", ".35em")
    .style("text-anchor", function(d) {
      return d < 270 + 90 && d > 90 + 90 ? "end" : null;
    })
    .attr("transform", function(d) {
      return d < 270 + 90 && d > 90 + 90
        ? "rotate(180 " + (radius + 6) + ",0)"
        : null;
    })
    .text(function(d) {
      return d3.timeFormat(
        ". %H:%M"
      )(window.time[startindex + parseInt(d * range / 360)]);
    });

  ga
    .append("text")
    .attr("x", radius + 6)
    .attr("y", "-.4em")
    .attr("dy", ".35em")
    .style("text-anchor", function(d) {
      return d < 270 + 90 && d > 90 + 90 ? "end" : null;
    })
    .attr("transform", function(d) {
      return d < 270 + 90 && d > 90 + 90
        ? "rotate(180 " + (radius + 6) + ",0)"
        : null;
    })
    .text(function(d) {
      return d3.timeFormat(
        "%b %d"
      )(window.time[startindex + parseInt(d * range / 360)]);
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
