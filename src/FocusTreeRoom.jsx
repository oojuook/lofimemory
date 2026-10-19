import React, { useEffect, useMemo, useState } from 'react';
import { Leaf, RotateCcw, Timer, TreePine } from 'lucide-react';

const growthStages = [
  { minutes: 0, label: 'Seedling', height: 64, canopy: 50, note: 'Arrive slowly. Put your phone away, open your notes, and let the room become quiet.' },
  { minutes: 3, label: 'Young sprout', height: 92, canopy: 70, note: 'Your focus tree is waking up. Stay with one task and keep the lofi room open.' },
  { minutes: 8, label: 'Little tree', height: 126, canopy: 92, note: 'A steady study break is forming. Keep reading, writing, or revising without switching tabs.' },
  { minutes: 15, label: 'Focus tree', height: 160, canopy: 118, note: 'Nice rhythm. Your tree is growing with the time you stay in this calm room.' },
  { minutes: 25, label: 'Deep focus tree', height: 198, canopy: 145, note: 'A full focus block is blooming. When you stop, write one sentence about what helped.' }
];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getStage(totalSeconds) {
  const minutes = totalSeconds / 60;
  return growthStages.reduce((current, stage) => (minutes >= stage.minutes ? stage : current), growthStages[0]);
}

export default function FocusTreeRoom() {
  const [seconds, setSeconds] = useState(0);
  const [isGrowing, setIsGrowing] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden));

  useEffect(() => {
    const syncVisibility = () => setIsPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('focus', syncVisibility);
    window.addEventListener('blur', syncVisibility);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      window.removeEventListener('focus', syncVisibility);
      window.removeEventListener('blur', syncVisibility);
    };
  }, []);

  const canGrow = isGrowing && isPageVisible;

  useEffect(() => {
    if (!canGrow) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [canGrow]);

  const stage = useMemo(() => getStage(seconds), [seconds]);
  const progressToMature = Math.min(seconds / (25 * 60), 1);
  const leaves = useMemo(() => ['leaf-1', 'leaf-2', 'leaf-3', 'leaf-4', 'leaf-5', 'leaf-6'], []);

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10 lg:py-16 fade-in">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-emerald-200/70 bg-gradient-to-br from-[#eff8ee] via-[#f8f4e9] to-[#e1efd9] p-5 shadow-soft sm:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-50" aria-hidden="true">
          <div className="absolute -left-12 top-12 h-48 w-48 rounded-full bg-lime-200 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-200 blur-3xl" />
        </div>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-emerald-700">Focus room</p>
            <h1 className="mt-3 font-display text-4xl font-black leading-none tracking-tight text-sage-950 sm:text-5xl">Stay here and grow a quiet tree.</h1>
            <p className="mt-4 text-sm font-semibold leading-7 text-sage-700">This is not a game you need to win. The tree only grows while this Focus Tree page is open and visible, so switching to another browser tab or another Lofi Memory room pauses growth automatically.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50/80 p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700"><Timer size={15} /> Time here</div>
                <p className="mt-2 text-4xl font-black text-sage-950">{formatTime(seconds)}</p>
              </div>
              <div className="rounded-[1.4rem] border border-amber-100 bg-amber-50/80 p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700"><TreePine size={15} /> Stage</div>
                <p className="mt-2 text-xl font-black text-sage-950">{stage.label}</p>
              </div>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-white/80 bg-white/70 p-4">
              <div className="flex justify-between text-xs font-black uppercase tracking-[0.18em] text-sage-600"><span>Growth</span><span>{Math.round(progressToMature * 100)}%</span></div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500" style={{ width: `${progressToMature * 100}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">{stage.note}</p>
            </div>

            <div className={`mt-4 rounded-[1.2rem] border px-4 py-3 text-sm font-bold ${canGrow ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
              {canGrow ? 'Growing now — keep this Focus page visible.' : 'Growth paused — return to this Focus page to keep growing.'}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => setIsGrowing((value) => !value)} className="rounded-full bg-sage-900 px-5 py-3 text-sm font-black text-white shadow-lift transition hover:-translate-y-0.5">
                {isGrowing ? 'Pause tree' : 'Resume tree'}
              </button>
              <button type="button" onClick={() => { setSeconds(0); setIsGrowing(true); }} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-sage-900 transition hover:-translate-y-0.5">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#16271d] p-5 shadow-lift">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(194,255,176,0.25),transparent_18rem)]" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1c14] to-transparent" aria-hidden="true" />
            {leaves.map((leaf, index) => (
              <Leaf
                key={leaf}
                className="absolute text-lime-100/35"
                size={18 + index * 3}
                style={{ left: `${12 + index * 14}%`, top: `${12 + (index % 3) * 18}%`, transform: `rotate(${index * 32}deg)` }}
              />
            ))}

            <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10 text-center">
              <div className="relative flex flex-col items-center transition-all duration-700" style={{ minHeight: 280 }}>
                <div
                  className="absolute bottom-[88px] rounded-full bg-gradient-to-br from-lime-200 via-emerald-300 to-emerald-700 shadow-[0_0_60px_rgba(132,204,22,0.35)] transition-all duration-700"
                  style={{ width: stage.canopy, height: stage.canopy, transform: `translateY(${(1 - progressToMature) * 20}px)` }}
                />
                <div
                  className="absolute bottom-[72px] rounded-full bg-gradient-to-br from-lime-100 via-lime-300 to-emerald-600 opacity-80 blur-[1px] transition-all duration-700"
                  style={{ width: stage.canopy * 0.72, height: stage.canopy * 0.72, transform: 'translateX(-34px)' }}
                />
                <div
                  className="absolute bottom-[70px] rounded-full bg-gradient-to-br from-emerald-100 via-lime-300 to-emerald-600 opacity-80 blur-[1px] transition-all duration-700"
                  style={{ width: stage.canopy * 0.66, height: stage.canopy * 0.66, transform: 'translateX(38px)' }}
                />
                <div
                  className="absolute bottom-0 w-8 rounded-t-full bg-gradient-to-b from-amber-600 to-[#6b3f1f] transition-all duration-700"
                  style={{ height: stage.height }}
                />
                <div className="absolute bottom-0 h-20 w-64 rounded-[50%] bg-emerald-950/65 blur-sm" />
              </div>
              <div className="mt-8 rounded-[1.5rem] border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-100">Current tree</p>
                <p className="mt-1 text-2xl font-black">{stage.label}</p>
                <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-emerald-50/80">Keep this Focus page open while studying or listening to lofi. If you switch tabs, the tree waits for you instead of growing in the background.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
