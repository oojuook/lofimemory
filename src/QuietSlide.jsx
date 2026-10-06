import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    size: 3,
    shuffleMoves: 36,
    label: 'Easy',
    note: 'A smaller board for a softer sliding rhythm.'
  },
  medium: {
    size: 4,
    shuffleMoves: 90,
    label: 'Medium',
    note: 'The classic sliding puzzle feel with a balanced pace.'
  },
  hard: {
    size: 5,
    shuffleMoves: 160,
    label: 'Hard',
    note: 'A bigger board when you want a more absorbing puzzle reset.'
  }
};

function createSolvedBoard(size) {
  return [...Array(size * size - 1).keys()].map((value) => value + 1).concat(0);
}

function getNeighborIndexes(blankIndex, size) {
  const row = Math.floor(blankIndex / size);
  const col = blankIndex % size;
  const neighbors = [];

  if (row > 0) neighbors.push(blankIndex - size);
  if (row < size - 1) neighbors.push(blankIndex + size);
  if (col > 0) neighbors.push(blankIndex - 1);
  if (col < size - 1) neighbors.push(blankIndex + 1);

  return neighbors;
}

function swap(board, firstIndex, secondIndex) {
  const nextBoard = [...board];
  [nextBoard[firstIndex], nextBoard[secondIndex]] = [nextBoard[secondIndex], nextBoard[firstIndex]];
  return nextBoard;
}

function shuffleBoard(size, shuffleMoves) {
  let board = createSolvedBoard(size);
  let blankIndex = board.length - 1;
  let previousBlankIndex = -1;

  for (let moveIndex = 0; moveIndex < shuffleMoves; moveIndex += 1) {
    const neighbors = getNeighborIndexes(blankIndex, size).filter((neighbor) => neighbor !== previousBlankIndex);
    const nextIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
    board = swap(board, blankIndex, nextIndex);
    previousBlankIndex = blankIndex;
    blankIndex = nextIndex;
  }

  return board;
}

function isSolved(board) {
  return board.every((value, index) => {
    if (index === board.length - 1) return value === 0;
    return value === index + 1;
  });
}

function getTargetIndex(blankIndex, direction, size) {
  const row = Math.floor(blankIndex / size);
  const col = blankIndex % size;

  if (direction === 'up' && row > 0) return blankIndex - size;
  if (direction === 'down' && row < size - 1) return blankIndex + size;
  if (direction === 'left' && col > 0) return blankIndex - 1;
  if (direction === 'right' && col < size - 1) return blankIndex + 1;
  return -1;
}

export default function QuietSlide({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestMovesKey = `quiet-journal-quiet-slide-best-${difficulty}`;
  const clearsKey = `quiet-journal-quiet-slide-clears-${difficulty}`;

  const [board, setBoard] = useState(() => shuffleBoard(config.size, config.shuffleMoves));
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState(() => parseInt(localStorage.getItem(bestMovesKey) || '0', 10));
  const [clears, setClears] = useState(() => parseInt(localStorage.getItem(clearsKey) || '0', 10));
  const [gameState, setGameState] = useState('playing');

  useEffect(() => {
    setBoard(shuffleBoard(config.size, config.shuffleMoves));
    setMoves(0);
    setGameState('playing');
    setBestMoves(parseInt(localStorage.getItem(bestMovesKey) || '0', 10));
    setClears(parseInt(localStorage.getItem(clearsKey) || '0', 10));
  }, [bestMovesKey, clearsKey, config.shuffleMoves, config.size]);

  const blankIndex = useMemo(() => board.indexOf(0), [board]);

  const resetGame = () => {
    setBoard(shuffleBoard(config.size, config.shuffleMoves));
    setMoves(0);
    setGameState('playing');
  };

  const finishSolvedBoard = useCallback((nextBoard, nextMoves) => {
    setBoard(nextBoard);
    setMoves(nextMoves);
    setGameState('won');

    setClears((current) => {
      const next = current + 1;
      localStorage.setItem(clearsKey, String(next));
      return next;
    });

    setBestMoves((current) => {
      if (current === 0 || nextMoves < current) {
        localStorage.setItem(bestMovesKey, String(nextMoves));
        return nextMoves;
      }
      return current;
    });
  }, [bestMovesKey, clearsKey]);

  const makeMove = useCallback((targetIndex) => {
    if (gameState === 'won' || targetIndex < 0) return;

    const nextBoard = swap(board, blankIndex, targetIndex);
    const nextMoves = moves + 1;

    if (isSolved(nextBoard)) {
      finishSolvedBoard(nextBoard, nextMoves);
      return;
    }

    setBoard(nextBoard);
    setMoves(nextMoves);
  }, [blankIndex, board, finishSolvedBoard, gameState, moves]);

  const handleTileClick = useCallback((tileIndex) => {
    if (gameState === 'won') return;
    if (!getNeighborIndexes(blankIndex, config.size).includes(tileIndex)) return;
    makeMove(tileIndex);
  }, [blankIndex, config.size, gameState, makeMove]);

  const handleDirectionMove = useCallback((direction) => {
    const targetIndex = getTargetIndex(blankIndex, direction, config.size);
    makeMove(targetIndex);
  }, [blankIndex, config.size, makeMove]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const directionMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      };
      const direction = directionMap[event.key];
      if (!direction) return;
      event.preventDefault();
      handleDirectionMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionMove]);

  const controls = [
    { id: 'up', icon: ArrowUp },
    { id: 'left', icon: ArrowLeft },
    { id: 'down', icon: ArrowDown },
    { id: 'right', icon: ArrowRight }
  ];

  return (
    <div className="mx-auto mt-12 w-full max-w-[920px] pb-12">
      <div className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-white via-slate-50/80 to-sand-50/80 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              <Sparkles size={14} /> {config.label} slide loop
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Slide</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">A cozy sliding puzzle inspired by the classic 15-puzzle style people search for when they want a quiet brain reset. Move each tile into place and let the simple sequence calm everything down.</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem]">
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Moves</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{moves}</p>
            </div>
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{bestMoves || '—'}</p>
            </div>
            <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Clears</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950">{clears}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-slate-700">
            {gameState === 'won'
              ? 'You solved the board — a tidy little reset.'
              : 'Click a tile next to the empty space or use the arrow controls to slide the board into order.'}
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5"
            onClick={resetGame}
            type="button"
          >
            <RotateCcw size={16} /> Shuffle again
          </button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_190px]">
          <div className="rounded-[1.8rem] border border-slate-100 bg-[#ebe1d4] p-4 shadow-inner lg:p-5">
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${config.size}, minmax(0, 1fr))` }}>
              {board.map((value) => {
                const isEmpty = value === 0;
                return (
                  <button
                    key={`tile-${value}`}
                    className={`aspect-square rounded-[1.2rem] text-xl font-extrabold shadow-sm transition sm:text-2xl ${isEmpty ? 'border border-dashed border-white/70 bg-white/35 text-transparent' : 'border border-[#e3d4c3] bg-gradient-to-br from-[#fbf5ec] to-[#f2e5d5] text-slate-900 hover:-translate-y-0.5 hover:from-white hover:to-[#f5ebdf]'}`}
                    onClick={() => handleTileClick(board.indexOf(value))}
                    type="button"
                  >
                    {isEmpty ? '0' : value}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/80 bg-white/78 p-4 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Tap controls</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div />
              <button className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition hover:bg-slate-100" onClick={() => handleDirectionMove('up')} type="button"><ArrowUp className="mx-auto" size={18} /></button>
              <div />
              {controls.slice(1).map((control) => (
                <button
                  key={control.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition hover:bg-slate-100"
                  onClick={() => handleDirectionMove(control.id)}
                  type="button"
                >
                  <control.icon className="mx-auto" size={18} />
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-[1.25rem] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
              Search-friendly angle: sliding puzzle and 15-puzzle style games are familiar, low-pressure formats that fit cozy browser gaming really well.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
