import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { PointsMaterial } from "three";

//Scene
const scene = new THREE.Scene();

//Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.set(0,2,0);
scene.add(ambientLight, pointLight);

//LoadingManager
const loadingManager = new THREE.LoadingManager();

//TextureLoader
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/texture/color.jpg");
const bumpTexture = textureLoader.load("/texture/bump.jpg");
const displacementTexture = textureLoader.load("/texture/displacementMap.jpg");

//Mesh
/*
const geometry = new THREE.PlaneGeometry(1, 1, 12, 12);
const material = new THREE.MeshStandardMaterial({ 
//  wireframe: true,
//  color: "purple" 
  map: colorTexture,
  bumpMap: bumpTexture,
  displacementMap: displacementTexture
});
const mesh = new THREE.Mesh(geometry, material);
*/

const geometry = new THREE.TorusGeometry(0.3, 0.2, 64, 64);
const material = new THREE.MeshStandardMaterial();
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const planeGeometry = new THREE.PlaneGeometry(3, 3);
const planeMaterial = new THREE.MeshStandardMaterial();
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI * 0.45;
planeMesh.position.y = -0.5;
scene.add(planeMesh);

//Camera
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
camera.position.z = 3;

scene.add(camera);  

//Renderer
const canvas = document.querySelector(".draw"); //Select the canvas
const renderer = new THREE.WebGLRenderer({ canvas }); //add WeBGL Renderer
renderer.setSize(aspect.width, aspect.height); //Renderer size

//Shadow
pointLight.castShadow = true;
mesh.castShadow = true;
planeMesh.receiveShadow = true;
renderer.shadowMap.enabled = true;

// CameraControls
const orbitControls = new OrbitControls(camera, canvas);

//Clock Class
const clock = new THREE.Clock();

//Animation
gsap.to(mesh.position,{duration:1,delay:1,x:1}); 
gsap.to(mesh.position,{duration:2,delay:2,x:-1});

//Mouse listener
const cursor = { x:0, y:0 };
window.addEventListener("mousemove", e => {
  cursor.x = 2 * (e.clientX / window.innerWidth) - 1;
  cursor.y = 2 * (-e.clientY / window.innerHeight) + 1;
});

//Canvas resize listener
window.addEventListener("resize",() => {
  aspect.width = window.innerWidth;
  aspect.height = window.innerHeight;
  camera.aspect = aspect.width / aspect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(aspect.width, aspect.height);

  // fix pixel ratio issues
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
});

//Debug
const gui = new dat.GUI();
gui.add(mesh.position, "x").min(-3).max(3).name("X Position");
gui.add(material, "wireframe");
gui.add(ambientLight, "intensity").min(0).max(1).step(0.1).name("Ambient Intensity");

//Particles
const particleGeometry = new THREE.BufferGeometry();
const verticesAmount = 1000;
const positionArray = new Float32Array(verticesAmount * 3);
for (let i=0; i<positionArray.length; i++) {
  positionArray[i] = Math.random();
}
particleGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = 0.02;
const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);

//Raycaster to select items with mouse
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.addEventListener("mousemove", e => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects([mesh]);
  console.log(intersects);
});

//Animate
const animate = () => {
  //GetElapsedTime
  const elapsedTime = clock.getElapsedTime();

  //Update Rotation On Y axis
  //mesh.rotation.y = elapsedTime * Math.PI * 2; //will rotate the cube a turn per second

  //look at the mouse
  mesh.lookAt(new THREE.Vector3(cursor.x, cursor.y,1));

  //Renderer
  renderer.render(scene, camera); //draw what the camera inside the scene captured

  //RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();
