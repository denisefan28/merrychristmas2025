import React from 'react';
import { ThemeConfig, TreeMorphState } from '../types';
import { THEMES } from '../constants';
import { Wand2, RefreshCw } from 'lucide-react';

interface UIOverlayProps {
  currentTheme: ThemeConfig;
  setTheme: (t: ThemeConfig) => void;
  morphState: TreeMorphState;
  setMorphState: (s: TreeMorphState) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  currentTheme, 
  setTheme, 
  morphState, 
  setMorphState 
}) => {
  const isTree = morphState === TreeMorphState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 md:p-12 z-10 text-white">
      {/* Header */}
      <header className="pointer-events-auto">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-luxury-goldLight to-luxury-gold drop-shadow-lg">
          Signature Christmas
        </h1>
        <p className="text-luxury-silver mt-1 sm:mt-2 text-xs sm:text-sm md:text-base tracking-widest uppercase opacity-80">
          Interactive Holiday Experience
        </p>
      </header>

      {/* Theme Selector (Only visible if not assembled, or always visible? Let's keep it always visible for fun) */}
      <div className={`pointer-events-auto transition-opacity duration-700 ${isTree ? 'opacity-50 active:opacity-100' : 'opacity-100'}`}>
        <div className="flex flex-col gap-2 sm:gap-4">
          <span className="text-xs tracking-widest uppercase text-luxury-gold border-b border-luxury-gold/30 pb-2 w-max">
            Select Material Theme
          </span>
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme)}
                className={`group relative min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 overflow-hidden active:scale-95
                  ${currentTheme.id === theme.id ? 'border-luxury-gold scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'border-white/20 active:border-white/50 hover:border-white/50'}
                `}
                title={theme.name}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.leafColor})` }}
                />
              </button>
            ))}
          </div>
          <div className="text-sm sm:text-lg serif italic text-luxury-silver">
            {currentTheme.name}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pointer-events-auto flex justify-center sm:justify-end items-end">
        <button
          onClick={() => setMorphState(isTree ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE)}
          className={`
            relative group overflow-hidden px-6 py-3 sm:px-8 sm:py-4 rounded-none border border-luxury-gold/50
            bg-luxury-black/60 backdrop-blur-md transition-all duration-500
            active:border-luxury-gold active:bg-luxury-green/80 active:shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95
            hover:border-luxury-gold hover:bg-luxury-green/80 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]
            min-w-[200px] sm:min-w-0
          `}
        >
          <div className="flex items-center gap-2 sm:gap-3 relative z-10 justify-center">
            {isTree ? <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" /> : <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" />}
            <span className="text-sm sm:text-lg tracking-widest uppercase text-luxury-goldLight font-bold">
              {isTree ? 'Disassemble' : 'Assemble Tree'}
            </span>
          </div>

          {/* Shine effect */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] group-active:left-[100%] transition-all duration-1000 ease-in-out" />
        </button>
      </div>
    </div>
  );
};
