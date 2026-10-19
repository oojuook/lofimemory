import React, { useMemo, useState } from 'react';
import { CheckCircle2, Leaf, RotateCcw, Sparkles, Timer } from 'lucide-react';

const sprintSettings = {
  easy: { label: 'Soft reset', target: 3, focus: '2-minute warm up' },
  medium: { label: 'Study sprint', target: 4, focus: '10-minute focus block' },
  hard: { label: 'Deep work prep', target: 5, focus: '25-minute focus block' }
};

const promptDeck = [
  { id: 'desk', label: 'Clear desk', type: 'space', note: 'Move one distracting item away from your study area.' },
  { id: 'tab', label: 'Close tabs', type: 'digital', note: 'Keep only the tab you need for this sprint.' },
  { id: 'goal', label: 'Tiny goal', type: 'plan', note: 'Write one outcome that would make this session useful.' },
  { id: 'water', label: 'Water nearby', type: 'body', note: 'Put a drink nearby before the timer starts.' },
  { id: 'lofi', label: 'Start lofi', type: 'sound', note: 'Choose one calm track and leave it running.' },
  { id: 'phone', label: 'Phone away', type: 'digital', note: 'Place your phone face down or outside reach.' },
  { id: 'first', label: 'First step', type: 'plan', note: 'Decide the first action before you begin.' },
  { id: 'break', label: 'Break plan', type: 'recovery', note: 'Choose what you will do when the sprint ends.' }
];

const typeStyles = {
  space: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  digital: 'bg-sky-100 text-sky-900 border-sky-200',
  plan: 'bg-amber-100 text-amber-900 border-amber-200',
  body: 'bg-rose-100 text-rose-900 border-rose-200',
  sound: 'bg-violet-100 text-violet-900 border-violet-200',
  recovery: 'bg-lime-100 text-lime-900 border-lime-200'
};

function getSeedGradient(index, planted) {
  if (!planted) return 'from-stone-200 via-stone-100 to-white';
  const gradients = [
    'from-emerald-300 via-lime-200 to-amber-100',
    'from-sky-300 via-cyan-100 to-emerald-100',
    'from-violet-300 via-pink-100 to-amber-100',
    'from-amber-300 via-orange-100 to-rose-100',
    'from-lime-300 via-emerald-100 to-sky-100'
  ];
  return gradients[index % gradients.length];
}

export default function StudySprintGarden({ difficulty = 'medium', theme = 'lofi', viewportMode = 'embedded' }) {
  const settings = sprintSettings[difficulty] || sprintSettings.medium;
  const [selectedIds, setSelectedIds] = useState([]);
  const [completed, setCompleted] = useState(false);

  const selectedPrompts = useMemo(() => promptDeck.filter((prompt) => selectedIds.includes(prompt.id)), [selectedIds]);
  const potSlots = useMemo(() => Array.from({ length: settings.target }, (_, slot) => `focus-pot-${slot}`), [settings.target]);
  const progress = Math.min(selectedIds.length / settings.target, 1);
  const ready = selectedIds.length >= settings.target;

  const togglePrompt = (id) => {
    setCompleted(false);
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= settings.target) return current;
      return [...current, id];
    });
  };

  const reset = () => {
    setSelectedIds([]);
    setCompleted(false);
  };

  const containerClass = viewportMode === 'fullscreen'
    ? 'min-h-[calc(100vh-12rem)] w-full'
    : 'min-h-[620px] w-full';

  return (
    <div className={`${containerClass} overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-gradient-to-br ${theme === 'lofi' ? 'from-[#f9efe2] via-[#f5f6e9] to-[#dfeedd]' : 'from-sage-50 via-white to-emerald-50'} p-4 shadow-soft sm:p-6`}>
      <div className="grid h-full gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col rounded-[1.7rem] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-700">Study Sprint Garden</p>
              <h3 className="mt-2 text-3xl font-black text-sage-950">Plant a focus plan before you study.</h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-sage-700">Pick {settings.target} tiny setup seeds, then turn them into a calm study sprint. Built for students who want a cute lofi ritual before work begins.</p>
            </div>
            <div className="rounded-2xl bg-emerald-900 p-3 text-white shadow-lift"><Leaf size={28} /></div>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-emerald-100 bg-emerald-50/80 p-4">
            <div className="flex items-center justify-between text-sm font-extrabold text-emerald-900">
              <span>{settings.label}</span>
              <span>{selectedIds.length}/{settings.target} seeds</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500" style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-sage-700"><Timer size={16} /> Recommended next block: {settings.focus}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {promptDeck.map((prompt) => {
              const isSelected = selectedIds.includes(prompt.id);
              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => togglePrompt(prompt.id)}
                  className={`rounded-[1.2rem] border p-4 text-left transition hover:-translate-y-0.5 ${isSelected ? 'border-emerald-500 bg-white shadow-lift' : 'border-white/80 bg-white/70 hover:border-emerald-200'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${typeStyles[prompt.type]}`}>{prompt.type}</span>
                    {isSelected ? <CheckCircle2 className="text-emerald-600" size={20} /> : null}
                  </div>
                  <p className="mt-3 text-base font-black text-sage-950">{prompt.label}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-sage-700">{prompt.note}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-[#19291f] p-5 text-white shadow-lift">
          <div className="absolute inset-0 opacity-30" aria-hidden="true">
            <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-emerald-300 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-44 w-44 rounded-full bg-amber-200 blur-3xl" />
          </div>
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-emerald-100">Your focus garden</p>
                <h3 className="mt-2 text-3xl font-black">{ready ? 'Ready to study.' : 'Choose your seeds.'}</h3>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-emerald-50/85">The goal is not to win fast. The goal is to make the next study block feel easier to start.</p>
              </div>
              <button type="button" onClick={reset} className="rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20" aria-label="Reset sprint garden"><RotateCcw size={20} /></button>
            </div>

            <div className="mt-8 grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
              {potSlots.map((slotId) => {
                const slotIndex = Number(slotId.replace('focus-pot-', ''));
                const prompt = selectedPrompts[slotIndex];
                return (
                  <div key={slotId} className="flex min-h-[150px] flex-col items-center justify-end rounded-[1.4rem] border border-white/15 bg-white/10 p-4 text-center">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${getSeedGradient(slotIndex, Boolean(prompt))} text-sage-950 shadow-lift transition-all duration-500 ${prompt ? 'scale-100 opacity-100' : 'scale-75 opacity-45'}`}>
                      {prompt ? <Sparkles size={30} /> : <Leaf size={26} />}
                    </div>
                    <p className="mt-4 text-sm font-black">{prompt?.label || 'Empty pot'}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-50/65">{prompt?.type || 'Pick a seed'}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
              {completed ? (
                <p className="text-sm font-bold leading-7 text-emerald-50">Your study sprint is planted. Start {settings.focus}, then come back to journal one sentence about what helped.</p>
              ) : (
                <p className="text-sm font-bold leading-7 text-emerald-50">{ready ? 'Nice — your setup is ready. Start the sprint when you feel settled.' : `Choose ${settings.target - selectedIds.length} more ${settings.target - selectedIds.length === 1 ? 'seed' : 'seeds'} to complete the ritual.`}</p>
              )}
              <button
                type="button"
                disabled={!ready}
                onClick={() => setCompleted(true)}
                className="mt-4 w-full rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-950 shadow-lift transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Start my study sprint
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
