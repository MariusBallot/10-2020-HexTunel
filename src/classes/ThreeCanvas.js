import * as THREE from "three"

import Tunel from './Tunel'
import MyGui from './MyGui'


import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/raf'

class ThreeScene {
  constructor() {
    this.bind()
    this.camera
    this.scene
    this.renderer
    this.controls

    this.loader = new GLTFLoader()

    this.fog

    this.composer
    this.bloomPass
  }

  init() {
    MyGui.start()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.debug.checkShaderErrors = true
    document.body.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    let col = new THREE.Color(0xFFAAAA)
    this.scene.background = col


    this.fog = new THREE.Fog(col, 20, 30)
    this.scene.fog = this.fog

    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 0, 0)
    this.camera.lookAt(0, 0, - 1)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enabled = true
    this.controls.maxDistance = 1500
    this.controls.minDistance = 0


    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3, 1, 0.9);
    this.composer.addPass(this.bloomPass);

    let light = new THREE.AmbientLight()
    let pointLight = new THREE.PointLight()
    pointLight.position.set(10, 10, 0)
    light.intensity = 0
    this.scene.add(light, pointLight)


    Tunel.init(this.scene)
  }


  update() {
    // this.composer.render();
    this.renderer.render(this.scene, this.camera);
  }


  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  bind() {
    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)

    window.addEventListener("resize", this.resizeCanvas)
    RAF.subscribe('threeSceneUpdate', this.update)
  }
  myGUI() {

    var params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0
    };
    this.myGui = new GUI();

    this.myGui.add(params, "bloomThreshold", 0.0, 1.0).onChange(value => {
      this.bloomPass.threshold = Number(value);
    });

    this.myGui.add(params, "bloomStrength", 0.0, 3.0).onChange(value => {
      this.bloomPass.strength = Number(value);
    });

    this.myGui.add(params, "bloomRadius", 0.0, 1.0).step(0.01).onChange(value => {
      this.bloomPass.radius = Number(value);
    });
  }
}

const _instance = new ThreeScene
export default _instance
