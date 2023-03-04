import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { CSG } from "three-csg-ts";

// calls updateStencil() on input change
let fontSizeInput = document.getElementById("fontSlider");
fontSizeInput.addEventListener("input", function () {
  updateStencil(fontSizeInput);
});

let fontChoiceInput = document.getElementById("fontSelection");
fontChoiceInput.addEventListener("change", function () {
  updateStencil(fontChoiceInput);
});

let textPosXInput = document.getElementById("textPosX");
textPosXInput.addEventListener("input", function () {
  updateStencil(textPosXInput);
});

let textPosYInput = document.getElementById("textPosY");
textPosYInput.addEventListener("input", function () {
  updateStencil(textPosYInput);
});

let textInput = document.getElementById("textbox");
textInput.addEventListener("input", function () {
  updateStencil(textInput);
});

let backPlateXInput = document.getElementById("backPlateX");
backPlateXInput.addEventListener("input", function () {
  updateStencil(backPlateXInput);
});

let backPlateYInput = document.getElementById("backPlateY");
backPlateYInput.addEventListener("input", function () {
  updateStencil(backPlateYInput);
});

let backPlateZInput = document.getElementById("backPlateZ");
backPlateZInput.addEventListener("input", function () {
  updateStencil(backPlateZInput);
});

let exportButtonInput = document.getElementById("exportButton");
exportButtonInput.addEventListener("click", exportSTL);

// exports the scene as an stl file
function exportSTL() {
  orientSceneForExport();
  var str = exporter.parse(scene);
  orientSceneAfterExport();

  var blob = new Blob([str], { type: "text/plain" });
  var link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = textInput.value + ".stl";
  link.click();
} 

// calls helper methods in main.js
function updateStencil(e)
{
  deleteStencil();
  window.e = e;
  updateText();
}


const fontLoader = new FontLoader();

// used for camera, renderer, and resize
const sizes = {
  width: window.innerWidth / 1.33,
  height: window.innerHeight,
};

// global exporter to use in exportSTL()
var exporter = new STLExporter();
window.exporter = exporter;

// initialize scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xd4d4d4  );
window.scene = scene;

// create the camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 150;

// create some light
const ambient = new THREE.AmbientLight(0xffffff, 0.5)
const light = new THREE.PointLight(0xffffff, 0.5);
light.position.set(0, 300, 0);
scene.add(ambient);
scene.add(light);

// add grid to the scene
const gridHelper = new THREE.GridHelper(200, 30);
scene.add(gridHelper);

// create the renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// create the orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 130, 0);
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// window resize listener
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth / 1.33;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// animation loop
function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// deletes all meshes in scene
function deleteStencil() {
  tempBackplate();
  for (let i = scene.children.length - 1; i >= 0; i--) {
    if (scene.children[i].type === "Mesh") {
      if (scene.children[i].name === "temp") {
        continue;
      }
      scene.remove(scene.children[i]);
    }
  }
}
window.deleteStencil = deleteStencil;

// helper function for delteStencil() that creates a temporary
// backplate to prevent flashing when updating the stencil
function tempBackplate() {
  const geometry = new THREE.BoxGeometry(
    backPlateXInput.value,
    backPlateYInput.value,
    backPlateZInput.value
  );

  const material = new THREE.MeshStandardMaterial({ color: 0x7882ab });
  const tempPlate = new THREE.Mesh(geometry, material);
  tempPlate.position.set(0, backPlateZInput.value / 2, 0);
  tempPlate.rotation.set(Math.PI / 2, Math.PI, Math.PI);
  tempPlate.name = "temp";

  scene.add(tempPlate);

  setTimeout(function () {
    scene.remove(tempPlate);
  }, 5);
}
window.tempBackplate = tempBackplate;

// orient scene before exporter.parse(scene) is called
function orientSceneForExport() {
  scene.rotation.set(-Math.PI / 2, Math.PI, Math.PI);
  scene.updateMatrixWorld();
}
window.orientSceneForExport = orientSceneForExport;

// orient scene after exporter.parse(scene) is called
function orientSceneAfterExport() {
  scene.rotation.set(Math.PI, Math.PI, Math.PI);
  scene.updateMatrixWorld();
}
window.orientSceneAfterExport = orientSceneAfterExport;

// called whenever a input is changed
// creates and adds to the scene a new stencil per the specifications of inputs
function updateText() {
  let fileName =
    "fonts/" + fontChoiceInput.value + ".json";

  fontLoader.load(fileName, (droidFont) => {
    const textGeometry = new TextGeometry(textInput.value, {
      height: 100,
      size: fontSizeInput.value,
      font: droidFont,
    });

    const geometry = new THREE.BoxGeometry(
      backPlateXInput.value,
      backPlateYInput.value,
      backPlateZInput.value
    );

    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0x7882ab });
    const plate = new THREE.Mesh(geometry, plateMaterial);
    plate.position.set(0, backPlateZInput.value / 2, 0);

    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.geometry.center();

    textMesh.position.x = textPosXInput.value - 0; // only works when subtracting a number??
    textMesh.position.y = textPosYInput.value - 0;
    textMesh.position.z = -1;
    textMesh.updateMatrix();
    plate.updateMatrix();

    const subRes = CSG.subtract(plate, textMesh);
    subRes.rotation.set(Math.PI / 2, Math.PI, Math.PI);

    scene.add(subRes);
    window.subRes = subRes;
  });
}
updateText();
window.updateText = updateText;
