"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { BrainModel } from "./BrainModel";

export default function BrainScene() {
  const [focusPoint, setFocusPoint] = useState(null);
  const modelRef = useRef(null);

  /* ---------- CAMERA SPRING (click-to-focus) ---------- */
  const { camPos } = useSpring({
    camPos: focusPoint
      ? [focusPoint.x, focusPoint.y + 0.3, focusPoint.z + 1.5]
      : [0, 0.3, 3],
    config: { tension: 80, friction: 30 },
  });

  /* ---------- SMOOTH HOVER ROTATION ---------- */
  function HoverRotation() {
    const { mouse } = useThree();
    const strength = 0.22;      // very subtle
    const damping = 0.09;       // buttery smooth

    // keep a smoothed mouse value to kill jitter
    const smoothed = useRef({ x: 0, y: 0 });

    useFrame(() => {
      if (!modelRef.current) return;

      // smooth mouse first
      smoothed.current.x += (mouse.x - smoothed.current.x) * 0.2;
      smoothed.current.y += (mouse.y - smoothed.current.y) * 0.2;

      const tx = -smoothed.current.x * strength;
      const ty = -smoothed.current.y * strength;

      modelRef.current.rotation.x += (ty - modelRef.current.rotation.x) * damping;
      modelRef.current.rotation.y += (tx - modelRef.current.rotation.y) * damping;
    });

    return null;
  }

  return (
    <Canvas camera={{ position: [0, 0.3, 3], fov: 45 }}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} />

      <a.perspectiveCamera makeDefault position={camPos} fov={45} />

      <HoverRotation />

      <group ref={modelRef}>
        <BrainModel setFocusPoint={setFocusPoint} />
      </group>
    </Canvas>
  );
}