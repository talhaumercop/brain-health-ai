'use client'

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
// import './styles.css'

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.x += delta
  })
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  )
}

export default function Page() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: '#020202' }} camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}