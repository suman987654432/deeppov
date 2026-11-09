import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import DiyaModel from './DiyaModel';
import RangoliFloor from './RangoliFloor';
import FloatingSparks from './FloatingSparks';
import DistantDiyas from './DistantDiyas';

/**
 * Camera Parallax Rig: Smoothly responds to pointer movements
 */
function CameraRig({ isLit }) {
  useFrame((state) => {
    // Subtle, elegant mouse parallax
    const targetX = state.pointer.x * 0.8;
    const targetY = 1.6 + state.pointer.y * 0.4;
    const targetZ = isLit ? 3.8 : 4.4;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.04);
    state.camera.lookAt(0, 0.25, 0);
  });

  return null;
}

export default function DiwaliScene({
  isLit = true,
  flameIntensity = 1.0,
  materialType = 'brass',
  onDiyaClick,
  enableOrbit = true,
}) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 4.0], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 2]}
      >
        {/* Midnight / Royal Navy Ambient Lighting */}
        <color attach="background" args={['#040308']} />
        <ambientLight intensity={isLit ? 0.25 : 0.08} color="#1e1838" />

        {/* Soft Golden Rim Light */}
        <directionalLight
          position={[5, 8, 4]}
          intensity={isLit ? 0.7 : 0.2}
          color="#ffd68a"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={20}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />

        {/* Deep Blue Back Rim Light for Cinematic Contrast */}
        <directionalLight position={[-4, 4, -4]} intensity={0.45} color="#3b427b" />

        <Suspense fallback={null}>
          {/* Subtle floating gentle breathing movement */}
          <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.08}>
            <DiyaModel
              isLit={isLit}
              flameIntensity={flameIntensity}
              materialType={materialType}
              onClick={onDiyaClick}
            />
          </Float>

          {/* Sacred Rangoli Floor & Petals */}
          <RangoliFloor isLit={isLit} />

          {/* Golden Floating Sparks & Dust */}
          <FloatingSparks isLit={isLit} count={280} />

          {/* Distant River Diyas */}
          <DistantDiyas isLit={isLit} count={16} />

          {/* Camera Smooth Mouse Parallax */}
          {!enableOrbit && <CameraRig isLit={isLit} />}
        </Suspense>

        {enableOrbit && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={7.0}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05} // Prevent going below the marble floor
            dampingFactor={0.05}
            rotateSpeed={0.6}
            target={[0, 0.25, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}

