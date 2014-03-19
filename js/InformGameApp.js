var renderer = null;
var scene = null;

var controls = null;
var camera = null;

var spotLight;

var clock = null;

var animating = true;

var resMgr = null;

var keyPressed = [];

var exporter = {};

var inform = {};
var world = {};

var time = 0;

var player;
var playerTarget = null;

//***************************************************************************//
// initialize the renderer, scene, camera, and lights                        //
//***************************************************************************//
function onLoad()
{
    // Grab our container div
    var container = document.getElementById("container");

    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0);
    renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    // renderer.physicallyBasedShading = true;
    renderer.shadowMapCullFace = THREE.CullFaceBack;
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Put in a camera
    camera = new THREE.PerspectiveCamera( 20, 
        window.innerWidth / window.innerHeight, 1, 10000 );
        
    camera.position.set( 0, 50, -100);
    camera.lookAt(0, 0, 0);
    controls = new THREE.OrbitControls(camera);
    controls.noKeys = true;
    controls.addEventListener( 'change', render );

    // add lights
    initSceneLights();

    // scene specific stuff (add objects)
    populateScene();

    // Add a mouse up handler to toggle the animation
    addInputHandler();
    window.addEventListener( 'resize', onWindowResize, false );

    // add gui
    addGui();

    clock = new THREE.Clock();

    // init keyPressed
    for (var i=0; i<255; i++)
    {
        keyPressed[i] = false;
    }

    // Run our render loop
	run();
}

//***************************************************************************//
// Populate the scene with lights                                            //
//***************************************************************************//
function initSceneLights()
{
    // Create an ambient and a directional light to show off the object
    var dirLight = [];
    var ambLight = new THREE.AmbientLight( 0x777777 ); // soft white light
    dirLight[0] = new THREE.DirectionalLight( 0xffffff, 1);
    dirLight[0].position.set(0, 1, 1);
    dirLight[0].casrShadow = true;
    dirLight[1] = new THREE.DirectionalLight( 0xbbbbbb, 1);
    dirLight[1].position.set(0, -1, -1);

    scene.add( ambLight );
    // scene.add( dirLight[0] );
    // scene.add( dirLight[1] );


      // object spotlight
    spotLight = new THREE.SpotLight(0xFFFFEE, 1);
    spotLight.angle = Math.PI/2;
    spotLight.exponent = 12;
    spotLight.position.set(12, 40, 30);
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 10;
    spotLight.shadowCameraFar = 60;
    spotLight.shadowDarkness = 0.7;
    // spotLight.shadowCameraVisible = true;
    scene.add(spotLight);

}

//***************************************************************************//
// Populate the scene object with our objects                                //
//***************************************************************************//
function populateScene()
{
    resMgr = new ResourceManager();
    resMgr.initMaterials();

    // var axes = buildAxes(300);
    // scene.add(axes);

    var geo = new THREE.SphereGeometry(0.6, 12, 12);
    player = new THREE.Mesh(geo, resMgr.materials.character);
    // player.rotation.x = -Math.PI/2;
    player.position.set(0.5, 0, 0.5);
    player.castShadow = true;
    player.receiveShadow = true;
    scene.add(player);

    world = new World("art/test4.png");

    inform = new InformTable();
    inform.init();
    inform.rotation.x = -Math.PI/2;
    inform.applyHeights(world.getHeights());
    // inform.transform(transFunc);
    scene.add(inform);
}

var transFunc = function(x, y)
{
    return 2 + Math.cos(x*0.2 + time*0.1)*2 + Math.sin(y*0.3 + time*0.1)*2;
}

function addGui()
{
    var gui = new dat.GUI();
    inform.cooldown = 0.55;
    gui.add(inform, 'cooldown', 0, 1);
    gui.add(world.context, 'imageSmoothingEnabled');
/*
    var tmpF = f1.addFolder('Head Scale Vector');
    tmpF.add(genome.headJointsScaleFactor, 'x', 0.7, 1.2).onChange(onGeometryChanged);
    tmpF.add(genome.headJointsScaleFactor, 'y', 0.7, 1.2).onChange(onGeometryChanged);
    tmpF.add(genome.headJointsScaleFactor, 'z', 0.7, 1.2).onChange(onGeometryChanged);
    var f4 = f1.addFolder('EYE GEOMETRY');
    f4.add(genome, 'eyeRadius', 0, 10).onChange(onGeometryChanged);
    f4.add(genome, 'eyeLidRadius', 0, 13).onChange(onGeometryChanged);
    f4.add(genome, 'topLidAngle', 0, 2*Math.PI).onChange(onGeometryChanged);
    f4.add(genome, 'bottomLidAngle', 0, 2*Math.PI).onChange(onGeometryChanged);

    var f2 = gui.addFolder('TENTACLE GEOMETRY');
    f2.add(genome, 'tentBaseRadius', 0, 20).onChange(onGeometryChanged);
    f2.add(genome, 'numTents', 0, 32).onChange(onGeometryChanged);
    f2.add(genome, 'numJoints', 0, 50).onChange(onGeometryChanged);

    tmpF = f2.addFolder('Joint Scale Vector');
    tmpF.add(genome.jointScaleVector, 'x', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.jointScaleVector, 'y', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.jointScaleVector, 'z', 0.7, 1.3).onChange(onGeometryChanged);
    f2.add(genome, 'numSpikesPerJoint', 0, 10).onChange(onGeometryChanged);
    f2.add(genome, 'spikesArcStart', 0.0, 2*Math.PI).onChange(onGeometryChanged);
    f2.add(genome, 'spikesArcEnd', 0.0, 2*Math.PI).onChange(onGeometryChanged);
    tmpF = f2.addFolder("Spike Scale Vector");
    tmpF.add(genome.spikeScale, 'x', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.spikeScale, 'y', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.spikeScale, 'z', 0.7, 1.3).onChange(onGeometryChanged);
    f2.add(genome, 'tentColorInc', 0, 10).onChange(onGeometryChanged);
    f2.add(genome, 'tentColorBW').onChange(onGeometryChanged);

    var f3 = gui.addFolder('ANIMATION');
    f3.add(genome, 'tentFactor1', 0, 100);
    f3.add(genome, 'tentFactor2', 0, 50);
    f3.add(genome, 'tentFactor3', 0, 50);
    f3.add(genome, 'tentFactor4', 0, 50);

    var f5 = gui.addFolder('GEOMETRY DETAILS');
    f5.add(genome, 'sphereDetail', 0, 40).onChange(onGeometryChanged);
    f5.add(genome, 'cylinderDetail', 0, 40).onChange(onGeometryChanged);
    f5.add(genome, 'eyeDetails', 0, 20).onChange(onGeometryChanged);
*/
}

//***************************************************************************//
// render loop                                                               //
//***************************************************************************//
var t= -2 * Math.PI;
function run()
{
    var deltaMS = clock.getDelta()*1000;

    render();

    if (animating)
    {
        if (keyPressed[38]) {
            playerTarget = null;
            world.propel(0.2);
        }
        else if (keyPressed[40]) {
            playerTarget = null;
            world.propel(-0.2);
        }
        if (keyPressed[37]) {
            world.turn(0.01);
        }
        else if (keyPressed[39]) {
            world.turn(-0.01);
        }

        world.update();
        // handle player target (ride on monster)
        if (playerTarget != null) {
            world.pos.set(playerTarget.pos.x, playerTarget.pos.y, playerTarget.pos.z);
        }
        inform.applyHeights(world.getHeightsAbs());

        player.position.y = inform.cubes[15+15*30].position.z + 2.5;
    }

    // Ask for another frame
    requestAnimationFrame(run);
    controls.update();
}

// Render the scene
function render()
{
    renderer.render(scene, camera);    
}

//***************************************************************************//
// User interaction                                                          //
//***************************************************************************//
function addInputHandler()
{
    var dom = renderer.domElement;
    dom.addEventListener('mouseup', onMouseUp, false);
    dom.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
}

function onKeyDown(evt)
{
    var keyCode = getKeyCode(evt);
    keyPressed[keyCode] = true;

    console.log(keyCode);

    if (keyCode == 32) {
        animating = !animating;        
    }
    if (keyCode == 65) {    // a
        var a = new THREE.Vector3();
        console.log(world.pos);
        console.log(world.creature.pos);
        a.subVectors(world.pos, world.creature.pos);
        console.log(a.length());
        if (a.length() < 4) {
            playerTarget = world.creature;
        }
    }

    evt.preventDefault();
}

function onKeyUp(evt)
{
    var keyCode = getKeyCode(evt);

    keyPressed[keyCode] = false;
}

function onMouseDown(event)
{
    event.preventDefault();
}

function onMouseUp(event)
{
    event.preventDefault();
}

function onMouseMove(event)
{
    event.preventDefault();
    if (dragging) {
        var x = prevMouse.x - event.x;
        var y = prevMouse.y - event.y;
        camera.rotation.y -= x/1000;

        prevMouse.x = event.x;
        prevMouse.y = event.y;
    }
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getKeyCode(evt)
{
    if (window.event != null) 
        return window.event.keyCode;
    else
        return evt.which;
}

function map(i, sStart, sEnd, tStart, tEnd)
{
    var v = clip(i, sStart, sEnd);
    var sRange = sEnd - sStart;
    var tRange = tEnd - tStart;
    return tStart + (tRange*((v-sStart)/sRange));
}

function getFuncVal(t)
{
    return new THREE.Vector3(
        Math.sin(t*Math.cos(t)),
        Math.cos(t*Math.sin(t)),
        Math.cos(t*Math.tan(t))
        );
}

function clip(x, bottom, top)
{
    if (x < bottom) {
        x = bottom;
    }
    else if (x > top) {
        x = top;
    }

    return x;
}



function buildAxes( length ) {
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat; 

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}


