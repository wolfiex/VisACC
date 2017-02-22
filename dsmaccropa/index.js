////////////////////////////////////////////////////////////////////////////////
// make bars
////////////////////////////////////////////////////////////////////////////////

function draw(spec, timestep) {
  document.getElementById("dropdown").value = spec;
  document.getElementById("valueslider").value = timestep;
  document.getElementById("output").value = ncdata.datetime[timestep];
  svg.selectAll("*").remove();

  data = [];
  var prod = [], loss = [];
  var specindex = ncdata.dict[spec];

  for (var i = 0; i < ncdata.combine.length; i++) {
    if (specindex === ncdata.tar[i]) {
      ncdata.combine[i][0].forEach(d => prod.push(d));
      ncdata.combine[i][1].forEach(d => loss.push(d));
    }
    if (specindex === ncdata.src[i]) {
      ncdata.combine[i][1].forEach(d => prod.push(d));
      ncdata.combine[i][0].forEach(d => loss.push(d));
    }
  }

  loss = new Set(loss);
  prod = new Set(prod);

  var selectedflux = ncdata.flux.row(timestep);

  loss = topfew(loss, false, selectedflux);
  prod = topfew(prod, true, selectedflux);

  tloss = loss[1];
  tprod = prod[1];
  loss = loss[0];
  prod = prod[0];

  var ttotal = tprod + tloss;

  tprod /= ttotal;
  tloss /= ttotal;

  var tmax = d3.max([tprod, tloss]);

  console.log(tprod, tloss);

  plot(prod, true, ttotal, tmax, tprod);
  plot(loss, false, ttotal, tmax, tloss);
  //
}

/*










*/

function plot(data, production, ttotal, tmax, datamax) {
  //
  //console.log(datamax, tmax, ttotal, data);

  data = data.map(d => {
    d.value /= ttotal;
    return d;
  });

  var x = d3.scaleLinear().range([0, width / 2]);
  var y = d3.scaleBand().range([height, 0]);
  x.domain([0, tmax]);
  y
    .domain(
      data.map(function(d) {
        return d.reaction;
      })
    )
    .padding(0.1);

  var g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + (production ? width / 2 : 0) + "," + 0 + ")"
    )
    .attr("id", production);
  //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + (40 + height) + ")")
    .call(
      d3.axisBottom(
        d3.scaleLinear().range(production ? [0, width / 2] : [width / 2, 0])
      )
    ); //percent axis rather than actual

  g //yaxis
    .append("g")
    .attr("class", "y axis")
    .attr(
      "transform",
      "translate(" + (production ? 0 : width / 2) + "," + 0 + ")"
    )
    .call(
      production
        ? d3.axisRight(y).tickFormat("")
        : d3.axisLeft(y).tickFormat("")
    );

  var bar = g
    .selectAll(".bar")
    .exit()
    .remove()
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", d => x(d.value))
    .attr("x", d => production ? 0 : -x(d.value))
    .attr("y", d => y(d.reaction))
    .style("fill", function(d) {
      return d.prod ? "#0277bd" : "#fc1333";
    })
    .attr("mask", d => /Other/.test(d.reaction) ? "url(#mask)" : "")
    .attr(
      "transform",
      "translate(" + (production ? 0 : width / 2) + "," + 0 + ")"
    )
    .attr("height", y.bandwidth())
    .on("mousemove", function(d) {
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html(
          d.reaction +
            "<br>" +
            d.value / ttotal +
            "% of total <br>" +
            d.value / datamax +
            "% of" +
            (production ? "Production" : "Loss")
        );
    })
    .on("mouseout", function(d) {
      tooltip.style("display", "none");
    });

  var boxheight = y(data[data.length - 1].reaction);

  console.log(boxheight);
  g
    .selectAll(".rxn")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.reaction)
    .attr("x", d => production ? 10 + x(d.value) : width / 2 - x(d.value) - 10)
    .attr("y", d => y(d.reaction) + 5 * boxheight)
    .style("fill", "black")
    .style("font-size", "10px")
    .attr("text-anchor", production ? "start" : "end");
  //.attr("alignment-baseline", "hanging");
  overall(datamax);
  //
}

/*














*/

function oldplot(side, production) {
  var data = [];

  data = sortedData(data);

  // set the ranges
  var y = d3.scaleBand().range([height, 0]).padding(0.1);
  var x = d3.scaleLinear().range([0, width / 2]);

  // Scale the range of the data in the domains
  x.domain([
    0,
    d3.max(data, function(d) {
      return d.value;
    })
  ]);
  y.domain(
    data.map(function(d) {
      return d.reaction;
    })
  );

  var bar = svg
    .selectAll(".bar")
    .exit()
    .remove()
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    //.attr("x", function(d) { return x(d.sales); })
    .attr("width", function(d) {
      return x(d.value);
    })
    .attr("y", function(d) {
      return y(d.reaction);
    })
    .style("fill", function(d) {
      return d.prod ? "#0277bd" : "#fc1333";
    })
    .attr("mask", d => /Other/.test(d.reaction) ? "url(#mask)" : "")
    .on("mouseover", function(d) {
      console.log(d.value);
    })
    .attr(
      "transform",
      "translate(" + (production ? 0 : width / 2) + "," + 0 + ")"
    )
    .attr("height", y.bandwidth());

  //
  var text = svg
    .selectAll(".textval")
    .attr("id", "texts")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "textval")
    .text(function(d) {
      return x(d.value) / width > 0.1 ? format(d.value) : "";
    }) // only display if greater than 0.1%
    .attr("x", function(d) {
      return x(d.value);
    })
    .attr("y", function(d) {
      return y(d.reaction);
    })
    .on("mouseover", function(d) {
      console.log(d.value);
    })
    .style("font-size", "10px")
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "hanging");

  svg.selectAll("g").remove();

  svg // add the x Axis
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (production ? -11 : width / 2 + 11) +
        "," +
        (50 + height) +
        ")"
    )
    .call(
      d3.axisBottom(
        d3.scaleLinear().range(production ? [width / 2, 0] : [0, width / 2])
      )
    ); //percent axis rather than actual
  // add the y Axis
  svg
    .append("g")
    .call(production ? d3.axisRight(y) : d3.axisLeft(y))
    .attr("transform", "translate(" + width / 2 + "," + 0 + ")");
}
