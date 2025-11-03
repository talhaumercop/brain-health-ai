import { Html } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

const hotspots = [
  {
    id: 3,
    position: [1.5, 0.1, -0.6],
    label: "Occipital Lobe",
    description: "Interprets visual information from the eyes.",
    cameraTarget: [-0.4, 0.1, -1.2],
  },
  {
    id: 4,
    position: [-0.8, -0.2, 0.0],
    label: "Temporal Lobe",
    description: "Handles auditory processing, memory, language & emotion.",
    cameraTarget: [-0.2, -0.2, 0.0],
  },
  {
    id: 5,
    position: [0.0, -1.2, -0.5],
    label: "Parietal Lobe",
    description: "Processes touch, temperature & spatial awareness.",
    cameraTarget: [0.0, 0.4, -1.1],
  },
];

export function BrainModel({ setFocusPoint, focusPoint, cameraRef }) {
  const { scene } = useGLTF("/models/human-brain.glb");

  useEffect(() => {
    if (focusPoint && cameraRef.current) {
      cameraRef.current.position.lerp(
        { x: focusPoint.x, y: focusPoint.y + 0.3, z: focusPoint.z + 1.5 },
        0.1
      );
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [focusPoint, cameraRef]);

  const handleClick = (h) => {
    setFocusPoint({ x: h.cameraTarget[0], y: h.cameraTarget[1], z: h.cameraTarget[2] });
  };

  return (
    <group>
      <primitive object={scene} scale={0.6} />
      {hotspots.map((h) => (
        <Html
          key={h.id}
          position={h.position}
          transform
          distanceFactor={3}
          occlude="blending"
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              position: "absolute",
              width: 180,
              fontSize: '24px', 
              height: 50,
              // cursor: "pointer",
              // pointerEvents: "auto",
            }}
            onClick={() => handleClick(h)}
          />
          <div style={{ transform: "scale(0.5)", transformOrigin: "0 0" }}>
            <div
              style={{
                color: "#fff",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: "bold",
                lineHeight: 1.3,
                textShadow: `
                  -0.5px -0.5px 0 #000,
                   0.5px -0.5px 0 #000,
                  -0.5px  0.5px 0 #000,
                   0.5px  0.5px 0 #000
                `,
                background: "transparent",
                maxWidth: "180px",
                padding: "0 4px",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: "11px", marginBottom: "1px" }}>
                {h.label}
              </div>
              <div style={{ fontSize: "9px", opacity: 0.9 }}>
                {h.description}
              </div>
            </div>
          </div>
        </Html>
      ))}
    </group>
  );
}