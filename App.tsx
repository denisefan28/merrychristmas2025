import React, { useState, Suspense } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { THEMES } from './constants';
import { TreeMorphState, ThemeConfig } from './types';
import { Loader } from '@react-three/drei';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeConfig>(THEMES.royal_gold);
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  return (
    <div className="w-full h-screen bg-luxury-black overflow-hidden relative selection:bg-luxury-gold selection:text-black">
      {/* UI Overlay */}
      <UIOverlay 
        currentTheme={theme} 
        setTheme={setTheme}
        morphState={morphState}
        setMorphState={setMorphState}
      />

      {/* 3D Scene */}
      <Suspense fallback={null}>
        <Scene theme={theme} morphState={morphState} />
      </Suspense>

      {/* Loading Screen */}
      <Loader 
        containerStyles={{ background: '#0a0a0a' }}
        innerStyles={{ width: '200px', height: '2px', background: '#333' }}
        barStyles={{ height: '2px', background: '#D4AF37' }}
        dataStyles={{ color: '#D4AF37', fontFamily: 'serif', fontSize: '14px' }}
      />
    </div>
  );
};

export default App;
