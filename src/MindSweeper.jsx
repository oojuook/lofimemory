import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    boardSize: 8,
    mineCount: 10,
    label: 'Easy',
    note: 'A gentler board with more breathing room and a wide-open start.',
    densityLabel: 'Open grid'
  },
  medium: {
    boardSize: 10,
    mineCount: 18,
    label: 'Medium',
    note: 'A larger board that asks for steadier scanning and calmer logic.',
    densityLabel: 'Compact grid'
  },
  hard: {
    boardSize: 12,
    mineCount: 30,
    label: 'Hard',
    note: 'A denser field that changes the board feel much more clearly.',
    densityLabel: 'Dense grid'
  }
};

const numberTone = {
  1: 'text-sky-700',
  2: 'text-emerald-700',
  3: 'text-rose-600',
  4: 'text-violet-600',
  5: 'text-amber-700',
  6: 'text-cyan-700',
  7: 'text-slate-700',
  8: 'text-stone-700'
};

function buildBoard(boardSize, mineCount, safeCell) {
  const board = Array.from({ length: boardSize }, (_, row) => Array.from({ length: boardSize }, (_, col) => ({
    row,
    col,
    mine: false,
    adjacent: 0,
    revealed: false,
    flagged: false
  })));

  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    if (board[row][col].mine) {
      continue;
    }

    if (safeCell && row === safeCell.row && col === safeCell.col) {
      continue;
    }

    board[row][col].mine = true;
    placedMines += 1;
  }

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      if (board[row][col].mine) {
        continue;
      }

      let adjacent = 0;
      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
          if (rowOffset === 0 && colOffset === 0) {
            continue;
          }

          const nextRow = row + rowOffset;
          const nextCol = col + colOffset;
          if (
            nextRow < 0 || nextRow >= boardSize
            || nextCol < 0 || nextCol >= boardSize
          ) {
            continue;
          }

          if (board[nextRow][nextCol].mine) {
            adjacent += 1;
          }
        }
      }
      board[row][col].adjacent = adjacent;
    }
  }

  return board;
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function revealOpenArea(board, startRow, startCol) {
  const stack = [[startRow, startCol]];
  const boardSize = board.length;

  while (stack.length > 0) {
    const [row, col] = stack.pop();
    const cell = board[row][col];

    if (cell.revealed || cell.flagged) {
      continue;
    }

    cell.revealed = true;

    if (cell.adjacent !== 0) {
      continue;
    }

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nextRow = row + rowOffset;
        const nextCol = col + colOffset;
        if (
          nextRow < 0 || nextRow >= boardSize
          || nextCol < 0 || nextCol >= boardSize
        ) {
          continue;
        }

        const nextCell = board[nextRow][nextCol];
        if (!nextCell.revealed && !nextCell.flagged && !nextCell.mine) {
          stack.push([nextRow, nextCol]);
        }
      }
    }
  }
}

export default function MindSweeper({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const { boardSize, mineCount, label, note, densityLabel } = config;
  const safeTiles = boardSize * boardSize - mineCount;
  const winsStorageKey = `quiet-journal-mind-sweeper-wins-${difficulty}`;

  const [board, setBoard] = useState(() => buildBoard(boardSize, mineCount));
  const [gameState, setGameState] = useState('playing');
  const [actionMode, setActionMode] = useState('reveal');
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem(winsStorageKey) || '0', 10));

  useEffect(() => {
    setBoard(buildBoard(boardSize, mineCount));
    setGameState('playing');
    setActionMode('reveal');
    setWins(parseInt(localStorage.getItem(winsStorageKey) || '0', 10));
  }, [boardSize, mineCount, winsStorageKey]);

  const resetBoard = () => {
    setBoard(buildBoard(boardSize, mineCount));
    setGameState('playing');
    setActionMode('reveal');
  };

  const revealedCount = useMemo(() => board.flat().filter((cell) => cell.revealed).length, [board]);
  const flagCount = useMemo(() => board.flat().filter((cell) => cell.flagged).length, [board]);
  const boardProgress = Math.round((revealedCount / safeTiles) * 100);

  const handleCellAction = (row, col) => {
    if (gameState !== 'playing') {
      return;
    }

    if (actionMode === 'flag') {
      const nextBoard = cloneBoard(board);
      const cell = nextBoard[row][col];
      if (cell.revealed) {
        return;
      }
      cell.flagged = !cell.flagged;
      setBoard(nextBoard);
      return;
    }

    const firstReveal = revealedCount === 0 && flagCount === 0;
    let nextBoard = firstReveal ? buildBoard(boardSize, mineCount, { row, col }) : cloneBoard(board);
    const cell = nextBoard[row][col];

    if (cell.flagged || cell.revealed) {
      return;
    }

    if (cell.mine) {
      nextBoard = nextBoard.map((line) => line.map((entry) => (entry.mine ? { ...entry, revealed: true } : entry)));
      setBoard(nextBoard);
      setGameState('lost');
      return;
    }

    revealOpenArea(nextBoard, row, col);
    const nextRevealedCount = nextBoard.flat().filter((entry) => entry.revealed).length;

    if (nextRevealedCount >= safeTiles) {
      setBoard(nextBoard);
      setGameState('won');
      const nextWins = wins + 1;
      setWins(nextWins);
      localStorage.setItem(winsStorageKey, String(nextWins));
      return;
    }

    setBoard(nextBoard);
  };

  const cellSizingClass = boardSize >= 12
    ? 'h-7 text-[11px] sm:h-9 sm:text-xs'
    : boardSize >= 10
      ? 'h-8 text-xs sm:h-10 sm:text-sm'
      : 'h-9 text-sm sm:h-11 sm:text-base';

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-lime-100 bg-gradient-to-br from-white via-lime-50/80 to-emerald-50/80 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-lime-700 shadow-sm">
              <Sparkles size={14} /> {label} sweep
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-lime-950">Mind Sweeper</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-lime-700">A cozy Minesweeper-style board that rewards slow logic and careful pattern reading. The bigger boards now change the feel much more clearly, so difficulty is not just a tiny numbers tweak anymore.</p>
            <p className="mt-2 text-sm font-semibold text-lime-600">{note}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-lime-700 shadow-sm">{densityLabel}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-lime-700 shadow-sm">First tap is always safe</span>
            </div>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[31rem]">
            <div className="rounded-[1.15rem] bg-lime-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-lime-500">Grid</p>
              <p className="mt-2 text-xl font-extrabold text-lime-950">{boardSize}×{boardSize}</p>
            </div>
            <div className="rounded-[1.15rem] bg-lime-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-lime-500">Mines</p>
              <p className="mt-2 text-xl font-extrabold text-lime-950">{mineCount}</p>
            </div>
            <div className="rounded-[1.15rem] bg-lime-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-lime-500">Flags</p>
              <p className="mt-2 text-xl font-extrabold text-lime-950">{flagCount}</p>
            </div>
            <div className="rounded-[1.15rem] bg-lime-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-lime-500">Wins</p>
              <p className="mt-2 text-xl font-extrabold text-lime-950">{wins}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-white/80 bg-white/74 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-lime-500">
            <span>Safe tiles uncovered</span>
            <span>{revealedCount}/{safeTiles}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-lime-100">
            <div className="h-full rounded-full bg-gradient-to-r from-lime-500 to-emerald-500 transition-all" style={{ width: `${boardProgress}%` }} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/80 bg-white/72 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === 'reveal' ? 'bg-lime-900 text-white shadow-sm' : 'border border-lime-200 bg-white text-lime-900'}`}
              onClick={() => setActionMode('reveal')}
              type="button"
            >
              Reveal mode
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === 'flag' ? 'bg-lime-900 text-white shadow-sm' : 'border border-lime-200 bg-white text-lime-900'}`}
              onClick={() => setActionMode('flag')}
              type="button"
            >
              Flag mode
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-lime-900 shadow-sm">{gameState === 'won' ? 'Board cleared' : gameState === 'lost' ? 'A mine popped' : 'Keep sweeping'}</span>
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-lime-900 shadow-sm transition hover:-translate-y-0.5" onClick={resetBoard} type="button">
              <RotateCcw size={16} /> Reset board
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-lime-100 bg-[#f6f8ef] p-3 shadow-inner sm:p-4">
          <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
            {board.flat().map((cell) => {
              const showMine = cell.revealed && cell.mine;
              return (
                <button
                  key={`${cell.row}-${cell.col}`}
                  className={`rounded-[0.9rem] border font-extrabold shadow-sm transition ${cellSizingClass} ${cell.revealed ? 'border-lime-100 bg-white' : 'border-white/80 bg-[#dde7d7] hover:-translate-y-0.5 hover:bg-[#e4ecdf]'} ${showMine ? 'bg-rose-100 text-rose-700' : ''} ${cell.flagged ? 'text-amber-700' : ''}`}
                  onClick={() => handleCellAction(cell.row, cell.col)}
                  type="button"
                >
                  {cell.flagged && !cell.revealed ? '⚑' : showMine ? '✹' : cell.revealed && cell.adjacent > 0 ? <span className={numberTone[cell.adjacent]}>{cell.adjacent}</span> : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
