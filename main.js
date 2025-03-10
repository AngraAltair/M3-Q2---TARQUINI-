import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cubeMesh = new THREE.Mesh();
let stars, starGeo;

lighting();
cube();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const positions = starGeo.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 1;
    if (positions[i + 1] < -200) {
      positions[i + 1] = 200;
    }
  }
  starGeo.attributes.position.needsUpdate = true;
}

function cube() {
  const texture = new THREE.TextureLoader().load("assets/textures/Tarquini.jpg");
  const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const cubeGeometry = new THREE.BoxGeometry(10, 5, 5, 5);
  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cubeMesh.position.z = -5;
  camera.position.z = 15;

  scene.add(cubeMesh);
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();