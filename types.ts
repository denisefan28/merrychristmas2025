import * as THREE from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export type ThemeType = 'royal_gold' | 'frozen_silver' | 'classic_red';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  leafColor: string;
  ambientLight: string;
}

export interface ParticleData {
  id: number;
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  type: 'leaf' | 'ornament_sphere' | 'ornament_box' | 'ornament_star';
  color: string;
}
