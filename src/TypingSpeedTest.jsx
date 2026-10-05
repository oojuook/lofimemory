import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const timerPresets = [15, 30, 60];

const typingModeSettings = {
  words: {
    label: 'Words',
    initialCount: 42,
    bufferSize: 18,
    batchSize: 24,
    idleMessage: 'Tap the word flow or the input box, then start typing. Press space to roll into the next word.',
    runningMessage: 'Space commits each word and the next one glides into view.',
    finishedMessage: 'Round complete — start another and the words will keep flowing.',
    inputLabel: 'Live input',
    placeholder: 'Start typing here…',
    currentLabel: 'Current word',
    panelDescription: 'A calmer typing test where the words keep coming and the active line moves along with you, closer to a monkeytype flow but still cozy on mobile.',
    modeNote: 'Choose words when you want a classic typing flow.',
    tips: [
      'Words keep extending, so you can stay in the rhythm for the whole timer.',
      'Space commits a word and scrolls the active one into view.',
      'On mobile, tap the word panel anytime to refocus the keyboard.'
    ]
  },
  sentences: {
    label: 'Sentences',
    initialCount: 18,
    bufferSize: 8,
    batchSize: 10,
    idleMessage: 'Tap into the sentence flow, type the full line, and press Enter to move on.',
    runningMessage: 'Finish each sentence and press Enter to roll into the next calm line.',
    finishedMessage: 'Round complete — restart when you want another sentence flow.',
    inputLabel: 'Live sentence input',
    placeholder: 'Type the full sentence, then press Enter…',
    currentLabel: 'Current sentence',
    panelDescription: 'Switch to sentence mode when you want a fuller typing rhythm with longer lines and a gentler pace.',
    modeNote: 'Choose sentences when you want to type complete calm phrases instead of single words.',
    tips: [
      'Each line stays active until you finish it and press Enter.',
      'Sentence mode is great for practicing flow, spacing, and longer phrasing.',
      'On mobile, the larger field makes it easier to type full lines comfortably.'
    ]
  }
};

const contentPools = {
  words: {
    easy: [
      'soft', 'rain', 'moss', 'glow', 'rest', 'slow', 'calm', 'cozy', 'bloom', 'drift', 'pond', 'leaf', 'hush', 'breeze', 'warm', 'still', 'lilypad', 'lantern', 'cloud', 'river', 'ember', 'settle', 'quiet', 'golden', 'tea', 'window', 'blanket', 'gentle', 'ripple', 'meadow'
    ],
    medium: [
      'typing', 'rhythm', 'coastline', 'journal', 'focus', 'steady', 'unwind', 'layout', 'puzzle', 'forecast', 'breathe', 'comfort', 'friendlier', 'signal', 'sunlight', 'evening', 'restart', 'clarity', 'wander', 'drizzle', 'morning', 'kindness', 'landing', 'texture', 'counter', 'gliding', 'lanes', 'mobile', 'frogs', 'lilies'
    ],
    hard: [
      'atmosphere', 'comfortable', 'meditative', 'background', 'continuous', 'monkeytype', 'interface', 'forecasting', 'adjustments', 'reflection', 'responsive', 'location', 'beautifully', 'character', 'wordsmith', 'snowfall', 'waterfront', 'curiosity', 'adventure', 'sunshower', 'hummingbird', 'harmonize', 'understory', 'lighthouse', 'momentum', 'storybook', 'tenderness', 'serenity', 'afterglow', 'wildflower'
    ]
  },
  sentences: {
    easy: [
      'soft rain taps the window tonight',
      'the pond stays calm under moonlight',
      'warm tea rests beside the keyboard',
      'small lanterns glow across the room',
      'the evening breeze feels kind and light',
      'moss gathers near the garden path',
      'cozy music drifts through the hall',
      'clouds move slowly over the lake',
      'the blanket feels warm after dusk',
      'quiet leaves settle on the water',
      'a gentle glow fills the corner',
      'rest comes easier in a calm room'
    ],
    medium: [
      'the lilypad garden feels brighter when the rhythm stays steady',
      'cozy lights and softer music can make a typing session feel lighter',
      'a quiet desk and a clear mind help each sentence land smoothly',
      'the shoreline breeze keeps the evening calm while thoughts keep moving',
      'gentle focus grows when the page feels simple and easy to read',
      'small rituals like tea and music make longer practice feel more welcoming',
      'the room stays peaceful when the typing flow glides without pressure',
      'warm light on the wall can turn a quick test into a calmer habit',
      'settling into a steady rhythm makes each line feel easier to finish',
      'soft clouds and slow rain give the whole session a gentler pace'
    ],
    hard: [
      'the atmosphere feels meditative when the waterfront air and steady rhythm begin to harmonize',
      'comfortable practice comes from repeating longer lines until the movement feels beautifully consistent',
      'a responsive layout and a calmer background can turn focused typing into a restorative ritual',
      'curiosity tends to grow when a longer sentence asks for patience timing and cleaner spacing',
      'storybook evenings and a mellow soundtrack make sustained concentration feel surprisingly natural',
      'tenderness in the visual design can soften the challenge of typing a more demanding prompt',
      'momentum builds when each sentence carries enough texture to reward careful attention',
      'the lighthouse glow across the harbor makes the whole practice loop feel reflective and serene'
    ]
  }
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
    note: 'Longer prompts and denser language for sharper focus.'
  }
};

function getPool(mode, difficulty) {
  return contentPools[mode]?.[difficulty] || contentPools.words.medium;
}

function generatePromptBatch(pool, count) {
  return Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);
}

function comparePrompt(targetPrompt, typedPrompt) {
  const maxLength = Math.max(targetPrompt.length, typedPrompt.length);
  let correctChars = 0;
  let incorrectChars = 0;

  for (let index = 0; index < maxLength; index += 1) {
    if (targetPrompt[index] === typedPrompt[index]) {
      correctChars += 1;
    } else {
      incorrectChars += 1;
    }
  }

  return {
    correctChars,
    incorrectChars,
    isPerfect: targetPrompt === typedPrompt
  };
}

function getDisplayCharacters(targetPrompt, typedPrompt) {
  const maxLength = Math.max(targetPrompt.length, typedPrompt.length);
  return Array.from({ length: maxLength }, (_, index) => ({
    key: `${targetPrompt}-${typedPrompt}-${index}`,
    targetCharacter: targetPrompt[index] || '',
    typedCharacter: typedPrompt[index] || ''
  }));
}

function TypingPrompt({ activeInput = '', isActive, isPast, isSentenceMode, prompt, typedPrompt = '', promptRef }) {
  const characters = getDisplayCharacters(prompt, typedPrompt || activeInput);

  return (
    <span
      className={`${isSentenceMode ? 'block w-full rounded-[1.35rem] px-3 py-3 text-base leading-7 sm:px-4 sm:text-lg sm:leading-8' : 'inline-flex min-h-[2.75rem] items-center rounded-2xl px-2.5 py-2 text-lg sm:text-xl'} font-bold transition whitespace-pre-wrap ${isActive ? 'bg-white text-stone-950 shadow-sm ring-2 ring-sky-200' : isPast ? 'bg-transparent' : 'text-stone-300'}`}
      ref={promptRef}
    >
      {characters.map(({ key, targetCharacter, typedCharacter }) => {
        let className = 'text-stone-300';
        let content = targetCharacter;

        if (isPast) {
          content = typedCharacter || targetCharacter;
          className = typedCharacter === targetCharacter ? 'text-emerald-700' : 'text-rose-600';
        } else if (isActive) {
          if (!typedCharacter) {
            className = 'text-stone-400';
            content = targetCharacter;
          } else {
            content = typedCharacter;
            className = typedCharacter === targetCharacter ? 'text-stone-950 bg-emerald-100/80' : 'text-rose-700 bg-rose-100/80';
          }
        }

        return (
          <span className={`rounded px-[1px] ${className}`} key={key}>
            {content === ' ' ? '\u00A0' : content}
          </span>
        );
      })}
    </span>
  );
}

export default function TypingSpeedTest({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const [typingMode, setTypingMode] = useState('words');
  const modeConfig = typingModeSettings[typingMode] || typingModeSettings.words;
  const pool = getPool(typingMode, difficulty);
  const bestKey = `quiet-journal-typing-speed-best-${difficulty}-${typingMode}`;
  const roundsKey = `quiet-journal-typing-speed-rounds-${difficulty}-${typingMode}`;

  const inputRef = useRef(null);
  const promptRefs = useRef({});
  const [timerPreset, setTimerPreset] = useState(30);
  const [promptSequence, setPromptSequence] = useState(() => generatePromptBatch(pool, modeConfig.initialCount));
  const [typedPrompts, setTypedPrompts] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [roundStatus, setRoundStatus] = useState('idle');
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [bestWpm, setBestWpm] = useState(() => parseInt(localStorage.getItem(bestKey) || '0', 10));
  const [rounds, setRounds] = useState(() => parseInt(localStorage.getItem(roundsKey) || '0', 10));
  const [hasRecordedResult, setHasRecordedResult] = useState(false);

  const activePromptIndex = typedPrompts.length;
  const activePrompt = promptSequence[activePromptIndex] || '';
  const elapsedSeconds = timerPreset - timeLeft;
  const totalTypedChars = correctChars + incorrectChars;
  const wpm = elapsedSeconds > 0 ? Math.round((correctChars / 5) / (elapsedSeconds / 60)) : 0;
  const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  const cpm = elapsedSeconds > 0 ? Math.round(correctChars / (elapsedSeconds / 60)) : 0;
  const isSentenceMode = typingMode === 'sentences';

  const resetRound = (nextPreset = timerPreset, nextMode = typingMode) => {
    const nextModeConfig = typingModeSettings[nextMode] || typingModeSettings.words;
    const nextPool = getPool(nextMode, difficulty);

    setPromptSequence(generatePromptBatch(nextPool, nextModeConfig.initialCount));
    setTypedPrompts([]);
    setCurrentInput('');
    setTimeLeft(nextPreset);
    setIsRunning(false);
    setRoundStatus('idle');
    setCorrectChars(0);
    setIncorrectChars(0);
    setErrors(0);
    setHasRecordedResult(false);
    promptRefs.current = {};
  };

  useEffect(() => {
    setBestWpm(parseInt(localStorage.getItem(bestKey) || '0', 10));
    setRounds(parseInt(localStorage.getItem(roundsKey) || '0', 10));
    resetRound(30, typingMode);
  }, [bestKey, roundsKey, difficulty, typingMode]);

  useEffect(() => {
    if (timeLeft !== 0 || roundStatus !== 'finished' || hasRecordedResult) {
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
  }, [bestKey, bestWpm, hasRecordedResult, rounds, roundsKey, roundStatus, timeLeft, wpm]);

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
    if (promptSequence.length - activePromptIndex > modeConfig.bufferSize) {
      return;
    }

    setPromptSequence((previous) => [...previous, ...generatePromptBatch(pool, modeConfig.batchSize)]);
  }, [activePromptIndex, modeConfig.batchSize, modeConfig.bufferSize, pool, promptSequence.length]);

  useEffect(() => {
    const activeNode = promptRefs.current[activePromptIndex];
    activeNode?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, [activePromptIndex]);

  const handleWordCommits = (rawValue) => {
    if (roundStatus === 'finished') {
      return;
    }

    const normalizedValue = rawValue.toLowerCase().replace(/[^a-z\-\s]/g, '');
    let remainingValue = normalizedValue;
    const nextTypedPrompts = [...typedPrompts];
    let nextCorrectChars = 0;
    let nextIncorrectChars = 0;
    let nextErrors = 0;

    while (remainingValue.includes(' ')) {
      const boundaryIndex = remainingValue.indexOf(' ');
      const typedPrompt = remainingValue.slice(0, boundaryIndex).trim();
      const targetPrompt = promptSequence[nextTypedPrompts.length];

      if (!targetPrompt) {
        break;
      }

      if (!typedPrompt) {
        remainingValue = remainingValue.slice(boundaryIndex + 1).replace(/^\s+/, '');
        continue;
      }

      const comparison = comparePrompt(targetPrompt, typedPrompt);
      nextCorrectChars += comparison.correctChars;
      nextIncorrectChars += comparison.incorrectChars;
      if (!comparison.isPerfect) {
        nextErrors += 1;
      }

      nextTypedPrompts.push(typedPrompt);
      remainingValue = remainingValue.slice(boundaryIndex + 1).replace(/^\s+/, '');
    }

    if (nextTypedPrompts.length !== typedPrompts.length) {
      setTypedPrompts(nextTypedPrompts);
      setCorrectChars((previous) => previous + nextCorrectChars);
      setIncorrectChars((previous) => previous + nextIncorrectChars);
      setErrors((previous) => previous + nextErrors);
    }

    setCurrentInput(remainingValue);
  };

  const handleSentenceCommits = (rawValue) => {
    if (roundStatus === 'finished') {
      return;
    }

    const normalizedValue = rawValue
      .toLowerCase()
      .replace(/\r/g, '')
      .replace(/[^a-z\-\s\n]/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/^\n+/, '');

    let remainingValue = normalizedValue;
    const nextTypedPrompts = [...typedPrompts];
    let nextCorrectChars = 0;
    let nextIncorrectChars = 0;
    let nextErrors = 0;

    while (remainingValue.includes('\n')) {
      const boundaryIndex = remainingValue.indexOf('\n');
      const typedPrompt = remainingValue.slice(0, boundaryIndex).trim();
      const targetPrompt = promptSequence[nextTypedPrompts.length];

      remainingValue = remainingValue.slice(boundaryIndex + 1).replace(/^\n+/, '');

      if (!targetPrompt || !typedPrompt) {
        continue;
      }

      const comparison = comparePrompt(targetPrompt, typedPrompt);
      nextCorrectChars += comparison.correctChars;
      nextIncorrectChars += comparison.incorrectChars;
      if (!comparison.isPerfect) {
        nextErrors += 1;
      }

      nextTypedPrompts.push(typedPrompt);
    }

    if (nextTypedPrompts.length !== typedPrompts.length) {
      setTypedPrompts(nextTypedPrompts);
      setCorrectChars((previous) => previous + nextCorrectChars);
      setIncorrectChars((previous) => previous + nextIncorrectChars);
      setErrors((previous) => previous + nextErrors);
    }

    setCurrentInput(remainingValue);
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    if (!isRunning && nextValue.trim().length > 0 && timeLeft > 0) {
      setIsRunning(true);
      setRoundStatus('running');
    }

    if (isSentenceMode) {
      handleSentenceCommits(nextValue);
      return;
    }

    handleWordCommits(nextValue);
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
      <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-slate-50/86 p-4 shadow-soft sm:p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              <Sparkles size={14} /> {config.label} typing pace
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Typing Speed Test</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">{modeConfig.panelDescription}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{config.note}</p>
            <p className="mt-2 text-sm font-semibold text-sky-700">{modeConfig.modeNote}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {Object.entries(typingModeSettings).map(([modeKey, modeValue]) => (
                <button
                  key={modeKey}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${typingMode === modeKey ? 'bg-slate-900 text-white shadow-sm' : 'border border-sky-200 bg-white text-sky-800 hover:bg-sky-50'}`}
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
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${timerPreset === preset ? 'bg-slate-900 text-white shadow-sm' : 'border border-sky-200 bg-white text-sky-800 hover:bg-sky-50'}`}
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
          <div className="grid w-full gap-2 rounded-[1.6rem] border border-white/85 bg-white/84 p-3 shadow-sm sm:grid-cols-2 lg:w-[29rem] lg:grid-cols-3">
            {[
              { label: 'WPM', value: wpm },
              { label: 'Accuracy', value: `${accuracy}%` },
              { label: 'CPM', value: cpm },
              { label: 'Errors', value: errors },
              { label: 'Best WPM', value: bestWpm },
              { label: 'Rounds', value: rounds }
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-xl font-extrabold text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-[1.8rem] border border-white/80 bg-white/92 p-4 shadow-sm sm:p-5">
            <button
              className="block h-[11.5rem] w-full overflow-y-auto rounded-[1.5rem] bg-slate-50/90 px-3 py-4 text-left shadow-inner outline-none ring-offset-0 transition focus-visible:ring-2 focus-visible:ring-sky-300 sm:h-[13rem] sm:px-4"
              onClick={() => inputRef.current?.focus()}
              type="button"
            >
              <div className={`${isSentenceMode ? 'flex flex-col gap-3 text-base leading-7 sm:text-lg sm:leading-8' : 'flex flex-wrap items-center gap-x-2 gap-y-3 text-lg leading-8 sm:text-xl sm:leading-9'}`}>
                {promptSequence.map((prompt, index) => (
                  <TypingPrompt
                    activeInput={currentInput}
                    isActive={index === activePromptIndex}
                    isPast={index < activePromptIndex}
                    isSentenceMode={isSentenceMode}
                    key={`${prompt}-${index}`}
                    prompt={prompt}
                    typedPrompt={typedPrompts[index] || ''}
                    promptRef={(node) => {
                      if (node) {
                        promptRefs.current[index] = node;
                      }
                    }}
                  />
                ))}
              </div>
            </button>

            <div className="mt-4 rounded-[1.35rem] border border-sky-100 bg-sky-50/75 p-3 sm:p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-700">{modeConfig.inputLabel}</p>
              {isSentenceMode ? (
                <textarea
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className="mt-3 min-h-[7.5rem] w-full rounded-2xl border border-white bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                  disabled={roundStatus === 'finished'}
                  onChange={handleChange}
                  onFocus={() => {
                    if (!isRunning && roundStatus !== 'finished') {
                      setRoundStatus('idle');
                    }
                  }}
                  placeholder={roundStatus === 'finished' ? 'Round complete — restart for a fresh sentence flow' : modeConfig.placeholder}
                  ref={inputRef}
                  rows={3}
                  spellCheck={false}
                  value={currentInput}
                />
              ) : (
                <input
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className="mt-3 w-full rounded-2xl border border-white bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                  disabled={roundStatus === 'finished'}
                  onChange={handleChange}
                  onFocus={() => {
                    if (!isRunning && roundStatus !== 'finished') {
                      setRoundStatus('idle');
                    }
                  }}
                  placeholder={roundStatus === 'finished' ? 'Round complete — restart for a fresh flow' : modeConfig.placeholder}
                  ref={inputRef}
                  spellCheck={false}
                  type="text"
                  value={currentInput}
                />
              )}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold leading-6 text-slate-600">{helperMessage}</p>
                  {isSentenceMode ? (
                    <div className="max-w-xl rounded-[1rem] bg-white px-3 py-2 text-sm font-semibold leading-6 text-sky-800 shadow-sm">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-600">{modeConfig.currentLabel}</span>
                      <p className="mt-1">{activePrompt || 'done'}</p>
                    </div>
                  ) : (
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700 shadow-sm">
                      {modeConfig.currentLabel}: {activePrompt || 'done'}
                    </span>
                  )}
                </div>
                <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] ${timeLeft > 10 ? 'bg-emerald-100 text-emerald-800' : timeLeft > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'}`}>
                  {timeLeft}s left
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-white/80 bg-white/92 p-4 shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-600">Flow tips</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {modeConfig.tips.map((tip) => (
                  <li key={tip}>- {tip}</li>
                ))}
              </ul>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-slate-800"
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
