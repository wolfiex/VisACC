
function heatmap(){
saveloc(window.graph);
window.simulation.stop();
var cmd = 'python src/heatmap.py '+window.innerWidth+' '+window.innerHeight+ ' 30'
var child = require('child_process').exec(cmd,
   function (error, stdout, stderr) {
		 console.log(stdout);
	   child.stdout.pipe(process.stdout);
		 var ifr = document.getElementById('heatmapiframe')
		 ifr.width=window.width;
		 ifr.height=window.height;
		 ifr.src='./heatmap.html';
	 	 });

     document.getElementById('heatmapiframe').src='./heatmap.html';
}



function groupselect(){

simulation.stop();


var mySVG = d3.select("#selector").append("svg").attr('width',width).attr('height',height).on('dblclick', polyClick), point =[];
var w = window.width/2 , h=window.height/2;

function polyClick() {
  point.push(d3.mouse(this));
  if (point.length>2) drawPoly(point);

  function drawPoly(point) {
    d3.select(".p").remove();
    mySVG.append("svg:polygon")
      //.style("fill", "red")
      .attr("points", [].concat.apply([], point) );

    simulation.nodes().filter(function(d) {
      var w = d.x + window.width/2 , h = d.y + window.height/2;
      inside = d3.polygonContains( point, [w,h] );

      if (inside){ console.log(d.name);
        mySVG.append("text").text(d.name).attr('x',w).attr('y',h).style('fill', 'white');
        };
      })

  }}


}






function drawLink(d) {
        context.beginPath();
        context.moveTo(d.source.x, d.source.y);

        //quardratic cubic
        context.quadraticCurveTo(1.2*(d.source.x+d.target.x)/2 , 1.2*(d.source.y+d.target.y)/2 ,d.target.x, d.target.y);
        //console.log(  '---'     ,Math.sqrt(Math.pow(Math.abs(d.source.x-d.target.x),2)+ Math.pow(Math.abs(d.source.y-d.target.y),2))/2.0 );

        //var radius = Math.sqrt(Math.pow(Math.abs(d.source.x-d.target.x),2)+ Math.pow(Math.abs(d.source.y-d.target.y),2))/2.0 ;

        //context.arc(width+(d.target.x+d.source.x)/2, height+(d.target.y+d.source.y)/2,radius,0,Math.pi)

        //linear
        //context.lineTo(d.target.x, d.target.y);

        context.strokeStyle =(window.color(d.value));
        context.lineWidth= 0.1 + 8*(0.2+(1-d.value)/3);
        if (d.dir != 0){
        context.setLineDash([5, 2]);
        }
        context.filter=''
        //console.log(d)

        context.stroke(); // draw stroke
        context.closePath();
        }




function textify(d,i){
    var txt_width = 20;//node_sizes[i];
	var fontsize = fitTextOnCanvas(d.name, "Fredericka the Great",2*txt_width);
    context.fillText(d.name,d.x,d.y);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    }





function fitTextOnCanvas(text, fontface,t_width){ return measureTextBinaryMethod(text, fontface, 0, 600, t_width); }

function measureTextBinaryMethod(text, fontface, min, max, desiredWidth) {
	if (max-min < 1) { return min; }

	var test = min+((max-min)/2); //Find half interval
	context.font=test+"px "+fontface;
	measureTest = context.measureText(text).width;
	if ( measureTest > desiredWidth) {
		var found = measureTextBinaryMethod(text, fontface, min, test, desiredWidth)
	} else {
		var found = measureTextBinaryMethod(text, fontface, test, max, desiredWidth)
	}
	return found;
}







/*


font-family: 'Open Sans', sans-serif;

font-family: 'Lato', sans-serif;

font-family: 'Fredericka the Great', cursive;


*/








// controls
function savecanvas(canvas){

    simulation.stop();
    //add svg to canvas

    d3.selectAll('circle').style('fill-opacity','0.79')

    var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg1 = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg1);
    img.onload = function() {
    //plot svg on canvas
    context.drawImage(img, 0, 0);
    //replot text
    context.fillStyle = 'black';
    graph.nodes.forEach(savetext);
    context.restore();
    // open image in new window for saving
//    window.open(canvas.toDataURL('png'));


var image = window.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.


window.location.href=image;

      };


    img.src = url;
    function savetext(d,i){
    var txt_width = node_sizes[i];
	var fontsize = fitTextOnCanvas(d.name, "Fredericka the Great",2*txt_width);
    context.fillText(d.name,d.x+width/2,d.y+height/2);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    //context.font = "30px Arial";
    }
    }


function saveloc(graph){
  var fs = require('fs');

  var filepath = "locations.json";// you need to save the filepath when you open the file to update without use the filechooser dialog againg
  var content = JSON.stringify(graph);

  fs.writeFile(filepath, content, function (err) {
        if(err){
              alert("An error ocurred updating the file"+ err.message);
              console.log(err);
              return;
        }

        console.log("The file has been succesfully saved");
   });

}



 function zoomed() {
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(d3.event.transform.x, d3.event.transform.y);
      context.scale(-d3.event.transform.k, -d3.event.transform.k);
      drawPoints();
      context.restore();
    }

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
