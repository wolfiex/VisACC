//const electron = require('electron');
var MemoryFileSystem = require("memory-fs");
//const NetCDFReader = require('netcdfjs');
console.log(fs);
//var newfn = fs.readFile;
var fs = new MemoryFileSystem();
console.log(fs);

//const NetCDFReader = require('netcdfjs');
var data = fs.readFileSync(__dirname + "/volcano.nc");
//var reader = new NetCDFReader(data); // read the header
console.log(data)
