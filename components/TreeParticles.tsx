import React, { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleData, TreeMorphState } from '../types';
import { easing } from 'maath';

interface TreeParticlesProps {
  particles: ParticleData[];
  morphState: TreeMorphState;
}

// Reusable geometry and material placeholders
const tempObj = new THREE.Object3D();
const tempColor = new THREE.Color();

export const TreeParticles: React.FC<TreeParticlesProps> = ({ particles, morphState }) => {
  const leavesRef = useRef<THREE.InstancedMesh>(null);
  const spheresRef = useRef<THREE.InstancedMesh>(null);
  const boxesRef = useRef<THREE.InstancedMesh>(null);

  // Group particles by type for separate InstancedMeshes
  const { leaves, spheres, boxes } = useMemo(() => {
    return {
      leaves: particles.filter(p => p.type === 'leaf'),
      spheres: particles.filter(p => p.type === 'ornament_sphere'),
      boxes: particles.filter(p => p.type === 'ornament_box'),
    };
  }, [particles]);

  // Current position storage to allow smooth transition without React state updates every frame
  // We store current position in a Float32Array for performance? 
  // Or just rely on maath to interpolate directly into the matrix? 
  // Let's use a ref to store current interpolated positions if we want per-particle damping.
  // For simplicity and aesthetic, all particles can share roughly the same damping config, 
  // but let's give them random delays or speeds for the "Movie" effect.
  
  const leafConfig = useMemo(() => leaves.map(() => ({ 
    currentPos: new THREE.Vector3(),
    speed: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 0.5 
  })), [leaves]);
  
  const sphereConfig = useMemo(() => spheres.map(() => ({ 
    currentPos: new THREE.Vector3(),
    speed: 0.8 + Math.random() * 1.2,
    delay: Math.random() * 0.2 
  })), [spheres]);

  const boxConfig = useMemo(() => boxes.map(() => ({ 
    currentPos: new THREE.Vector3(),
    speed: 0.8 + Math.random() * 1.2,
    delay: Math.random() * 0.2 
  })), [boxes]);

  // Initialize positions
  useLayoutEffect(() => {
    const init = (mesh: THREE.InstancedMesh | null, data: ParticleData[], config: any[]) => {
      if (!mesh) return;
      data.forEach((p, i) => {
        // Start at scatter position
        tempObj.position.copy(p.scatterPosition);
        tempObj.rotation.copy(p.rotation);
        tempObj.scale.setScalar(p.scale);
        tempObj.updateMatrix();
        mesh.setMatrixAt(i, tempObj.matrix);
        mesh.setColorAt(i, tempColor.set(p.color));
        
        // Sync config
        config[i].currentPos.copy(p.scatterPosition);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    init(leavesRef.current, leaves, leafConfig);
    init(spheresRef.current, spheres, sphereConfig);
    init(boxesRef.current, boxes, boxConfig);
  }, [leaves, spheres, boxes, leafConfig, sphereConfig, boxConfig]);


  useFrame((state, delta) => {
    const targetState = morphState === TreeMorphState.TREE_SHAPE;
    const t = state.clock.getElapsedTime();

    const updateMesh = (
      mesh: THREE.InstancedMesh | null, 
      data: ParticleData[], 
      config: any[],
      geoScale: number
    ) => {
      if (!mesh) return;
      
      let needsUpdate = false;
      
      data.forEach((p, i) => {
        const target = targetState ? p.treePosition : p.scatterPosition;
        const cfg = config[i];

        // Smooth damp
        const done = easing.damp3(
          cfg.currentPos, 
          target, 
          targetState ? 1.5 / cfg.speed : 2.5, // Gather fast, scatter slow
          delta
        );
        
        if (done) needsUpdate = true;

        // Apply
        tempObj.position.copy(cfg.currentPos);
        
        // Add a gentle floating motion when in tree state
        if (targetState) {
            tempObj.position.y += Math.sin(t * 1 + p.id) * 0.02;
            tempObj.rotation.z += Math.sin(t * 0.5 + p.id) * 0.005;
        } else {
            // Spin while scattered
            tempObj.rotation.x += delta * 0.2;
            tempObj.rotation.y += delta * 0.2;
        }
        
        // Base rotation
        tempObj.rotation.copy(p.rotation);
        
        // Spin effect during transition or idle
        tempObj.rotation.y += t * 0.1;

        tempObj.scale.setScalar(p.scale * geoScale);
        tempObj.updateMatrix();
        mesh.setMatrixAt(i, tempObj.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    };

    updateMesh(leavesRef.current, leaves, leafConfig, 1.0);
    updateMesh(spheresRef.current, spheres, sphereConfig, 1.0);
    updateMesh(boxesRef.current, boxes, boxConfig, 1.0);
  });

  return (
    <group>
      {/* Leaves - Cone or Tetrahedrons */}
      <instancedMesh ref={leavesRef} args={[undefined, undefined, leaves.length]} castShadow receiveShadow>
        <tetrahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial roughness={0.8} metalness={0.1} />
      </instancedMesh>

      {/* Spheres - Shiny Ornaments */}
      <instancedMesh ref={spheresRef} args={[undefined, undefined, spheres.length]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial roughness={0.1} metalness={0.9} envMapIntensity={1.5} />
      </instancedMesh>

      {/* Boxes - Gift boxes */}
      <instancedMesh ref={boxesRef} args={[undefined, undefined, boxes.length]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial roughness={0.2} metalness={0.6} />
      </instancedMesh>
    </group>
  );
};
