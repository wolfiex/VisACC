var margin = {top: 10, right: 20, bottom: 20, left: 10},
    width = 410 - margin.right - margin.left,
    height = 310 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select('svg')//d3.select("body").append("svg")

    //.attr("width", width + margin.right + margin.left)
    //.attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width-10) + "," +margin.top + ")");

  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
	if (typeof d.nodes=="undefined") return;
    d.children=(d.nodes.length==0)?null:d.nodes;

	if (d.children!=null){
    if (typeof d.children[0]=="undefined") d.children[0] ={c:d.c+"_"+0};
    if (typeof d.children[1]=="undefined") d.children[1] ={c:d.c+"_"+1};
    if (typeof d.children[2]=="undefined") d.children[2] ={c:d.c+"_"+2};
    if (typeof d.children[3]=="undefined") d.children[3] ={c:d.c+"_"+3};
    }
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children=root.nodes;
  root.children.forEach(collapse);
  collapse(root)
  update(root);

d3.select(self.frameElement).style("height", "800px");

function update(source,delay) {
  delay = typeof delay=="undefined" ? 0 : delay;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 50; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("id", function(d) { return "node_tree_"+d.id; })
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click)
      .on("mouseover",function(d){
		  d3.selectAll("#node_"+d.c)
			.style("fill","lightsteelblue")
			.style("opacity",0.4);
		d3.selectAll(".square_"+d.c)
			.style("stroke","red")
			.attr("r",5) ;

      })
      .on("mouseout",function(d){
		  d3.selectAll("#node_"+d.c)
			.style("fill",null)
			.style("opacity",null);
		d3.selectAll(".square_"+d.c)
			.style("stroke",null)
			.attr("r",3) ;
     });

  nodeEnter.append("circle")

    .attr('fill','#fff')
    .attr('stroke','steelblue')
    .attr('stroke-width','1.5px')
  
      .attr("r", 1e-6)
      .style("fill", function(d) {

      	//if (d.verified)
      	//	return d.leaf?'pink':(d._children ? "lightsteelblue" :"red");
      	//return "steelblue";
      });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition().delay(delay)
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", function(d) { return (!d.verified || d.leaf || d._children || d.children)?4.5:0; })
      .style("fill", function(d) {
        console.log(d)
      	if (d.verified)
      		return d.leaf?
///heeeeereee
d3.selectAll(".square_"+d.c)[0][0].style

          :(d._children ? "lightsteelblue" :"#fff");
      	return "steelblue";
      });

  nodeUpdate.select("text")

      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition().delay(delay)
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")

      .attr('fill','none')
      .attr('stroke','#ccc')
      .attr('stroke-width','1.5px')


      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration).delay(delay)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration).delay(delay)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
