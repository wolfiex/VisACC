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

var print = d => console.log(d);
const width = window.innerWidth;
const height = window.innerHeight;

/* comment block



*/

function ncparse(reader, file) {
  //all parts we require from the netcdf file
  reader.dimensions.forEach(
    function(d) {
      dims[d.name] = d.size;
    },
    dims = {}
  );
  const concentration = new nc2D("concentration", "specs", Float32Array);
  //const flux = new nc2D("edge-length", "fluxes", Float32Array);
  const dict = JSON.parse(reader.getDataVariable("nodes").join(""));
  /*
  const combine = JSON.parse(reader.getDataVariable("combinations").join(""));
  const tar = reader.getDataVariable("target");
  const src = reader.getDataVariable("source");
  */
  const time = reader.getDataVariable("timeseconds");


  // creates reverse dictionary rdict below
  var rdict, nodes, i;
  Object.keys(dict).forEach(
    function(d) {
      var i = dict[d];
      rdict[i] = d;
    },
    rdict = {},
    nodes = []
  );

  window.formatTime = d3.timeFormat("%b %d \n %H:%M");
  //time => datetime
  const datetime = time.map(function(e) {
    var utcSeconds = e;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    return d;
  });

  console.log(file.replace(/\.nc/, ""), "Can display reactions on interaction");

  eval(
    "window." +
      file.replace(/\.nc/, "") +
      "={concentration,dict,rdict,datetime,dims};"//combine,tar,src,
  );
}

function newfile(file) {
  var ncfile;
  try {
    const fs = require("fs");
    const data = fs.readFileSync(
      __dirname.match(/(.*\/)/)[1] + "netcdf_results/" + file
    );
    reader = new netcdfjs(data);
    ncparse(reader, file);
  } catch (err) {
    console.log("switching to browser mode", err);
    var urlpath = document.URL.match(/(.*\/).*\//)[1] +
      "netcdf_results/" +
      file;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", urlpath, true);
    oReq.responseType = "blob";

    oReq.onload = function(oEvent) {
      var blob = oReq.response;
      reader_url = new FileReader();
      return reader_url.onload = function(e) {
        reader = new netcdfjs(this.result);
        return ncparse(reader, file);
      };
      reader_url.readAsArrayBuffer(blob);
    };
    oReq.send(); //start process
  }
  return eval("window." + file.replace(/\.nc/, ""));
}
