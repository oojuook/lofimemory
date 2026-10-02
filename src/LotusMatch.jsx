import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const lotusIcons = ['🌸', '🪷', '🌙', '☁️', '✨', '🍃', '🫧', '🕯️', '🪻', '🐚', '🌊', '🫖'];

const difficultySettings = {
  easy: {
    pairCount: 6,
    previewMs: 1600,
    mismatchMs: 700,
    label: 'Easy',
    note: 'Fewer pairs and a longer peek to keep things gentle.'
  },
  medium: {
    pairCount: 8,
    previewMs: 1100,
    mismatchMs: 560,
    label: 'Medium',
    note: 'A balanced memory flow with a cozy pace.'
  },
  hard: {
    pairCount: 10,
    previewMs: 800,
    mismatchMs: 420,
    label: 'Hard',
    note: 'More tiles and a faster fade for sharper focus.'
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

function buildDeck(pairCount) {
  return shuffle(
    lotusIcons.slice(0, pairCount).flatMap((icon, index) => [
      {
        id: `${icon}-${index}-a`,
        icon,
        pairId: index,
        matched: false,
        revealed: true
      },
      {
        id: `${icon}-${index}-b`,
        icon,
        pairId: index,
        matched: false,
        revealed: true
      }
    ])
  );
}

export default function LotusMatch({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const { pairCount, previewMs, mismatchMs, label, note } = config;
  const bestScoreKey = `quiet-journal-lotus-best-${difficulty}`;

  const [cards, setCards] = useState(() => buildDeck(pairCount));
  const [selectedIds, setSelectedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const freshDeck = buildDeck(pairCount);
    setCards(freshDeck);
    setSelectedIds([]);
    setMoves(0);
    setIsLocked(true);
    setHasWon(false);
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));

    const timer = window.setTimeout(() => {
      setCards((current) => current.map((card) => ({ ...card, revealed: false })));
      setIsLocked(false);
    }, previewMs);

    return () => window.clearTimeout(timer);
  }, [pairCount, previewMs, bestScoreKey]);

  const matchedPairs = useMemo(() => cards.filter((card) => card.matched).length / 2, [cards]);

  const resetGame = () => {
    const freshDeck = buildDeck(pairCount);
    setCards(freshDeck);
    setSelectedIds([]);
    setMoves(0);
    setIsLocked(true);
    setHasWon(false);

    window.setTimeout(() => {
      setCards((current) => current.map((card) => ({ ...card, revealed: false })));
      setIsLocked(false);
    }, previewMs);
  };

  const revealCard = (cardId) => {
    if (isLocked || hasWon) return;

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
            setHasWon(true);
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

  const gridCols = pairCount >= 10 ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-4';

  return (
    <div className="mx-auto mt-12 w-full max-w-[900px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/82 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
              <Sparkles size={14} /> {label} memory flow
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-sage-950">Lotus Match</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">A soft memory game for quiet focus. Watch the symbols bloom, remember where they rest, and match the pairs at your own pace.</p>
            <p className="mt-2 text-sm font-semibold text-sage-600">{note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem]">
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Pairs</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{matchedPairs}/{pairCount}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Moves</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{moves}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{bestScore || '—'}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-sage-700">{isLocked ? 'Take a first look while the cards glow.' : hasWon ? 'You matched every pair — lovely work.' : 'Tap two cards at a time and follow the pattern.'}</p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5"
            onClick={resetGame}
            type="button"
          >
            <RotateCcw size={16} /> Restart round
          </button>
        </div>

        <div className={`mt-5 grid gap-3 ${gridCols}`}>
          {cards.map((card) => (
            <button
              key={card.id}
              className={`aspect-square rounded-[1.6rem] border p-3 text-3xl shadow-sm transition ${card.revealed || card.matched ? 'border-white/80 bg-white text-sage-950' : 'border-sage-100 bg-gradient-to-br from-[#efe5d9] to-[#e7dfd6] text-transparent hover:-translate-y-0.5 hover:from-[#f3ebdf] hover:to-[#ece3d7]'} ${card.matched ? 'ring-2 ring-emerald-200' : ''}`}
              onClick={() => revealCard(card.id)}
              type="button"
            >
              <span className={card.revealed || card.matched ? 'opacity-100' : 'opacity-0'}>{card.icon}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-white/75 bg-white/76 px-4 py-4 text-sm font-semibold text-sage-700 shadow-sm">
          A lot of people reach for light puzzle and memory games when they want to relax without feeling pressured. This round keeps the interaction simple, calm, and satisfying.
        </div>
      </div>
    </div>
  );
}
