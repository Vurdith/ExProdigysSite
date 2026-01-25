"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.05;
    
    // Deep Midnight Base - Professional Void
    vec3 color = vec3(0.005, 0.005, 0.01); 
    
    // Very subtle organic flow that doesn't overwhelm the UI
    float flow = sin(uv.x * 2.0 + time) * cos(uv.y * 2.0 - time);
    color += vec3(0.02, 0.05, 0.1) * flow * 0.5; 
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function SceneBackground() {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <ShaderBackground />
      </Canvas>
    </div>
  );
}
