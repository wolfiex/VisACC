function timestep(t) {
  edge_len = flux.row(t);
  concs = concentration.row(t);

  combine.forEach(
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
  graphlinks = [];
  for (i = 0; i < combine.length; i++) {
    if (sign[i] !== 0) {
      graphlinks.push({
        source: src[i],
        target: tar[i],
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

  return { links: graphlinks, node_size };
}
