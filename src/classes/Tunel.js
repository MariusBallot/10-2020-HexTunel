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

        this.cloneSpace = 0.7

        this.tunelParams = {
            animSpeed: 1,
            zSpeed: .1,
            sinAmp: .5,
            offset: 0.3
        }

    }

    init(scene) {
        this.scene = scene
        this.scene.add(this.tunelGroup)

        this.loader.load("chunk.glb", (glb) => {
            console.log(glb)
            this.sourceMesh = glb.scene

            for (let i = 0; i < 60; i++) {
                let clone = this.sourceMesh.clone()
                clone.position.z = -i * this.cloneSpace
                clone.rotation.z = Math.random() * 0.5
                this.tunelGroup.add(clone)
            }
        })

        RAF.subscribe("tunelUpdate", this.update)

        MyGui.gui.add(this.tunelParams, "animSpeed", 0.0, 3.0).step(0.001)
        MyGui.gui.add(this.tunelParams, "zSpeed", 0.0, .3)


    }

    update() {
        if (this.tunelGroup.children.length < 0)
            return


        let offset = 0.3
        this.tunelGroup.children.forEach((child, i) => {
            child.rotateZ(.01)

            // let trigoOff = Date.now() * 0.002 * this.tunelParams.animSpeed + i * this.tunelParams.offset

            let trigoOff = Math.PI * 2 * (i / this.tunelGroup.children.length) + Date.now() * 0.002 * this.tunelParams.animSpeed

            child.position.x = Math.cos(trigoOff) * this.tunelParams.sinAmp
            child.position.y = Math.sin(trigoOff) * this.tunelParams.sinAmp

            child.position.z += this.tunelParams.zSpeed

            if (child.position.z >= 0) {
                child.position.z = -this.tunelGroup.children.length * this.cloneSpace
            }

        });

    }


    bind() {
        this.init = this.init.bind(this)
        this.update = this.update.bind(this)
    }


}


const _instance = new Tunel()
export default _instance