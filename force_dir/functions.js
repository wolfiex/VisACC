

function startgooey (){//SVG filter for the gooey effect
//Code based on http://tympanus.net/codrops/2015/03/10/creative-gooey-effec
/*<filter id="goo">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -1" result="goo" />
  <feBlend in="SourceGraphic" in2="goo" />
</filter>*/


var defs = svg.append("defs");
var filter = svg.append("defs")
	.append("filter")
	.attr("id","gooeyCodeFilter"); //use a unique id to reference again later on

//Append multiple "pieces" to the filter
filter.append("feGaussianBlur")
	.attr("in","SourceGraphic")
	.attr("stdDeviation","5")
	//to fix safari:
	//http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
	.attr("color-interpolation-filters","sRGB")
	.attr("result","blur");

filter.append("feColorMatrix")
	.attr("class","blurValues") //used later to transition the gooey effect
	.attr("in","blur")
	.attr("mode","matrix")
	.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5") //19 -9
	.attr("result","gooey");
//If you want the end shapes to be exactly the same size as without the filter
//add the feBlend below. However this will result in a less beautiful gooey effect
filter.append("feBlend")
	.attr("in","SourceGraphic")
	.attr("in2","gooey");
//Instead of the feBlend, you can do feComposite. This will also place a sharp image on top
//But it will result in smaller circles
filter.append("feComposite") //feBlend
 	.attr("in","SourceGraphic")
 	.attr("in2","gooey")
 	.attr("operator","atop");

//Apply the filter to the group element of all the circles




filter.append("stop")
    .attr("offset", "0%")
    .style("stop-opacity", "0");

    filter.append("stop")
        .attr("offset", "20%")
        .style("stop-opacity", "0.2");

filter.append("stop")
    .attr("offset", "100%")
    .style("stop-opacity", 0);


};




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





function heatmap(d) {
    ctxheat.beginPath();
    ctxheat.moveTo(d.source.x, d.source.y);
    ctxheat.quadraticCurveTo(1.2*(d.source.x+d.target.x)/2 , 1.2*(d.source.y+d.target.y)/2 ,d.target.x, d.target.y);
    //context.lineTo(d.target.x, d.target.y);
    colour = d3.interpolate("red", "green")
    ctxheat.strokeStyle =(colour(d.value));
    ctxheat.lineWidth= 0.6 + 8*(0.3+(1-d.value));
    if (d.dir != 0){
    ctxheat.setLineDash([5, 2]);
    }
    ctxheat.filter = "blur(20px)";
    //console.log(d)

    ctxheat.stroke(); // draw stroke
    ctxheat.closePath();
    }



function drawLink(d) {
        context.beginPath();
        context.moveTo(d.source.x, d.source.y);
        context.quadraticCurveTo(1.2*(d.source.x+d.target.x)/2 , 1.2*(d.source.y+d.target.y)/2 ,d.target.x, d.target.y);
        //context.lineTo(d.target.x, d.target.y);

        context.strokeStyle =(window.color(d.value));
        context.lineWidth= 0.6 + 8*(0.3+(1-d.value)/3);
        if (d.dir != 0){
        context.setLineDash([5, 2]);
        }
        context.filter=''
        //console.log(d)

        context.stroke(); // draw stroke
        context.closePath();
        }




function textify(d,i){
    var txt_width = 40;//node_sizes[i];
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


var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.


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

        alert("The file has been succesfully saved");
   });

}
