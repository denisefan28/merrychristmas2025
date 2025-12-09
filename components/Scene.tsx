import React, { useEffect, useState, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { TopStar } from './TopStar';
import { ThemeConfig, TreeMorphState } from '../types';
import { generateParticles } from '../services/geometryService';
import * as THREE from 'three';

// Detect if device is mobile
const isMobileDevice = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Mobile-optimized post-processing component
const PostProcessingEffects: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  if (isMobile) {
    // Minimal effects for mobile performance
    return (
      <EffectComposer>
        <Bloom luminanceThreshold={1.2} intensity={0.8} radius={0.3} />
      </EffectComposer>
    );
  }

  // Full effects for desktop
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <Noise opacity={0.02} />
    </EffectComposer>
  );
};

interface SceneProps {
  theme: ThemeConfig;
  morphState: TreeMorphState;
}

export const Scene: React.FC<SceneProps> = ({ theme, morphState }) => {
  // Detect mobile device
  const isMobile = useMemo(() => isMobileDevice(), []);

  // Performance settings based on device
  const performanceSettings = useMemo(() => ({
    dpr: isMobile ? [1, 1.5] : [1, 2],
    antialias: !isMobile,
    shadows: !isMobile,
    starsCount: isMobile ? 1000 : 5000,
    sparklesCount: isMobile ? 50 : 200,
    powerPreference: isMobile ? 'default' : 'high-performance',
  }), [isMobile]);

  // Generate particles when theme changes
  const [particles, setParticles] = useState(() =>
    generateParticles(theme.primaryColor, theme.secondaryColor, theme.leafColor, isMobile)
  );

  useEffect(() => {
    setParticles(generateParticles(theme.primaryColor, theme.secondaryColor, theme.leafColor, isMobile));
  }, [theme, isMobile]);

  return (
    <Canvas
      shadows={performanceSettings.shadows}
      dpr={performanceSettings.dpr}
      frameloop="always"
      gl={{
        antialias: performanceSettings.antialias,
        alpha: true,
        stencil: true,
        depth: true,
        powerPreference: performanceSettings.powerPreference as 'high-performance' | 'low-power' | 'default'
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} color={theme.ambientLight} />
      <spotLight 
        position={[20, 30, 20]} 
        angle={0.2} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        shadow-bias={-0.0001}
        color={theme.primaryColor}
      />
      <pointLight position={[-10, -10, -10]} intensity={1} color={theme.secondaryColor} />

      {/* Environment for Reflections */}
      {!isMobile && <Environment preset="city" environmentIntensity={0.5} />}
      <Stars radius={100} depth={50} count={performanceSettings.starsCount} factor={4} saturation={0} fade speed={1} />

      {/* Floating Sparkles in Background */}
      <Sparkles count={performanceSettings.sparklesCount} scale={30} size={isMobile ? 3 : 4} speed={0.4} opacity={0.5} color={theme.secondaryColor} />

      {/* Main Content */}
      <group position={[0, -5, 0]}>
        <TreeParticles particles={particles} morphState={morphState} />
        <TopStar morphState={morphState} theme={theme} />
        
        {/* Floor Shadow */}
        <ContactShadows opacity={0.4} scale={40} blur={2} far={10} resolution={256} color="#000000" />
      </group>

      {/* Post Processing for Luxury Feel */}
      <PostProcessingEffects isMobile={isMobile} />

      <OrbitControls
        enablePan={false}
        enableZoom={isMobile}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={isMobile ? 0.5 : 1}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={50}
        autoRotate={morphState === TreeMorphState.TREE_SHAPE && !isMobile}
        autoRotateSpeed={0.5}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
      />
    </Canvas>
  );
};
