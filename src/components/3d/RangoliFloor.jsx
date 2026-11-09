import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Sacred Festive Rangoli Floor
 * Creates a dark polished reflective marble floor with golden Rangoli motifs
 * and scattered marigold / rose petals around the Diya.
 */
export default function RangoliFloor({ isLit = true }) {
  // Generate procedural procedural floral Rangoli texture on an HTML Canvas
  const rangoliTexture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    // Helper to draw golden ornate petals
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;

    // Outer concentric sacred circles
    const radii = [450, 420, 350, 260, 180, 100];
    radii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(255, 215, 0, 0.7)' : 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = idx === 0 || idx === 2 ? 5 : 2;
      ctx.stroke();
    });

    // 16 Petal Lotus Flower
    const numPetals = 16;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * Math.PI * 2) / numPetals;
      const x1 = cx + Math.cos(angle) * 180;
      const y1 = cy + Math.sin(angle) * 180;
      const cpX = cx + Math.cos(angle + Math.PI / numPetals) * 330;
      const cpY = cy + Math.sin(angle + Math.PI / numPetals) * 330;
      const x2 = cx + Math.cos(angle + (Math.PI * 2) / numPetals) * 180;
      const y2 = cy + Math.sin(angle + (Math.PI * 2) / numPetals) * 180;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 215, 0, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Outer Star Points & Diyas motifs
    const outerPoints = 24;
    for (let i = 0; i < outerPoints; i++) {
      const angle = (i * Math.PI * 2) / outerPoints;
      const rInner = 350;
      const rOuter = 410;
      const xIn = cx + Math.cos(angle) * rInner;
      const yIn = cy + Math.sin(angle) * rInner;
      const xOut = cx + Math.cos(angle + Math.PI / outerPoints) * rOuter;
      const yOut = cy + Math.sin(angle + Math.PI / outerPoints) * rOuter;

      ctx.beginPath();
      ctx.moveTo(xIn, yIn);
      ctx.lineTo(xOut, yOut);
      ctx.strokeStyle = 'rgba(255, 230, 100, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Little golden dot at each point
      ctx.beginPath();
      ctx.arc(xOut, yOut, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe066';
      ctx.fill();
    }

    // Auspicious Inner Om / Swastik / Sun rays accent
    for (let i = 0; i < 32; i++) {
      const angle = (i * Math.PI * 2) / 32;
      const r1 = 105;
      const r2 = 145;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
      ctx.strokeStyle = 'rgba(255, 190, 40, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);

  // Generate 80 scattered marigold (orange/yellow) and rose (red) petals
  const petals = useMemo(() => {
    const list = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.35 + Math.random() * 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const rotY = Math.random() * Math.PI * 2;
      const rotX = (Math.random() - 0.5) * 0.2;
      const scale = 0.08 + Math.random() * 0.06;
      const color =
        i % 3 === 0
          ? '#e11d48' // Rose red
          : i % 3 === 1
          ? '#f59e0b' // Marigold golden orange
          : '#fbbf24'; // Marigold yellow

      list.push({ x, z, rotX, rotY, scale, color });
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.4, 0]}>
      {/* 1. Dark Sacred Marble Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#06050b"
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* 2. Glowing Golden Rangoli Decal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[6.8, 6.8]} />
        <meshStandardMaterial
          map={rangoliTexture}
          transparent
          opacity={isLit ? 0.92 : 0.4}
          roughness={0.3}
          metalness={0.8}
          emissive={isLit ? '#ffd700' : '#452b00'}
          emissiveIntensity={isLit ? 0.35 : 0.05}
          emissiveMap={rangoliTexture}
        />
      </mesh>

      {/* 3. Scattered Festive Flower Petals */}
      {petals.map((petal, i) => (
        <mesh
          key={i}
          position={[petal.x, 0.012, petal.z]}
          rotation={[petal.rotX, petal.rotY, 0]}
          scale={[petal.scale * 1.5, petal.scale * 0.2, petal.scale]}
          receiveShadow
        >
          <sphereGeometry args={[1, 7, 7]} />
          <meshStandardMaterial
            color={petal.color}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

