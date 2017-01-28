
///classes and defns
class nc2D {
  constructor(name, width, arr_type) { //Float32Array
    this.width = dims[width];
    this.arr_type = arr_type;
    this.data = new arr_type(reader.getDataVariable(name));
  }
};

nc2D.prototype.row = function (index) {
   var start = index*this.width;
   return new this.arr_type(this.data.slice(start,start+this.width))
}

var print = (d) => console.log(d);
const width = window.innerWidth;
const height = window.innerHeight;

var test = []



///file read
var reader,reader_url,dims, file;
// read browser, adjust from there try except

if(window.location.hash === ''){
  // Get the modal
  closeNav()
  var modal = document.getElementById('myModal');
  modal.style.display = "block";

 } else {
   document.getElementById('myModal').remove();
   file = window.location.hash.replace('#','');
      try{
        const fs = require('fs');
        const data = fs.readFileSync(__dirname+'/'+file+'.nc');
        reader = new netcdfjs(data);
        ncparse(reader);
        }catch (err) {
        console.log('switching to browser mode',err)
        var urlpath = document.URL + file + ".nc"
        var oReq = new XMLHttpRequest();
        oReq.open("GET", urlpath, true);
        oReq.responseType = "blob";

        oReq.onload = function(oEvent) {
          var blob = oReq.response;
          reader_url = new FileReader();
          reader_url.onload = function(e) {
               reader = new netcdfjs(this.result);
               ncparse(reader);
               (function(){draw()})()
              }
          reader_url.readAsArrayBuffer(blob);
        };
        oReq.send(); //start process
      }


}


 function ncparse (reader){
                //all parts we require from the netcdf file
                reader.dimensions.forEach(function(d){dims[d.name] = d.size},dims={});
                const concentration = new nc2D('concentration','specs',Float32Array);
                const flux = new nc2D('edge-length','fluxes',Float32Array);
                const dict = JSON.parse(reader.getDataVariable('nodes').join(''));
                const combine = JSON.parse(reader.getDataVariable('combinations').join(''));
                const tar = reader.getDataVariable('target');
                const src = reader.getDataVariable('source');
                const time = reader.getDataVariable('timeseconds');

                  // creates reverse dictionary rdict below
                 var rdict,nodes,i;
                  Object.keys(dict).forEach(function(d){var i = dict[d];rdict[i]=d;}, rdict={}, nodes=[]);

                window.nodes =[];for (i = 0; i < combine.length; i++) { window.nodes.push({"names":rdict[i],"id":i,"x":2*(0.5-Math.random()),
                  "y":2*(0.5-Math.random()),"z":0.5-Math.random()}) };

                const formatTime = d3.timeFormat("%b %d, %H:%M");
                  //time => datetime
                const datetime=time.map(function(e){
                      var utcSeconds = e;var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                      d.setUTCSeconds(utcSeconds);
                      return d });


                window.ncdata ={concentration,flux,dict,rdict,combine,tar,src,formatTime,datetime,dims};

                var select = document.getElementById('end');
                var select1 = document.getElementById('start');

                datetime.forEach((d,i)=> {

                var opt = document.createElement('option');
                opt.value = i;
                opt.innerHTML = formatTime(d);
                select.appendChild(opt);

                var opt1 = document.createElement('option');
                opt1.value = i;
                opt1.innerHTML = formatTime(d);
                select1.appendChild(opt1);



                });



                /*
                  .data(time).enter()
                  .append('option')
                    .text(function (d) { return formatTime(datetime[d]); });
*/


}


//get smiles strings and species data

window.csvdata=[];
window.N=[] ;
window.C=[];

var inorganics= 'O,O3,O1D,O2,OH,NO,NO2,NO2N2O5,H2O2,HO2,HO2NO2,HONO,HNO3,CO,SO2,SO3,NA'.split(',')
inorganics.forEach(function(d){
  if (Object.keys(ncdata.dict).indexOf(d) >= 0 ) {
         if (/^(.*[N].*)$/.test(d)) window.N.push(d);
         if (/^(.*[Cc].*)$/.test(d)) window.C.push(d);
    }
  });

d3.csv("./fullmcmspecs.csv", function(error, csv) {window.csvdata=csv;
  for (var i = 0; i < csv.length; i++){
     var j = csv[i];
     if (Object.keys(ncdata.dict).indexOf(j.item) >= 0 ) {
         if (/^(.*[N].*)$/.test(j.smiles)) window.N.push(j.item);
         if (/^(.*[Cc].*)$/.test(j.smiles)) window.C.push(j.item);
    }
  };

});
