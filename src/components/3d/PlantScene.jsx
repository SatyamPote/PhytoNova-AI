import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FloatingLeaves from './FloatingLeaves';
import * as THREE from 'three';

function PlantGroup() {
  const groupRef = useRef();
  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    const targetX = pointer.x * 0.3;
    const targetY = pointer.y * 0.15;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetX,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetY,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {/* Pot */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.45, 0.6, 16]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, -0.88, 0]} castShadow>
        <torusGeometry args={[0.56, 0.06, 8, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 24]} />
        <meshStandardMaterial color="#451a03" roughness={1} />
      </mesh>

      {/* Main stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 2.6, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>

      {/* Leaves on main stem — alternating positions */}
      {[
        { pos: [0.35, 0.1, 0], rot: [0, 0, -Math.PI / 4], scale: [0.7, 0.4, 0.05] },
        { pos: [-0.38, 0.5, 0.1], rot: [0, 0.3, Math.PI / 3.5], scale: [0.65, 0.38, 0.05] },
        { pos: [0.3, 1.0, -0.1], rot: [0.1, -0.2, -Math.PI / 3], scale: [0.6, 0.35, 0.05] },
        { pos: [-0.32, 1.4, 0.05], rot: [-0.1, 0.4, Math.PI / 4], scale: [0.55, 0.32, 0.05] },
        { pos: [0.25, 1.8, -0.05], rot: [0.05, -0.3, -Math.PI / 5], scale: [0.5, 0.3, 0.05] },
      ].map((leaf, i) => (
        <mesh key={i} position={leaf.pos} rotation={leaf.rot} scale={leaf.scale} castShadow>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} metalness={0.05} />
        </mesh>
      ))}

      {/* Top cluster */}
      <group position={[0, 1.75, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.42, 14, 10]} />
          <meshStandardMaterial color="#16a34a" roughness={0.45} />
        </mesh>
        <mesh position={[0.28, 0.15, 0.1]} rotation={[0.2, 0.5, 0.3]} scale={[0.45, 0.28, 0.06]} castShadow>
          <sphereGeometry args={[1, 10, 7]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>
        <mesh position={[-0.25, 0.2, -0.08]} rotation={[-0.15, -0.4, -0.25]} scale={[0.42, 0.26, 0.06]} castShadow>
          <sphereGeometry args={[1, 10, 7]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.35, 0]} scale={[0.3, 0.2, 0.05]} castShadow>
          <sphereGeometry args={[1, 10, 7]} />
          <meshStandardMaterial color="#15803d" roughness={0.5} />
        </mesh>
      </group>

      {/* Side branch left */}
      <mesh position={[-0.28, 0.6, 0.1]} rotation={[0.2, 0, Math.PI / 2.5]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.7, 6]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
      <mesh position={[-0.5, 1.0, 0.12]} scale={[0.38, 0.22, 0.05]} rotation={[0, 0.2, 0.5]} castShadow>
        <sphereGeometry args={[1, 10, 7]} />
        <meshStandardMaterial color="#22c55e" roughness={0.4} />
      </mesh>

      {/* Side branch right */}
      <mesh position={[0.25, 1.1, -0.05]} rotation={[-0.2, 0, -Math.PI / 2.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.035, 0.55, 6]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
      <mesh position={[0.48, 1.4, -0.08]} scale={[0.35, 0.2, 0.05]} rotation={[0, -0.3, -0.4]} castShadow>
        <sphereGeometry args={[1, 10, 7]} />
        <meshStandardMaterial color="#22c55e" roughness={0.4} />
      </mesh>
    </group>
  );
}

function PlantScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 3, -3]} color="#22c55e" intensity={0.6} />
      <pointLight position={[3, 2, 2]} color="#06b6d4" intensity={0.4} />

      <PlantGroup />
      <FloatingLeaves />

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.2}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

export default PlantScene;