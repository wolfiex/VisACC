var ThreeLayout;

(

function (ThreeLayout) {

    var Graph = ThreeLayout.Graph = (function () {
        function Graph(parentObject, graph) {
            var _this = this;
            var n = graph.nodes.length
            this.edgeList = [];
            this.parentObject = parentObject;
            this.rootObject = new THREE.Object3D();
            parentObject.add(this.rootObject);
            // Create all the node meshes
            this.nodeMeshes = Array(n);
            for (var i = 0; i < n; ++i) {
                var sphere = this.nodeMeshes[i] = new THREE.Mesh(
                  new THREE.SphereGeometry(2+10*graph.nodes[i].s,  50, 50), //radius, segments, rings
                  new THREE.MeshPhongMaterial( {
          color: window.color1(graph.nodes[i].s),
          specular: 0x050505,
          shininess: 100
      } )
                     //new THREE.MeshLambertMaterial({ color: window.color1(graph.nodes[i].s)})
                   );
                this.rootObject.add(sphere);
            }
            // Create all the edges
            graph.links.forEach(function (e) {
                _this.edgeList.push(
                  new Edge(_this.rootObject, _this.nodeMeshes[e.source.index].position,
                     _this.nodeMeshes[e.target.index].position,e.value));
            });
        }
        Graph.prototype.setNodePositions = function (graph) {

            for (var i = 0; i < this.nodeMeshes.length; ++i) {1
                var p = this.nodeMeshes[i].position;
                var nd = graph.nodes[i]
                p.x = nd.x;
                p.y = nd.y;
                p.z = nd.z;
                this.nodeMeshes[i].position = p             }
        };
        Graph.prototype.update = function () {
            this.edgeList.forEach(function (e) { return e.update(); });
        };
        // Remove self from the scene so that the object can be GC'ed
        Graph.prototype.destroy = function () {
            this.parentObject.remove(this.rootObject);
        };
        return Graph;
    })();


    var Edge = ThreeLayout.Edge = (function () {
        function Edge(parentObject, sourcePoint, targetPoint,strength ) {
            this.parentObject = parentObject;
            this.sourcePoint = sourcePoint;
            this.targetPoint = targetPoint;
            this.strength=strength;
            this.shape = this.makeCylinder();
            parentObject.add(this.shape);

        }

        Edge.prototype.makeCylinder = function () {
            var n = 12, points = [], cosh = function (v) { return (Math.pow(Math.E, v) + Math.pow(Math.E, -v)) / 2; };
            var xmax = 2, m = 2 * cosh(xmax);
            for (var i = 0; i < n + 1; i++) {
                var x = 2 * xmax * (i - n / 2) / n;
                points.push(new THREE.Vector3(cosh(x) / m, 0, (i - n / 2) / n));
            }
            var material =   new THREE.MeshPhongMaterial( {
    color: window.color(this.strength),
    specular: 0x050505,
    shininess: 100
} )
//new THREE.MeshLambertMaterial({ color: window.color(this.strength)}),
                 geometry = new THREE.LatheGeometry(points, 12),
                 cylinder = new THREE.Mesh(geometry, material);
            return cylinder;
        };

        Edge.prototype.update = function () {
            var a = this.sourcePoint, b = this.targetPoint;
            var m = new THREE.Vector3();
            m.addVectors(a, b).divideScalar(2);
            this.shape.position = m;
            var origVec = new THREE.Vector3(0,0,1); //vector of cylinder
            var targetVec = new THREE.Vector3();
            targetVec.subVectors(b, a);
            var l = targetVec.length();

            this.shape.scale.set(1,2, l);
            //this.shape.scale.set(parseInt(4*this.strength), parseInt(4*this.strength) , l);

            targetVec.normalize();
            var angle = Math.acos(origVec.dot(targetVec));
            var axis = new THREE.Vector3();
            axis.crossVectors(origVec, targetVec);
            axis.normalize();
            var quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(axis, angle);
            this.shape.quaternion = quaternion;
        };
        return Edge;
    })();


})

(ThreeLayout || (ThreeLayout = {}));
