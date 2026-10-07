import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const lotusIcons = ['A♠', 'K♥', 'Q♦', 'J♣', '10♠', '9♥', '8♦', '7♣', '6♠', '5♥', '4♦', '3♣'];

const difficultySettings = {
  easy: {
    pairCount: 6,
    previewMs: 2200,
    mismatchMs: 820,
    label: 'Easy',
    note: 'Fewer pairs, a longer preview, and a softer reset after a miss.'
  },
  medium: {
    pairCount: 8,
    previewMs: 1450,
    mismatchMs: 620,
    label: 'Medium',
    note: 'A balanced memory flow with enough pace to stay satisfying.'
  },
  hard: {
    pairCount: 12,
    previewMs: 900,
    mismatchMs: 380,
    label: 'Hard',
    note: 'A fuller board with a quick preview, so you need to lock in the pattern fast.'
  }
};

function shuffle(cards) {
  const next = [...cards];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function buildDeck(pairCount, revealed = false) {
  return shuffle(
    lotusIcons.slice(0, pairCount).flatMap((icon, index) => [
      {
        id: `${icon}-${index}-a`,
        icon,
        pairId: index,
        matched: false,
        revealed
      },
      {
        id: `${icon}-${index}-b`,
        icon,
        pairId: index,
        matched: false,
        revealed
      }
    ])
  );
}

function formatDuration(ms) {
  return ms % 1000 === 0 ? `${ms / 1000}s` : `${(ms / 1000).toFixed(1)}s`;
}

export default function LotusMatch({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const { pairCount, previewMs, mismatchMs, label, note } = config;
  const bestScoreKey = `quiet-journal-lotus-best-${difficulty}`;

  const previewTimerRef = useRef(null);

  const [cards, setCards] = useState(() => buildDeck(pairCount));
  const [selectedIds, setSelectedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [status, setStatus] = useState('ready');

  const clearPreviewTimer = () => {
    if (previewTimerRef.current) {
      window.clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  };

  const prepareRound = () => {
    clearPreviewTimer();
    setCards(buildDeck(pairCount));
    setSelectedIds([]);
    setMoves(0);
    setIsLocked(true);
    setStatus('ready');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  };

  useEffect(() => {
    prepareRound();

    return () => clearPreviewTimer();
  }, [pairCount, previewMs, bestScoreKey]);

  const matchedPairs = useMemo(() => cards.filter((card) => card.matched).length / 2, [cards]);
  const hasWon = status === 'won';
  const previewLabel = formatDuration(previewMs);
  const mismatchLabel = formatDuration(mismatchMs);

  const startRound = () => {
    clearPreviewTimer();
    const freshDeck = buildDeck(pairCount, true);
    setCards(freshDeck);
    setSelectedIds([]);
    setMoves(0);
    setIsLocked(true);
    setStatus('preview');

    previewTimerRef.current = window.setTimeout(() => {
      setCards((current) => current.map((card) => ({ ...card, revealed: false })));
      setIsLocked(false);
      setStatus('playing');
      previewTimerRef.current = null;
    }, previewMs);
  };

  const resetGame = () => {
    prepareRound();
  };

  const revealCard = (cardId) => {
    if (isLocked || status !== 'playing') return;

    const card = cards.find((entry) => entry.id === cardId);
    if (!card || card.revealed || card.matched || selectedIds.length >= 2) return;

    const nextSelected = [...selectedIds, cardId];
    setCards((current) => current.map((entry) => (entry.id === cardId ? { ...entry, revealed: true } : entry)));
    setSelectedIds(nextSelected);

    if (nextSelected.length !== 2) return;

    setIsLocked(true);
    setMoves((currentMoves) => currentMoves + 1);

    const [firstId, secondId] = nextSelected;
    const firstCard = cards.find((entry) => entry.id === firstId);
    const secondCard = cards.find((entry) => entry.id === secondId) || card;

    if (firstCard?.pairId === secondCard?.pairId) {
      window.setTimeout(() => {
        setCards((current) => {
          const next = current.map((entry) => (nextSelected.includes(entry.id) ? { ...entry, matched: true } : entry));
          const won = next.every((entry) => entry.matched);
          if (won) {
            const finalMoves = moves + 1;
            setStatus('won');
            setBestScore((currentBest) => {
              if (currentBest === 0 || finalMoves < currentBest) {
                localStorage.setItem(bestScoreKey, String(finalMoves));
                return finalMoves;
              }
              return currentBest;
            });
          }
          return next;
        });
        setSelectedIds([]);
        setIsLocked(false);
      }, 220);
      return;
    }

    window.setTimeout(() => {
      setCards((current) => current.map((entry) => (nextSelected.includes(entry.id) ? { ...entry, revealed: false } : entry)));
      setSelectedIds([]);
      setIsLocked(false);
    }, mismatchMs);
  };

  const gridCols = pairCount >= 12 ? 'grid-cols-4 sm:grid-cols-6' : pairCount >= 10 ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-4';

  const statusMessage = status === 'ready'
    ? 'Press start when you want the preview to begin.'
    : status === 'preview'
      ? 'Memorize the board while every card is still glowing.'
      : hasWon
        ? 'You matched every pair — lovely work.'
        : 'Tap two cards at a time and follow the pattern.';

  return (
    <div className="mx-auto mt-12 w-full max-w-[900px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/82 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
              <Sparkles size={14} /> {label} memory flow
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-sage-950">Lotus Match</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">A soft memory game for quiet focus. Watch the poker cards flip, remember where they rest, and match the pairs at your own pace.</p>
            <p className="mt-2 text-sm font-semibold text-sage-600">{note}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">{pairCount} pairs • {previewLabel} preview • {mismatchLabel} reset</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[29rem]">
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Pairs</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{matchedPairs}/{pairCount}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Moves</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{moves}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Preview</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{previewLabel}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{bestScore || '—'}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-sage-700">{statusMessage}</p>
          <div className="flex flex-wrap gap-2">
            {status === 'ready' && (
              <button
                className="inline-flex items-center gap-2 rounded-full bg-sage-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5"
                onClick={startRound}
                type="button"
              >
                <Sparkles size={16} /> Start round
              </button>
            )}
            {status !== 'ready' && (
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5"
                onClick={resetGame}
                type="button"
              >
                <RotateCcw size={16} /> {hasWon ? 'Play again' : 'Set up new board'}
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-5">
          {status === 'ready' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.8rem] border border-white/70 bg-white/72 p-4 backdrop-blur-[2px]">
              <div className="max-w-md rounded-[1.6rem] border border-white/90 bg-white/92 px-6 py-6 text-center shadow-soft">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-500">Ready when you are</p>
                <h4 className="mt-3 text-2xl font-extrabold text-sage-950">Take a quick look, then match from memory.</h4>
                <p className="mt-3 text-sm leading-7 text-sage-700">This {label.toLowerCase()} round gives you {previewLabel} to study {pairCount} pairs before the cards flip over.</p>
                <button
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5"
                  onClick={startRound}
                  type="button"
                >
                  <Sparkles size={16} /> Start Lotus Match
                </button>
              </div>
            </div>
          )}

          <div className={`grid gap-3 ${gridCols}`}>
            {cards.map((card) => (
              <button
                key={card.id}
                className={`aspect-square rounded-[1.6rem] border p-3 text-3xl shadow-sm transition ${card.revealed || card.matched ? 'border-white/80 bg-white text-sage-950' : 'border-sage-100 bg-gradient-to-br from-[#efe5d9] to-[#e7dfd6] text-transparent hover:-translate-y-0.5 hover:from-[#f3ebdf] hover:to-[#ece3d7]'} ${card.matched ? 'ring-2 ring-emerald-200' : ''} ${status === 'ready' ? 'pointer-events-none opacity-75' : ''}`}
                onClick={() => revealCard(card.id)}
                type="button"
              >
                <span className={card.revealed || card.matched ? 'opacity-100' : 'opacity-0'}>{card.icon}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-white/75 bg-white/76 px-4 py-4 text-sm font-semibold text-sage-700 shadow-sm">
          A lot of people reach for light puzzle and memory games when they want to relax without feeling pressured. This round keeps the interaction simple, calm, and satisfying while making each difficulty level easier to read at a glance.
        </div>
      </div>
    </div>
  );
}
