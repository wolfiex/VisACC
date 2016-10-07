
var tree3d;
(function (tree3d) {
    var Graph = (function () {
        function Graph(parentObject, nodes, edges, nodeColour) {
            var _this = this;
            var n = nodes.length
            this.edgeList = [];
            this.parentObject = parentObject;
            this.rootObject = new THREE.Object3D();
            parentObject.add(this.rootObject);
            // Create all the node meshes
            this.nodeMeshes = Array(n);
            for (var i = 0; i < n; ++i) {
                var sphere = this.nodeMeshes[i] = new THREE.Mesh(new THREE.SphereGeometry(1+3*nodes[i].s,  0, 0),
                    new THREE.MeshLambertMaterial({ color: nodeColour[i] }));
                this.rootObject.add(sphere);
            }
            // Create all the edges
            edges.forEach(function (e) {
                _this.edgeList.push(new Edge(_this.rootObject, _this.nodeMeshes[e.source].position, _this.nodeMeshes[e.target].position));
            });
        }
        Graph.prototype.setNodePositions = function (nodeCoords) {
            var x = nodeCoords[0], y = nodeCoords[1], z = nodeCoords[2];
            for (var i = 0; i < this.nodeMeshes.length; ++i) {1
                var p = this.nodeMeshes[i].position;
                p.x = x[i];
                p.y = y[i];
                p.z = z[i];
            }
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

tree3d.Graph = Graph;
    var Edge = (function () {
        function Edge(parentObject, sourcePoint, targetPoint) {
            this.parentObject = parentObject;
            this.sourcePoint = sourcePoint;
            this.targetPoint = targetPoint;
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
            var material = new THREE.MeshLambertMaterial({ color: 0xcfcfcf }), geometry = new THREE.LatheGeometry(points, 12), cylinder = new THREE.Mesh(geometry, material);
            return cylinder;
        };
        Edge.prototype.update = function () {
            var a = this.sourcePoint, b = this.targetPoint;
            var m = new THREE.Vector3();
            m.addVectors(a, b).divideScalar(2);
            this.shape.position = m;
            var origVec = new THREE.Vector3(0, 0, 1); //vector of cylinder
            var targetVec = new THREE.Vector3();
            targetVec.subVectors(b, a);
            var l = targetVec.length();
            this.shape.scale.set(1, 1, l);
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
    tree3d.Edge = Edge;
})

(tree3d || (tree3d = {}));


d3.json("../force_dir/locations.json", function (error, graph) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var sizeRatio = 1;
    var div = document.getElementById("graphdiv");
    renderer.setSize(window.innerWidth * sizeRatio, window.innerHeight * sizeRatio - div.offsetTop);
    div.appendChild(renderer.domElement);
    var ThreeObj = new THREE.Object3D();
    ThreeObj.position = new THREE.Vector3();
    scene.add(ThreeObj);
    var ambient = new THREE.AmbientLight(0x1f1f1f);
    scene.add(ambient);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    var color = d3.scale.category20();
    var nodeColourings = graph.nodes.map(function (v) {
        var str = color(v.group).replace("#", "0x");
        return parseInt(str);
    });

    console.log(graph);

    all_planes =  new THREE.Object3D();//create an empty container to hold apll plane groups
    material = new THREE.MeshNormalMaterial({color: 0xFFFF00, transparent: true,opacity: .34});
    square_size = 450

    plane = new THREE.Mesh(new THREE.PlaneGeometry(square_size, square_size),material);
    //plane.material.color.setHex( 0xffffff );
    plane.material.side = THREE.DoubleSide;
    plane.position.x = 0;
    all_planes.add(plane)

    plane1 = new THREE.Mesh(new THREE.PlaneGeometry(square_size, square_size),material);
    //plane.material.color.setHex( 0xffffff );
    plane1.material.side = THREE.DoubleSide;
    plane1.position.z = 100;
    plane1.position.x = 0
    all_planes.add(plane1)

    plane2 = new THREE.Mesh(new THREE.PlaneGeometry(square_size, square_size),material);
    //plane.material.color.setHex( 0xffffff );
    plane2.material.side = THREE.DoubleSide;
    plane2.position.z = -100;
    plane2.position.x = 0
    all_planes.add(plane2)

    // rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
    // Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
    //plane.rotation.z = Math.PI / 2;



    scene.add(all_planes);

    dict ={};
    var step;
    for (step = 0; step < graph.nodes.length; step++) {
    dict[graph.nodes[step].id]= step;
    };

    window.dim=graph.dims
    graph.links = graph.links.filter(function(d){d.value = 1*d.value;d.source=dict[d.source.id]; d.target=dict[d.target.id]; return d});
    //graph.nodes.filter(function(d){x.push(d.x/2);y.push(d.y/2),z.push((dict[d.id] % 2 === 0)? 100:0 )},x=[],y=[],z=[]);
    graph.nodes.filter(function(d){x.push(d.x/2);y.push(d.y/2);z.push((d.s<0.33)?-100:((d.s>0.66)?100:0))},x=[],y=[],z=[]);


    var ThreeGraph = new tree3d.Graph(ThreeObj, graph.nodes, graph.links, nodeColourings);





//  dist of camera
    camera.position.z = 450;
    var xAngle = 0;
    var yAngle = 0;
    document.onmousedown = mousedownhandler;
    document.onmouseup = mouseuphandler;
    document.onmousemove = mousemovehandler;
    var mouse = {
        down: false,
        x: 0, y: 0,
        dx: 0, dy: 0
    };
    function mousedownhandler(e) {
        mouse.down = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    function mouseuphandler(e) {
        mouse.down = false;
    }
    function mousemovehandler(e) {
        if (mouse.down) {
            mouse.dx = e.clientX - mouse.x;
            mouse.x = e.clientX;
            mouse.dy = e.clientY - mouse.y;
            mouse.y = e.clientY;
        }
    }

    var render = function () {
        xAngle += mouse.dx / 100;
        yAngle += mouse.dy / 100;
        ThreeObj.rotation.set(yAngle, xAngle, 0);
        all_planes.rotation.set(yAngle, xAngle, 0);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
    ThreeGraph.setNodePositions([x,y,z])
    ThreeGraph.update();
// Update all the edge positions
});
//# sourceMappingURL=3dtree.js.map
