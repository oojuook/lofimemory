import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const passagePools = {
  easy: [
    'soft rain taps the window while the room stays warm and quiet',
    'take a slow breath and let the next line arrive without hurry',
    'a calm little typing break can help your thoughts settle gently',
  ],
  medium: [
    'lofi memory turns a simple speed test into a softer reset with music, puzzles, and room to breathe after each round',
    'typing for one quiet minute can sharpen your focus without making the page feel loud or competitive',
    'steady hands and a relaxed rhythm usually matter more than rushing when you want both speed and accuracy',
  ],
  hard: [
    'when your attention feels scattered, a longer typing passage can give your mind one clear thread to follow before you jump back into journaling or planning',
    'the best speed tests reward calm consistency, because smooth keystrokes and accurate phrasing often outperform frantic bursts that create extra corrections',
    'practice works better when the passage feels readable, the timer feels fair, and your stats help you notice progress instead of pressure',
  ],
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    duration: 30,
    note: 'Shorter timer and lighter lines for a relaxed warm-up.',
  },
  medium: {
    label: 'Medium',
    duration: 45,
    note: 'A balanced pace for measuring calm speed and focus.',
  },
  hard: {
    label: 'Hard',
    duration: 60,
    note: 'Longer passages and more time for a fuller typing run.',
  },
};

function pickPassage(pool, previousPassage = '') {
  const options = pool.filter((entry) => entry !== previousPassage);
  return options[Math.floor(Math.random() * options.length)] || pool[0];
}

function calculateStats(text, target, elapsedSeconds) {
  const typedChars = text.length;
  const correctChars = text.split('').reduce((count, character, index) => count + (character === target[index] ? 1 : 0), 0);
  const errors = Math.max(typedChars - correctChars, 0);
  const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
  const minutes = Math.max(elapsedSeconds, 1) / 60;
  const wpm = Math.round((correctChars / 5) / minutes);
  const cpm = Math.round(correctChars / minutes);

  return {
    typedChars,
    correctChars,
    errors,
    accuracy,
    wpm,
    cpm,
  };
}

export default function TypingSpeedTest({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const pool = passagePools[difficulty] || passagePools.medium;
  const bestWpmKey = `quiet-journal-typing-speed-best-${difficulty}`;
  const roundsKey = `quiet-journal-typing-speed-rounds-${difficulty}`;

  const [passage, setPassage] = useState(() => pickPassage(pool));
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasRecordedResult, setHasRecordedResult] = useState(false);
  const [bestWpm, setBestWpm] = useState(() => parseInt(localStorage.getItem(bestWpmKey) || '0', 10));
  const [rounds, setRounds] = useState(() => parseInt(localStorage.getItem(roundsKey) || '0', 10));
  const [message, setMessage] = useState('Press start, type the passage, and watch your WPM settle into view.');

  useEffect(() => {
    setPassage(pickPassage(pool));
    setTypedText('');
    setTimeLeft(config.duration);
    setIsRunning(false);
    setIsFinished(false);
    setHasRecordedResult(false);
    setBestWpm(parseInt(localStorage.getItem(bestWpmKey) || '0', 10));
    setRounds(parseInt(localStorage.getItem(roundsKey) || '0', 10));
    setMessage('Press start, type the passage, and watch your WPM settle into view.');
  }, [bestWpmKey, config.duration, pool, roundsKey]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timerId);
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const elapsedSeconds = config.duration - timeLeft;
  const currentStats = useMemo(() => calculateStats(typedText, passage, elapsedSeconds), [elapsedSeconds, passage, typedText]);

  useEffect(() => {
    if (!isFinished || hasRecordedResult) {
      return;
    }

    const nextRounds = rounds + 1;
    setRounds(nextRounds);
    localStorage.setItem(roundsKey, String(nextRounds));

    if (currentStats.wpm > bestWpm) {
      setBestWpm(currentStats.wpm);
      localStorage.setItem(bestWpmKey, String(currentStats.wpm));
    }

    setHasRecordedResult(true);
    setMessage(`Round finished — ${currentStats.wpm} WPM at ${currentStats.accuracy}% accuracy.`);
  }, [bestWpm, bestWpmKey, currentStats.accuracy, currentStats.wpm, hasRecordedResult, isFinished, rounds, roundsKey]);

  const startRound = () => {
    setTypedText('');
    setTimeLeft(config.duration);
    setIsFinished(false);
    setHasRecordedResult(false);
    setIsRunning(true);
    setMessage('Timer started — keep it smooth, not rushed.');
  };

  const resetRound = () => {
    setPassage((current) => pickPassage(pool, current));
    setTypedText('');
    setTimeLeft(config.duration);
    setIsRunning(false);
    setIsFinished(false);
    setHasRecordedResult(false);
    setMessage('Fresh passage ready when you are.');
  };

  const showResults = isFinished || typedText.length > 0;

  const passageMarkup = useMemo(() => passage.split('').map((character, index) => {
    let className = 'text-stone-400';

    if (index < typedText.length) {
      className = typedText[index] === character ? 'text-stone-950 bg-emerald-100/80' : 'text-rose-700 bg-rose-100/80';
    } else if (index === typedText.length) {
      className = 'text-stone-700 bg-amber-100/80';
    }

    return {
      id: `passage-${index}-${character === ' ' ? 'space' : character}`,
      character,
      className,
    };
  }), [passage, typedText]);

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-slate-50/86 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              <Sparkles size={14} /> {config.label} typing pace
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Typing Speed Test</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">A calm typing speed test that shows your WPM, accuracy, CPM, and errors without making the whole page feel intense. Start a timer, type the passage, and get a clean little snapshot of your rhythm.</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[28rem]">
            <div className="rounded-[1.15rem] bg-sky-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-600">Time</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{timeLeft}s</p>
            </div>
            <div className="rounded-[1.15rem] bg-sky-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-600">WPM</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{showResults ? currentStats.wpm : 0}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sky-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-600">Best</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{bestWpm}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sky-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-600">Rounds</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{rounds}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[1.8rem] border border-sky-100 bg-[#eef5fb] p-5 shadow-inner lg:p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600">Typing passage</p>
            <div className="mt-4 rounded-[1.5rem] border border-white/85 bg-white/86 p-5 text-lg leading-8 text-slate-800 shadow-sm">
              {passageMarkup.map((item) => (
                <span key={item.id} className={`rounded px-0.5 ${item.className}`}>
                  {item.character === ' ' ? '\u00A0' : item.character}
                </span>
              ))}
            </div>

            <label className="mt-5 block text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600" htmlFor="typing-speed-input">Type here</label>
            <textarea
              id="typing-speed-input"
              autoCapitalize="none"
              autoCorrect="off"
              className="mt-3 min-h-[168px] w-full rounded-[1.5rem] border border-sky-200 bg-white px-5 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={isFinished}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (!isRunning && !isFinished) {
                  setIsRunning(true);
                  setMessage('Timer started — keep it smooth, not rushed.');
                }
                if (!isFinished) {
                  setTypedText(nextValue);
                }
              }}
              placeholder="Start typing the highlighted passage here..."
              value={typedText}
            />

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900" onClick={startRound} type="button">
                Start fresh timer
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5" onClick={resetRound} type="button">
                <RotateCcw size={16} /> New passage
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[1.8rem] border border-white/80 bg-white/78 p-4 shadow-sm">
            <div className="rounded-[1.4rem] border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600">Current stats</p>
              <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700">
                <p>Accuracy: <span className="font-extrabold text-slate-950">{showResults ? currentStats.accuracy : 100}%</span></p>
                <p>CPM: <span className="font-extrabold text-slate-950">{showResults ? currentStats.cpm : 0}</span></p>
                <p>Errors: <span className="font-extrabold text-slate-950">{showResults ? currentStats.errors : 0}</span></p>
                <p>Correct chars: <span className="font-extrabold text-slate-950">{showResults ? currentStats.correctChars : 0}</span></p>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-sky-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600">How to read it</p>
              <div className="mt-3 space-y-2.5 text-sm leading-7 text-slate-700">
                <p>WPM estimates how many standard words you typed correctly each minute.</p>
                <p>Accuracy shows how clean your keystrokes were.</p>
                <p>CPM helps if you want a finer-grained progress number.</p>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-sky-100 bg-white p-4 text-sm font-semibold leading-7 text-slate-700 shadow-sm">
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
