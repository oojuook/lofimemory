import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

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
  const { boardSize, mineCount, label, densityLabel } = config;
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
    ? 'h-6 w-6 text-[11px] sm:h-8 sm:w-8 sm:text-xs'
    : boardSize >= 10
      ? 'h-7 w-7 text-xs sm:h-9 sm:w-9 sm:text-sm'
      : 'h-8 w-8 text-sm sm:h-10 sm:w-10 sm:text-base';

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border-[3px] border-[#8f8f8f] bg-[#c9c9c9] p-4 shadow-[0_18px_45px_rgba(63,74,52,0.14)] lg:p-5">
        <div className="rounded-[1.4rem] border-t-[3px] border-l-[3px] border-[#f8f8f8] border-r-[3px] border-b-[3px] border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#d4d4d4] p-4 lg:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-[#efefef] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#4e5a45] shadow-sm">
                <Sparkles size={14} /> {label} sweep
              </div>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-[#293125]">Mind Sweeper</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4a5643]">A retro desktop-style sweep that feels much closer to the classic Minesweeper board. Clear squares carefully, mark mines, and use the safer first click to settle into the board.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white bg-[#efefef] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#4e5a45] shadow-sm">{densityLabel}</span>
                <span className="rounded-full border border-white bg-[#efefef] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#4e5a45] shadow-sm">First tap is always safe</span>
              </div>
            </div>
            <div className="grid gap-2 rounded-[1.2rem] border-t-[3px] border-l-[3px] border-[#f8f8f8] border-r-[3px] border-b-[3px] border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#d0d0d0] p-3 shadow-sm sm:grid-cols-4 lg:min-w-[31rem]">
              <div className="rounded-[1rem] bg-[#efefef] px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6b6b6b]">Grid</p>
                <p className="mt-2 text-xl font-extrabold text-[#222]">{boardSize}×{boardSize}</p>
              </div>
              <div className="rounded-[1rem] bg-[#efefef] px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6b6b6b]">Mines</p>
                <p className="mt-2 text-xl font-extrabold text-[#222]">{mineCount}</p>
              </div>
              <div className="rounded-[1rem] bg-[#efefef] px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6b6b6b]">Flags</p>
                <p className="mt-2 text-xl font-extrabold text-[#222]">{flagCount}</p>
              </div>
              <div className="rounded-[1rem] bg-[#efefef] px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6b6b6b]">Wins</p>
                <p className="mt-2 text-xl font-extrabold text-[#222]">{wins}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[1.25rem] border-t-[3px] border-l-[3px] border-[#f8f8f8] border-r-[3px] border-b-[3px] border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#bfbfbf] p-3 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[132px_minmax(0,1fr)_132px] lg:items-center">
              <div className="rounded-[0.9rem] border-[3px] border-[#2a2a2a] bg-black px-3 py-2 text-center font-mono text-3xl font-extrabold tracking-[0.18em] text-[#ff3b30] shadow-inner">
                {String(remainingMines).padStart(3, '0')}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  className="inline-flex h-14 w-14 items-center justify-center rounded-[1rem] border-t-[3px] border-l-[3px] border-white border-r-[3px] border-b-[3px] border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#efefef] text-2xl shadow-sm transition active:translate-y-[1px]"
                  onClick={resetBoard}
                  type="button"
                >
                  {gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂'}
                </button>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === 'reveal' ? 'bg-[#3a3a3a] text-white' : 'border border-[#9d9d9d] bg-[#efefef] text-[#2b2b2b]'}`}
                    onClick={() => setActionMode('reveal')}
                    type="button"
                  >
                    Reveal
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === 'flag' ? 'bg-[#3a3a3a] text-white' : 'border border-[#9d9d9d] bg-[#efefef] text-[#2b2b2b]'}`}
                    onClick={() => setActionMode('flag')}
                    type="button"
                  >
                    Flag
                  </button>
                </div>
              </div>
              <div className="rounded-[0.9rem] border-[3px] border-[#2a2a2a] bg-black px-3 py-2 text-center font-mono text-3xl font-extrabold tracking-[0.18em] text-[#ff3b30] shadow-inner">
                {String(boardProgress).padStart(3, '0')}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#565656]">
              <span>{gameState === 'won' ? 'Board cleared' : gameState === 'lost' ? 'Mine popped' : 'Keep sweeping'}</span>
              <span>{revealedCount}/{safeTiles} safe cells open</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-none border-t-[4px] border-l-[4px] border-[#f8f8f8] border-r-[4px] border-b-[4px] border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#bdbdbd] p-2 text-center shadow-inner sm:p-2.5">
            <div className="inline-grid gap-0 border border-[#8f8f8f]" style={{ gridTemplateColumns: `repeat(${boardSize}, max-content)` }}>
              {board.flat().map((cell) => {
                const showMine = cell.revealed && cell.mine;
                const isHidden = !cell.revealed;
                return (
                  <button
                    key={`${cell.row}-${cell.col}`}
                    className={`flex items-center justify-center rounded-none font-extrabold leading-none transition ${cellSizingClass} ${isHidden ? 'border-t-[2px] border-l-[2px] border-r-[2px] border-b-[2px] border-t-white border-l-white border-r-[#7b7b7b] border-b-[#7b7b7b] bg-[#c7c7c7] active:border-t-[#7b7b7b] active:border-l-[#7b7b7b] active:border-r-white active:border-b-white' : 'border border-[#8f8f8f] bg-[#c6c6c6]'} ${showMine ? 'bg-[#f7c9c9] text-[#8b1111]' : ''} ${cell.flagged ? 'text-[#cf2d27]' : ''}`}
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
                    {cell.flagged && !cell.revealed ? '⚑' : showMine ? '✹' : cell.revealed && cell.adjacent > 0 ? <span className={numberTone[cell.adjacent]}>{cell.adjacent}</span> : ''}
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
