
function parseColour(color) {
    var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
    return {
        hex: "#" + arr.slice(0, 3).map(toHex).join(""),
        opacity: arr.length == 4 ? arr[3] : 1
    };
}
function toHex(int) {
    var hex = int.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


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
