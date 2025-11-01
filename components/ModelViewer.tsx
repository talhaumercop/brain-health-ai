'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';

type ModelProps = {
  path: string;
};

function Model({ path }: ModelProps) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.2} />;
}

export default function ModelViewer() {
  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        camera={{ position: [2, 2, 3], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <Model path="/models/scene.gltf" />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enableZoom enablePan />
      </Canvas>
    </div>
  );
}
