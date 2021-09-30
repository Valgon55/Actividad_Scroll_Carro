//Valentina Gonzalez 63503 - Santiago Varela 63421

import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import gsap from 'gsap';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/loaders/GLTFLoader.js';

/* 
    Actividad
    - Cambiar imagenes por modelos(puede ser el mismo modelo)
    - Limitar el scroll
 */

//Let's

let car




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

let y = 0;
let position = 0;

let objs = [];

document.body.onload = () => {
  main();
};

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

window.addEventListener('wheel', onMouseWheel);

function main() {
  // Configurracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  //POSICIONES INICIALES 0, 0, 2
  camera.position.x = 3;
  camera.position.y = 0;
  camera.position.z = 15;

  scene.background = new THREE.Color(0xB3B3B3);
  
  scene.add(camera);

  // Lights
  setupLights();

  // Imagenes
  //loadImages();
  loadModel();

  animate();
}

let loader = new GLTFLoader();

function loadModel(){
    for (let i = 0; i<4; i++){
        loader.load(
            'assets/scene.gltf',
            function (gltf) {
              car = gltf.scene.children[0];

              scene.traverse((object) => {
                if (object.isMesh) objs.push(object);
              });


              car.scale.set(20, 20, 20);
              //POSICIONES GENERALES 0.5 , -2.8
              car.position.set(Math.random() + 2, i * -5.8);
              car.rotation.z = 180; // rotamos el carro porque mira hacia atras

        
        
              scene.add(gltf.scene);
              animate();
            },
            function (xhr) {
              console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
            },
            function (error) {
              console.log('Un error ocurrio');
            },
          );
    }
}


function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}


function setupLights() {
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  const light = new THREE.AmbientLight( 0x404040 , 9); 
  scene.add( light );


  const light2 = new THREE.PointLight( 0xff0000, 10, 10 );
  light2.position.set( 50, 50, 50 );
  scene.add( light2 )
  light2.position.x = 0
  light2.position.z = 0
  light2.position.y = 20;

}



function onMouseWheel(event) {
  y = -event.deltaY * 0.0007;
}

function updateElements() {
  position += y;
  y *= 0.9;

  // Raycaster
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objs);

  for (const intersect of intersects) {
    //gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });
    gsap.to(intersect.object.rotation, { z: -0.5 });
    //gsap.to(intersect.object.position, { z: -0.9 });

    
  }

  for (const object of objs) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      gsap.to(object.scale, { x: 1, y: 1 });
      gsap.to(object.rotation, { x: 0 });
      gsap.to(object.position, { z: 0 });
    }
  }

  //Maximo y Minimo (SCROLL)

  if(position>10.5){ 
    position=10.5;  //Si la posicion supera 10.5, siempre vuelve a tomar el valor de 10.5.
  }else if(position<-15.5){
    position=-15.5; //Si la posicion supera -15.5, siempre vuelve a tomar el valor de -15.5.
  }

 
    camera.position.y = position;
  
}