var color = d3.scale.linear()
    .domain([0, 8])  // max depth of quadtree
    .range(["#efe", "#060"]);

var svg = d3.select("body").append("svg")
    .attr("width", 2*width)
    .attr("height", 6+height)

/*
    svg.append("image")
        .attr("xlink:href", "./methane_graph.svg")
        .attr("x",0)
        .attr("y", 0)
        .style("width", '100%') // * 1.211)
        .style("height", '100%') // * 1.211);
*/




var rect = svg.selectAll(".node")
    .data(nodes.nodes)
  .enter().append("rect")
    .attr("id", function(d) { return "node_"+d.c; })
    .attr("class", "node")

    .attr('fill','none')
      .attr('stroke','#ccc')
      .attr('cursor','pointer')



    .attr("x", function(d) { return d.x1+3; })
    .attr("y", function(d) { return d.y1+2; })
    .attr("width", function(d) { return d.x2 - d.x1; })
    .attr("height", function(d) { return d.y2 - d.y1; })
    .style("opacity",0);
var count=0;
var point = svg.selectAll(".point")
    .data(nodes.leaves)
  .enter().append("circle")

      .attr('fill','#fff')
      .attr('stroke','steelblue')
      .attr('stroke-width','1.5px')
    .attr("class", function(d) { return "point "+d.classes; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 3);

// PDS Collect a list of nodes to draw rectangles, adding extent and depth data
