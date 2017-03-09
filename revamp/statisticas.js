// https://en.wikipedia.org/wiki/Centrality

var search = 128;
var linkmatch = graphlinks.filter(d => {
  if (d.source === search || d.target === search) return d;
});

var degree_centrality = linkmatch.lenght;

var lengthvalues = linkmatch.map(d => d.v);

//lenght between a node and all other nodes // often multiplied by number of nodes -1
var connected_closeness_centrality = 1 / d3.sum(lengthvalues);

var average_reactivity = d3.mean(lengthvalues);

var percent_shortest = d3.mean(lengthvalues.map(d => d < 0.3 ? 1 : 0));

var degree_shortest = d3.sum(lengthvalues.map(d => d < 0.3 ? 1 : 0));

//betweenness centrality
//
