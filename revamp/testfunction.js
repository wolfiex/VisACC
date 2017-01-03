function ropaplot (){

var spec  = dict['NO'];

var loss_id = src.reduce(function(a, e, i) {
    if (e === spec)
        a.push(i);
    return a;
}, []);   // find all index values

var prod_id = tar.reduce(function(a, e, i) {
    if (e === spec)
        a.push(i);
    return a;
}, []);   // find all index values


var prod = [];
var loss = [];


p_f = (e)=> prod.push(e);
l_f = (e)=> loss.push(e);

prod_id.forEach((z)=> {var d = combine[z]; d[0].forEach(p_f); d[1].forEach(l_f)});
loss_id.forEach((z)=> {var d = combine[z]; d[1].forEach(p_f); d[0].forEach(l_f)});

prod = new Set(prod);
loss = new Set(loss);



//ropa : http://bl.ocks.org/deciob/raw/ffd5c65629e43449246cb80a0af280c7/

}
