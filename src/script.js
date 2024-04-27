import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

//Scene
const scene = new THREE.Scene();

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "purple" });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

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
