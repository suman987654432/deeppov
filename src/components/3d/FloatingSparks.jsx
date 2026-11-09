import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Floating Golden Sparkling Dust Particles
 * Creates a celestial Diwali night aura with slowly drifting golden orbs & sparkling stars
 */
export default function FloatingSparks({ count = 350, isLit = true }) {
  const pointsRef = useRef();

  const [positions, scales, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around the center Diya
      const radius = 0.8 + Math.random() * 8.0;
      const angle = Math.random() * Math.PI * 2;
      const y = -0.2 + Math.random() * 6.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      scl[i] = 0.04 + Math.random() * 0.08;
      spd[i] = 0.2 + Math.random() * 0.6;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return [pos, scl, spd, phs];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle floating upward spiral
      posArray[idx + 1] += 0.003 * speeds[i];
      posArray[idx] += Math.sin(t * 0.8 + phases[i]) * 0.002;
      posArray[idx + 2] += Math.cos(t * 0.8 + phases[i]) * 0.002;

      // Wrap around when reaching top
      if (posArray[idx + 1] > 6.5) {
        posArray[idx + 1] = -0.2;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        color={isLit ? '#ffd54f' : '#b8860b'}
        transparent
        opacity={isLit ? 0.8 : 0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

