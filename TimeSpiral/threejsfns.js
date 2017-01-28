
// three.js animataed line using BufferGeometry

var renderer, scene, camera;




	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// scene
	scene = new THREE.Scene();

	// camera
	camera = new THREE.PerspectiveCamera( 145, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 1000 );

controls = new THREE.TrackballControls( camera );
controls.target.set( 0, 0, 0 )
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;

				controls.noZoom = false;
				controls.noPan = false;

				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;

				controls.keys = [ 65, 83, 68 ];

				controls.addEventListener( 'change', render );
	// geometry
	var geometry = new THREE.BufferGeometry();

	// attributes
	//geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

	// drawcalls
	drawCount = 2; // draw the first 2 points, only
	geometry.setDrawRange( 0, drawCount );

	// material
	//var material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

	// line
	//line = new THREE.Line( geometry,  material );
	//scene.add( line );

	// update positions
	//updatePositions();

  function render() {

  	renderer.render( scene, camera );

  }
