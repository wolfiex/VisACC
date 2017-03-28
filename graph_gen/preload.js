var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext("2d"), searchRadius = 400;

var color = d3.scaleOrdinal().range(d3.schemeCategory20);

///classes and defns
class nc2D {
  constructor(name, width, arr_type) {
    //Float32Array
    this.width = dims[width];
    this.arr_type = arr_type;
    this.data = new arr_type(reader.getDataVariable(name));
  }
}
nc2D.prototype.row = function(index) {
  var start = index * this.width;
  return new this.arr_type(this.data.slice(start, start + this.width));
};
