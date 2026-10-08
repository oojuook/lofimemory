import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const timerPresets = [15, 30, 60];
const WORD_BATCH_SIZE = 24;
const WORD_INITIAL_COUNT = 42;
const WORD_BUFFER_SIZE = 18;

const typingModeSettings = {
  words: {
    label: 'Words',
    panelDescription: 'A calmer typing test where the words keep coming and the active line moves along with you, closer to a monkeytype flow but still cozy on mobile.',
    modeNote: 'Choose words for the classic continuous typing rhythm.',
    idleMessage: 'Tap the word flow or the input box, then start typing. Press space to roll into the next word.',
    runningMessage: 'Space commits each word and the next one glides into view.',
    finishedMessage: 'Round complete — restart whenever you want another flowing word run.',
    inputLabel: 'Live input',
    placeholder: 'Start typing here…',
    tips: [
      'Words keep extending, so you can stay in rhythm for the whole timer.',
      'Space commits a word and scrolls the active one into view.',
      'On mobile, tap the word panel anytime to refocus the keyboard.'
    ]
  },
  sentences: {
    label: 'Sentences',
    panelDescription: 'Sentence mode now feels more like Typing.com: one readable passage, inline live feedback, a visible timer, and a cleaner focus area without a second typing box competing for attention.',
    modeNote: 'Choose sentences for a full-passage typing test with inline character feedback.',
    idleMessage: 'Start typing to begin. The timer starts on your first character.',
    runningMessage: 'Keep moving through the passage — every correct character counts live.',
    finishedMessage: 'Passage complete. Restart for a fresh sentence challenge.',
    inputLabel: 'Typing field',
    placeholder: 'Start typing the passage here…',
    tips: [
      'Sentence mode keeps the passage in one focused reading area, closer to a classic typing test.',
      'Type directly after tapping the passage — the timer starts on your first keypress.',
      'Accuracy updates inline as each character changes color.'
    ]
  }
};

const wordPools = {
  easy: [
    'soft', 'rain', 'moss', 'glow', 'rest', 'slow', 'calm', 'cozy', 'bloom', 'drift', 'pond', 'leaf', 'hush', 'breeze', 'warm', 'still', 'lilypad', 'lantern', 'cloud', 'river', 'ember', 'settle', 'quiet', 'golden', 'tea', 'window', 'blanket', 'gentle', 'ripple', 'meadow'
  ],
  medium: [
    'typing', 'rhythm', 'coastline', 'journal', 'focus', 'steady', 'unwind', 'layout', 'puzzle', 'forecast', 'breathe', 'comfort', 'friendlier', 'signal', 'sunlight', 'evening', 'restart', 'clarity', 'wander', 'drizzle', 'morning', 'kindness', 'landing', 'texture', 'gliding', 'mobile', 'frogs', 'lilies', 'pockets', 'harbor'
  ],
  hard: [
    'atmosphere', 'comfortable', 'meditative', 'background', 'continuous', 'monkeytype', 'interface', 'forecasting', 'adjustments', 'reflection', 'responsive', 'beautifully', 'character', 'wordsmith', 'snowfall', 'waterfront', 'curiosity', 'adventure', 'sunshower', 'hummingbird', 'harmonize', 'understory', 'lighthouse', 'momentum', 'storybook', 'tenderness', 'serenity', 'afterglow', 'wildflower', 'moonlight'
  ]
};

const sentencePassages = {
  easy: [
    'Soft rain taps the window while the room stays warm and quiet.',
    'A calm pond reflects the clouds as the evening slowly settles in.',
    'Warm tea and a gentle breeze can make a tired day feel lighter.',
    'Cozy lights and soft music turn a short typing break into a calm ritual.',
    'The little radio hums softly while you type one clean line at a time.',
    'A sleepy cat curls beside the desk as the playlist keeps moving.',
    'Golden light lands on the notebook and makes the page feel kind.',
    'Tiny waves roll across the shore while your hands find a steady pace.',
    'A quiet room can make simple words feel easier to follow.',
    'The moon looks gentle tonight, and the keyboard feels calm.',
    'Fresh flowers near the window make the morning feel softer.',
    'Slow music helps each word arrive without needing to rush.'
  ],
  medium: [
    'The lilypad garden feels brighter when the rhythm stays steady and the page remains easy to read.',
    'A quiet desk and a clear mind can make each sentence feel smoother, lighter, and easier to finish.',
    'Gentle music, softer colors, and a calmer layout help typing practice feel more enjoyable over time.',
    'When the interface feels simple and welcoming, longer passages become much easier to focus on.',
    'The best study breaks feel small, useful, and calm enough to return from without losing focus.',
    'A mellow beat in the background can turn ordinary typing practice into a peaceful little routine.',
    'The city lights outside the window blur softly while the sentence waits for careful attention.',
    'Good practice is not always fast; sometimes it is steady, accurate, and easy to repeat.',
    'The page feels better when every button has space to breathe and every word has room to land.',
    'A cozy browser corner can hold games, notes, and music without becoming noisy or distracting.',
    'Each reset should bring a fresh prompt so practice feels new instead of repeating the same line.',
    'Typing feels more natural when the sentence has a clear rhythm and a gentle visual flow.'
  ],
  hard: [
    'The atmosphere becomes more meditative when a longer passage asks for patience, cleaner spacing, and steady concentration from beginning to end.',
    'A responsive layout and a calmer background can transform sentence practice into a more restorative ritual, even when the words become more demanding.',
    'Comfortable typing often comes from repeating longer prompts until momentum, accuracy, and rhythm begin to harmonize naturally.',
    'Storybook evenings and a mellow soundtrack can make sustained concentration feel beautifully consistent instead of tense or rushed.',
    'A minimal lofi workspace should feel expressive without becoming crowded, letting soft textures and warm colors support the user quietly.',
    'When a game responds instantly to every key press, the experience feels fair, smooth, and much easier to enjoy for a longer session.',
    'Imported wallpapers can change the whole mood of a page when the overlay, contrast, and card surfaces adapt together carefully.',
    'A thoughtful interface keeps the most important action close by, hides unnecessary noise, and still leaves room for personal style.',
    'Longer typing passages are useful because they reveal whether the rhythm, spacing, punctuation, and focus can stay consistent over time.',
    'The quietest designs often require the most care, because every shadow, pause, animation, and word needs to earn its place.',
    'A relaxing website should feel smooth on a phone, comfortable on a laptop, and spacious enough on a larger screen without changing its personality.',
    'Lofi music, gentle games, private writing, and small reminders can work together when the whole page stays calm, readable, and responsive.'
  ]
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    note: 'Shorter prompts and softer pacing for a more welcoming flow.'
  },
  medium: {
    label: 'Medium',
    note: 'Balanced prompts that feel close to a classic typing rhythm.'
  },
  hard: {
    label: 'Hard',
    note: 'Longer prompts with denser language for sharper focus.'
  }
};

function pickRandom(items, previousItem = '') {
  const choices = items.filter((item) => item !== previousItem);
  return choices[Math.floor(Math.random() * choices.length)] || items[0];
}

function generateWordBatch(pool, count) {
  return Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);
}

function generateDistinctWordBatch(pool, count, previousBatch = []) {
  const previousSignature = previousBatch.join(' ');
  let nextBatch = generateWordBatch(pool, count);
  let attempts = 0;

  while (previousSignature && nextBatch.join(' ') === previousSignature && attempts < 6) {
    nextBatch = generateWordBatch(pool, count);
    attempts += 1;
  }

  return nextBatch;
}

function compareText(targetText, typedText) {
  const maxLength = Math.max(targetText.length, typedText.length);
  let correctChars = 0;
  let incorrectChars = 0;

  for (let index = 0; index < maxLength; index += 1) {
    const targetChar = targetText[index] || '';
    const typedChar = typedText[index] || '';

    if (!typedChar) {
      continue;
    }

    if (typedChar === targetChar) {
      correctChars += 1;
    } else {
      incorrectChars += 1;
    }
  }

  return {
    correctChars,
    incorrectChars,
    isPerfect: typedText === targetText
  };
}

function buildSentenceCharacters(targetText, typedText) {
  return targetText.split('').map((char, index) => ({
    id: `${targetText}-${index}`,
    targetChar: char,
    typedChar: typedText[index] || ''
  }));
}

function WordPrompt({ activeInput = '', isActive, isLofi = false, isPast, prompt, promptRef, typedPrompt = '' }) {
  const maxLength = Math.max(prompt.length, (isActive ? activeInput : typedPrompt).length);
  const characters = Array.from({ length: maxLength }, (_, index) => ({
    id: `${prompt}-${index}`,
    targetChar: prompt[index] || '',
    typedChar: (isActive ? activeInput : typedPrompt)[index] || ''
  }));

  return (
    <span
      className={`inline-flex min-h-[2.75rem] items-center rounded-2xl px-2.5 py-2 text-lg font-bold transition sm:text-xl ${isActive ? (isLofi ? 'bg-white/82 text-[#3d3025] shadow-sm ring-2 ring-amber-200 backdrop-blur-sm' : 'bg-white text-stone-950 shadow-sm ring-2 ring-sky-200') : isPast ? 'bg-transparent' : (isLofi ? 'text-[#baa28c]' : 'text-stone-300')}`}
      ref={promptRef}
    >
      {characters.map(({ id, targetChar, typedChar }) => {
        let className = isLofi ? 'text-[#baa28c]' : 'text-stone-300';
        let content = targetChar;

        if (isPast) {
          content = typedChar || targetChar;
          className = typedChar === targetChar ? (isLofi ? 'text-[#3d5d49]' : 'text-emerald-700') : (isLofi ? 'text-[#b15f55]' : 'text-rose-600');
        } else if (isActive) {
          if (!typedChar) {
            className = isLofi ? 'text-[#8c755f]' : 'text-stone-400';
            content = targetChar;
          } else {
            content = typedChar;
            className = typedChar === targetChar
              ? (isLofi ? 'text-[#3d3025] bg-[#f5e6d3]' : 'text-stone-950 bg-emerald-100/80')
              : (isLofi ? 'text-[#8d4b45] bg-[#f4d6cf]' : 'text-rose-700 bg-rose-100/80');
          }
        }

        return (
          <span className={`rounded px-[1px] ${className}`} key={id}>
            {content === ' ' ? '\u00A0' : content}
          </span>
        );
      })}
    </span>
  );
}

export default function TypingSpeedTest({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const [typingMode, setTypingMode] = useState('words');
  const modeConfig = typingModeSettings[typingMode] || typingModeSettings.words;
  const bestKey = `quiet-journal-typing-speed-best-${difficulty}-${typingMode}`;
  const roundsKey = `quiet-journal-typing-speed-rounds-${difficulty}-${typingMode}`;

  const inputRef = useRef(null);
  const wordRefs = useRef({});

  const [timerPreset, setTimerPreset] = useState(30);
  const [wordSequence, setWordSequence] = useState(() => generateDistinctWordBatch(wordPools[difficulty] || wordPools.medium, WORD_INITIAL_COUNT));
  const [typedWords, setTypedWords] = useState([]);
  const [sentenceTarget, setSentenceTarget] = useState(() => pickRandom(sentencePassages[difficulty] || sentencePassages.medium));
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [roundStatus, setRoundStatus] = useState('idle');
  const [recordedCorrectChars, setRecordedCorrectChars] = useState(0);
  const [recordedIncorrectChars, setRecordedIncorrectChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [bestWpm, setBestWpm] = useState(() => parseInt(localStorage.getItem(bestKey) || '0', 10));
  const [rounds, setRounds] = useState(() => parseInt(localStorage.getItem(roundsKey) || '0', 10));
  const [hasRecordedResult, setHasRecordedResult] = useState(false);

  const wordPool = wordPools[difficulty] || wordPools.medium;
  const sentencePool = sentencePassages[difficulty] || sentencePassages.medium;
  const wordEntries = useMemo(() => {
    const promptCounts = {};
    return wordSequence.map((prompt) => {
      promptCounts[prompt] = (promptCounts[prompt] || 0) + 1;
      return {
        id: `${prompt}-${promptCounts[prompt]}`,
        prompt
      };
    });
  }, [wordSequence]);
  const activeWordIndex = typedWords.length;
  const activeWord = wordSequence[activeWordIndex] || '';
  const elapsedSeconds = timerPreset - timeLeft;
  const sentenceComparison = useMemo(() => compareText(sentenceTarget, currentInput), [currentInput, sentenceTarget]);
  const liveWordComparison = useMemo(() => compareText(activeWord, currentInput.trim()), [activeWord, currentInput]);

  const correctChars = typingMode === 'sentences'
    ? sentenceComparison.correctChars
    : recordedCorrectChars + liveWordComparison.correctChars;
  const incorrectChars = typingMode === 'sentences'
    ? sentenceComparison.incorrectChars
    : recordedIncorrectChars + liveWordComparison.incorrectChars;
  const totalTypedChars = correctChars + incorrectChars;
  const wpm = elapsedSeconds > 0 ? Math.round((correctChars / 5) / (elapsedSeconds / 60)) : 0;
  const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  const cpm = elapsedSeconds > 0 ? Math.round(correctChars / (elapsedSeconds / 60)) : 0;
  const sentenceCharacters = useMemo(() => buildSentenceCharacters(sentenceTarget, currentInput), [currentInput, sentenceTarget]);
  const activeSentenceIndex = Math.min(currentInput.length, Math.max(sentenceCharacters.length - 1, 0));
  const sentenceProgress = sentenceTarget.length > 0 ? Math.min(100, Math.round((currentInput.length / sentenceTarget.length) * 100)) : 0;

  const resetRound = useCallback((nextPreset = timerPreset, nextMode = typingMode) => {
    if (nextMode === 'words') {
      setWordSequence((previous) => generateDistinctWordBatch(wordPool, WORD_INITIAL_COUNT, previous));
      setTypedWords([]);
    } else {
      setSentenceTarget((previous) => pickRandom(sentencePool, previous));
      setTypedWords([]);
    }

    setCurrentInput('');
    setTimeLeft(nextPreset);
    setIsRunning(false);
    setRoundStatus('idle');
    setRecordedCorrectChars(0);
    setRecordedIncorrectChars(0);
    setErrors(0);
    setHasRecordedResult(false);
    wordRefs.current = {};
  }, [sentencePool, timerPreset, typingMode, wordPool]);

  useEffect(() => {
    setBestWpm(parseInt(localStorage.getItem(bestKey) || '0', 10));
    setRounds(parseInt(localStorage.getItem(roundsKey) || '0', 10));
    resetRound(30, typingMode);
  }, [bestKey, roundsKey, difficulty, resetRound, typingMode]);

  useEffect(() => {
    if (typingMode !== 'words') {
      return;
    }

    if (wordSequence.length - activeWordIndex > WORD_BUFFER_SIZE) {
      return;
    }

    setWordSequence((previous) => [...previous, ...generateWordBatch(wordPool, WORD_BATCH_SIZE)]);
  }, [activeWordIndex, typingMode, wordPool, wordSequence.length]);

  useEffect(() => {
    if (typingMode !== 'words') {
      return;
    }

    const activeNode = wordRefs.current[activeWordIndex];
    activeNode?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, [activeWordIndex, typingMode]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timerId);
          setIsRunning(false);
          setRoundStatus('finished');
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning]);

  useEffect(() => {
    if (roundStatus !== 'finished' || hasRecordedResult) {
      return;
    }

    const nextRounds = rounds + 1;
    setRounds(nextRounds);
    setHasRecordedResult(true);
    localStorage.setItem(roundsKey, String(nextRounds));

    if (wpm > bestWpm) {
      setBestWpm(wpm);
      localStorage.setItem(bestKey, String(wpm));
    }
  }, [bestKey, bestWpm, hasRecordedResult, rounds, roundsKey, roundStatus, wpm]);

  const commitWord = (rawValue) => {
    if (roundStatus === 'finished') {
      return;
    }

    const normalizedValue = rawValue.toLowerCase().replace(/[^a-z\-\s]/g, '');
    let remainingValue = normalizedValue;
    const nextTypedWords = [...typedWords];
    let nextCorrect = 0;
    let nextIncorrect = 0;
    let nextErrors = 0;

    while (remainingValue.includes(' ')) {
      const boundaryIndex = remainingValue.indexOf(' ');
      const typedWord = remainingValue.slice(0, boundaryIndex).trim();
      const targetWord = wordSequence[nextTypedWords.length];

      if (!targetWord) {
        break;
      }

      remainingValue = remainingValue.slice(boundaryIndex + 1).replace(/^\s+/, '');
      if (!typedWord) {
        continue;
      }

      const comparison = compareText(targetWord, typedWord);
      nextCorrect += comparison.correctChars;
      nextIncorrect += comparison.incorrectChars;
      if (!comparison.isPerfect) {
        nextErrors += 1;
      }
      nextTypedWords.push(typedWord);
    }

    if (nextTypedWords.length !== typedWords.length) {
      setTypedWords(nextTypedWords);
      setRecordedCorrectChars((previous) => previous + nextCorrect);
      setRecordedIncorrectChars((previous) => previous + nextIncorrect);
      setErrors((previous) => previous + nextErrors);
    }

    setCurrentInput(remainingValue);
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (!isRunning && nextValue.length > 0 && timeLeft > 0) {
      setIsRunning(true);
      setRoundStatus('running');
    }

    if (typingMode === 'sentences') {
      if (roundStatus === 'finished') {
        return;
      }

      setCurrentInput(nextValue.slice(0, sentenceTarget.length));
      const nextComparison = compareText(sentenceTarget, nextValue.slice(0, sentenceTarget.length));
      setErrors(nextComparison.incorrectChars);

      if (nextValue.slice(0, sentenceTarget.length).length >= sentenceTarget.length) {
        setIsRunning(false);
        setRoundStatus('finished');
      }
      return;
    }

    commitWord(nextValue);
  };

  const helperMessage = useMemo(() => {
    if (roundStatus === 'finished') {
      return modeConfig.finishedMessage;
    }

    if (!isRunning) {
      return modeConfig.idleMessage;
    }

    return modeConfig.runningMessage;
  }, [isRunning, modeConfig.finishedMessage, modeConfig.idleMessage, modeConfig.runningMessage, roundStatus]);

  return (
    <div className="mx-auto mt-12 w-full max-w-[1040px] pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-4 shadow-soft sm:p-5 lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_28px_80px_rgba(83,62,44,0.12)]' : 'border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-slate-50/86'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,236,0.9)_42%,rgba(250,237,205,0.84)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #7a6250 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-sky-200 bg-white/88 text-sky-700'}`}>
              <Sparkles size={14} /> {config.label} typing pace
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>Typing Speed Test</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-slate-700'}`}>{modeConfig.panelDescription}</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-amber-700' : 'text-slate-600'}`}>{config.note}</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-[#8b5e34]' : 'text-sky-700'}`}>{modeConfig.modeNote}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {Object.entries(typingModeSettings).map(([modeKey, modeValue]) => (
                <button
                  key={modeKey}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${typingMode === modeKey ? (isLofi ? 'bg-[#4a3a2d] text-white shadow-sm' : 'bg-slate-900 text-white shadow-sm') : (isLofi ? 'border border-amber-200 bg-white text-amber-900 hover:bg-[#fff8f0]' : 'border border-sky-200 bg-white text-sky-800 hover:bg-sky-50')}`}
                  onClick={() => setTypingMode(modeKey)}
                  type="button"
                >
                  {modeValue.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {timerPresets.map((preset) => (
                <button
                  key={preset}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${timerPreset === preset ? (isLofi ? 'bg-[#a98467] text-white shadow-sm' : 'bg-slate-900 text-white shadow-sm') : (isLofi ? 'border border-amber-200 bg-white text-amber-900 hover:bg-[#fff8f0]' : 'border border-sky-200 bg-white text-sky-800 hover:bg-sky-50')}`}
                  onClick={() => {
                    setTimerPreset(preset);
                    resetRound(preset);
                  }}
                  type="button"
                >
                  {preset}s
                </button>
              ))}
            </div>
          </div>
          <div className={`grid w-full gap-2 p-3 shadow-sm sm:grid-cols-2 lg:w-[29rem] lg:grid-cols-3 ${isLofi ? 'rounded-[1.45rem] border border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'rounded-[1.6rem] border border-white/85 bg-white/84'}`}>
            {[
              { label: 'WPM', value: wpm },
              { label: 'Accuracy', value: `${accuracy}%` },
              { label: 'CPM', value: cpm },
              { label: 'Errors', value: errors },
              { label: 'Best WPM', value: bestWpm },
              { label: 'Rounds', value: rounds }
            ].map((stat) => (
              <div key={stat.label} className={`${isLofi ? 'rounded-[0.95rem] bg-amber-50/90 text-amber-900' : 'rounded-[1.15rem] bg-slate-50'} px-4 py-3 text-center`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800/60' : 'text-slate-500'}`}>{stat.label}</p>
                <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className={`rounded-[1.5rem] border p-4 shadow-sm sm:p-5 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/72 backdrop-blur-sm' : 'border-white/80 bg-white/92'}`}>
            <button
              className={`block w-full overflow-y-auto rounded-[1.5rem] px-3 py-4 text-left shadow-inner outline-none ring-offset-0 transition focus-visible:ring-2 sm:px-4 ${typingMode === 'sentences' ? 'min-h-[15rem] sm:min-h-[17rem] lg:min-h-[18rem]' : 'h-[11.5rem] sm:h-[13rem]'} ${isLofi ? 'bg-[linear-gradient(145deg,rgba(253,250,245,0.98),rgba(245,230,211,0.88))] focus-visible:ring-amber-300' : 'bg-slate-50/90 focus-visible:ring-sky-300'}`}
              onClick={() => inputRef.current?.focus()}
              type="button"
            >
              {typingMode === 'sentences' ? (
                <div className="flex h-full flex-col">
                  <div className={`mb-3 flex items-center justify-between gap-3 rounded-[1rem] px-3 py-2 shadow-sm ${isLofi ? 'bg-white/82 backdrop-blur-sm' : 'bg-white/88'}`}>
                    <div>
                      <p className={`text-[11px] font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-800' : 'text-sky-700'}`}>Sentence test</p>
                      <p className={`mt-1 text-xs font-semibold ${isLofi ? 'text-[#7b6656]' : 'text-slate-600'}`}>Tap here and type — progress {sentenceProgress}%</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] ${timeLeft > 10 ? (isLofi ? 'bg-[#d8eadf] text-[#2f4d3d]' : 'bg-emerald-100 text-emerald-800') : timeLeft > 0 ? (isLofi ? 'bg-[#f7e2b7] text-[#7a5227]' : 'bg-amber-100 text-amber-800') : (isLofi ? 'bg-[#f4d6cf] text-[#8d4b45]' : 'bg-rose-100 text-rose-700')}`}>
                      {timeLeft}s left
                    </span>
                  </div>
                  <div className={`flex-1 overflow-y-auto rounded-[1.3rem] px-4 py-4 shadow-inner ${isLofi ? 'bg-white/78 backdrop-blur-sm' : 'bg-white'}`}>
                    <p className={`whitespace-pre-wrap break-words text-lg font-semibold leading-8 sm:text-xl sm:leading-9 ${isLofi ? 'text-[#baa28c]' : 'text-stone-400'}`}>
                      {sentenceCharacters.map(({ id, targetChar, typedChar }, index) => {
                        let className = isLofi ? 'text-[#baa28c]' : 'text-stone-400';
                        let content = targetChar;

                        if (typedChar) {
                          className = typedChar === targetChar
                            ? (isLofi ? 'text-[#3d3025]' : 'text-slate-950')
                            : (isLofi ? 'rounded bg-[#f4d6cf] text-[#8d4b45]' : 'rounded bg-rose-100 text-rose-700');
                          content = typedChar;
                        } else if (index === activeSentenceIndex) {
                          className = isLofi ? 'rounded bg-[#f5e6d3] text-[#3d3025] ring-1 ring-amber-200' : 'rounded bg-sky-100 text-slate-950 ring-1 ring-sky-200';
                        }

                        return (
                          <span className={`px-[1px] ${className}`} key={id}>
                            {content}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-lg leading-8 sm:text-xl sm:leading-9">
                  {wordEntries.map(({ id, prompt }, index) => (
                    <WordPrompt
                      activeInput={currentInput}
                      isActive={index === activeWordIndex}
                      isLofi={isLofi}
                      isPast={index < activeWordIndex}
                      key={id}
                      prompt={prompt}
                      promptRef={(node) => {
                        if (node) {
                          wordRefs.current[index] = node;
                        }
                      }}
                      typedPrompt={typedWords[index] || ''}
                    />
                  ))}
                </div>
              )}
            </button>

            <div className={`mt-4 rounded-[1.35rem] border p-3 sm:p-4 ${isLofi ? 'border-amber-200/60 bg-amber-50/70' : 'border-sky-100 bg-sky-50/75'}`}>
              <p className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800' : 'text-sky-700'}`}>{modeConfig.inputLabel}</p>
              {typingMode === 'sentences' ? (
                <>
                  <textarea
                    aria-label="Sentence typing input"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    className="sr-only"
                    disabled={roundStatus === 'finished'}
                    onChange={handleChange}
                    placeholder={roundStatus === 'finished' ? 'Passage complete — restart for another one' : modeConfig.placeholder}
                    ref={inputRef}
                    rows={3}
                    spellCheck={false}
                    value={currentInput}
                  />
                  <div className={`mt-3 rounded-[1rem] px-3 py-2 text-sm font-semibold leading-6 shadow-sm ${isLofi ? 'bg-white/78 text-[#6e5a4a]' : 'bg-white text-slate-600'}`}>
                    Tap the passage above to focus, then type straight through the sentence. The timer starts on your first keystroke.
                  </div>
                </>
              ) : (
                <input
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 text-base font-semibold outline-none transition ${isLofi ? 'border-amber-200 bg-white/82 text-[#3d3025] focus:border-[#d4a373] focus:ring-2 focus:ring-amber-200' : 'border-white bg-white text-slate-900 focus:border-sky-300 focus:ring-2 focus:ring-sky-200'}`}
                  disabled={roundStatus === 'finished'}
                  onChange={handleChange}
                  placeholder={roundStatus === 'finished' ? 'Round complete — restart for a fresh flow' : modeConfig.placeholder}
                  ref={inputRef}
                  spellCheck={false}
                  type="text"
                  value={currentInput}
                />
              )}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className={`text-sm font-semibold leading-6 ${isLofi ? 'text-[#6e5a4a]' : 'text-slate-600'}`}>{helperMessage}</p>
                  {typingMode === 'sentences' ? (
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] shadow-sm ${isLofi ? 'bg-white text-amber-900' : 'bg-white text-sky-700'}`}>
                      {currentInput.length}/{sentenceTarget.length} characters
                    </span>
                  ) : (
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] shadow-sm ${isLofi ? 'bg-white text-amber-900' : 'bg-white text-sky-700'}`}>
                      Current word: {activeWord || 'done'}
                    </span>
                  )}
                </div>
                {typingMode === 'words' && (
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] ${timeLeft > 10 ? (isLofi ? 'bg-[#d8eadf] text-[#2f4d3d]' : 'bg-emerald-100 text-emerald-800') : timeLeft > 0 ? (isLofi ? 'bg-[#f7e2b7] text-[#7a5227]' : 'bg-amber-100 text-amber-800') : (isLofi ? 'bg-[#f4d6cf] text-[#8d4b45]' : 'bg-rose-100 text-rose-700')}`}>
                    {timeLeft}s left
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-[1.5rem] border p-4 shadow-sm ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-white/80 bg-white/92'}`}>
              <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-slate-600'}`}>Flow tips</p>
              <ul className={`mt-3 space-y-2 text-sm leading-6 ${isLofi ? 'text-[#6e5a4a]' : 'text-slate-700'}`}>
                {modeConfig.tips.map((tip) => (
                  <li key={tip}>- {tip}</li>
                ))}
              </ul>
            </div>
            <button
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-slate-900 hover:bg-slate-800'}`}
              onClick={() => resetRound(timerPreset)}
              type="button"
            >
              <RotateCcw size={16} /> Restart typing flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
