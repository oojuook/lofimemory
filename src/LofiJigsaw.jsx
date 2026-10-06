import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, RotateCcw, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    size: 3,
    shuffleMoves: 38,
    label: 'Easy',
    note: 'A small 3×3 cozy puzzle with gentle shuffling for a relaxing first round.'
  },
  medium: {
    size: 4,
    shuffleMoves: 86,
    label: 'Medium',
    note: 'A balanced 4×4 jigsaw-style slider with enough movement to feel satisfying.'
  },
  hard: {
    size: 5,
    shuffleMoves: 150,
    label: 'Hard',
    note: 'A fuller 5×5 puzzle for focused players who want a deeper calm challenge.'
  }
};

const sceneTiles = [
  'from-[#f8e7c9] via-[#f7d9b5] to-[#cbdcc3]',
  'from-[#f4d3ba] via-[#edbca7] to-[#b9d3bf]',
  'from-[#d7e4c7] via-[#bdd5b9] to-[#91b39c]',
  'from-[#f6ddbd] via-[#d7c5a4] to-[#889e83]',
  'from-[#c6dcbf] via-[#9ebf9a] to-[#6e9373]',
  'from-[#f8cfae] via-[#dfa084] to-[#8d725d]',
  'from-[#f7e8d4] via-[#cabfa7] to-[#778c79]',
  'from-[#eec2a3] via-[#bd8e75] to-[#5f7466]',
  'from-[#d5e6dc] via-[#9bbfb8] to-[#5f8d92]',
  'from-[#f5d7af] via-[#e6aa7d] to-[#996a55]',
  'from-[#cfe0b9] via-[#a6be89] to-[#5d7655]',
  'from-[#f9ead8] via-[#dec5aa] to-[#8b7a66]'
];

function buildSolvedBoard(size) {
  const total = size * size;
  return Array.from({ length: total }, (_, index) => (index === total - 1 ? null : index));
}

function getNeighbors(emptyIndex, size) {
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;
  const neighbors = [];
  if (row > 0) neighbors.push(emptyIndex - size);
  if (row < size - 1) neighbors.push(emptyIndex + size);
  if (col > 0) neighbors.push(emptyIndex - 1);
  if (col < size - 1) neighbors.push(emptyIndex + 1);
  return neighbors;
}

function shuffleBoard(size, shuffleMoves) {
  let board = buildSolvedBoard(size);
  let emptyIndex = board.length - 1;
  let previousIndex = -1;

  for (let move = 0; move < shuffleMoves; move += 1) {
    const options = getNeighbors(emptyIndex, size).filter((index) => index !== previousIndex);
    const nextIndex = options[Math.floor(Math.random() * options.length)] ?? getNeighbors(emptyIndex, size)[0];
    board = [...board];
    board[emptyIndex] = board[nextIndex];
    board[nextIndex] = null;
    previousIndex = emptyIndex;
    emptyIndex = nextIndex;
  }

  return board;
}

function isSolved(board) {
  return board.every((tile, index) => (index === board.length - 1 ? tile === null : tile === index));
}

function getMoveLabel(moves) {
  if (moves === 0) return 'No moves yet';
  if (moves === 1) return '1 soft move';
  return `${moves} soft moves`;
}

function TileArtwork({ tile, size }) {
  if (tile === null) return null;

  const row = Math.floor(tile / size);
  const col = tile % size;
  const total = size * size;
  const gradient = sceneTiles[tile % sceneTiles.length];

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[1rem] bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.8) 0 8%, transparent 9% 100%)' }} />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-white/15" />
      <div className="absolute -bottom-4 left-0 right-0 h-12 rounded-t-[50%] bg-sage-900/10" />
      <div className="absolute right-2 top-2 rounded-full bg-white/55 px-2 py-0.5 text-[10px] font-black text-sage-800">{tile + 1}/{total - 1}</div>
      <div className="absolute bottom-2 left-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/85">{row + 1}.{col + 1}</div>
    </div>
  );
}

export default function LofiJigsaw({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const { size, shuffleMoves, label, note } = config;
  const totalTiles = size * size - 1;
  const bestScoreKey = `quiet-journal-lofi-jigsaw-best-${difficulty}`;

  const [board, setBoard] = useState(() => shuffleBoard(size, shuffleMoves));
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('playing');
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));

  useEffect(() => {
    setBoard(shuffleBoard(size, shuffleMoves));
    setMoves(0);
    setStatus('playing');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [size, shuffleMoves, bestScoreKey]);

  const emptyIndex = board.indexOf(null);
  const neighborSet = useMemo(() => new Set(getNeighbors(emptyIndex, size)), [emptyIndex, size]);
  const solved = status === 'won';

  const resetPuzzle = () => {
    setBoard(shuffleBoard(size, shuffleMoves));
    setMoves(0);
    setStatus('playing');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  };

  const moveTile = (index) => {
    if (solved || !neighborSet.has(index)) return;

    const next = [...board];
    next[emptyIndex] = board[index];
    next[index] = null;
    const nextMoves = moves + 1;

    setBoard(next);
    setMoves(nextMoves);

    if (isSolved(next)) {
      setStatus('won');
      setBestScore((currentBest) => {
        if (currentBest === 0 || nextMoves < currentBest) {
          localStorage.setItem(bestScoreKey, String(nextMoves));
          return nextMoves;
        }
        return currentBest;
      });
    }
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/82 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
              <ImagePlus size={14} /> {label} lofi jigsaw
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-sage-950">Lofi Jigsaw Puzzle</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">Slide soft image pieces back into place and rebuild a tiny lofi landscape. It is a cozy puzzle for study breaks, relaxing browser play, and quiet journal moments.</p>
            <p className="mt-2 text-sm font-semibold text-sage-600">{note}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">{size}×{size} board • {totalTiles} picture pieces • relaxing sliding puzzle</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[24rem]">
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Moves</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{moves}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Pieces</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{totalTiles}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{bestScore || '—'}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-sage-700">{solved ? 'The whole scene is back together — soft work.' : `Tap a piece beside the empty space to slide it. ${getMoveLabel(moves)} so far.`}</p>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5"
            onClick={resetPuzzle}
            type="button"
          >
            <RotateCcw size={16} /> {solved ? 'Play again' : 'Shuffle new puzzle'}
          </button>
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-white/85 bg-white/72 p-3 shadow-soft sm:p-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {board.map((tile, index) => (
              <button
                key={`${tile ?? 'empty'}-${index}`}
                aria-label={tile === null ? 'Empty jigsaw space' : `Move puzzle piece ${tile + 1}`}
                className={`aspect-square rounded-[1.15rem] border text-left shadow-sm transition ${tile === null ? 'border-dashed border-sage-200 bg-sage-50/60' : neighborSet.has(index) && !solved ? 'border-white/90 bg-white hover:-translate-y-0.5 hover:shadow-lift' : 'border-white/80 bg-white/86'} ${solved ? 'ring-2 ring-emerald-200' : ''}`}
                disabled={tile === null || solved || !neighborSet.has(index)}
                onClick={() => moveTile(index)}
                type="button"
              >
                <TileArtwork tile={tile} size={size} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-white/75 bg-white/76 px-4 py-4 text-sm font-semibold text-sage-700 shadow-sm">
          Lofi Jigsaw Puzzle is designed for people searching for relaxing puzzle games, cozy browser games, and simple online jigsaw-style play. Pair it with a quick journal note afterward to turn a small game break into a calm reflection.
        </div>
      </div>
    </div>
  );
}
