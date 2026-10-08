import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const cluePools = {
  easy: [
    { answer: 'COZY', clue: 'Warm, soft, and comfortable' },
    { answer: 'CALM', clue: 'A peaceful state of mind' },
    { answer: 'REST', clue: 'What you take when you slow down' },
    { answer: 'GLOW', clue: 'A soft kind of light' },
    { answer: 'BREEZE', clue: 'A gentle little wind' },
    { answer: 'CLOUD', clue: 'A soft shape in the sky' },
    { answer: 'MOSS', clue: 'Soft green growth near stones and trees' },
    { answer: 'POND', clue: 'A still little body of water' }
  ],
  medium: [
    { answer: 'MEADOW', clue: 'An open grassy field' },
    { answer: 'LANTERN', clue: 'A small warm light source' },
    { answer: 'MELLOW', clue: 'Relaxed, easy, and unhurried' },
    { answer: 'JOURNAL', clue: 'A place to write your thoughts' },
    { answer: 'WILLOW', clue: 'A tree with soft hanging branches' },
    { answer: 'SETTLE', clue: 'To become calm again after a busy feeling' },
    { answer: 'RIPPLE', clue: 'A tiny wave pattern on water' },
    { answer: 'BLOSSOM', clue: 'A flower opening into view' }
  ],
  hard: [
    { answer: 'MOONLIGHT', clue: 'Night glow from above' },
    { answer: 'QUIETUDE', clue: 'A state of stillness and calm' },
    { answer: 'AFTERGLOW', clue: 'The warm feeling that stays after a good moment' },
    { answer: 'STILLNESS', clue: 'Deep calm without movement' },
    { answer: 'UNWINDING', clue: 'The process of slowly relaxing' },
    { answer: 'DAYDREAM', clue: 'A wandering thought in a restful moment' },
    { answer: 'UNDERSTORY', clue: 'The lower layer of a quiet forest' },
    { answer: 'HARMONIZE', clue: 'To bring different parts into a calm fit' }
  ]
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    targetClues: 4,
    note: 'Short, friendly answers and a quick round that is easy to finish.',
    sessionLabel: 'Quick round'
  },
  medium: {
    label: 'Medium',
    targetClues: 7,
    note: 'Longer clue chains with a more noticeable crossword-session feel.',
    sessionLabel: 'Cozy session'
  },
  hard: {
    label: 'Hard',
    targetClues: 10,
    note: 'Longer answers and a much longer run, so the round feels meaningfully deeper.',
    sessionLabel: 'Deep session'
  }
};

function getClueQueue(pool, count) {
  const queue = [];
  let previousAnswer = '';
  while (queue.length < count) {
    const options = pool.filter((item) => item.answer !== previousAnswer);
    const next = options[Math.floor(Math.random() * options.length)] || pool[0];
    queue.push(next);
    previousAnswer = next.answer;
  }
  return queue;
}

export default function QuietClues({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const pool = cluePools[difficulty] || cluePools.medium;
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestRoundKey = `quiet-journal-quiet-clues-best-${difficulty}`;
  const clearsKey = `quiet-journal-quiet-clues-clears-${difficulty}`;

  const [clueQueue, setClueQueue] = useState(() => getClueQueue(pool, config.targetClues + 3));
  const [guess, setGuess] = useState('');
  const [solvedCount, setSolvedCount] = useState(0);
  const [bestRound, setBestRound] = useState(() => parseInt(localStorage.getItem(bestRoundKey) || '0', 10));
  const [clears, setClears] = useState(() => parseInt(localStorage.getItem(clearsKey) || '0', 10));
  const [message, setMessage] = useState('Read the clue, fill the answer, and keep the puzzle mood soft.');

  useEffect(() => {
    setClueQueue(getClueQueue(pool, config.targetClues + 3));
    setGuess('');
    setSolvedCount(0);
    setMessage('Read the clue, fill the answer, and keep the puzzle mood soft.');
    setBestRound(parseInt(localStorage.getItem(bestRoundKey) || '0', 10));
    setClears(parseInt(localStorage.getItem(clearsKey) || '0', 10));
  }, [bestRoundKey, clearsKey, config.targetClues, pool]);

  const activeClue = clueQueue[0] || { answer: '', clue: '' };
  const upcomingClues = useMemo(() => clueQueue.slice(1, 4), [clueQueue]);
  const normalizedGuess = guess.trim().toUpperCase();
  const progressSegments = useMemo(() => Array.from({ length: config.targetClues }, (_, index) => index < solvedCount), [config.targetClues, solvedCount]);

  const revealSlots = useMemo(() => activeClue.answer.split('').map((letter, index) => ({
    id: `${activeClue.answer}-${index + 1}`,
    letter,
    typed: normalizedGuess[index] || ''
  })), [activeClue.answer, normalizedGuess]);

  const resetRound = () => {
    setClueQueue(getClueQueue(pool, config.targetClues + 3));
    setGuess('');
    setSolvedCount(0);
    setMessage('Fresh clue board, same easy pace.');
  };

  const advanceClue = () => {
    setClueQueue((current) => {
      const nextQueue = current.slice(1);
      const lastAnswer = nextQueue[nextQueue.length - 1]?.answer || activeClue.answer;
      const options = pool.filter((item) => item.answer !== lastAnswer);
      nextQueue.push(options[Math.floor(Math.random() * options.length)] || pool[0]);
      return nextQueue;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!normalizedGuess) return;

    if (normalizedGuess === activeClue.answer) {
      const nextSolved = solvedCount + 1;
      setSolvedCount(nextSolved);
      setGuess('');
      setMessage('Correct — that clue landed nicely.');

      if (nextSolved > bestRound) {
        setBestRound(nextSolved);
        localStorage.setItem(bestRoundKey, String(nextSolved));
      }

      if (nextSolved >= config.targetClues) {
        const nextClears = clears + 1;
        setClears(nextClears);
        localStorage.setItem(clearsKey, String(nextClears));
        setMessage('Round complete — a tidy little crossword-style reset.');
        setClueQueue(getClueQueue(pool, config.targetClues + 3));
        setSolvedCount(0);
        return;
      }

      advanceClue();
      return;
    }

    setMessage('Not quite — keep it light and try another word shape.');
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-[940px] pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_26px_80px_rgba(83,62,44,0.12)]' : 'border-stone-100 bg-gradient-to-br from-white via-stone-50/76 to-sand-50/78'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,236,0.9)_45%,rgba(250,237,205,0.84)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #7a6250 1px, transparent 0)', backgroundSize: '19px 19px' }} />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-stone-200 bg-white/88 text-stone-700'}`}>
              <Sparkles size={14} /> {config.label} clue flow
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-stone-950'}`}>Clues</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-stone-700'}`}>A beginner-friendly crossword-style game built around short clues and soft words. It keeps the crossword mood without the intimidation of a full puzzle grid, so it is easy to pick up even when your brain feels tired.</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-amber-700' : 'text-stone-600'}`}>{config.note}</p>
            <div className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] shadow-sm ${isLofi ? 'border border-white/70 bg-white/72 text-amber-900 backdrop-blur-sm' : 'bg-white text-stone-700'}`}>{config.sessionLabel}</div>
          </div>
          <div className={`grid gap-2 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem] ${isLofi ? 'rounded-[1.35rem] border border-white/70 bg-white/65 backdrop-blur-sm' : 'rounded-[1.5rem] border border-white/85 bg-white/80'}`}>
            {[
              ['Solved', `${solvedCount}/${config.targetClues}`],
              ['Best run', bestRound],
              ['Clears', clears]
            ].map(([label, value]) => (
              <div key={label} className={`${isLofi ? 'rounded-[0.95rem] bg-amber-50/90 text-amber-900' : 'rounded-[1.15rem] bg-stone-50'} px-4 py-3 text-center`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800/60' : 'text-stone-500'}`}>{label}</p>
                <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-stone-950'}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative z-10 mt-5 rounded-[1.4rem] border p-4 shadow-sm ${isLofi ? 'border-white/70 bg-white/68 backdrop-blur-sm' : 'border-white/80 bg-white/74'}`}>
          <div className={`flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-800/70' : 'text-stone-500'}`}>
            <span>Round progress</span>
            <span>{solvedCount}/{config.targetClues}</span>
          </div>
          <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${config.targetClues}, minmax(0, 1fr))` }}>
            {progressSegments.map((isDone, index) => (
              <div key={`clue-segment-${index + 1}`} className={`h-3 rounded-full transition ${isDone ? (isLofi ? 'bg-gradient-to-r from-[#a98467] via-[#d4a373] to-[#84a59d]' : 'bg-gradient-to-r from-stone-700 to-teal-600') : (isLofi ? 'bg-amber-100/80' : 'bg-stone-200')}`} />
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className={`rounded-[1.8rem] border p-5 shadow-inner lg:p-6 ${isLofi ? 'border-amber-200/60 bg-[linear-gradient(145deg,rgba(253,250,245,0.98),rgba(250,237,205,0.92))]' : 'border-stone-100 bg-[#f5ede1]'}`}>
            <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-stone-500'}`}>Current clue</p>
            <h2 className={`mt-3 text-2xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-stone-950'}`}>{activeClue.clue}</h2>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-[#8c755f]' : 'text-stone-600'}`}>Answer length: {activeClue.answer.length} letters</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {revealSlots.map((slot) => (
                <div key={slot.id} className={`flex h-14 w-14 items-center justify-center rounded-[1.2rem] border text-xl font-extrabold shadow-sm ${slot.typed ? (isLofi ? 'border-amber-200 bg-white/90 text-[#3d3025]' : 'border-stone-300 bg-white text-stone-950') : (isLofi ? 'border-[#eadccf] bg-[#fdf7ef] text-[#c7ad92]' : 'border-[#e7d8c7] bg-[#fbf7f1] text-stone-300')}`}>
                  {slot.typed || '•'}
                </div>
              ))}
            </div>

            <form className="mt-5" onSubmit={handleSubmit}>
              <label className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-stone-500'}`} htmlFor="quiet-clues-guess">Your answer</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="quiet-clues-guess"
                  autoComplete="off"
                  className={`flex-1 rounded-full border px-5 py-3 text-base font-semibold outline-none transition ${isLofi ? 'border-amber-200 bg-white/82 text-[#3d3025] shadow-sm focus:border-[#d4a373] focus:ring-2 focus:ring-amber-200' : 'border-stone-200 bg-white text-stone-950 focus:border-stone-400 focus:ring-2 focus:ring-stone-200'}`}
                  onChange={(event) => setGuess(event.target.value.toUpperCase())}
                  placeholder="Type the answer"
                  value={guess}
                />
                <button className={`rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-stone-900 hover:bg-stone-800'}`} type="submit">Check clue</button>
                <button
                  className={`rounded-full border px-6 py-3 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'border-amber-200 bg-white text-amber-900' : 'border-stone-200 bg-white text-stone-900'}`}
                  onClick={() => {
                    setGuess(activeClue.answer);
                    setMessage(`Answer shown — ${activeClue.answer}. Tap check clue if you want to move on.`);
                  }}
                  type="button"
                >
                  Show answer
                </button>
              </div>
            </form>
          </div>

          <div className={`rounded-[1.8rem] border p-4 shadow-sm ${isLofi ? 'border-white/70 bg-white/70 backdrop-blur-sm' : 'border-white/80 bg-white/78'}`}>
            <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-stone-500'}`}>Why the difficulty changes</p>
            <div className={`mt-3 space-y-2.5 text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-stone-700'}`}>
              <p>Easy keeps the session short with simple words.</p>
              <p>Medium asks you to stay with the clue flow longer.</p>
              <p>Hard turns it into a much longer clue run with bigger answers.</p>
            </div>
            <div className={`mt-5 rounded-[1.25rem] px-4 py-4 text-sm leading-7 ${isLofi ? 'bg-amber-50/90 text-[#6e5a4a]' : 'bg-stone-50 text-stone-700'}`}>
              Up next:
              <div className="mt-2 flex flex-wrap gap-2">
                {upcomingClues.map((item) => (
                  <span key={`${activeClue.answer}-${item.answer}`} className={`rounded-full border px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'border-amber-200 bg-white text-amber-900' : 'border-stone-200 bg-white text-stone-700'}`}>{item.answer.length} letters</span>
                ))}
              </div>
            </div>
            <button className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#fdfaf5] border border-amber-200 text-[#4a3a2d]' : 'bg-white text-stone-900'}`} onClick={resetRound} type="button">
              <RotateCcw size={16} /> Reset round
            </button>
          </div>
        </div>

        <div className={`relative z-10 mt-5 rounded-[1.6rem] border px-4 py-4 text-sm font-semibold shadow-sm ${isLofi ? 'border-white/70 bg-white/68 text-[#6e5a4a] backdrop-blur-sm' : 'border-white/80 bg-white/76 text-stone-700'}`}>
          {message}
        </div>
      </div>
    </div>
  );
}
