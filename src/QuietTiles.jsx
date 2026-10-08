import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Sparkles } from 'lucide-react';

const BOARD_SIZE = 4;

const difficultySettings = {
  easy: {
    target: 256,
    initialTiles: 2,
    spawnFourChance: 0.04,
    label: 'Easy',
    note: 'A softer number merge with an earlier win target.'
  },
  medium: {
    target: 512,
    initialTiles: 2,
    spawnFourChance: 0.1,
    label: 'Medium',
    note: 'Balanced and satisfying when you want a gentle puzzle loop.'
  },
  hard: {
    target: 1024,
    initialTiles: 3,
    spawnFourChance: 0.18,
    label: 'Hard',
    note: 'More pressure from the start and a higher merge goal.'
  }
};

const tileStyles = {
  0: 'bg-white/55 text-transparent border border-white/55',
  2: 'bg-[#f7efe5] text-stone-800 border border-[#efe3d5]',
  4: 'bg-[#f4e4d0] text-stone-800 border border-[#ecd6bb]',
  8: 'bg-[#f0cfaa] text-stone-900 border border-[#e7bf8d]',
  16: 'bg-[#ebb98a] text-stone-900 border border-[#dfa56e]',
  32: 'bg-[#e8a06e] text-white border border-[#d88653]',
  64: 'bg-[#db8358] text-white border border-[#cc7145]',
  128: 'bg-[#d8b86d] text-white border border-[#caab60]',
  256: 'bg-[#c5b26e] text-white border border-[#b5a15f]',
  512: 'bg-[#8fb18a] text-white border border-[#7da376]',
  1024: 'bg-[#729b8f] text-white border border-[#668c81]',
  2048: 'bg-[#5e7e78] text-white border border-[#4f6e68]'
};

const lofiTileStyles = {
  0: 'border border-white/60 bg-white/35 text-transparent',
  2: 'border border-[#f0e4d7] bg-[linear-gradient(145deg,#fffaf4,#f5e6d3)] text-[#5b4b40]',
  4: 'border border-[#ead8c4] bg-[linear-gradient(145deg,#fff5eb,#f1dcc3)] text-[#5b4b40]',
  8: 'border border-[#e9c8a8] bg-[linear-gradient(145deg,#f9e0c2,#efc496)] text-[#4a3a2d]',
  16: 'border border-[#deba90] bg-[linear-gradient(145deg,#f3d1ae,#e2af7f)] text-[#4a3a2d]',
  32: 'border border-[#d8a06f] bg-[linear-gradient(145deg,#e6b78c,#cd8f63)] text-white',
  64: 'border border-[#ca875b] bg-[linear-gradient(145deg,#db9a72,#ba724a)] text-white',
  128: 'border border-[#d4c3a4] bg-[linear-gradient(145deg,#d9e7d0,#adc7a2)] text-[#3d3025]',
  256: 'border border-[#c1d7c8] bg-[linear-gradient(145deg,#d8eff1,#a9d3d3)] text-[#27464a]',
  512: 'border border-[#bccfc1] bg-[linear-gradient(145deg,#cbe1d4,#93b69d)] text-[#2f4d3d]',
  1024: 'border border-[#c9bed8] bg-[linear-gradient(145deg,#dcd6ef,#b4a6d0)] text-[#3f3558]',
  2048: 'border border-[#d7c1b3] bg-[linear-gradient(145deg,#d4a373,#a98467)] text-white'
};

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function addRandomTile(board, spawnFourChance) {
  const emptyCells = [];
  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) emptyCells.push([rowIndex, colIndex]);
    });
  });

  if (!emptyCells.length) return board;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const nextBoard = cloneBoard(board);
  nextBoard[row][col] = Math.random() < spawnFourChance ? 4 : 2;
  return nextBoard;
}

function buildBoard(config) {
  let board = createEmptyBoard();
  for (let count = 0; count < config.initialTiles; count += 1) {
    board = addRandomTile(board, config.spawnFourChance);
  }
  return board;
}

function slideLine(line) {
  const filtered = line.filter((value) => value !== 0);
  const merged = [];
  let gained = 0;

  for (let index = 0; index < filtered.length; index += 1) {
    const current = filtered[index];
    const next = filtered[index + 1];

    if (current !== 0 && current === next) {
      const value = current * 2;
      merged.push(value);
      gained += value;
      index += 1;
    } else {
      merged.push(current);
    }
  }

  while (merged.length < BOARD_SIZE) merged.push(0);
  return { line: merged, gained };
}

function moveBoard(board, direction) {
  let moved = false;
  let scoreGain = 0;
  const nextBoard = createEmptyBoard();

  const readLine = (index) => {
    if (direction === 'left') return [...board[index]];
    if (direction === 'right') return [...board[index]].reverse();
    if (direction === 'up') return board.map((row) => row[index]);
    return board.map((row) => row[index]).reverse();
  };

  const writeLine = (index, line) => {
    if (direction === 'left') {
      nextBoard[index] = line;
      return;
    }
    if (direction === 'right') {
      nextBoard[index] = [...line].reverse();
      return;
    }
    if (direction === 'up') {
      line.forEach((value, rowIndex) => {
        nextBoard[rowIndex][index] = value;
      });
      return;
    }
    [...line].reverse().forEach((value, rowIndex) => {
      nextBoard[rowIndex][index] = value;
    });
  };

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    const originalLine = readLine(index);
    const { line, gained } = slideLine(originalLine);
    if (line.some((value, lineIndex) => value !== originalLine[lineIndex])) moved = true;
    scoreGain += gained;
    writeLine(index, line);
  }

  return { board: nextBoard, moved, scoreGain };
}

function canMove(board) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = board[row][col];
      if (value === 0) return true;
      if (row + 1 < BOARD_SIZE && board[row + 1][col] === value) return true;
      if (col + 1 < BOARD_SIZE && board[row][col + 1] === value) return true;
    }
  }
  return false;
}

function getLargestTile(board) {
  return Math.max(...board.flat());
}

export default function QuietTiles({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-quiet-tiles-best-${difficulty}`;

  const [board, setBoard] = useState(() => buildBoard(config));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('playing');

  useEffect(() => {
    setBoard(buildBoard(config));
    setScore(0);
    setGameState('playing');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [bestScoreKey, config]);

  const largestTile = useMemo(() => getLargestTile(board), [board]);
  const boardCoordinates = useMemo(
    () => Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, cellIndex) => ({ row: Math.floor(cellIndex / BOARD_SIZE), col: cellIndex % BOARD_SIZE })),
    []
  );

  const resetGame = () => {
    setBoard(buildBoard(config));
    setScore(0);
    setGameState('playing');
  };

  const handleMove = (direction) => {
    if (gameState === 'lost') return;

    const result = moveBoard(board, direction);
    if (!result.moved) return;

    const nextBoard = addRandomTile(result.board, config.spawnFourChance);
    const nextScore = score + result.scoreGain;
    const hasWon = getLargestTile(nextBoard) >= config.target;
    const hasMovesLeft = canMove(nextBoard);

    setBoard(nextBoard);
    setScore(nextScore);

    if (nextScore > bestScore) {
      setBestScore(nextScore);
      localStorage.setItem(bestScoreKey, String(nextScore));
    }

    if (hasWon) {
      setGameState('won');
    } else if (!hasMovesLeft) {
      setGameState('lost');
    } else {
      setGameState('playing');
    }
  };

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
      handleMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const controls = [
    { key: 'up', icon: ArrowUp },
    { key: 'left', icon: ArrowLeft },
    { key: 'down', icon: ArrowDown },
    { key: 'right', icon: ArrowRight }
  ];

  return (
    <div className="mx-auto mt-12 w-full max-w-[900px] pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_26px_80px_rgba(83,62,44,0.12)]' : 'border-sage-100 bg-gradient-to-br from-white via-slate-50/80 to-sand-50/80'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(255,247,236,0.9)_48%,rgba(250,237,205,0.86))]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8b6b52 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-slate-200 bg-white/88 text-slate-700'}`}>
              <Sparkles size={14} /> {config.label} merge flow
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>Tiles</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-slate-700'}`}>A cozy number-merge puzzle inspired by the satisfying rhythm people love in 2048-style games. Slide the board, combine matching tiles, and let the repetition do the relaxing.</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-amber-700' : 'text-slate-600'}`}>{config.note}</p>
          </div>
          <div className={`grid gap-2 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[23rem] ${isLofi ? 'rounded-[1.35rem] border border-white/70 bg-white/65 backdrop-blur-sm' : 'rounded-[1.5rem] border border-white/85 bg-white/80'}`}>
            {[
              ['Score', score],
              ['Best', bestScore],
              ['Target', config.target]
            ].map(([label, value]) => (
              <div key={label} className={`${isLofi ? 'rounded-[0.95rem] bg-amber-50/90 text-amber-900' : 'rounded-[1.15rem] bg-slate-50'} px-4 py-3 text-center`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800/60' : 'text-slate-500'}`}>{label}</p>
                <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative z-10 mt-5 flex flex-col gap-3 rounded-[1.6rem] border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between ${isLofi ? 'border-white/70 bg-white/68 backdrop-blur-sm' : 'border-white/80 bg-white/72'}`}>
          <p className={`text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-slate-700'}`}>
            {gameState === 'won'
              ? 'You reached the target tile — soft focus unlocked.'
              : gameState === 'lost'
                ? 'The board filled up. Reset and ease back in.'
                : 'Use arrow keys or the tap controls to slide and merge matching tiles.'}
          </p>
          <button
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] text-white hover:bg-[#3d3025]' : 'bg-white text-slate-900'}`}
            onClick={resetGame}
            type="button"
          >
            <RotateCcw size={16} /> New board
          </button>
        </div>

        <div className="relative z-10 mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className={`relative rounded-[1.8rem] border p-4 shadow-inner lg:p-5 ${isLofi ? 'border-amber-200/60 bg-[linear-gradient(145deg,rgba(253,250,245,0.98),rgba(250,237,205,0.92))]' : 'border-slate-100 bg-[#efe4d8]'}`}>
            {isLofi && <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_60%)]" />}
            <div className="relative z-10 grid gap-3" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}>
              {boardCoordinates.map(({ row, col }) => {
                const value = board[row][col];
                return (
                  <div
                    key={`cell-${row}-${col}`}
                    className={`flex aspect-square items-center justify-center rounded-[1.2rem] text-2xl font-extrabold shadow-sm transition sm:text-3xl ${isLofi ? `${lofiTileStyles[value] || 'border border-[#d4c0ae] bg-[linear-gradient(145deg,#a98467,#6c584c)] text-white'} shadow-[0_12px_24px_rgba(83,62,44,0.1)]` : tileStyles[value] || 'bg-[#4f6e68] text-white border border-[#3f5a55]'}`}
                  >
                    {value === 0 ? '' : value}
                  </div>
                );
              })}
            </div>
            {gameState === 'lost' && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-[1.8rem] p-4 backdrop-blur-[3px] ${isLofi ? 'bg-white/54' : 'bg-white/82'}`}>
                <div className={`w-full max-w-sm rounded-[1.5rem] border p-5 text-center shadow-soft ${isLofi ? 'border-white/80 bg-white/80 backdrop-blur-md' : 'border-white/85 bg-white/92'}`}>
                  <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-slate-500'}`}>Round over</p>
                  <h4 className={`mt-3 text-3xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>No moves left</h4>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {[
                      ['Score', score],
                      ['Best', bestScore],
                      ['Largest', largestTile]
                    ].map(([label, value]) => (
                      <div key={label} className={`rounded-[1rem] px-3 py-3 ${isLofi ? 'bg-amber-50/90 text-amber-900' : 'bg-slate-50'}`}>
                        <p className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-800/60' : 'text-slate-500'}`}>{label}</p>
                        <p className={`mt-1 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className={`mt-4 text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-slate-600'}`}>Target tile: {config.target}. Reset whenever you want another gentle run.</p>
                  <button
                    className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-slate-900 hover:bg-slate-800'}`}
                    onClick={resetGame}
                    type="button"
                  >
                    <RotateCcw size={16} /> Play again
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`rounded-[1.8rem] border p-4 shadow-sm ${isLofi ? 'border-white/70 bg-white/70 backdrop-blur-sm' : 'border-white/80 bg-white/78'}`}>
            <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800/70' : 'text-slate-500'}`}>Tap controls</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div />
              <button className={`rounded-2xl border p-3 transition ${isLofi ? 'border-amber-200 bg-amber-50/90 text-amber-900 hover:bg-white' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'}`} onClick={() => handleMove('up')} type="button"><ArrowUp className="mx-auto" size={18} /></button>
              <div />
              {controls.slice(1).map((control) => (
                <button
                  key={control.key}
                  className={`rounded-2xl border p-3 transition ${isLofi ? 'border-amber-200 bg-amber-50/90 text-amber-900 hover:bg-white' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
                  onClick={() => handleMove(control.key)}
                  type="button"
                >
                  <control.icon className="mx-auto" size={18} />
                </button>
              ))}
            </div>
            <div className={`mt-5 rounded-[1.25rem] px-4 py-4 text-sm leading-7 ${isLofi ? 'bg-amber-50/90 text-[#6e5a4a]' : 'bg-slate-50 text-slate-700'}`}>
              Largest tile: <span className={`font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-slate-950'}`}>{largestTile}</span><br />
              Search-friendly bonus: this is a calm 2048-style number merge game, which is one of the most recognizable relaxing puzzle formats on the web.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
