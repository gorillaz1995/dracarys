import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  Object3DNode,
} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Tween, Easing, update as tweenUpdate } from "@tweenjs/tween.js";
import { gsap } from "gsap";

class CustomCube extends THREE.Group {
  subdivisions: number;
  outerCube: THREE.Mesh;
  innerCubesGroup: THREE.Group;
  liquidMaterial: THREE.ShaderMaterial;

  constructor(subdivisions = 3) {
    super();
    this.subdivisions = subdivisions;
    this.outerCube = new THREE.Mesh();
    this.innerCubesGroup = new THREE.Group();
    this.liquidMaterial = new THREE.ShaderMaterial(); // Initialize here
    this.add(this.innerCubesGroup);
    this.createOuterCube();
    this.createInnerCubes();
  }

  createOuterCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);

    this.liquidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0x32cd32) }, // Limegreen color
        accentColor: { value: new THREE.Color(0x00ff00) }, // Brighter green for contrast
        noiseScale: { value: 3.4 },
        noiseIntensity: { value: 0.09 },
      },
      vertexShader: `
        uniform float time;
        uniform float noiseScale;
        uniform float noiseIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simplex 3D noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normal;
          vPosition = position;
          
          // Add organic, flowing movement
          float noise = snoise(vec3(position * noiseScale + time * 0.3));
          vec3 newPosition = position + normal * noise * noiseIntensity;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform vec3 accentColor;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Dynamic lighting
          vec3 lightDir = normalize(vec3(sin(time * 0.5), cos(time * 0.5), 0.5));
          float diffuse = max(dot(vNormal, lightDir), 0.0);
          
          // Enhanced Fresnel effect
          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(-vPosition)), 0.0), 4.0);
          
          // Color blending
          vec3 finalColor = mix(baseColor, accentColor, fresnel * 0.7);
          finalColor = mix(finalColor, vec3(1.0), fresnel * 0.3); // Add highlights
          
          // Apply lighting
          finalColor *= (diffuse * 0.7 + 0.3);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: false,
    });

    this.outerCube = new THREE.Mesh(geometry, this.liquidMaterial);
    this.add(this.outerCube);
  }

  createInnerCubes() {
    const size = 0.9;
    const segmentSize = size / this.subdivisions;
    const geometry = new THREE.BoxGeometry(
      segmentSize,
      segmentSize,
      segmentSize
    );
    const material = new THREE.MeshPhongMaterial({
      color: "limegreen",
      shininess: 150,
    });

    for (let i = 0; i < 30; i++) {
      const cube = new THREE.Mesh(geometry, material);

      cube.position.set(
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size
      );

      cube.userData.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01,
      };

      cube.userData.orbitSpeed = Math.random() * 0.005 + 0.001;
      cube.userData.orbitAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      cube.visible = false;
      this.innerCubesGroup.add(cube);
    }
  }

  update(delta: number) {
    this.innerCubesGroup.children.forEach((cube) => {
      if (cube instanceof THREE.Mesh) {
        cube.rotation.x += cube.userData.rotationSpeed.x * delta;
        cube.rotation.y += cube.userData.rotationSpeed.y * delta;
        cube.rotation.z += cube.userData.rotationSpeed.z * delta;
        cube.position.applyAxisAngle(
          cube.userData.orbitAxis,
          cube.userData.orbitSpeed * delta
        );
      }
    });

    // Update the time uniform for the liquid effect
    if (this.liquidMaterial.uniforms) {
      this.liquidMaterial.uniforms.time.value += delta;
    }
  }

  dispose() {
    this.outerCube.geometry.dispose();
    this.liquidMaterial.dispose();

    this.innerCubesGroup.children.forEach((cube) => {
      if (cube instanceof THREE.Mesh) {
        cube.geometry.dispose();
        (cube.material as THREE.Material).dispose();
      }
    });
  }
}

extend({ CustomCube });

declare module "@react-three/fiber" {
  interface ThreeElements {
    customCube: Object3DNode<CustomCube, typeof CustomCube>;
  }
}

const Cube: React.FC<{ scale: number }> = ({ scale }) => {
  const groupRef = useRef<CustomCube>(null!);
  const [exploded, setExploded] = useState(false);

  const handleExplode = useCallback(() => {
    if (!groupRef.current) return;

    const outerCube = groupRef.current.outerCube;
    const innerCubes = groupRef.current.innerCubesGroup.children;

    if (exploded) {
      new Tween(outerCube.scale)
        .to({ x: 1, y: 1, z: 1 }, 1000)
        .easing(Easing.Exponential.Out)
        .start();

      innerCubes.forEach((cube) => {
        new Tween(cube.position)
          .to({ x: 0, y: 0, z: 0 }, 1000)
          .easing(Easing.Exponential.Out)
          .onComplete(() => {
            cube.visible = false;
          })
          .start();
      });
    } else {
      new Tween(outerCube.scale)
        .to({ x: 0.1, y: 0.1, z: 0.1 }, 1000)
        .easing(Easing.Exponential.Out)
        .start();

      innerCubes.forEach((cube) => {
        cube.visible = true;
        new Tween(cube.position)
          .to(
            {
              x: (Math.random() - 0.5) * 3,
              y: (Math.random() - 0.5) * 3,
              z: (Math.random() - 0.5) * 3,
            },
            1000
          )
          .easing(Easing.Exponential.Out)
          .start();
      });
    }

    setExploded(!exploded);
  }, [exploded]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.5;
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.update(delta);

      // Update the time uniform for the pulsating effect
      if (groupRef.current.liquidMaterial.uniforms) {
        groupRef.current.liquidMaterial.uniforms.time.value += delta;
      }
    }
    tweenUpdate();
  });

  useEffect(() => {
    const currentGroupRef = groupRef.current;

    // Initial animation
    if (currentGroupRef) {
      gsap.from(currentGroupRef.position, {
        y: 5,
        duration: 2,
        ease: "power3.out",
      });
    }

    return () => {
      if (currentGroupRef) {
        currentGroupRef.dispose();
      }
    };
  }, []);

  return (
    <customCube ref={groupRef} scale={scale * 1.224} onClick={handleExplode} />
  );
};

const ResizeHandler: React.FC = () => {
  const { gl, camera } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const canvas = gl.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;

      if (canvas.width !== width || canvas.height !== height) {
        gl.setSize(width, height, false);
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [gl, camera]);

  return null;
};

const Scene: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 600;
  const cameraPosition: [number, number, number] = isSmallScreen
    ? [0, 0, 3]
    : [0, 0, 2.5];
  const cubeScale = isSmallScreen ? 0.51 : 0.68;

  useEffect(() => {
    // Animate text elements
    gsap.fromTo(
      "#agency-name",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 2 }
    );

    // Split the slogan into two parts
    const tl = gsap.timeline({ delay: 3 });

    // Animate "Redefine the future" from left
    tl.fromTo(
      "#redefine",
      { x: "-100%", opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
      0
    );

    // Animate "Break out of the BOX" from right
    tl.fromTo(
      "#break-out",
      { x: "100%", opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
      0
    );

    // Add clash effect
    tl.to(
      ["#redefine", "#break-out"],
      {
        x: "+=10",
        yoyo: true,
        repeat: 3,
        duration: 0.1,
        ease: "power1.inOut",
      },
      1
    );

    // Final color change and glow effect
    tl.to("#agency-slogan", {
      color: "limegreen",
      duration: 0.5,
      textShadow: "0 0 10px limegreen, 0 0 20px limegreen, 0 0 30px limegreen",
    });

    // Keep the glow effect for strong elements
    tl.to(
      "#agency-slogan strong",
      {
        color: "#00FF00",
      },
      "-=0.5"
    );
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000000",
        position: "relative",
      }}
    >
      <Canvas style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <ResizeHandler />
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[5, 5, 5]} intensity={4} castShadow />
        <Cube scale={cubeScale} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: 0,
          width: "100%",
          zIndex: 2,
          pointerEvents: "none",
          textAlign: "center",
          color: "white",
        }}
      >
        <h2
          id="agency-name"
          className="text-3xl lg:text-7xl mb-2"
          style={{
            opacity: 0,
            color: "white",
            WebkitTextStroke: "0.5px #808080",
            textShadow: "0 0 1px #808080, 0 0 2px #808080",
          }}
        >
          Dark Advertising Agency
        </h2>
        <p
          id="agency-slogan"
          className="text-xl lg:text-4xl pt-2"
          style={{ opacity: 1, overflow: "hidden" }}
        >
          <span
            id="redefine"
            style={{ display: "inline-block", transform: "translateX(-100%)" }}
          >
            <strong style={{ color: "#32CD32" }}>Redefine</strong>
            <span
              style={{
                color: "#FFFFFF",
                opacity: 0.88,
                textShadow:
                  "-1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 1px 1px 0 #808080",
              }}
            >
              {" "}
              the future.{" "}
            </span>
          </span>
          <span
            id="break-out"
            style={{ display: "inline-block", transform: "translateX(100%)" }}
          >
            <span
              style={{
                color: "#FFFFFF",
                opacity: 0.88,
                textShadow: "0 0 1px #808080",
              }}
            >
              Break out of the{" "}
            </span>
            <strong style={{ color: "#00FF00", textShadow: "0 0 1px #808080" }}>
              <b>BOX</b>
            </strong>
            <span
              style={{
                opacity: 0.88,
                textShadow: "0 0 1px #808080",
              }}
            >
              .
            </span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Scene;
