import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const difficultyPools = {
  easy: [
    { word: 'CALM', hint: 'A peaceful feeling' },
    { word: 'SOFT', hint: 'Gentle in mood or touch' },
    { word: 'GLOW', hint: 'A warm, soft light' },
    { word: 'REST', hint: 'What a slow evening gives you' },
    { word: 'MOSS', hint: 'Something soft and green outdoors' },
    { word: 'COZY', hint: 'Warm, safe, and comfortable' },
  ],
  medium: [
    { word: 'DREAM', hint: 'A wandering thought or night story' },
    { word: 'CLOUD', hint: 'Something soft overhead' },
    { word: 'NOTES', hint: 'Short things you jot down' },
    { word: 'PLANT', hint: 'A quiet little desk companion' },
    { word: 'COAST', hint: 'A calm place near the sea' },
    { word: 'LIGHT', hint: 'A soft glow in the room' },
  ],
  hard: [
    { word: 'BREEZY', hint: 'Light and airy in mood' },
    { word: 'MEADOW', hint: 'An open grassy field' },
    { word: 'SETTLE', hint: 'What your mind starts to do when it quiets' },
    { word: 'SUNLIT', hint: 'Filled with gentle light' },
    { word: 'MELLOW', hint: 'Relaxed, soft, and unhurried' },
    { word: 'GARDEN', hint: 'A quiet green place to wander' },
  ],
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    wordLength: 4,
    maxGuesses: 7,
    note: 'Four-letter words and one extra guess for the gentlest start.',
  },
  medium: {
    label: 'Medium',
    wordLength: 5,
    maxGuesses: 6,
    note: 'Classic five-letter word guessing with a calm pace.',
  },
  hard: {
    label: 'Hard',
    wordLength: 6,
    maxGuesses: 6,
    note: 'Longer words when you want a deeper little focus loop.',
  },
};

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

const statusPriority = {
  absent: 1,
  present: 2,
  correct: 3,
};

const positionLabels = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];

function pickWord(pool, previousWord = '') {
  const choices = pool.filter((entry) => entry.word !== previousWord);
  return choices[Math.floor(Math.random() * choices.length)] || pool[0];
}

function evaluateGuess(guess, target) {
  const result = Array.from({ length: guess.length }, () => 'absent');
  const remainingLetters = target.split('');

  guess.split('').forEach((letter, index) => {
    if (letter === target[index]) {
      result[index] = 'correct';
      remainingLetters[index] = null;
    }
  });

  guess.split('').forEach((letter, index) => {
    if (result[index] === 'correct') {
      return;
    }

    const matchIndex = remainingLetters.indexOf(letter);
    if (matchIndex !== -1) {
      result[index] = 'present';
      remainingLetters[matchIndex] = null;
    }
  });

  return result;
}

function getTileClass(status, filled) {
  if (status === 'correct') {
    return 'border-emerald-300 bg-emerald-200/90 text-emerald-950';
  }
  if (status === 'present') {
    return 'border-amber-300 bg-amber-100 text-amber-950';
  }
  if (status === 'absent') {
    return 'border-slate-200 bg-slate-200/85 text-slate-700';
  }
  if (filled) {
    return 'border-sage-300 bg-white text-sage-950';
  }
  return 'border-sage-100 bg-[#fbf7f1] text-sage-300';
}

function getKeyboardKeyClass(status) {
  if (status === 'correct') {
    return 'border-emerald-300 bg-emerald-200/90 text-emerald-950';
  }
  if (status === 'present') {
    return 'border-amber-300 bg-amber-100 text-amber-950';
  }
  if (status === 'absent') {
    return 'border-slate-200 bg-slate-200/85 text-slate-700';
  }
  return 'border-sage-200 bg-white text-sage-900 hover:bg-sage-50';
}

export default function QuietWordle({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const pool = difficultyPools[difficulty] || difficultyPools.medium;
  const bestKey = `quiet-journal-quiet-wordle-best-${difficulty}`;
  const winsKey = `quiet-journal-quiet-wordle-wins-${difficulty}`;

  const [targetEntry, setTargetEntry] = useState(() => pickWord(pool));
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('Guess the word a letter at a time — no rush.');
  const [roundStatus, setRoundStatus] = useState('playing');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => parseInt(localStorage.getItem(bestKey) || '0', 10));
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem(winsKey) || '0', 10));

  useEffect(() => {
    setTargetEntry(pickWord(pool));
    setGuesses([]);
    setCurrentGuess('');
    setMessage('Guess the word a letter at a time — no rush.');
    setRoundStatus('playing');
    setStreak(0);
    setBestStreak(parseInt(localStorage.getItem(bestKey) || '0', 10));
    setWins(parseInt(localStorage.getItem(winsKey) || '0', 10));
  }, [bestKey, pool, winsKey]);

  const guessEvaluations = useMemo(
    () => guesses.map((guess) => evaluateGuess(guess, targetEntry.word)),
    [guesses, targetEntry.word],
  );

  const keyboardStatuses = useMemo(() => {
    const nextStatuses = {};

    guesses.forEach((guess, guessIndex) => {
      const statuses = guessEvaluations[guessIndex] || [];
      guess.split('').forEach((letter, letterIndex) => {
        const status = statuses[letterIndex];
        if (!status) {
          return;
        }

        const previousStatus = nextStatuses[letter];
        if (!previousStatus || statusPriority[status] > statusPriority[previousStatus]) {
          nextStatuses[letter] = status;
        }
      });
    });

    return nextStatuses;
  }, [guessEvaluations, guesses]);

  const loadNextWord = useCallback((resetStreak = false) => {
    setTargetEntry((previous) => pickWord(pool, previous.word));
    setGuesses([]);
    setCurrentGuess('');
    setRoundStatus('playing');
    setMessage('Fresh board, same calm pace.');
    if (resetStreak) {
      setStreak(0);
    }
  }, [pool]);

  const addLetter = useCallback((letter) => {
    if (roundStatus !== 'playing' || currentGuess.length >= config.wordLength) {
      return;
    }

    setCurrentGuess((previous) => `${previous}${letter}`);
  }, [config.wordLength, currentGuess.length, roundStatus]);

  const removeLetter = useCallback(() => {
    if (roundStatus !== 'playing') {
      return;
    }

    setCurrentGuess((previous) => previous.slice(0, -1));
  }, [roundStatus]);

  const submitGuess = useCallback(() => {
    if (roundStatus !== 'playing') {
      return;
    }

    if (currentGuess.length !== config.wordLength) {
      setMessage(`Finish the ${config.wordLength}-letter word first.`);
      return;
    }

    const normalizedGuess = currentGuess.toUpperCase();
    const nextGuesses = [...guesses, normalizedGuess];
    setGuesses(nextGuesses);
    setCurrentGuess('');

    if (normalizedGuess === targetEntry.word) {
      const nextStreak = streak + 1;
      const nextWins = wins + 1;
      setRoundStatus('won');
      setMessage('You got it — soft win, nice and steady.');
      setStreak(nextStreak);
      setWins(nextWins);
      localStorage.setItem(winsKey, String(nextWins));

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        localStorage.setItem(bestKey, String(nextStreak));
      }
      return;
    }

    const guessesLeft = config.maxGuesses - nextGuesses.length;
    if (guessesLeft === 0) {
      setRoundStatus('lost');
      setStreak(0);
      setMessage(`Round complete — the word was ${targetEntry.word}.`);
      return;
    }

    setMessage(`Not quite yet — ${guessesLeft} guess${guessesLeft === 1 ? '' : 'es'} left.`);
  }, [bestKey, bestStreak, config.maxGuesses, config.wordLength, currentGuess, guesses, roundStatus, streak, targetEntry.word, wins, winsKey]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (roundStatus !== 'playing' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        submitGuess();
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        removeLetter();
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        addLetter(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addLetter, removeLetter, roundStatus, submitGuess]);

  const rows = Array.from({ length: config.maxGuesses }, (_, rowIndex) => {
    const buildCells = (letters, statuses, rowId) => letters.map((letter, letterIndex) => ({
      id: `${rowId}-${positionLabels[letterIndex] || `slot-${letterIndex + 1}`}`,
      letter,
      status: statuses[letterIndex],
    }));

    if (rowIndex < guesses.length) {
      const guess = guesses[rowIndex];
      const rowId = `guess-${rowIndex}`;
      return {
        id: rowId,
        cells: buildCells(guess.split(''), guessEvaluations[rowIndex], rowId),
      };
    }

    if (rowIndex === guesses.length && roundStatus === 'playing') {
      const paddedGuess = currentGuess.padEnd(config.wordLength, ' ');
      const rowId = `current-${rowIndex}`;
      return {
        id: rowId,
        cells: buildCells(paddedGuess.split(''), Array.from({ length: config.wordLength }, () => 'idle'), rowId),
      };
    }

    const rowId = `empty-${rowIndex}`;
    return {
      id: rowId,
      cells: buildCells(Array.from({ length: config.wordLength }, () => ' '), Array.from({ length: config.wordLength }, () => 'idle'), rowId),
    };
  });

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sky-50/72 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
              <Sparkles size={14} /> {config.label} word guess
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-sage-950">Quiet Wordle</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">A cozy Wordle-style puzzle for when you want a familiar word-guessing game without losing the soft relaxed mood of the page. Type or tap letters, read the color hints, and keep the rounds light.</p>
            <p className="mt-2 text-sm font-semibold text-sage-600">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem]">
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Streak</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{streak}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{bestStreak}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Wins</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{wins}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)]">
          <div className="rounded-[1.8rem] border border-sage-100 bg-[#f7f1e7] p-5 shadow-inner lg:p-6">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/78 px-4 py-4 text-sm font-semibold text-sage-700 shadow-sm">
              Hint: {targetEntry.hint}
            </div>

            <div className="mt-5 grid gap-2">
              {rows.map((row) => (
                <div key={row.id} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${config.wordLength}, minmax(0, 1fr))` }}>
                  {row.cells.map((cell) => {
                    const filled = cell.letter.trim().length > 0;
                    return (
                      <div
                        key={cell.id}
                        className={`flex aspect-square items-center justify-center rounded-[1.1rem] border text-xl font-extrabold uppercase shadow-sm transition ${getTileClass(cell.status, filled)}`}
                      >
                        {cell.letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[1.8rem] border border-white/80 bg-white/74 p-4 shadow-sm lg:p-5">
            <div className="rounded-[1.4rem] border border-sage-100 bg-sage-50/70 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">How the colors work</p>
              <div className="mt-3 grid gap-2 text-sm font-semibold text-sage-700">
                <p><span className="mr-2 inline-flex rounded-full bg-emerald-200 px-2 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-950">Exact</span> right letter, right spot</p>
                <p><span className="mr-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-950">Close</span> right letter, wrong spot</p>
                <p><span className="mr-2 inline-flex rounded-full bg-slate-200 px-2 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700">Miss</span> not in the word</p>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-sage-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">Round status</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-sage-700">{message}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-sage-500">{config.wordLength} letters • {config.maxGuesses} tries</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-800"
                onClick={submitGuess}
                type="button"
              >
                Check word
              </button>
              <button
                className="rounded-full border border-sage-200 bg-white px-5 py-3 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5"
                onClick={() => loadNextWord(roundStatus !== 'won')}
                type="button"
              >
                New word
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5"
                onClick={() => {
                  setGuesses([]);
                  setCurrentGuess('');
                  setRoundStatus('playing');
                  setStreak(0);
                  setMessage('Fresh board, same calm pace.');
                }}
                type="button"
              >
                <RotateCcw size={16} /> Reset streak
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-white/80 bg-white/72 p-4 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">Tap or type letters</p>
          <div className="mt-4 grid gap-2">
            {keyboardRows.map((row) => (
              <div key={`keyboard-row-${row.join('')}`} className="flex flex-wrap justify-center gap-2">
                {row.map((keyLabel) => {
                  const isSpecialKey = keyLabel === 'ENTER' || keyLabel === '⌫';
                  const status = keyboardStatuses[keyLabel];
                  return (
                    <button
                      key={keyLabel}
                      className={`rounded-2xl border px-3 py-3 text-sm font-extrabold uppercase shadow-sm transition hover:-translate-y-0.5 ${isSpecialKey ? 'min-w-[4.5rem]' : 'min-w-[2.8rem]'} ${getKeyboardKeyClass(status)}`}
                      onClick={() => {
                        if (keyLabel === 'ENTER') {
                          submitGuess();
                          return;
                        }
                        if (keyLabel === '⌫') {
                          removeLetter();
                          return;
                        }
                        addLetter(keyLabel);
                      }}
                      type="button"
                    >
                      {keyLabel}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
