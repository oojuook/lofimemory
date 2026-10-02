import React, { useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const BOARD_SIZE = 8;
const MINE_COUNT = 10;
const SAFE_TILES = BOARD_SIZE * BOARD_SIZE - MINE_COUNT;
const WINS_STORAGE_KEY = 'quiet-journal-mind-sweeper-wins';

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

function buildBoard() {
  const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => ({
      row,
      col,
      mine: false,
      adjacent: 0,
      revealed: false,
      flagged: false
    }))
  );

  const mineSlots = new Set();
  while (mineSlots.size < MINE_COUNT) {
    mineSlots.add(Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE));
  }

  mineSlots.forEach((slot) => {
    const row = Math.floor(slot / BOARD_SIZE);
    const col = slot % BOARD_SIZE;
    board[row][col].mine = true;
  });

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col].mine) continue;
      let adjacent = 0;
      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
          if (rowOffset === 0 && colOffset === 0) continue;
          const nextRow = row + rowOffset;
          const nextCol = col + colOffset;
          if (nextRow < 0 || nextRow >= BOARD_SIZE || nextCol < 0 || nextCol >= BOARD_SIZE) continue;
          if (board[nextRow][nextCol].mine) adjacent += 1;
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

function countSafeRevealed(board) {
  return board.flat().filter((cell) => cell.revealed && !cell.mine).length;
}

function countFlags(board) {
  return board.flat().filter((cell) => cell.flagged).length;
}

function revealAllMines(board) {
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.mine) cell.revealed = true;
    });
  });
}

function floodReveal(board, startRow, startCol) {
  const stack = [[startRow, startCol]];

  while (stack.length) {
    const [row, col] = stack.pop();
    const cell = board[row]?.[col];
    if (!cell || cell.revealed || cell.flagged) continue;

    cell.revealed = true;

    if (cell.adjacent > 0) continue;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) continue;
        const nextRow = row + rowOffset;
        const nextCol = col + colOffset;
        if (nextRow < 0 || nextRow >= BOARD_SIZE || nextCol < 0 || nextCol >= BOARD_SIZE) continue;
        const nextCell = board[nextRow][nextCol];
        if (!nextCell.revealed && !nextCell.mine) {
          stack.push([nextRow, nextCol]);
        }
      }
    }
  }
}

export default function MindSweeper() {
  const [board, setBoard] = useState(buildBoard);
  const [gameState, setGameState] = useState('playing');
  const [actionMode, setActionMode] = useState('reveal');
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem(WINS_STORAGE_KEY) || '0', 10));

  const flags = useMemo(() => countFlags(board), [board]);
  const cleared = useMemo(() => countSafeRevealed(board), [board]);
  const minesLeft = Math.max(0, MINE_COUNT - flags);

  const resetGame = () => {
    setBoard(buildBoard());
    setGameState('playing');
    setActionMode('reveal');
  };

  const finishWin = (nextBoard) => {
    nextBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell.mine) cell.flagged = true;
      });
    });
    setBoard(nextBoard);
    setGameState('won');
    setWins((current) => {
      const next = current + 1;
      localStorage.setItem(WINS_STORAGE_KEY, String(next));
      return next;
    });
  };

  const toggleFlag = (nextBoard, row, col) => {
    const cell = nextBoard[row][col];
    if (cell.revealed) return false;
    if (cell.flagged) {
      cell.flagged = false;
      return true;
    }
    if (countFlags(nextBoard) >= MINE_COUNT) return false;
    cell.flagged = true;
    return true;
  };

  const handleCellAction = (row, col, forcedMode) => {
    if (gameState !== 'playing') return;

    const mode = forcedMode || actionMode;
    const nextBoard = cloneBoard(board);
    const cell = nextBoard[row][col];
    if (!cell) return;

    if (mode === 'flag') {
      if (toggleFlag(nextBoard, row, col)) {
        setBoard(nextBoard);
      }
      return;
    }

    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      revealAllMines(nextBoard);
      setBoard(nextBoard);
      setGameState('lost');
      return;
    }

    floodReveal(nextBoard, row, col);
    if (countSafeRevealed(nextBoard) === SAFE_TILES) {
      finishWin(nextBoard);
      return;
    }

    setBoard(nextBoard);
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-[880px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/78 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
              <Sparkles size={14} /> Soft logic reset
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-sage-950">Mind Sweeper</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">
              A cozy Minesweeper-style board for slower focus. Clear the quiet tiles, mark the sleepy hazards, and let your brain settle into one gentle task.
            </p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem]">
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Mines left</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{minesLeft}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Cleared</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{cleared}/{SAFE_TILES}</p>
            </div>
            <div className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">Soft wins</p>
              <p className="mt-2 text-xl font-extrabold text-sage-950">{wins}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'reveal', label: 'Reveal tiles' },
              { id: 'flag', label: 'Mark hazards' }
            ].map((option) => (
              <button
                key={option.id}
                className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${actionMode === option.id ? 'bg-sage-900 text-white shadow-sm' : 'border border-sage-200 bg-white text-sage-800 hover:bg-sage-50'}`}
                onClick={() => setActionMode(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-sage-700">
            <span className="rounded-full bg-sage-50 px-3 py-2">Tap to {actionMode === 'reveal' ? 'reveal' : 'flag'}</span>
            <span className="rounded-full bg-sage-50 px-3 py-2">Right click always flags</span>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5"
              onClick={resetGame}
              type="button"
            >
              <RotateCcw size={16} /> New board
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-sage-100 bg-[#f7f1e7] p-4 shadow-inner lg:p-5">
          <div className="grid grid-cols-8 gap-2">
            {board.flat().map((cell) => {
              const showNumber = cell.revealed && !cell.mine && cell.adjacent > 0;
              return (
                <button
                  key={`${cell.row}-${cell.col}`}
                  aria-label={`Tile ${cell.row + 1}-${cell.col + 1}`}
                  className={`aspect-square rounded-[1rem] border text-base font-extrabold transition ${cell.revealed ? 'border-white/80 bg-white text-sage-950 shadow-inner' : 'border-[#e7d8c7] bg-[#fbf7f1] text-sage-700 shadow-sm hover:-translate-y-0.5 hover:bg-white'} ${cell.flagged ? 'text-rose-600' : ''} ${cell.revealed && cell.mine ? 'bg-[#fde8df] text-rose-600' : ''}`}
                  onClick={() => handleCellAction(cell.row, cell.col)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    handleCellAction(cell.row, cell.col, 'flag');
                  }}
                  type="button"
                >
                  {cell.flagged && !cell.revealed ? '🚩' : ''}
                  {cell.revealed && cell.mine ? '💣' : ''}
                  {showNumber ? <span className={numberTone[cell.adjacent] || 'text-sage-800'}>{cell.adjacent}</span> : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/80 bg-white/78 px-4 py-4 text-sm font-semibold text-sage-700 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p>
            {gameState === 'won'
              ? 'You cleared the whole board — soft focus unlocked.'
              : gameState === 'lost'
                ? 'One sleepy hazard popped. Reset and try a calmer path.'
                : 'Take it slow — reveal the safe tiles and mark the hidden hazards.'}
          </p>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sage-500">Cozy logic • small reset • no rush</p>
        </div>
      </div>
    </div>
  );
}
