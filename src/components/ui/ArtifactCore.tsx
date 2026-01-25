"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useSpring } from "framer-motion";

export function ArtifactCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { scrollYProgress } = useScroll();
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Elegant, slow rotation
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
    meshRef.current.rotation.y += 0.002 + (springScroll.get() * 0.02);
    
    // Cursor tracking - subtle tilt
    const targetX = (state.mouse.x * Math.PI) / 12;
    const targetY = (state.mouse.y * Math.PI) / 12;
    meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.z += (targetX - meshRef.current.rotation.z) * 0.05;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F0FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7000FF" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} castShadow receiveShadow scale={0.8}>
          <torusKnotGeometry args={[1, 0.35, 256, 64]} />
          <MeshDistortMaterial
            color="#ffffff"
            speed={1.5}
            distort={0.2}
            radius={1}
            emissive="#00F0FF"
            emissiveIntensity={0.02}
            roughness={0.1}
            metalness={1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>
      
      {/* Structural Wireframe Grid - Adds 'System' vibe */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={4}>
        <torusGeometry args={[1, 0.002, 16, 100]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} transparent opacity={0.05} />
      </mesh>
    </>
  );
}
