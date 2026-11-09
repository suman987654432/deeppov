import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Distant Floating Diyas (River of Lights / Sky Lanterns)
 * Creates poetic depth of field with softly glowing floating diyas in the backdrop
 */
export default function DistantDiyas({ count = 18, isLit = true }) {
  const groupRef = useRef();

  const diyas = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      // Semi-circle background arc
      const angle = (i / count) * Math.PI + Math.PI;
      const radius = 5.0 + Math.random() * 4.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.2 + (Math.random() - 0.5) * 0.4;
      const floatSpeed = 0.5 + Math.random() * 0.5;
      const flickerOffset = Math.random() * 10;
      const scale = 0.28 + Math.random() * 0.15;

      list.push({ x, y, z, floatSpeed, flickerOffset, scale });
    }
    return list;
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current || !isLit) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const data = diyas[i];
      if (data) {
        // Subtle floating bob
        child.position.y = data.y + Math.sin(t * data.floatSpeed + data.flickerOffset) * 0.05;
      }
    });
  });

  if (!isLit) return null;

  return (
    <group ref={groupRef}>
      {diyas.map((d, i) => (
        <group key={i} position={[d.x, d.y, d.z]} scale={[d.scale, d.scale, d.scale]}>
          {/* Small Clay Bowl */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.15, 0.2, 16]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          {/* Glowing Flame Sphere with Soft Bokeh */}
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial
              color="#ffaa22"
              blending={THREE.AdditiveBlending}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Outer Halo */}
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshBasicMaterial
              color="#ff6600"
              blending={THREE.AdditiveBlending}
              transparent
              opacity={0.18}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

