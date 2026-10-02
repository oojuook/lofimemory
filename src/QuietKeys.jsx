import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const difficultyPools = {
  easy: ['calm', 'soft', 'rest', 'glow', 'slow', 'bloom', 'breathe', 'cloud', 'settle', 'cozy'],
  medium: ['meadow', 'journal', 'mellow', 'lantern', 'sunrise', 'daydream', 'harbor', 'willow', 'blanket', 'whisper'],
  hard: ['afterglow', 'moonlight', 'quietude', 'lullaby', 'softness', 'unwinding', 'stillness', 'safeplace', 'wanderer', 'honeycomb']
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    targetWords: 6,
    note: 'Short, friendly words for a soft warm-up.'
  },
  medium: {
    label: 'Medium',
    targetWords: 8,
    note: 'A balanced typing loop with cozy vocabulary.'
  },
  hard: {
    label: 'Hard',
    targetWords: 10,
    note: 'Longer words when you want a little more focus.'
  }
};

function getWordQueue(pool, count) {
  const queue = [];
  let previous = '';
  while (queue.length < count) {
    const choices = pool.filter((word) => word !== previous);
    const next = choices[Math.floor(Math.random() * choices.length)] || pool[0];
    queue.push(next);
    previous = next;
  }
  return queue;
}

export default function QuietKeys({ difficulty = 'medium' }) {
  const pool = difficultyPools[difficulty] || difficultyPools.medium;
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestStreakKey = `quiet-journal-quiet-keys-best-${difficulty}`;
  const roundsKey = `quiet-journal-quiet-keys-rounds-${difficulty}`;

  const inputRef = useRef(null);
  const [wordQueue, setWordQueue] = useState(() => getWordQueue(pool, config.targetWords + 3));
  const [input, setInput] = useState('');
  const [solvedWords, setSolvedWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => parseInt(localStorage.getItem(bestStreakKey) || '0', 10));
  const [roundsCompleted, setRoundsCompleted] = useState(() => parseInt(localStorage.getItem(roundsKey) || '0', 10));
  const [message, setMessage] = useState('Type the word, press Enter, and keep the rhythm gentle.');

  useEffect(() => {
    setWordQueue(getWordQueue(pool, config.targetWords + 3));
    setInput('');
    setSolvedWords(0);
    setStreak(0);
    setMessage('Type the word, press Enter, and keep the rhythm gentle.');
    setBestStreak(parseInt(localStorage.getItem(bestStreakKey) || '0', 10));
    setRoundsCompleted(parseInt(localStorage.getItem(roundsKey) || '0', 10));
  }, [bestStreakKey, config.targetWords, pool, roundsKey]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [wordQueue]);

  const activeWord = wordQueue[0] || '';
  const upcomingWords = useMemo(() => wordQueue.slice(1, 4), [wordQueue]);
  const matchLength = useMemo(() => {
    const normalized = input.toLowerCase();
    let count = 0;
    while (count < normalized.length && activeWord[count] === normalized[count]) count += 1;
    return count;
  }, [activeWord, input]);

  const resetRound = () => {
    setWordQueue(getWordQueue(pool, config.targetWords + 3));
    setInput('');
    setSolvedWords(0);
    setStreak(0);
    setMessage('Fresh round, same calm pace.');
    inputRef.current?.focus();
  };

  const pushNextWord = () => {
    setWordQueue((current) => {
      const nextQueue = current.slice(1);
      const lastWord = nextQueue[nextQueue.length - 1] || activeWord;
      const options = pool.filter((word) => word !== lastWord);
      nextQueue.push(options[Math.floor(Math.random() * options.length)] || pool[0]);
      return nextQueue;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedInput = input.trim().toLowerCase();
    if (!normalizedInput) return;

    if (normalizedInput === activeWord) {
      const nextSolvedWords = solvedWords + 1;
      const nextStreak = streak + 1;
      setSolvedWords(nextSolvedWords);
      setStreak(nextStreak);
      setInput('');
      setMessage('Nice — keep going at the same gentle pace.');

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        localStorage.setItem(bestStreakKey, String(nextStreak));
      }

      if (nextSolvedWords >= config.targetWords) {
        const nextRounds = roundsCompleted + 1;
        setRoundsCompleted(nextRounds);
        localStorage.setItem(roundsKey, String(nextRounds));
        setMessage('Round complete — soft focus unlocked.');
        setWordQueue(getWordQueue(pool, config.targetWords + 3));
        setSolvedWords(0);
        return;
      }

      pushNextWord();
      return;
    }

    setMessage('Not quite — loosen your shoulders and try again.');
    setStreak(0);
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-[920px] pb-12">
      <div className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-white via-slate-50/78 to-sand-50/76 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              <Sparkles size={14} /> {config.label} typing flow
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Quiet Keys</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">A calm typing game for people who want something approachable and easy to understand. Type the cozy word on screen, keep a gentle streak, and let the rhythm do the relaxing.</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem]">
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Round</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{solvedWords}/{config.targetWords}</p>
            </div>
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Streak</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{streak}</p>
            </div>
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Best / rounds</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{bestStreak} / {roundsCompleted}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-slate-100 bg-[#f4ece3] p-5 shadow-inner lg:p-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Type this word</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[0.16em] text-slate-950 sm:text-5xl">{activeWord.toUpperCase()}</h2>
          <p className="mt-3 text-sm font-semibold text-slate-600">Friendly tip: press Enter after typing the word. Short rounds keep it light and easy to retry.</p>

          <form className="mt-5" onSubmit={handleSubmit}>
            <label className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-500" htmlFor="quiet-keys-input">Your typing</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                ref={inputRef}
                id="quiet-keys-input"
                autoComplete="off"
                className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                onChange={(event) => setInput(event.target.value.toLowerCase())}
                placeholder="Type the word here"
                value={input}
              />
              <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800" type="submit">Check word</button>
            </div>
          </form>

          <div className="mt-4 rounded-[1.3rem] border border-white/80 bg-white/80 px-4 py-4 text-sm leading-7 text-slate-700 shadow-sm">
            Matching letters: <span className="font-extrabold text-slate-950">{matchLength}</span> / {activeWord.length}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-[1.6rem] border border-white/80 bg-white/76 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm">
            {message}
          </div>
          <div className="rounded-[1.6rem] border border-white/80 bg-white/76 p-4 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Up next</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {upcomingWords.map((word) => (
                <span key={`${activeWord}-${word}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-extrabold text-slate-800">{word.toUpperCase()}</span>
              ))}
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5" onClick={resetRound} type="button">
              <RotateCcw size={16} /> Reset round
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
