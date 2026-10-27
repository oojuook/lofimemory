import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function GameSplash({ game, isClosing = false }) {
  const Icon = game?.icon || Gamepad2;
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#fffaf2] transition-all duration-[800ms] ease-in-out ${isClosing ? 'scale-110 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
      {game?.preview && (
        <img src={game.preview} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.08] blur-[2px]" aria-hidden="true" />
      )}
      <div className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")' }}></div>
      <div className="relative text-center">
        <div className={`mx-auto mb-10 flex h-36 w-44 items-center justify-center rounded-[3rem] bg-gradient-to-br shadow-soft overflow-hidden relative ${game?.tone || 'from-sage-100 to-white'}`}>
          {game?.preview ? (
            <img src={game.preview} alt={`${game.title} preview`} className="absolute inset-0 h-full w-full object-cover transition duration-700" />
          ) : (
            <Icon size={56} className="animate-pulse" />
          )}
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.45em] text-sage-500">Launching your space</p>
        <h2 className="mt-4 font-display text-6xl font-bold tracking-tight text-sage-950">{game?.title}</h2>
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-sage-100">
            <div className="h-full bg-sage-600 transition-all duration-[1200ms] ease-out w-full" style={{ animation: 'gameSplashProgress 1.4s ease-in-out infinite' }} />
          </div>
          <p className="text-xs font-semibold italic text-sage-400">Arriving softly...</p>
        </div>
      </div>
    </div>
  );
}
