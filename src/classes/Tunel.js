import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import MyGui from './MyGui'

import RAF from '../utils/raf'

class Tunel {
    constructor() {
        this.bind()

        this.loader = new GLTFLoader()
        this.scene
        this.tunelGroup = new THREE.Group()
        this.sourceMesh


        this.tunelParams = {
            animSpeed: 1,
            zSpeed: .1,
            sinAmp: .5,
            offset: 0.3,
            cloneSpace: 0.7,
            staggering: .5,
            trigoMult: 1
        }

    }

    init(scene) {
        this.scene = scene
        this.scene.add(this.tunelGroup)

        this.loader.load("chunk.glb", (glb) => {
            console.log(glb)
            this.sourceMesh = glb.scene

            for (let i = 0; i < 45; i++) {
                let clone = this.sourceMesh.clone()
                this.tunelGroup.add(clone)
            }
            this.clonePositioning()

            MyGui.gui.add(this.tunelParams, "animSpeed", 0.0, 3.0).step(0.001)
            MyGui.gui.add(this.tunelParams, "zSpeed", 0.0, .3)
            MyGui.gui.add(this.tunelParams, "sinAmp", 0.0, 2)
            MyGui.gui.add(this.tunelParams, "cloneSpace", 0.5, 2).onChange(this.clonePositioning)
            MyGui.gui.add(this.tunelParams, "staggering", 0, 2).onChange(this.clonePositioning)
            MyGui.gui.add(this.tunelParams, "trigoMult", 0, 10).step(1)
        })

        RAF.subscribe("tunelUpdate", this.update)


    }

    clonePositioning() {
        this.tunelGroup.children.forEach((child, i) => {
            child.position.z = -i * this.tunelParams.cloneSpace
            child.rotation.z = Math.random() * this.tunelParams.staggering
        });

    }

    update() {
        if (this.tunelGroup.children.length < 0)
            return


        let offset = 0.3
        this.tunelGroup.children.forEach((child, i) => {
            child.rotateZ(.01)

            // let trigoOff = Date.now() * 0.002 * this.tunelParams.animSpeed + i * this.tunelParams.offset

            let trigoOff = Math.PI * 2 * this.tunelParams.trigoMult * (i / this.tunelGroup.children.length) + Date.now() * 0.002 * this.tunelParams.animSpeed

            child.position.x = Math.cos(trigoOff) * this.tunelParams.sinAmp
            child.position.y = Math.sin(trigoOff) * this.tunelParams.sinAmp

            child.position.z += this.tunelParams.zSpeed

            if (child.position.z >= 0) {
                child.position.z = -this.tunelGroup.children.length * this.tunelParams.cloneSpace
            }

        });

    }


    bind() {
        this.init = this.init.bind(this)
        this.update = this.update.bind(this)
        this.clonePositioning = this.clonePositioning.bind(this)
    }


}


const _instance = new Tunel()
export default _instance