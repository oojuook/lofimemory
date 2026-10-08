import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    boardWidth: 9,
    boardHeight: 9,
    mineCount: 10,
    label: 'Easy',
    note: 'Classic beginner setup: 9×9 with 10 mines.',
    densityLabel: 'Beginner · 9×9'
  },
  medium: {
    boardWidth: 16,
    boardHeight: 16,
    mineCount: 40,
    label: 'Medium',
    note: 'Classic intermediate setup: 16×16 with 40 mines.',
    densityLabel: 'Intermediate · 16×16'
  },
  hard: {
    boardWidth: 30,
    boardHeight: 16,
    mineCount: 99,
    label: 'Hard',
    note: 'Classic expert setup: 30×16 with 99 mines.',
    densityLabel: 'Expert · 30×16'
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

const lofiNumberTone = {
  1: 'text-[#a2d2ff]',
  2: 'text-[#ccd5ae]',
  3: 'text-[#ffafcc]',
  4: 'text-[#cdb4db]',
  5: 'text-[#d4a373]',
  6: 'text-[#bde0fe]',
  7: 'text-[#6e5a4a]',
  8: 'text-[#4a3a2d]'
};

function buildBoard(boardWidth, boardHeight, mineCount, safeCell) {
  const board = Array.from({ length: boardHeight }, (_, row) => Array.from({ length: boardWidth }, (_, col) => ({
    row,
    col,
    mine: false,
    adjacent: 0,
    revealed: false,
    flagged: false
  })));

  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * boardHeight);
    const col = Math.floor(Math.random() * boardWidth);

    if (board[row][col].mine) {
      continue;
    }

    if (safeCell && row === safeCell.row && col === safeCell.col) {
      continue;
    }

    board[row][col].mine = true;
    placedMines += 1;
  }

  for (let row = 0; row < boardHeight; row += 1) {
    for (let col = 0; col < boardWidth; col += 1) {
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
            nextRow < 0 || nextRow >= boardHeight
            || nextCol < 0 || nextCol >= boardWidth
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
  const boardHeight = board.length;
  const boardWidth = board[0]?.length || 0;

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
          nextRow < 0 || nextRow >= boardHeight
          || nextCol < 0 || nextCol >= boardWidth
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

export default function MindSweeper({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const { boardWidth, boardHeight, mineCount, label, densityLabel } = config;
  const safeTiles = boardWidth * boardHeight - mineCount;
  const winsStorageKey = `quiet-journal-mind-sweeper-wins-${difficulty}`;

  const [board, setBoard] = useState(() => buildBoard(boardWidth, boardHeight, mineCount));
  const [gameState, setGameState] = useState('playing');
  const [actionMode, setActionMode] = useState('reveal');
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem(winsStorageKey) || '0', 10));

  useEffect(() => {
    setBoard(buildBoard(boardWidth, boardHeight, mineCount));
    setGameState('playing');
    setActionMode('reveal');
    setWins(parseInt(localStorage.getItem(winsStorageKey) || '0', 10));
  }, [boardWidth, boardHeight, mineCount, winsStorageKey]);

  const resetBoard = () => {
    setBoard(buildBoard(boardWidth, boardHeight, mineCount));
    setGameState('playing');
    setActionMode('reveal');
  };

  const revealedCount = useMemo(() => board.flat().filter((cell) => cell.revealed).length, [board]);
  const flagCount = useMemo(() => board.flat().filter((cell) => cell.flagged).length, [board]);
  const boardProgress = Math.round((revealedCount / safeTiles) * 100);
  const remainingMines = Math.max(mineCount - flagCount, 0);

  const handleFlagAction = (row, col) => {
    const nextBoard = cloneBoard(board);
    const cell = nextBoard[row][col];
    if (cell.revealed) {
      return false;
    }
    cell.flagged = !cell.flagged;
    setBoard(nextBoard);
    return true;
  };

  const handleCellAction = (row, col) => {
    if (gameState !== 'playing') {
      return;
    }

    if (actionMode === 'flag') {
      handleFlagAction(row, col);
      return;
    }

    const firstReveal = revealedCount === 0 && flagCount === 0;
    let nextBoard = firstReveal ? buildBoard(boardWidth, boardHeight, mineCount, { row, col }) : cloneBoard(board);
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

  const cellSizingClass = boardWidth >= 30
    ? 'text-[10px] sm:text-[11px]'
    : boardWidth >= 16
      ? 'text-[11px] sm:text-xs'
      : 'text-sm sm:text-base';
  const cellPixelSize = boardWidth >= 30 ? 24 : boardWidth >= 16 ? 28 : 36;

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className={`rounded-[2rem] border p-4 lg:p-5 ${isLofi ? 'border-amber-200/60 bg-[#fff7ec] shadow-[0_26px_70px_rgba(83,62,44,0.13)]' : 'border-[4px] border-[#16191b] bg-[#2b2f31] shadow-[0_18px_45px_rgba(18,22,20,0.22)]'}`}>
        <div className={`rounded-[1.5rem] border p-4 lg:p-5 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-t-[3px] border-l-[3px] border-[#50565a] border-r-[3px] border-b-[3px] border-r-[#111315] border-b-[#111315] bg-[#383d40]'}`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-[#5d6468] bg-[#2b2f31] text-[#d9e0df]'}`}>
                <Sparkles size={14} /> {label} sweep
              </div>
              <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-[#f1f5f3]'}`}>Mind Sweeper</h3>
              <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-[#c1cbc7]'}`}>{isLofi ? 'A cozy Minesweeper board with soft biscuit tiles, warm shadows, and quiet focus pacing.' : 'Classic dark Minesweeper tiles with no spacing between squares.'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-[#5d6468] bg-[#2b2f31] text-[#d9e0df]'}`}>{densityLabel}</span>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-[#5d6468] bg-[#2b2f31] text-[#d9e0df]'}`}>Safe first tap</span>
              </div>
            </div>
            <div className={`grid gap-2 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[31rem] ${isLofi ? 'rounded-[1.5rem] border border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'rounded-[0.8rem] border-t-[3px] border-l-[3px] border-[#50565a] border-r-[3px] border-b-[3px] border-r-[#111315] border-b-[#111315] bg-[#2b2f31]'}`}>
              {[
                ['Grid', `${boardWidth}×${boardHeight}`],
                ['Mines', mineCount],
                ['Flags', flagCount],
                ['Wins', wins]
              ].map(([statLabel, value]) => (
                <div key={statLabel} className={`px-4 py-3 text-center ${isLofi ? 'rounded-[1.2rem] bg-[#faedcd] text-[#3d3025]' : 'rounded-[0.55rem] bg-[#1d2022]'}`}>
                  <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800/60' : 'text-[#9fa9a5]'}`}>{statLabel}</p>
                  <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-[#f1f5f3]'}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-5 p-3 shadow-sm ${isLofi ? 'rounded-[1.5rem] border border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'rounded-[0.7rem] border-t-[3px] border-l-[3px] border-[#50565a] border-r-[3px] border-b-[3px] border-r-[#111315] border-b-[#111315] bg-[#222629]'}`}>
            <div className="grid gap-3 lg:grid-cols-[132px_minmax(0,1fr)_132px] lg:items-center">
              <div className={`px-3 py-2 text-center font-mono text-3xl font-extrabold tracking-[0.18em] shadow-inner ${isLofi ? 'rounded-[1.2rem] border border-[#e8dfd5] bg-white/80 text-[#4a3a2d]' : 'rounded-[0.9rem] border-[3px] border-[#2a2a2a] bg-black text-[#ff3b30]'}`}>
                {String(remainingMines).padStart(3, '0')}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  className={`inline-flex h-14 w-14 items-center justify-center text-2xl shadow-sm transition active:translate-y-[1px] ${isLofi ? 'rounded-full border border-amber-200 bg-[#fffaf2]' : 'rounded-[1rem] border-t-[3px] border-l-[3px] border-white border-r-[3px] border-b-[3px] border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#efefef]'}`}
                  onClick={resetBoard}
                  type="button"
                >
                  {gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂'}
                </button>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === 'reveal' ? (isLofi ? 'bg-[#4a3a2d] text-white' : 'bg-[#3a3a3a] text-white') : (isLofi ? 'border border-amber-200 bg-white text-amber-900' : 'border border-[#9d9d9d] bg-[#efefef] text-[#2b2b2b]')}`}
                    onClick={() => setActionMode('reveal')}
                    type="button"
                  >
                    Reveal
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === 'flag' ? (isLofi ? 'bg-[#4a3a2d] text-white' : 'bg-[#3a3a3a] text-white') : (isLofi ? 'border border-amber-200 bg-white text-amber-900' : 'border border-[#9d9d9d] bg-[#efefef] text-[#2b2b2b]')}`}
                    onClick={() => setActionMode('flag')}
                    type="button"
                  >
                    Flag
                  </button>
                </div>
              </div>
              <div className={`px-3 py-2 text-center font-mono text-3xl font-extrabold tracking-[0.18em] shadow-inner ${isLofi ? 'rounded-[1.2rem] border border-[#e8dfd5] bg-white/80 text-[#4a3a2d]' : 'rounded-[0.9rem] border-[3px] border-[#2a2a2a] bg-black text-[#ff3b30]'}`}>
                {String(boardProgress).padStart(3, '0')}
              </div>
            </div>
            <div className={`mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'text-[#6e5a4a]' : 'text-[#b7c1bd]'}`}>
              <span>{gameState === 'won' ? 'Board cleared' : gameState === 'lost' ? 'Mine popped' : 'Keep sweeping'}</span>
              <span>{revealedCount}/{safeTiles} safe cells open</span>
            </div>
          </div>

          <div className={`mt-5 overflow-x-auto p-2 text-center shadow-inner sm:p-2.5 ${isLofi ? 'rounded-[1.5rem] border border-[#e8dfd5]/80 bg-[#fff9f0]' : 'rounded-none border-t-[4px] border-l-[4px] border-[#50565a] border-r-[4px] border-b-[4px] border-r-[#111315] border-b-[#111315] bg-[#24282a]'}`}>
            <div className={`inline-grid gap-0 border ${isLofi ? 'border-[#d8c6b2] bg-[#d8c6b2]' : 'border-2 border-[#151719] bg-[#151719]'}`} style={{ gridTemplateColumns: `repeat(${boardWidth}, ${cellPixelSize}px)` }}>
              {board.flat().map((cell) => {
                const showMine = cell.revealed && cell.mine;
                const isHidden = !cell.revealed;
                const hiddenClass = isLofi
                  ? 'border border-[#e8dfd5] bg-[#faedcd] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_0_rgba(139,94,52,0.08)] hover:bg-[#f6dfb8] active:bg-[#f2d8a9]'
                  : 'border-t-[2px] border-l-[2px] border-r-[2px] border-b-[2px] border-t-[#7b8388] border-l-[#7b8388] border-r-[#16191b] border-b-[#16191b] bg-[#4f5559] active:border-t-[#16191b] active:border-l-[#16191b] active:border-r-[#7b8388] active:border-b-[#7b8388]';
                const revealedClass = isLofi
                  ? 'border border-[#e8dfd5] bg-[#fffaf2]'
                  : 'border border-[#24282a] bg-[#303538]';
                const mineClass = isLofi ? 'bg-[#ffafcc] text-[#7b2f44]' : 'bg-[#7b2424] text-[#ffd0d0]';
                return (
                  <button
                    key={`${cell.row}-${cell.col}`}
                    className={`box-border m-0 flex items-center justify-center rounded-none p-0 font-extrabold leading-none transition ${cellSizingClass} ${isHidden ? hiddenClass : revealedClass} ${showMine ? mineClass : ''} ${cell.flagged ? (isLofi ? 'text-[#ff8fa3]' : 'text-[#ff4a43]') : ''}`}
                    style={{ width: `${cellPixelSize}px`, height: `${cellPixelSize}px` }}
                    onClick={() => handleCellAction(cell.row, cell.col)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      if (gameState !== 'playing') {
                        return;
                      }
                      handleFlagAction(cell.row, cell.col);
                    }}
                    type="button"
                  >
                    {cell.flagged && !cell.revealed ? '⚑' : showMine ? '✹' : cell.revealed && cell.adjacent > 0 ? <span className={(isLofi ? lofiNumberTone : numberTone)[cell.adjacent]}>{cell.adjacent}</span> : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
