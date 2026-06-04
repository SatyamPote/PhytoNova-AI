import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingLeaf({ initialPosition, speed, amplitude, phase }) {
  const meshRef = useRef();
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed + timeOffset.current + phase;
    meshRef.current.position.y =
      initialPosition[1] + Math.sin(t) * amplitude;
    meshRef.current.rotation.x = Math.sin(t * 0.7) * 0.4;
    meshRef.current.rotation.z = Math.cos(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <planeGeometry args={[0.18, 0.28]} />
      <meshStandardMaterial
        color="#22c55e"
        transparent
        opacity={0.75}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function FloatingLeaves() {
  const leavesData = useMemo(() => {
    const leaves = [];
    const positions = [
      [-1.8, 0.5, -0.5],
      [-1.4, 1.8, -1.0],
      [-2.2, 1.2, 0.3],
      [1.6, 0.8, -0.8],
      [1.9, 2.0, -0.3],
      [2.1, 1.0, 0.5],
      [-0.5, 2.5, -1.2],
      [0.6, 2.2, -1.5],
      [-2.0, 2.8, 0.0],
      [1.5, 3.0, 0.2],
      [-1.5, 3.5, -0.6],
      [0.8, 0.4, -1.8],
      [-0.9, 1.5, -1.6],
      [2.3, 2.5, -0.9],
      [-2.4, 1.6, 0.8],
    ];
    positions.forEach((pos, i) => {
      leaves.push({
        position: pos,
        speed: 0.3 + Math.random() * 0.25,
        amplitude: 0.15 + Math.random() * 0.2,
        phase: (i / positions.length) * Math.PI * 2,
      });
    });
    return leaves;
  }, []);

  return (
    <group>
      {leavesData.map((leaf, i) => (
        <FloatingLeaf
          key={i}
          initialPosition={leaf.position}
          speed={leaf.speed}
          amplitude={leaf.amplitude}
          phase={leaf.phase}
        />
      ))}
    </group>
  );
}

export default FloatingLeaves;