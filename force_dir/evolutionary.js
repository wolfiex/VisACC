//importScripts('./node_modules/webhamsters/src/hamsters.min.js');//forwebworkers


var Gene = function(code) { if (code) this.code = code; };
Gene.prototype.code= [];
Gene.prototype[1]= false;

Gene.prototype.random = function() {
  var myArray = [];
  var limit = 4
  for (var i = 0; i < limit-1; i++) {   myArray.push(Math.floor(Math.random()*limit+Math.random()*limit));  }
  this.code=myArray;
};

Gene.prototype.mutate = function(chance) {
  if (Math.random() > chance) return;
  var index = Math.floor(Math.random() * this.code.length);
  var multiplier = Math.floor(Math.random() * 3);
  var upOrDown = Math.random() <= 0.5 ? - 0.1 : 0.1;
  this.code[index] += multiplier* upOrDown;
  this[1]=9999
};



Gene.prototype.mate = function(gene) {
  var swap = Math.round(this.code.length / 2) - 1;
  var dummy = this.code[swap];
  this.code[swap] = gene.code[swap];
  gene.code[swap] = dummy;

  var child1 = this.code;
  var child2 = gene.code;

  return [new Gene(child1), new Gene(child2)];
};



Gene.prototype.calcCost = function(compareTo) {
  var total = this.code.reduce(function(a, b) { return a + b; })
  this[1] = self.mfun(self.data,this.code)[0];
  if (this[1]<0.0000001){ this[1] = 999999}



};

var Population = function(size) {
  this.members = [];
  this.generationNumber = 0;
  this.size= size
  while (size--) {;
    var gene = new Gene();
    gene.random();
    this.members.push(gene);
  }
};


Population.prototype.generation = function(gen_num) {

  var lenswp = 0 ;
  for (var i = lenswp; i < this.members.length; i++) {
    this.members[i].mutate(1); //mutate all as we already have a copy of all the champions
    this.members[i].calcCost();
  }


  //only top 20% survive
/*
  var lenswp = Math.floor(this.size*0.3); // top 20% survive
  this.members.splice(lenswp, this.size);


  //rm duplicates
  self.members=this.members;
  this.members.filter(function(d) {a.push(String(d.code))},a=[]);
  set = new Set(a);
  set.forEach(function(d){inx.push(a.indexOf(d))},inx=[]);
  newmembers=[];
  inx.forEach(function (i){  newmembers.push(self.members[i]); })
  this.members=newmembers;
  //console.log(this.members.length,newmembers.length, self.members.length, inx.length);

  Array.prototype.push.apply(this.members,this.members)

  // unselected mating between top 20%
  for (var i = 0; i < Math.floor((this.size-lenswp)/2); i++) {
    var i0 = Math.floor(Math.random() * lenswp);
    var i1 = Math.floor(Math.random() * lenswp);
    var children = this.members[i0].mate(this.members[i1]);
    this.members.push(children[0]);
    this.members.push(children[1]);
  };
*/


  Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
      return a[1] - b[1];
    });
  }

/*
  //rm duplicates
  self.members=this.members;
  this.members.filter(function(d) {a.push(String(d.code))},a=[]);
  set = new Set(a);
  set.forEach(function(d){inx.push(a.indexOf(d))},inx=[]);
  newmembers=[];
  inx.forEach(function (i){  newmembers.push(self.members[i]); })
  this.members=newmembers;



  // new external species
  for (var i=0;i<this.size - this.members.length; i++){
    var gene = new Gene();
    gene.random();
    this.members.push(gene);
  }

  // dont mutate top 20%
  for (var i = lenswp; i < this.members.length; i++) {
    this.members[i].mutate(1); //mutate all as we already have a copy of all the champions
    this.members[i].calcCost();
  }
//per iteration cmd
*/





this.sort();
//progress
this.generationNumber++;
var scope = this;
if (this.generationNumber < gen_num){
  //console.log(gen_num,this.generationNumber);
  setTimeout(function() {
    scope.generation(gen_num);
  }, 30);


}else{
    //console.log('finished');//
    //this.display();
      console.log(gen_num,this.generationNumber,this.members.length);
    this.sort();
    this.members=this.members.slice(0,5)
    console.log(this.members);
    this.members.forEach(function(d){d.permutation = self.permutation; d.value = self.mfun(self.data,d.code); members.push(d); },members=[]);

    end(JSON.stringify(members));

}

};




self.data=[];



function fn (permutation) {return "self.mfun = function(d,code){var sm =0;for (var i=0; i<"+self.data.length+"; i++) {var log = Math.abs(Math.log((1-d[i])+0.00001)*(1/Math.log(code[2])));var pow = Math.pow(d[i],code[0]);        var root = Math.pow(d[i],1/code[1]);        var math ="+permutation[0]+"*log + "+permutation[1]+"*pow + "+permutation[2]+"*root;sm = sm+ Math.abs(math-0.5);}return Math.abs(sm/300);}"};



self.onmessage = function(e) {
  self.data= JSON.parse(e.data.edges);
  self.permutation = JSON.parse(e.data.permutation)
  eval(fn(permutation)); // make function as needed


  var population = new self.Population(30);
  population.generation(223);

};

function end (str){
    //console.log(str);
    postMessage({"info":str});
    console.log('closing')
    setTimeout(function() {
    //self.close()
  }, 9000);
};
