import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { CSG } from 'three-csg-ts';
import "./style.css"

var exporter = new STLExporter();
window.exporter = exporter;

//Initialize scene
const scene = new THREE.Scene();
window.scene = scene;

const sizes = {
  width: window.innerWidth / 1.25,
  height: window.innerHeight,
}

//Create the camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 150;

//Create some light
const light = new THREE.PointLight( 0xffffff, 4);
light.position.set( 200, 300, 2000 );
scene.add( light );

// deletes all meshes in scene
function deleteStencil()
{
  for (let i = scene.children.length - 1; i >= 0; i--)
  {
    if(scene.children[i].type === "Mesh")
    {
      if (scene.children[i].name === "temp")
      {
        continue;
      }
      scene.remove(scene.children[i]);
    }
  }
}

window.deleteStencil = deleteStencil;

// creates a temporary backplate to prevent flashing when updating stencil
function tempBackplate()
{
  const geometry = new THREE.BoxGeometry( backPlateXInput.value, backPlateYInput.value, backPlateZInput.value);
  const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
  const tempPlate = new THREE.Mesh( geometry, material );
  tempPlate.rotation.x = Math.PI / 2;
  tempPlate.rotation.y = Math.PI;
  tempPlate.rotation.z = Math.PI;
  tempPlate.name = "temp";
  scene.add(tempPlate);
  setTimeout(function(){
    scene.remove(tempPlate);
  }, 10);
}
window.tempBackplate = tempBackplate


const fontLoader = new FontLoader(); 

function updateText()
{
  let fileName = 'node_modules/three/examples/fonts/' + fontChoiceInput.value + '.json';
  
  fontLoader.load(
    fileName,
    (droidFont) => {
      
    const textGeometry = new TextGeometry(textInput.value, {
    height: 100,
    size: fontSizeInput.value,
    font: droidFont,
  });
  const geometry = new THREE.BoxGeometry( backPlateXInput.value, backPlateYInput.value, backPlateZInput.value );
  const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.geometry.center();

  //console.log(textPosXInput.value)
  textMesh.position.x = textPosXInput.value - 0; // only works when subtracting a number??
  textMesh.position.y = textPosYInput.value - 0;

  textMesh.position.z = -1;
  textMesh.updateMatrix();
  cube.updateMatrix();

  const subRes = CSG.subtract(cube, textMesh);
  subRes.rotation.x = Math.PI / 2;
  subRes.rotation.y = Math.PI;
  subRes.rotation.z = Math.PI;
  //console.log("x pos is " + textMesh.position.x + " and y pos is " + textMesh.position.y)
  scene.add(subRes);
  window.subRes = subRes;
  }
  );
}

updateText();
window.updateText = updateText;

const size = 120;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );


//Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene,camera);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 130, 0);
controls.maxPolarAngle = Math.PI / 2
controls.update();

//Resize
window.addEventListener('resize', () =>{
  //Update sizes
  sizes.width = window.innerWidth / 1.25
  sizes.height = window.innerHeight

  //Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

//Animation loop
function animate() {
    renderer.render(scene, camera);
    // .rotation.y += 0.002;
    requestAnimationFrame(animate);
}

animate();
