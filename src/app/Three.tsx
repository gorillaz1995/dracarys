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

  constructor(subdivisions = 3) {
    super();
    this.subdivisions = subdivisions;
    this.outerCube = new THREE.Mesh();
    this.innerCubesGroup = new THREE.Group();
    this.add(this.innerCubesGroup);
    this.createOuterCube();
    this.createInnerCubes();
  }

  createOuterCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: "limegreen",
      transparent: true,
      opacity: 1,
      shininess: 150,
    });
    this.outerCube = new THREE.Mesh(geometry, material);
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
  }

  dispose() {
    this.outerCube.geometry.dispose();
    (this.outerCube.material as THREE.Material).dispose();

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
      new Tween(outerCube.material)
        .to({ opacity: 1 }, 1000)
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
      new Tween(outerCube.material)
        .to({ opacity: 0 }, 1000)
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
    gsap.fromTo(
      "#agency-slogan",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 3,
        onComplete: () => {
          gsap.to("#agency-slogan", {
            color: "limegreen",
            duration: 0.5,
            textShadow:
              "0 0 10px limegreen, 0 0 20px limegreen, 0 0 30px limegreen",
          });
        },
      }
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
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
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
          style={{ opacity: 0 }}
        >
          Dark Advertising Agency
        </h2>
        <p
          id="agency-slogan"
          className="text-xl lg:text-4xl pt-2"
          style={{ opacity: 0 }}
        >
          Great ideas glow in the dark
        </p>
      </div>
    </div>
  );
};

export default Scene;
