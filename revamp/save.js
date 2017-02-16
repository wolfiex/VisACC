
function savesvg (global) {
  var document = global.document,
      body = document.body,
      forEach = Array.prototype.forEach,
      styles = document.querySelectorAll("style");

  forEach.call(document.querySelectorAll("svg"), function(svg) {
    if (svg.namespaceURI !== "http://www.w3.org/2000/svg") return; // Not really an SVG.
    if (svg.ownerSVGElement) return; // An SVG within another SVG.

    forEach.call(styles, function(style) { svg.appendChild(style.cloneNode(true)); });

    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        image = new Image,
        ratio = global.devicePixelRatio || 1,
        width = svg.getAttribute("width") * ratio,
        height = svg.getAttribute("height") * ratio,
        url = URL.createObjectURL(new Blob([(new XMLSerializer).serializeToString(svg)], {type: "image/svg+xml"}));

    image.onload = function() {
      context.drawImage(this, 0, 0, width, height);
      url = URL.revokeObjectURL(url);
      canvas.toBlob(function(blob) {
        var a = document.createElement("a");
        a.download = "untitled.png";
        a.href = url = URL.createObjectURL(blob);
        body.appendChild(a);
        a.click();
        setTimeout(function() {
          url = URL.revokeObjectURL(url);
          body.removeChild(a);
        }, 10);
      });
    };

    canvas.width = width;
    canvas.height = height;
    image.src = url;
  });
}

//(this);
