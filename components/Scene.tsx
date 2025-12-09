import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { TopStar } from './TopStar';
import { ThemeConfig, TreeMorphState } from '../types';
import { generateParticles } from '../services/geometryService';
import * as THREE from 'three';

// Simplified post-processing component
const PostProcessingEffects: React.FC = () => {
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
  // Generate particles when theme changes
  const [particles, setParticles] = useState(() =>
    generateParticles(theme.primaryColor, theme.secondaryColor, theme.leafColor)
  );

  useEffect(() => {
    setParticles(generateParticles(theme.primaryColor, theme.secondaryColor, theme.leafColor));
  }, [theme]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop="always"
      gl={{
        antialias: true,
        alpha: true,
        stencil: true,
        depth: true,
        powerPreference: 'high-performance'
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
      <Environment preset="city" environmentIntensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floating Sparkles in Background */}
      <Sparkles count={200} scale={30} size={4} speed={0.4} opacity={0.5} color={theme.secondaryColor} />

      {/* Main Content */}
      <group position={[0, -5, 0]}>
        <TreeParticles particles={particles} morphState={morphState} />
        <TopStar morphState={morphState} theme={theme} />
        
        {/* Floor Shadow */}
        <ContactShadows opacity={0.4} scale={40} blur={2} far={10} resolution={256} color="#000000" />
      </group>

      {/* Post Processing for Luxury Feel */}
      <PostProcessingEffects />

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={50}
        autoRotate={morphState === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
