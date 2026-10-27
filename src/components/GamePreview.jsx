import React from 'react';
import { Gamepad2 } from 'lucide-react';
import dinoDashPreviewImage from '../assets/optimized/dino-dash-preview.webp';
import lotusMatchPreviewImage from '../assets/optimized/lotus-match-preview.webp';
import solitairePreviewImage from '../assets/optimized/solitaire-preview.webp';

export default function GamePreview({ gameId }) {
  const shellClass = 'mt-4 overflow-hidden rounded-[1.35rem] border border-[#e8dfd5] bg-sage-50/80 p-3 shadow-inner';

  if (gameId === 'drifting-leaf') {
    return (
      <div className={shellClass}>
        <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-[1rem] bg-gradient-to-b from-[#f6c8be] via-[#f3d8c6] to-[#f7eadb]">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6e5a4a 1px, transparent 0)', backgroundSize: '12px 12px' }} />
          <div className="absolute left-1/2 top-3 h-5 w-10 -translate-x-1/2 rounded-full bg-[#fff7ef]/90 blur-sm" />
          <div className="absolute left-6 top-5 h-4 w-10 rounded-full bg-white/35 blur-sm" />
          <div className="absolute right-7 bottom-5 h-5 w-14 rounded-full bg-white/35 blur-sm" />
          <div className="relative flex items-center justify-center animate-bounce" style={{ animationDuration: '3.8s' }}>
            {[-18, -12, -6, 0, 6, 12, 18].map((offset, index) => (
              <span
                key={offset}
                className="absolute h-5 w-[1px] origin-bottom rounded-full bg-[#fffaf4]/90"
                style={{ transform: `translateY(-0.45rem) rotate(${offset}deg)`, opacity: index % 2 === 0 ? 1 : 0.82 }}
              />
            ))}
            <span className="absolute h-6 w-6 rounded-full bg-[radial-gradient(circle,#f3c7cb_0%,#f7dfdf_55%,rgba(255,249,244,0)_100%)]" />
            <span className="absolute -top-4 -left-1 h-5 w-2.5 rounded-full bg-[#a3b18a] rotate-[-35deg]" />
            <span className="absolute -top-4 left-1 h-5 w-2.5 rounded-full bg-[#a3b18a] rotate-[35deg]" />
            <span className="absolute top-2 h-5 w-[2px] rounded-full bg-[#6f4b35]" />
            <span className="absolute top-6 h-3.5 w-3.5 rounded-full bg-[#6f4b35]" style={{ clipPath: 'polygon(50% 100%, 0% 35%, 50% 0%, 100% 35%)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'stream-surfer') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 gap-2 rounded-[1rem] bg-gradient-to-b from-sky-100 to-cyan-50 p-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/40 animate-pulse"></div>
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="relative rounded-full bg-white/40 border border-white/20 h-4">
              {lane === 1 && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🐸</span>}
              {lane !== 1 && <span className={`absolute ${lane === 0 ? 'right-6' : 'left-8'} top-1/2 -translate-y-1/2 text-sm opacity-60`}>🪷</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameId === 'lofi-jigsaw') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 grid-cols-4 gap-1 rounded-[1rem] bg-sage-100 p-2 overflow-hidden relative">
          {[0, 1, 2, 3, 4, '', 5, 6, 7, 8, 9, 10].map((tile, i) => {
            const row = tile === '' ? 1 : Math.floor(tile / 4);
            const col = tile === '' ? 1 : tile % 4;
            return (
              <div
                key={i}
                className={`rounded-md border ${tile === '' ? 'border-dashed border-amber-200/50 bg-white/30' : 'border-amber-200/50 bg-cover shadow-sm'} flex items-center justify-center text-[8px] font-black text-white transition-transform duration-1000 ease-in-out`}
                style={tile === '' ? {} : {
                  backgroundImage: 'url(/lofi-jigsaw-wallpaper.png)',
                  backgroundSize: '400% 300%',
                  backgroundPosition: `${col * 33.33}% ${row * 50}%`,
                  animation: tile === 4 ? 'jigsawTileNudge 3s infinite ease-in-out' : (tile === 5 ? 'jigsawTileNudge 3s infinite ease-in-out reverse' : undefined)
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (gameId === 'lotus-match') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 overflow-hidden rounded-[1rem] bg-rose-100">
          <img src={lotusMatchPreviewImage} alt="Lotus Match preview" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {['A♠', 'K♥', 'Q♦'].map((card) => (
              <span key={card} className="flex h-8 w-6 items-center justify-center rounded-md border border-amber-200/50 bg-white/86 text-[10px] font-black text-rose-800 shadow-sm">{card}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-tiles') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 grid-cols-4 gap-1.5 rounded-[1rem] bg-gradient-to-br from-violet-100 to-slate-50 p-2">
          {[2, 4, 8, 16, '', 32, '', 64].map((val, i) => (
            <div key={i} className={`flex h-full items-center justify-center rounded-lg ${val ? 'bg-white shadow-sm text-violet-700 font-bold' : 'bg-white/30'} text-[9px]`}>
              {val}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-tetris') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 rounded-[1rem] bg-gradient-to-br from-indigo-100 to-sky-50 p-2 overflow-hidden">
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-4 h-4 bg-indigo-400 rounded-sm"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-sm shadow-sm"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-sm"></div>
          </div>
          <div className="absolute top-2 right-6 w-4 h-8 bg-sky-400 rounded-sm animate-bounce" style={{ animationDuration: '2.5s' }}></div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-slide') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 grid-cols-3 gap-1 rounded-[1rem] bg-gradient-to-br from-amber-100 to-stone-50 p-1.5 shadow-inner">
          {[1, 2, 3, 4, '', 5, 6, 7, 8].map((v, i) => (
            <div key={i} className={`flex h-full items-center justify-center rounded-md ${v ? 'bg-white shadow-sm text-amber-700 font-bold' : 'bg-transparent'} text-[10px]`}>
              {v}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-words') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-fuchsia-100 to-rose-50 p-2 relative overflow-hidden">
          <div className="flex gap-2">
             <div className="w-12 h-14 bg-white rounded-lg shadow-sm border border-fuchsia-100 rotate-[-4deg] flex items-center justify-center text-xl font-display text-fuchsia-800">A</div>
             <div className="w-12 h-14 bg-white rounded-lg shadow-sm border border-fuchsia-100 rotate-[3deg] flex items-center justify-center text-xl font-display text-fuchsia-800">B</div>
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'typing-speed-test') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 flex-col justify-center gap-2 rounded-[1rem] bg-gradient-to-br from-sky-100 to-indigo-50 p-3 overflow-hidden">
          <div className="h-1.5 w-full bg-white/70 rounded-full"></div>
          <div className="h-1.5 w-[85%] bg-white/70 rounded-full"></div>
          <div className="h-1.5 w-[65%] bg-sky-500 rounded-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-indigo-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-clues') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-amber-100 to-rose-50 p-2">
           <div className="w-full bg-white/90 p-2 rounded border border-amber-200 shadow-sm space-y-1.5">
             <div className="h-1 w-full bg-amber-100 rounded-full opacity-60"></div>
             <div className="h-1 w-3/4 bg-amber-100 rounded-full opacity-60"></div>
             <div className="flex gap-1 pt-1">
               <div className="w-4 h-4 border border-amber-300 rounded-sm flex items-center justify-center text-[8px] font-bold text-amber-700 bg-amber-50">1</div>
               <div className="w-4 h-4 border border-amber-200 rounded-sm bg-amber-50/30"></div>
               <div className="w-4 h-4 border border-amber-200 rounded-sm bg-amber-50/30"></div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-wordle') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-gradient-to-br from-teal-100 to-sky-50 p-2">
          <div className="flex gap-1">
            {['C', 'O', 'Z', 'Y'].map((l, i) => (
              <div key={i} className={`w-7 h-7 rounded border flex items-center justify-center text-[11px] font-bold ${i < 2 ? 'bg-teal-500 border-teal-600 text-white shadow-sm' : 'bg-white border-teal-200 text-teal-700'}`}>{l}</div>
            ))}
          </div>
          <div className="flex gap-1 opacity-40">
            {[0, 1, 2, 3].map((i) => <div key={i} className="w-7 h-7 rounded border border-teal-100 bg-white"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-sudoku') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-cyan-100 to-blue-50 p-2">
           <div className="grid grid-cols-3 grid-rows-3 gap-0.5 border border-cyan-200 p-0.5 bg-white rounded shadow-sm">
             {[1,'',3,'',5,'',7,'',9].map((v, i) => (
               <div key={i} className="w-4 h-4 flex items-center justify-center text-[9px] text-cyan-800 font-bold border border-cyan-50">{v}</div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (gameId === 'mind-sweeper') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-lime-100 to-emerald-50 p-2">
           <div className="grid grid-cols-4 gap-1 bg-white/70 p-1.5 rounded-lg border border-lime-200 shadow-sm">
             {[0,1,2,3,4,5,6,7].map((i) => (
               <div key={i} className={`w-4 h-4 rounded-sm border ${i === 2 ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-lime-100 shadow-tiny'} flex items-center justify-center text-[8px] font-bold`}>
                 {i === 2 ? '🚩' : (i === 5 ? '1' : '')}
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-snake') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 rounded-[1rem] bg-gradient-to-br from-emerald-100 to-lime-50 p-2 overflow-hidden">
          <div className="absolute top-4 left-6 flex flex-col gap-0.5 rotate-[15deg]">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-sm"></div>
            <div className="w-3 h-3 bg-emerald-300 rounded-sm"></div>
          </div>
          <div className="absolute bottom-6 right-10 w-3 h-3 bg-rose-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
        </div>
      </div>
    );
  }

  if (gameId === 'solitaire') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 overflow-hidden rounded-[1rem] bg-gradient-to-br from-emerald-800 to-teal-900 shadow-inner">
          <img alt="Solitaire preview" className="h-full w-full object-cover" src={solitairePreviewImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 via-transparent to-white/10" />
        </div>
      </div>
    );
  }

  if (gameId === 'dinosaur-dash') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 overflow-hidden rounded-[1rem] bg-gradient-to-br from-orange-100 to-yellow-50 shadow-inner">
          <img alt="Dinosaur Dash preview" className="h-full w-full object-cover" src={dinoDashPreviewImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-950/10 via-transparent to-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div className="relative h-20 rounded-[1rem] bg-gradient-to-b from-stone-100 to-amber-50 p-3 flex items-center justify-center">
        <Gamepad2 className="text-stone-300" size={34} />
      </div>
    </div>
  );
}
