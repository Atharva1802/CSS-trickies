class World {
  constructor(width, height) {

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.container = document.getElementsByClassName("world")[0];
    this.scene = new THREE.Scene();
    this.width = width;
    this.height = height;
    this.aspectRatio = width / height;
    this.fieldOfView = 50;
    var nearPlane = .1;
    var farPlane = 20000;
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, nearPlane, farPlane);
    this.camera.position.z = 200;
    this.container.appendChild(this.renderer.domElement);
    this.timer = 0;
    this.mousePos = { x: 0, y: 0 };
    this.targetMousePos = { x: 0, y: 0 };
    this.createPlane();
    this.render();
  }

  createPlane() {
    this.material = new THREE.RawShaderMaterial({
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,

      uniforms: {
        uTime: { type: 'f', value: 0 },
        uHue: { type: 'f', value: .5 },
        uHueVariation: { type: 'f', value: 1 },
        uGradient: { type: 'f', value: 1 },
        uDensity: { type: 'f', value: 1 },
        uDisplacement: { type: 'f', value: 1 },
        uMousePosition: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) } } });


    this.planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    this.plane = new THREE.Mesh(this.planeGeometry, this.material);
    this.scene.add(this.plane);
  }

  render() {
    this.timer += parameters.speed;
    this.plane.material.uniforms.uTime.value = this.timer;

    this.mousePos.x += (this.targetMousePos.x - this.mousePos.x) * .1;
    this.mousePos.y += (this.targetMousePos.y - this.mousePos.y) * .1;

    if (this.plane) {
      this.plane.material.uniforms.uMousePosition.value = new THREE.Vector2(this.mousePos.x, this.mousePos.y);
    }

    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  updateSize(w, h) {
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  mouseMove(mousePos) {
    this.targetMousePos.x = mousePos.px;
    this.targetMousePos.y = mousePos.py;
  }}
;

document.addEventListener("DOMContentLoaded", domIsReady);
let mousePos = { x: 0, y: 0, px: 0, py: 0 };
let world;
let gui = new dat.GUI();


let parameters = {
  speed: .2,
  hue: .5,
  hueVariation: 1,
  gradient: .3,
  density: .5,
  displacement: .66 };



function domIsReady() {
  world = new World(this.container, this.renderer, window.innerWidth, window.innerHeight);
  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener("mousemove", handleMouseMove, false);
  handleWindowResize();
  world.loop();
  initGui();
}

var guiHue;

function initGui() {
  gui.width = 250;
  guiSpeed = gui.add(parameters, 'speed').min(.1).max(1).step(.01).name('speed');
  guiHue = gui.add(parameters, 'hue').min(0).max(1).step(.01).name('hue');
  guiVariation = gui.add(parameters, 'hueVariation').min(0).max(1).step(.01).name('hue variation');
  //guiGradient = gui.add(parameters, 'gradient').min(0).max(1).step(.01).name('inner gradient');
  guiDensity = gui.add(parameters, 'density').min(0).max(1).step(.01).name('density');
  guiDisp = gui.add(parameters, 'displacement').min(0).max(1).step(.01).name('displacement');

  guiHue.onChange(function (value) {
    updateParameters();
  });

  guiVariation.onChange(function (value) {
    updateParameters();
  });
  /*
  guiGradient.onChange( function(value) {
  	updateParameters();
  });
  */
  guiDensity.onChange(function (value) {
    updateParameters();
  });

  guiDisp.onChange(function (value) {
    updateParameters();
  });
  updateParameters();
}

function updateParameters() {
  world.plane.material.uniforms.uHue.value = parameters.hue;
  world.plane.material.uniforms.uHueVariation.value = parameters.hueVariation;
  //world.plane.material.uniforms.uGradient.value = parameters.gradient;
  world.plane.material.uniforms.uDensity.value = parameters.density;
  world.plane.material.uniforms.uDisplacement.value = parameters.displacement;
}

function handleWindowResize() {
  world.updateSize(window.innerWidth, window.innerHeight);
}

function handleMouseMove(e) {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  mousePos.px = mousePos.x / window.innerWidth;
  mousePos.py = 1.0 - mousePos.y / window.innerHeight;
  world.mouseMove(mousePos);
}