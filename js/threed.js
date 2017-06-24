var scene, camera;
var renderer, model3d;
var canvas3d, corners3d;
var posit, modelSize;

function initModel(width, height) {
    console.log("init 3D model");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 150;
    camera.lookAt(new THREE.Vector3(0, 0, 40));

    // create a render and set the size
    renderer = new THREE.WebGLRenderer({
        antialias: true,       //是否开启反锯齿  
        precision: "highp",    //着色精度选择  
        alpha: true,           //是否可以设置背景色透明  
        premultipliedAlpha:false,  
        stencil:false,  
        preserveDrawingBuffer:true, //是否保存绘图缓冲  
        maxLights:1           //maxLights:最大灯光数  
    }); 
    // render.setClearColor(new THREE.Color(0x000, 1.0));
    renderer.setClearColor(0xFFFFFF, 0);
    //render.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    
    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(150, 150, 150);
    scene.add(spotLight);
    // add the output of the renderer to the html element
    canvas3d = document.getElementById("3D-canvas");
    canvas3d.appendChild(renderer.domElement);
    
    // call the render function
    model3d = new THREE.Object3D();
    var loader = new THREE.STLLoader();
    loader.load("./assets/beauty.stl", function (geometry) {
        //console.log(geometry);
        var mat = new THREE.MeshLambertMaterial({color: 0x7777ff});
        model3d = new THREE.Mesh(geometry, mat);
        //model3d.rotation.x = -0.5 * Math.PI;
        //model3d.scale.set(32, 32, 32);
        scene.add(model3d);
    });
    //drawModel();
    corners3d = [ {'x':0,'y':0}, {'x':width,'y':0}, {'x':width,'y':height}, {'x':0,'y':height} ];
    modelSize = 35;
    posit = new POS.Posit(modelSize, width);
}

function drawModel(shapes) {
    if (isTracking) {
        //model3d.rotation.z += 0.006;
        computerPos(shapes);
        renderer.render(scene, camera);
     //   model3d.rotation.x += 0.006;
    } else {
        canvas3d.style.display = "none";
    }
    // render using requestAnimationFrame
    //     requestAnimationFrame(render);
    
}

function computerPos(shapes){
    // convert corners coordinate - not sure why
    for (var i = 0; i < 4; i++) {
        corners3d[i].x = shapes[i].x - (width / 2);
        corners3d[i].y = (height / 2) - shapes[i].y;
    }
    // compute the pose from the canvas
    var pose = posit.pose(corners3d);
    // console.assert(pose !== null)
    if( pose === null ) return;
    

    //////////////////////////////////////////////////////////////////////////////////
    //      Translate pose to THREE.Object3D
    //////////////////////////////////////////////////////////////////////////////////
    var rotation = pose.bestRotation;
    var translation = pose.bestTranslation;

    model3d.scale.x = 60;
    model3d.scale.y = 60;
    model3d.scale.z = 60;

    model3d.rotation.x = -Math.asin(-rotation[1][2]);
    model3d.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
    model3d.rotation.z =  Math.atan2(rotation[1][0], rotation[1][1]);

    model3d.rotation.y -= 0.5;

   // model3d.rotation.x = 0;
   // model3d.rotation.y = 0.5;
   // model3d.rotation.z = 3.14;

    model3d.position.x =  translation[0];
    model3d.position.y =  translation[1];
    model3d.position.z = -translation[2];
}