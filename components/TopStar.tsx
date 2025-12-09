import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { TreeMorphState, ThemeConfig } from '../types';
import { TREE_HEIGHT } from '../constants';

interface TopStarProps {
  morphState: TreeMorphState;
  theme: ThemeConfig;
}

export const TopStar: React.FC<TopStarProps> = ({ morphState, theme }) => {
  const ref = useRef<THREE.Group>(null);
  const targetPos = new THREE.Vector3(0, TREE_HEIGHT / 2 + 0.5, 0); // Top of tree
  const scatterPos = new THREE.Vector3(0, 15, 0); // Floating high up

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Position
    const target = morphState === TreeMorphState.TREE_SHAPE ? targetPos : scatterPos;
    easing.damp3(ref.current.position, target, 2, delta);

    // Rotation (Spin)
    ref.current.rotation.y += delta * 0.5;
    
    // Scale pulse
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    ref.current.scale.setScalar(scale);
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color={theme.secondaryColor} 
          emissive={theme.secondaryColor} 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>
      {/* Light emitted by star */}
      <pointLight distance={10} intensity={2} color={theme.secondaryColor} />
    </group>
  );
};
