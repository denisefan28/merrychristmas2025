import { ThemeConfig } from './types';

export const TREE_HEIGHT = 18;
export const TREE_RADIUS_BASE = 6;
export const PARTICLE_COUNT_LEAVES = 1200;
export const PARTICLE_COUNT_ORNAMENTS = 150;
export const SCATTER_RADIUS = 25;

export const THEMES: Record<string, ThemeConfig> = {
  royal_gold: {
    id: 'royal_gold',
    name: 'Royal Gold',
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#F4CF57', // Light Gold
    leafColor: '#0A3315', // Deep Green
    ambientLight: '#ffffff',
  },
  frozen_silver: {
    id: 'frozen_silver',
    name: 'Frozen Silver',
    primaryColor: '#C0C0C0', // Silver
    secondaryColor: '#E8E8E8', // White Silver
    leafColor: '#1A2F25', // Desaturated Green/Blue
    ambientLight: '#dbeeff',
  },
  classic_red: {
    id: 'classic_red',
    name: 'Classic Velvet',
    primaryColor: '#8a1c1c', // Red
    secondaryColor: '#D4AF37', // Gold Accents
    leafColor: '#0f3b1e', // Classic Green
    ambientLight: '#ffebd6',
  }
};
