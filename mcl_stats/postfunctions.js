function draw() {
  //background
/*
  d3
    .select("#svg")
    .append("rect")
    .style("width", width)
    .style("height", height)
    .style("fill", "#222");
*/
  //edges
  if (window.links) {
    window.dir ? gradedge() : edgebundle();
  }

  if (window.nodes) {
    //nodes
    d3
      .select("#svg")
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", d => (4 + d.z * 4) * scale)
      .attr("cx", d => (d.x*.9 +0.05) * width)
      .attr("cy", d => (d.y*.9 +0.05) * height)
      .style("fill", d=> '#222')
      .style("opacity",0.8)
      //window.labels ? "none" : "white")//"grey")
      .style("stroke",d=> 'white')//'#222')// {return window.tert(d.names.match('[Cc]')?0:d.names.match('[Nn]')?1:2 )})//window.blues(d.z))//''#08B9EF')
      .style("stroke-width", 1)//d=>.5+3*d.z)
      .style("fill-opacity", "1") //0.3 norma
      .style("stroke-opacity", window.labels ? .7 : 1)
      /*.style(
        "stroke",
        d => window.labels ? window.color(data.nodesize[d.id]) : "white"
    )*/
      .attr("id", d => "node" + d.names)
      .call(
        d3.drag()
        //.on("start", dragstarted)
        //.on("drag", dragged)
        // .on("end", dragended)
      )
      .on("mouseover", d => console.log(d))
      .append("title")
      .text(function(d) {
        return d.name;
      });
  }

  //labels

  if (window.labels) {
    d3
      .select("#svg")
      .append("g")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("x", d => (d.x*.9 +0.05) * width)
      .attr("y", d => (d.y*.9 +0.05) * height)
      .attr("text-anchor", "middle")
      .style("font-weight", 'medium')// "bold" )
      .style("font-size", d => 1 + 15 * d.z + "px")
      .style("fill", "black")
      .style("dominant-baseline", "middle")
      .style("alignment-baseline", "central")
      .style("text-shadow", "3px 3px 3px black;")
      //.attr("stroke", "black")
      //.attr("stroke-width", 0.3)
      .style("font-family", "ubuntu")
      //.style("text-decoration", "underline")
      .attr("id", d => "text" + d.id)
      .text(d => d.names);
  }
}

//use js to laod required libraries here
function edgebundle() {
  var names = data.nodes.map(d => d.names);
  var node_data = data.nodes.map(function(d) {
    return {x:(d.x*.9 +0.05) * width, y:(d.y*.9 +0.05) * height, col: 1 };
  });

  data.links.forEach(
    function(d) {
      if (d.source.id >= 0)
        link_data.push({
          source: names.indexOf(d.source.names),
          target: names.indexOf(d.target.names),
          lcol: d.v
        });
    },
    link_data = []
  );

  //console.log(link_data,'fdf',node_data, names)

  var fbundling = ForceEdgeBundling()
    .step_size(0.1)
    .compatibility_threshold(.3)//0.3)
    .nodes(node_data)
    .edges(link_data);
  var results = fbundling();

  var d3line = d3
    .line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .curve(d3.curveLinear);
  //plot the data
  for (var i = 0; i < results.length; i++) {
    var svg = d3.select("#svg");
    svg.style("width", width);
    svg.style("height", height);
    svg.style(
      "transform",
      "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")"
    );

console.log(results)
    svg
      .append("g")
      .append("path")
      .attr("d", d3line(results[i]))
      .attr("id", "link" + i)
      .style("fill", "none")
      .attr("stroke-width", 0.3+1*(1-data.links[i].v)) //  1.3 (d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
      .style("stroke-opacity",1)//(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
      .style("opacity", 1)//0.95)
      //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
      //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
      //.style('stroke', !group? window.blue:window.pink);
      .style("stroke",  window.color(link_data[i].lcol));
    var p = new Path2D(d3line(results[i]));
    //ctx.stroke(p)
    //ctx.fill(p);
  }
}

/*
Colour edges based on direction of colour




*/

function gradedge() {
  console.log("start", data);
  var names = data.nodes.map(d => d.names);
  var node_data = data.nodes.map(function(d) {
    return { x:(d.x*.9 +0.05) * width, y:(d.y*.9 +0.05) * height,  col: 1 };
  });
  //Append a defs (for definition) element to your SVG

  data.links.forEach(
    function(d) {
      if (d.source.id >= 0)
        link_data.push({
          source: names.indexOf(d.source.names),
          target: names.indexOf(d.target.names),
          lcol: d.v,
          dir: d.d
        });
    },
    link_data = []
  );

  if (link_data.length < 1) {
    var names = new Set(
      data.links.map(d => d.source) + data.links.map(d => d.target)
    );
    var node_data = [...names].map(d => data.nodes[d]);

    var node_data = node_data.map(function(d) {
      return { x: d.x * scale, y: d.y * scale, col: 1 };
    });

    data.links.forEach(
      function(d) {
        link_data.push({
          source: names.indexOf(d.source),
          target: names.indexOf(d.target),
          lcol: d.v,
          dir: d.d
        });
      },
      link_data = []
    );
  }

  var fbundling = ForceEdgeBundling()
    .step_size(0.1)
    .compatibility_threshold(0.45)
    .nodes(node_data)
    .edges(link_data);
  var results = fbundling();

  window.r = results;
  window.ld = link_data;
  window.nd = node_data;

  var d3line = d3
    .line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .curve(d3.curveLinear);
  //plot the data
  for (var i = 0; i < results.length; i++) {
    var svg = d3.select("#svg");
    svg.style("width", width);
    svg.style("height", height);
    svg.style(
      "transform",
      "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")"
    );
    var defs = svg.append("defs");
    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient").attr("id", "lg" + i);

    var r = results[i];
    var end = r.length - 1;

    if (link_data[i].d < 0) {
      var start = end, end = 0;
    } else {
      var start = 0;
    }

    var x = r[start].x - r[end].x;
    var y = r[start].y - r[end].y;
    var max = d3.max([x, y]);

    linearGradient
      .attr("x1", "10%")
      .attr("y1", "10%")
      .attr("x2", x / max * 85 + "%")
      .attr("y2", y / max * 85 + "%");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", '#FF520D'); //light blue

    //Set the color for the end (100%)
    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", '#FFAA0D'); //dark blue


      svg
        .append("g")
        .append("path")
        .attr("d", d3line(results[i]))
        .attr("id", "link" + i)
        .style("fill", "none")
        .attr("stroke-width", d => 3.2) //  1.3 (d) =>{(isFinite(edge_length[d.index]))? 10*window.edge_length[d] : 0.001} )
        .style("stroke-opacity",1)//(d) =>{(isFinite(edge_length[d.index]))? 1: 0.001} )
        .style("opacity", 1)//0.95)
        //attr("stroke-dashoffset", function(d) { return (d.new) ? "0%":6  }) //for dashed line
        //.attr("stroke-dasharray", function(d) { return (d.new) ? "6,6" : '1,0'} )
        //.style('stroke', !group? window.blue:window.pink);
        .style("stroke", "url(#lg" + i + ")");
      var p = new Path2D(d3line(results[i]));
      //ctx.stroke(p)
      //ctx.fill(p);
    }


}


var cat20 = d3.scaleOrdinal(d3.schemeCategory20);
var mcl

function mcl_plot (file = 'out.mcl'){

d3.text(file, function(text) {
  mcl = text.split('\n')
  mcl.pop()
  mcl = mcl.map(d => d.split('\t'))
  mcl.forEach( (d,i) => {

  d.forEach(e=>
  {
  d3.select('#node'+e).style('stroke',cat20(i))

  })

  })
});
console.log(mcl)

}
