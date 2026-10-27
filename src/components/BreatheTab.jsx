import React from 'react';
import musicSectionPreviewImage from '../assets/optimized/music-section-preview.webp';

export default function BreatheTab(props) {
  const {
    activeBreatheRoom,
    applyBreatheRoom,
    breathePhase,
    breatheRoomOptions,
    breatheRoomStatus,
    focusActive,
    focusTimer,
    formatTime,
    selectedBreatheRoom,
    setFocusActive,
    startFocusSession
  } = props;

  return (
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10 lg:py-16 fade-in">
        <div className="lofi-picture-border lofi-border-memory relative mb-8 sm:mb-14 overflow-hidden rounded-[2.2rem] sm:rounded-[3.2rem] border border-[#8b5e3c]/25 p-5 sm:p-8 shadow-soft lg:p-10 xl:p-12">
          <img src={musicSectionPreviewImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-black/5" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.15),transparent_25rem)]" />
          <div className="relative z-10">
            <h1 className="font-display text-5xl font-bold tracking-tight text-white lofi-sharp-text">Music Room</h1>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-white/95 lofi-sharp-text-soft">Sounds & Wallpapers</p>
            <p className="mt-6 max-w-2xl text-base font-bold leading-7 text-white lofi-sharp-text-soft">Choose a music mood to change the ambient sound, wallpaper, and room energy. Rainy lofi, fire burning music, cozy radio, and magical study ambience all live here.</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {breatheRoomOptions.map((option) => {
            const isSelected = selectedBreatheRoom === option.id;
            return (
              <button
                key={option.id}
                onClick={() => applyBreatheRoom(option.id)}
                className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border p-1 transition-all duration-500 hover:-translate-y-1.5 ${
                  isSelected ? `bg-white ${option.ringTone} ring-4 ring-offset-4 ring-offset-sage-50` : 'border-white/60 bg-white/40 hover:bg-white/60'
                }`}
              >
                <div className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[3rem] bg-gradient-to-br ${option.gradient} shadow-inner`}>
                   {option.wallpaper ? <img src={option.wallpaper} alt={`${option.title} wallpaper`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: option.imagePosition || 'center' }} /> : null}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-white/10" />
                   <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: 'white' }} />
                   {option.showDecoration === false ? null : (
                     <div className={`relative z-10 flex flex-col items-center gap-4 transition-transform duration-700 ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                       <span className="text-4xl drop-shadow">{option.decoration}</span>
                     </div>
                   )}
                   {isSelected ? (
                     <div className="absolute bottom-4 flex gap-1">
                       {[
                         { id: 'first', delay: 0 },
                         { id: 'second', delay: 0.15 },
                         { id: 'third', delay: 0.3 }
                       ].map((dot) => (
                         <div key={dot.id} className={`h-1.5 w-1.5 rounded-full ${option.textTone} animate-bounce`} style={{ animationDelay: `${dot.delay}s` }} />
                       ))}
                     </div>
                   ) : null}
                </div>
                <div className="rounded-[2.1rem] bg-[#fff8f1]/96 p-6 text-left shadow-[0_-18px_40px_rgba(255,255,255,0.24)]">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-[#3f3126]">{option.title}</h3>
                    {isSelected ? <span className="text-[10px] font-black uppercase tracking-widest text-[#7b5d44]/80">Active</span> : null}
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#7b5d44]">{option.sound}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[#6a5444]">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
         <div className="mt-16 flex flex-col items-center justify-center">
          <div className={`relative flex h-72 w-72 items-center justify-center transition-all duration-700`}>
            <div className={`absolute inset-0 rounded-[4rem] border border-white/60 bg-white/40 shadow-soft backdrop-blur-md transition-all duration-[4000ms] ease-in-out ${
              breathePhase === 0 ? 'scale-105 opacity-60' : 
              breathePhase === 1 ? 'scale-105 opacity-90' : 
              breathePhase === 2 ? 'scale-90 opacity-40' : 
              'scale-90 opacity-70'
            }`} />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="font-display text-3xl font-bold tracking-wide text-sage-900 transition-opacity duration-1000">
                {['Inhale', 'Hold', 'Exhale', 'Hold'][breathePhase]}
              </div>
              <p className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${activeBreatheRoom.textTone}`}>{selectedBreatheRoom} mode</p>
            </div>
          </div>
        </div>
         <div className="mt-16 rounded-[3rem] border border-[#e8dfd5] bg-white/60 p-10 shadow-soft backdrop-blur-md transition hover:bg-white/80">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-sage-950 tracking-tight">Focus Timer</h3>
              <p className="mt-3 text-sage-600 leading-relaxed">Set a gentle timer to keep yourself completely focused on your thoughts without distractions.</p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              {focusActive ? (
                <div className="flex flex-col items-center">
                  <div className="font-display text-7xl font-extrabold tabular-nums tracking-tighter text-sage-800">
                    {formatTime(focusTimer)}
                  </div>
                  <button onClick={() => setFocusActive(false)} className="mt-6 rounded-full border border-amber-200/50 bg-white px-8 py-3 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50">
                    Pause timer
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  {[5, 10, 15].map((mins) => (
                    <button key={mins} onClick={() => startFocusSession(mins)} className="flex h-16 w-32 items-center justify-center rounded-2xl bg-sage-900 text-lg font-bold text-white shadow-sm transition hover:-translate-y-1 hover:bg-sage-800">
                      {mins}m
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="mt-12 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-sage-400">
          {breatheRoomStatus}
        </p>
      </div>
  );
}
