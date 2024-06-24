import React from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const bounds = {
  ww: window.innerWidth,
  wh: window.innerHeight,
};

class Transition {
  constructor() {
    const { ww, wh } = bounds;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setPixelRatio(1);
    this.renderer.setSize(ww, wh);
    this.renderer.setClearColor(0xffffff, 0);
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(
      ww / -2,
      ww / 2,
      wh / 2,
      wh / -2,
      1,
      100
    );
    this.camera.lookAt(this.scene.position);
    this.camera.position.z = 1;

    document.body.appendChild(this.renderer.domElement);

    this.geo = new THREE.BufferGeometry();

    const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

    this.geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    this.geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    this.mat = new THREE.ShaderMaterial({
      vertexShader: `
          precision highp float;
          varying vec2 vUv;
  
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
        `,
      fragmentShader: `
          precision highp float;
  
          uniform float uProgress;
          uniform float uPower;
  
          uniform bool uOut;
  
          vec4 transparent = vec4(0., 0., 0., 0.);
          vec4 black = vec4(0., 0., 0., 1.);
  
          #define M_PI 3.1415926535897932384626433832795
  
          varying vec2 vUv;
  
          void main() {
            vec2 uv = vUv;
  
            uv.y -= ((sin(uv.x * M_PI) * uPower) * .25);
  
            if (!uOut) uv.y = 1. - uv.y;
  
            float t = smoothstep(uv.y - fwidth(uv.y), uv.y, uProgress);
            vec4 color = mix(transparent, black, t);
  
            gl_FragColor = color;
          }  
        `,
      uniforms: {
        uProgress: { value: 0 },
        uPower: { value: 0 },
        uOut: { value: true },
      },
    });

    this.triangle = new THREE.Mesh(this.geo, this.mat);
    this.triangle.scale.set(ww / 2, wh / 2, 1);
    this.triangle.frustumCulled = false;
    this.scene.add(this.triangle);

    this.tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 1.25,
        ease: "power3.inOut",
      },
    });

    this.addEvents();
  }

  addEvents() {
    document.querySelector("button").addEventListener("click", () => {
      if (this.animating) return;
      this.reverse ? this.in() : this.out();
    });
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  out = () => {
    this.animating = true;
    this.reverse = true;

    const { uProgress } = this.mat.uniforms;

    this.tl
      .clear()
      .to(
        uProgress,
        {
          value: 1,
          onUpdate: () => this.render(),
        },
        0
      )
      .to(
        this.bend(),
        {
          progress: 1,
        },
        0
      )
      .add(() => {
        this.animating = false;
      })
      .play();
  };

  in = () => {
    this.animating = true;
    this.reverse = false;

    const { uProgress, uOut } = this.mat.uniforms;

    this.tl
      .clear()
      .set(uOut, { value: false })
      .to(
        uProgress,
        {
          value: 0,
          onUpdate: () => this.render(),
        },
        0
      )
      .to(
        this.bend(),
        {
          progress: 1,
        },
        0
      )
      .set(uOut, { value: true })
      .add(() => {
        this.animating = false;
      })
      .play();
  };

  bend = () => {
    const { uPower } = this.mat.uniforms;

    return gsap
      .timeline({
        paused: true,
        defaults: {
          ease: "linear",
          duration: 0.5,
        },
      })
      .to(uPower, { value: 1 })
      .to(uPower, { value: 0 });
  };

  resize = () => {
    const { ww, wh } = bounds;

    this.camera.left = ww / -2;
    this.camera.right = ww / 2;
    this.camera.top = wh / 2;
    this.camera.bottom = wh / -2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(ww, wh);

    this.triangle.scale.set(ww / 2, wh / 2, 1);
  };
}

const transition = new Transition();

window.addEventListener("resize", () => {
  bounds.ww = window.innerWidth;
  bounds.wh = window.innerHeight;

  transition.resize();
});
