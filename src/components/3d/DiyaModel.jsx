import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural 3D Diya (Traditional Indian Akhand Deep)
 * Constructed with custom lathe curves, brass/clay materials,
 * glowing oil surface, cotton wick, and a multi-layered organic flickering flame.
 */
export default function DiyaModel({
  isLit = true,
  flameIntensity = 1.0,
  materialType = 'brass', // 'brass' | 'clay' | 'silver'
  onClick,
}) {
  const diyaGroupRef = useRef();
  const flameOuterRef = useRef();
  const flameCoreRef = useRef();
  const pointLightRef = useRef();
  const oilGlowRef = useRef();
  const wickRef = useRef();
  const embersRef = useRef();

  // 1. Generate smooth traditional Diya bowl profile via LatheGeometry
  const { bowlGeometry, rimGeometry } = useMemo(() => {
    // Points for Diya bowl cross-section
    const points = [];
    // Base pedestal
    points.push(new THREE.Vector2(0.01, 0.0));
    points.push(new THREE.Vector2(0.65, 0.05));
    points.push(new THREE.Vector2(0.7, 0.15));
    points.push(new THREE.Vector2(0.55, 0.25));
    // Flaring lower bowl
    points.push(new THREE.Vector2(0.8, 0.45));
    points.push(new THREE.Vector2(1.25, 0.7));
    points.push(new THREE.Vector2(1.4, 0.95));
    // Curved outer lip
    points.push(new THREE.Vector2(1.35, 1.1));
    points.push(new THREE.Vector2(1.2, 1.12));
    // Inner hollow oil reservoir
    points.push(new THREE.Vector2(1.05, 0.95));
    points.push(new THREE.Vector2(0.8, 0.7));
    points.push(new THREE.Vector2(0.4, 0.5));
    points.push(new THREE.Vector2(0.01, 0.45));

    const bowlGeom = new THREE.LatheGeometry(points, 48);
    bowlGeom.computeVertexNormals();

    // Ornate decorative rim ring with carved notches
    const rimGeom = new THREE.TorusGeometry(1.28, 0.06, 16, 48);
    return { bowlGeometry: bowlGeom, rimGeometry: rimGeom };
  }, []);

  // 2. Custom Materials depending on user preference
  const diyaMaterial = useMemo(() => {
    if (materialType === 'brass') {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4af37'),
        emissive: new THREE.Color('#3a2400'),
        roughness: 0.28,
        metalness: 0.88,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
      });
    } else if (materialType === 'silver') {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e2e8f0'),
        emissive: new THREE.Color('#1e293b'),
        roughness: 0.2,
        metalness: 0.92,
        clearcoat: 0.5,
      });
    } else {
      // Terracotta clay
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c2410c'),
        emissive: new THREE.Color('#451a03'),
        roughness: 0.82,
        metalness: 0.05,
      });
    }
  }, [materialType]);

  // Gold Trim Accent Material
  const goldTrimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'),
      roughness: 0.2,
      metalness: 0.95,
      emissive: new THREE.Color('#553a00'),
    });
  }, []);

  // Oil Material
  const oilMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d97706'),
      emissive: new THREE.Color('#78350f'),
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  // Teardrop Flame Geometry
  const flameGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.24, 0.85, 32, 16, true);
    // Offset pivot to base of flame
    geom.translate(0, 0.42, 0);
    return geom;
  }, []);

  // Floating Micro-Embers Geometry from flame tip
  const emberParticles = useMemo(() => {
    const count = 35;
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const offset = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.12;
      pos[i * 3 + 1] = 1.3 + Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
      speed[i] = 0.5 + Math.random() * 0.8;
      offset[i] = Math.random() * Math.PI * 2;
    }
    return { pos, speed, offset, count };
  }, []);

  // Dynamic Flame Physics & Organic Flicker in useFrame
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isLit) {
      // Natural organic wind turbulence
      const windX = Math.sin(t * 5.2) * 0.06 + Math.sin(t * 11.4) * 0.03;
      const windZ = Math.cos(t * 4.7) * 0.05 + Math.cos(t * 9.8) * 0.02;
      const pulseY = 1.0 + Math.sin(t * 14.0) * 0.07 + Math.sin(t * 22.0) * 0.04;
      const scaleBase = 1.0 * flameIntensity;

      if (flameOuterRef.current) {
        flameOuterRef.current.scale.set(scaleBase, scaleBase * pulseY, scaleBase);
        flameOuterRef.current.rotation.x = windZ * 0.8;
        flameOuterRef.current.rotation.z = windX * 0.8;
      }

      if (flameCoreRef.current) {
        flameCoreRef.current.scale.set(scaleBase * 0.7, scaleBase * 0.7 * (pulseY * 0.95), scaleBase * 0.7);
        flameCoreRef.current.rotation.x = windZ * 0.6;
        flameCoreRef.current.rotation.z = windX * 0.6;
      }

      // Point light dynamic warmth and flicker
      if (pointLightRef.current) {
        const baseLum = 2.4 * flameIntensity;
        const flicker = Math.sin(t * 18.0) * 0.25 + (Math.sin(t * 31.0) * 0.15) + (Math.random() - 0.5) * 0.1;
        pointLightRef.current.intensity = Math.max(0.4, baseLum + flicker);
      }

      // Oil reflection glow
      if (oilGlowRef.current) {
        oilGlowRef.current.intensity = (0.6 + Math.sin(t * 6) * 0.15) * flameIntensity;
      }

      // Animate rising ember sparks
      if (embersRef.current) {
        const positions = embersRef.current.geometry.attributes.position.array;
        for (let i = 0; i < emberParticles.count; i++) {
          const idx = i * 3;
          positions[idx + 1] += 0.008 * emberParticles.speed[i];
          positions[idx] += Math.sin(t * 4 + emberParticles.offset[i]) * 0.003;
          positions[idx + 2] += Math.cos(t * 4 + emberParticles.offset[i]) * 0.003;

          // Loop embers back down
          if (positions[idx + 1] > 2.4) {
            positions[idx + 1] = 1.25;
            positions[idx] = (Math.random() - 0.5) * 0.1;
            positions[idx + 2] = (Math.random() - 0.5) * 0.1;
          }
        }
        embersRef.current.geometry.attributes.position.needsUpdate = true;
      }
    } else {
      // Extinguished / Dormant state
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 0.05;
      }
      if (flameOuterRef.current) {
        flameOuterRef.current.scale.set(0, 0, 0);
      }
      if (flameCoreRef.current) {
        flameCoreRef.current.scale.set(0, 0, 0);
      }
    }
  });

  return (
    <group ref={diyaGroupRef} onClick={onClick} dispose={null} position={[0, -0.4, 0]}>
      {/* 1. Traditional Clay / Brass Diya Body */}
      <mesh geometry={bowlGeometry} material={diyaMaterial} castShadow receiveShadow />

      {/* 2. Ornate Golden Filigree Rim Collar */}
      <mesh
        geometry={rimGeometry}
        material={goldTrimMaterial}
        position={[0, 1.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* 3. Auspicious Engraved Base Ring */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.05, 12, 36]} />
        <primitive object={goldTrimMaterial} attach="material" />
      </mesh>

      {/* 4. Sacred Mustard Oil / Ghee Surface */}
      <mesh position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <primitive object={oilMaterial} attach="material" />
      </mesh>

      {/* 5. Cotton Wick (Batti) with Burnt Tip */}
      <group position={[0, 0.65, 0]}>
        {/* White cotton immersed base */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.045, 0.065, 0.35, 12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        {/* Dark scorched tip */}
        <mesh ref={wickRef} position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.15, 12]} />
          <meshStandardMaterial
            color="#271d15"
            emissive={isLit ? '#ff4500' : '#451a03'}
            emissiveIntensity={isLit ? 1.2 : 0.2}
            roughness={0.95}
          />
        </mesh>
      </group>

      {/* 6. Dynamic Multi-Layer Realistic Flame System */}
      {isLit && (
        <group position={[0, 0.95, 0]}>
          {/* A. Outer Warm Golden/Amber Flame Halo */}
          <mesh ref={flameOuterRef} geometry={flameGeometry}>
            <meshStandardMaterial
              color="#ff6a00"
              emissive="#ff4500"
              emissiveIntensity={3.5 * flameIntensity}
              transparent
              opacity={0.88}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* B. Inner White-Hot Core Flame */}
          <mesh ref={flameCoreRef} geometry={flameGeometry} position={[0, 0.02, 0]}>
            <meshStandardMaterial
              color="#ffffff"
              emissive="#fff275"
              emissiveIntensity={5.0 * flameIntensity}
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* C. Outer Volumetric Flame Glow Sphere */}
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshBasicMaterial
              color="#ffaa00"
              transparent
              opacity={0.25 * flameIntensity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>

          {/* D. Floating Micro-Embers */}
          <points ref={embersRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={emberParticles.count}
                array={emberParticles.pos}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.035}
              color="#ffdd55"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>

          {/* E. Dynamic Warm Radiant Point Light */}
          <pointLight
            ref={pointLightRef}
            position={[0, 0.45, 0]}
            color="#ff9922"
            distance={8.5}
            decay={2}
            castShadow
            shadow-bias={-0.001}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* F. Secondary High-Intensity Soft Glow for Pedestal */}
          <pointLight
            ref={oilGlowRef}
            position={[0, 0.1, 0]}
            color="#ff5500"
            distance={2.5}
            decay={2}
            intensity={0.8}
          />
        </group>
      )}
    </group>
  );
}

