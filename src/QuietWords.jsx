import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const difficultyPools = {
  easy: [
    { word: 'CALM', hint: 'A peaceful state of mind' },
    { word: 'COZY', hint: 'A warm and comfortable feeling' },
    { word: 'REST', hint: 'What you do when you slow down' },
    { word: 'GLOW', hint: 'A soft kind of light' },
    { word: 'SOFT', hint: 'Gentle to the touch or mood' },
    { word: 'SLOW', hint: 'The pace of a quiet day' },
    { word: 'MOSS', hint: 'Something green and cushiony outdoors' },
    { word: 'WAVE', hint: 'A moving line of water' }
  ],
  medium: [
    { word: 'BREEZE', hint: 'A gentle bit of wind' },
    { word: 'MELLOW', hint: 'Relaxed, soft, and unhurried' },
    { word: 'SETTLE', hint: 'What your mind starts to do when it gets quiet' },
    { word: 'JOURNAL', hint: 'A place to write your thoughts' },
    { word: 'LANTERN', hint: 'A small warm light source' },
    { word: 'MEADOW', hint: 'An open, grassy field' },
    { word: 'RIPPLE', hint: 'A tiny wave pattern on water' },
    { word: 'WILLOW', hint: 'A tree with soft hanging branches' }
  ],
  hard: [
    { word: 'MOONLIGHT', hint: 'Night glow from above' },
    { word: 'QUIETUDE', hint: 'A state of stillness and calm' },
    { word: 'UNWINDING', hint: 'What you are doing when stress starts to leave' },
    { word: 'DAYDREAM', hint: 'A wandering thought in a restful moment' },
    { word: 'AFTERGLOW', hint: 'The warm feeling that stays after a good moment' },
    { word: 'BREATHE', hint: 'A simple reset you can always return to' },
    { word: 'HARMONIZE', hint: 'To bring different parts into a calm fit' },
    { word: 'WILDFLOWER', hint: 'A bloom that feels soft and untamed' }
  ]
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    note: 'Shorter words, immediate hints, and a softer scramble to ease you in.',
    hintDelayMs: 0,
    minMovedRatio: 0.35,
    complexityLabel: 'Soft mix',
    hintLabel: 'Hint ready now'
  },
  medium: {
    label: 'Medium',
    note: 'Balanced words with stronger shuffles and still-friendly hints.',
    hintDelayMs: 0,
    minMovedRatio: 0.6,
    complexityLabel: 'Steady mix',
    hintLabel: 'Hint ready now'
  },
  hard: {
    label: 'Hard',
    note: 'Longer words, stronger shuffles, and a delayed hint so memory and pattern-spotting matter more.',
    hintDelayMs: 9000,
    minMovedRatio: 0.9,
    complexityLabel: 'Deep mix',
    hintLabel: 'Hint blooms after 9s'
  }
};

function getMovedLetters(originalWord, scrambledWord) {
  return originalWord.split('').reduce((count, letter, index) => (
    scrambledWord[index] === letter ? count : count + 1
  ), 0);
}

function shuffleWord(word, minMovedRatio) {
  const letters = word.split('');
  const minMoved = Math.max(2, Math.ceil(word.length * minMovedRatio));
  let bestAttempt = word;
  let bestMoved = 0;
  let attempts = 0;

  while (attempts < 80) {
    const next = [...letters];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }

    const attempt = next.join('');
    const movedLetters = getMovedLetters(word, attempt);
    if (attempt !== word && movedLetters >= minMoved) {
      return {
        scrambled: attempt,
        movedLetters
      };
    }

    if (attempt !== word && movedLetters > bestMoved) {
      bestAttempt = attempt;
      bestMoved = movedLetters;
    }
    attempts += 1;
  }

  return {
    scrambled: bestAttempt,
    movedLetters: bestMoved || getMovedLetters(word, bestAttempt)
  };
}

function pickWord(pool, config, previousWord = '') {
  const choices = pool.filter((entry) => entry.word !== previousWord);
  const selected = choices[Math.floor(Math.random() * choices.length)] || pool[0];
  const shuffled = shuffleWord(selected.word, config.minMovedRatio);
  return {
    ...selected,
    ...shuffled
  };
}

export default function QuietWords({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const pool = difficultyPools[difficulty] || difficultyPools.medium;
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestStreakKey = `quiet-journal-quiet-words-best-${difficulty}`;
  const clearsKey = `quiet-journal-quiet-words-clears-${difficulty}`;

  const [currentWord, setCurrentWord] = useState(() => pickWord(pool, config));
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Unscramble the word and keep the mood gentle.');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => parseInt(localStorage.getItem(bestStreakKey) || '0', 10));
  const [clears, setClears] = useState(() => parseInt(localStorage.getItem(clearsKey) || '0', 10));
  const [hintVisible, setHintVisible] = useState(config.hintDelayMs === 0);

  useEffect(() => {
    setCurrentWord(pickWord(pool, config));
    setGuess('');
    setMessage('Unscramble the word and keep the mood gentle.');
    setStreak(0);
    setBestStreak(parseInt(localStorage.getItem(bestStreakKey) || '0', 10));
    setClears(parseInt(localStorage.getItem(clearsKey) || '0', 10));
    setHintVisible(config.hintDelayMs === 0);
  }, [bestStreakKey, clearsKey, config, pool]);

  useEffect(() => {
    if (config.hintDelayMs === 0) {
      setHintVisible(true);
      return undefined;
    }

    setHintVisible(false);
    const timer = window.setTimeout(() => setHintVisible(true), config.hintDelayMs);
    return () => window.clearTimeout(timer);
  }, [config.hintDelayMs, currentWord.word]);

  const letterBlocks = useMemo(() => {
    const occurrences = {};
    return currentWord.scrambled.split('').map((letter) => {
      occurrences[letter] = (occurrences[letter] || 0) + 1;
      return {
        id: `${currentWord.word}-${letter}-${occurrences[letter]}`,
        letter
      };
    });
  }, [currentWord.scrambled, currentWord.word]);

  const scrambleIntensity = Math.round((currentWord.movedLetters / currentWord.word.length) * 100);

  const loadNextWord = () => {
    setCurrentWord((previous) => pickWord(pool, config, previous.word));
    setGuess('');
    setMessage('Fresh letters, same calm focus.');
  };

  const resetRound = () => {
    setStreak(0);
    setMessage('Fresh round, same soft pace.');
    setCurrentWord(pickWord(pool, config));
    setGuess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedGuess = guess.trim().toUpperCase();
    if (!normalizedGuess) return;

    if (normalizedGuess === currentWord.word) {
      const nextStreak = streak + 1;
      const nextClears = clears + 1;
      setMessage('Correct — keep the calm momentum going.');
      setStreak(nextStreak);
      setClears(nextClears);
      localStorage.setItem(clearsKey, String(nextClears));

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        localStorage.setItem(bestStreakKey, String(nextStreak));
      }

      loadNextWord();
      return;
    }

    setStreak(0);
    setMessage('Not quite — breathe, look again, and try another arrangement.');
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-[920px] pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_26px_80px_rgba(83,62,44,0.12)]' : 'border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/78'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,236,0.9)_40%,rgba(250,237,205,0.82)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6e5a4a 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-sage-200 bg-white/88 text-sage-700'}`}>
              <Sparkles size={14} /> {config.label} word reset
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>Words</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>A cozy word scramble for visitors who want a softer kind of focus. It is simple, familiar, and easy to play for a few minutes when you want a calm word-game loop instead of a noisy challenge.</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-amber-700' : 'text-sage-600'}`}>{config.note}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] shadow-sm ${isLofi ? 'border border-white/70 bg-white/70 text-amber-900 backdrop-blur-sm' : 'bg-white text-sage-700'}`}>{config.complexityLabel}</span>
              <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] shadow-sm ${isLofi ? 'border border-white/70 bg-white/70 text-amber-900 backdrop-blur-sm' : 'bg-white text-sage-700'}`}>{config.hintLabel}</span>
            </div>
          </div>
          <div className={`grid gap-2 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[28rem] ${isLofi ? 'rounded-[1.35rem] border border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'rounded-[1.5rem] border border-white/85 bg-white/80'}`}>
            {[
              ['Streak', streak],
              ['Best', bestStreak],
              ['Clears', clears],
              ['Shuffle', `${scrambleIntensity}%`]
            ].map(([label, value]) => (
              <div key={label} className={`${isLofi ? 'rounded-[0.95rem] bg-amber-50/90 text-amber-900' : 'rounded-[1.15rem] bg-sage-50'} px-4 py-3 text-center`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800/60' : 'text-sage-500'}`}>{label}</p>
                <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative z-10 mt-5 rounded-[1.5rem] border p-5 shadow-inner lg:p-6 ${isLofi ? 'border-amber-200/60 bg-[linear-gradient(145deg,rgba(253,250,245,0.96),rgba(250,237,205,0.92))]' : 'border-sage-100 bg-[#f7f1e7]'}`}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <div className={`rounded-[1.5rem] border px-4 py-4 text-sm font-semibold shadow-sm ${isLofi ? 'border-white/70 bg-white/72 text-[#6e5a4a] backdrop-blur-sm' : 'border-white/80 bg-white/78 text-sage-700'}`}>
                {hintVisible ? `Hint: ${currentWord.hint}` : 'Hint is still tucked away — look at the letter pattern first.'}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {letterBlocks.map((item) => (
                  <div key={item.id} className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] border text-xl font-extrabold shadow-sm transition ${isLofi ? 'border-[#eadfce] bg-white/82 text-[#4a3a2d] backdrop-blur-sm shadow-[0_12px_24px_rgba(83,62,44,0.1)]' : 'border-[#e7d8c7] bg-[#fbf7f1] text-sage-900'}`}>
                    {item.letter}
                  </div>
                ))}
              </div>

              <form className="mt-5" onSubmit={handleSubmit}>
                <label className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-sage-500'}`} htmlFor="quiet-words-guess">Your guess</label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="quiet-words-guess"
                    autoComplete="off"
                    className={`flex-1 rounded-full border px-5 py-3 text-base font-semibold outline-none transition ${isLofi ? 'border-amber-200 bg-white/82 text-[#3d3025] shadow-sm focus:border-[#d4a373] focus:ring-2 focus:ring-amber-200' : 'border-sage-200 bg-white text-sage-950 focus:border-sage-400 focus:ring-2 focus:ring-sage-200'}`}
                    onChange={(event) => setGuess(event.target.value.toUpperCase())}
                    placeholder="Type the word"
                    value={guess}
                  />
                  <button className={`rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-sage-900 hover:bg-sage-800'}`} type="submit">Check word</button>
                </div>
              </form>
            </div>

            <div className={`rounded-[1.5rem] border p-4 shadow-sm ${isLofi ? 'border-white/70 bg-white/70 text-[#6e5a4a] backdrop-blur-sm' : 'border-white/80 bg-white/76'}`}>
              <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-sage-500'}`}>Why the difficulty changes</p>
              <div className={`mt-3 space-y-2.5 text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>
                <p>Shorter words on easy are easier to hold in your head.</p>
                <p>Medium mixes more letters, so patterns take longer to spot.</p>
                <p>Hard uses longer words, heavier scrambles, and delayed hints.</p>
              </div>
              <div className={`mt-4 rounded-[1.15rem] px-4 py-3 text-sm font-semibold ${isLofi ? 'bg-amber-50/90 text-[#6e5a4a]' : 'bg-sage-50 text-sage-700'}`}>
                Word length: <span className={`font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>{currentWord.word.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`relative z-10 mt-5 flex flex-col gap-3 rounded-[1.5rem] border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-white/80 bg-white/72'}`}>
          <p className={`text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>{message}</p>
          <div className="flex flex-wrap gap-2">
            <button className={`rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'border border-amber-200 bg-white text-amber-900' : 'border border-sage-200 bg-white text-sage-900'}`} onClick={loadNextWord} type="button">Next word</button>
            <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#fdfaf5] text-[#4a3a2d] border border-white/70' : 'bg-white text-sage-900'}`} onClick={resetRound} type="button">
              <RotateCcw size={16} /> Reset round
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
