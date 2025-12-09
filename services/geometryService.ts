import * as THREE from 'three';
import { ParticleData } from '../types';
import { PARTICLE_COUNT_LEAVES, PARTICLE_COUNT_ORNAMENTS, TREE_HEIGHT, TREE_RADIUS_BASE, SCATTER_RADIUS } from '../constants';

const tempVec = new THREE.Vector3();

// Helper to get a random point inside a sphere
const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Helper to get a point on a cone volume (for the tree)
const getTreePoint = (height: number, baseRadius: number, biasOutwards = 0.8): THREE.Vector3 => {
  // biasOutwards: 0 = uniform volume, 1 = surface only.
  // We want mostly surface but some depth for volume
  const y = Math.random() * height; // 0 at bottom, height at top? No, usually 0 is center.
  // Let's say tree base is at y = -height/2.
  // We'll normalize y from 0 (base) to height (top)
  
  const normalizedY = Math.random(); // 0 to 1
  const yPos = (normalizedY * height) - (height / 2);
  
  // Radius at this height
  const currentRadius = (1 - normalizedY) * baseRadius;
  
  // Random angle
  const theta = Math.random() * Math.PI * 2;
  
  // Distance from center. Push towards surface for better visibility
  const rRandom = Math.pow(Math.random(), biasOutwards) * currentRadius;
  
  return new THREE.Vector3(
    rRandom * Math.cos(theta),
    yPos,
    rRandom * Math.sin(theta)
  );
};

export const generateParticles = (themePrimary: string, themeSecondary: string, themeLeaf: string): ParticleData[] => {
  const particles: ParticleData[] = [];
  let idCounter = 0;

  // 1. Leaves
  for (let i = 0; i < PARTICLE_COUNT_LEAVES; i++) {
    const treePos = getTreePoint(TREE_HEIGHT, TREE_RADIUS_BASE, 0.6);
    const scatterPos = getRandomSpherePoint(SCATTER_RADIUS);
    
    // Slight variation in leaf color
    const color = new THREE.Color(themeLeaf).offsetHSL(0, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1).getStyle();

    particles.push({
      id: idCounter++,
      scatterPosition: scatterPos,
      treePosition: treePos,
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      scale: 0.5 + Math.random() * 0.5,
      type: 'leaf',
      color: color
    });
  }

  // 2. Ornaments
  for (let i = 0; i < PARTICLE_COUNT_ORNAMENTS; i++) {
    const treePos = getTreePoint(TREE_HEIGHT, TREE_RADIUS_BASE, 0.95); // Mostly on surface
    const scatterPos = getRandomSpherePoint(SCATTER_RADIUS);
    
    // Mix of shapes
    const rand = Math.random();
    let type: ParticleData['type'] = 'ornament_sphere';
    if (rand > 0.7) type = 'ornament_box';
    if (rand > 0.9) type = 'ornament_star'; // Small stars

    const isPrimary = Math.random() > 0.4;
    
    particles.push({
      id: idCounter++,
      scatterPosition: scatterPos,
      treePosition: treePos,
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      scale: 0.8 + Math.random() * 0.4,
      type: type,
      color: isPrimary ? themePrimary : themeSecondary
    });
  }

  return particles;
};
