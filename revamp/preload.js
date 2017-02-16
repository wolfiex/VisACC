function load1() {
  svg = d3.select("svg");
  svg.style("width", width);
  svg.style("height", height);
  svg.style(
    "transform",
    "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")"
  );

  window.onresize = function(event) {
    location.reload();
  };
  window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);

  //d3.select('body').style('background-color', '#222'); // bg colour
  //var color = d3.scaleOrdinal(d3.schemeCategory20);

  window.nodes = window.C.map(function(i) {
    return {
      names: i,
      id: window.ncdata.dict[i],
      x: 2 * (0.5 - Math.random()),
      y: 2 * (0.5 - Math.random()),
      z: 0.5 - Math.random()
    };
  });

  timestep = 2 * 144;

  const edge_len = window.ncdata.flux.row(timestep);
  concs = window.ncdata.concentration.row(timestep);

  window.ncdata.combine.forEach(
    function(f) {
      var prod = new Set(f[0]);
      var loss = new Set(f[1]);

      var flx = 0;

      prod.forEach(function(i) {
        var j = edge_len[i];
        if (isFinite(j)) {
          flx -= j;
        }
      });
      loss.forEach(function(i) {
        var j = edge_len[i];
        if (isFinite(j)) {
          flx -= j;
        }
      });

      sign.push(Math.sign(flx));
      flx = Math.log10(Math.abs(flx));
      mylink.push(flx);
      if (isFinite(flx)) dummy.push(flx);
    },
    mylink = [],
    dummy = [],
    sign = []
  );

  //normalize
  var min = d3.min(dummy);
  var max = d3.max(dummy) - min;
  mylink = mylink.map(d => (d - min + 1e-6) / max);

  // create links object
  window.graphlinks = [];
  for (i = 0; i < window.ncdata.combine.length; i++) {
    if (sign[i] !== 0) {
      graphlinks.push({
        source: window.ncdata.src[i],
        target: window.ncdata.tar[i],
        v: Number(mylink[i].toFixed(3)),
        d: sign[i]
      });
    }
  }

  node_size = [];
  dummy = [];
  for (i = 0; i < concs.length; i++) {
    var f = concs[i];
    if (f > 0) {
      f = Math.log10(f);
      dummy.push(f);
    }
    node_size.push(f);
  }

  var min = d3.min(dummy);
  var max = d3.max(dummy) - min;

  node_size = node_size.map(d => (d - min + 1e-6) / max);

  run();
}
