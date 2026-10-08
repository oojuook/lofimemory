import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

const ROWS = 20;
const COLS = 10;

const SHAPES = {
  I: {
    color: '#67d7f7',
    lofiColor: '#bde0fe',
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  O: {
    color: '#f5cb55',
    lofiColor: '#faedcd',
    matrix: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    color: '#b48cff',
    lofiColor: '#cdb4db',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  S: {
    color: '#73d38e',
    lofiColor: '#ccd5ae',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  Z: {
    color: '#f48aa4',
    lofiColor: '#ffafcc',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  },
  J: {
    color: '#7aa0ff',
    lofiColor: '#a2d2ff',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  L: {
    color: '#ffb45f',
    lofiColor: '#ffc8dd',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  }
};

const pieceTypes = Object.keys(SHAPES);

const difficultySettings = {
  easy: {
    label: 'Easy',
    dropMs: 920,
    minDropMs: 240,
    note: 'A slower stack rate that still speeds up gently every 10 cleared lines.'
  },
  medium: {
    label: 'Medium',
    dropMs: 680,
    minDropMs: 170,
    note: 'A classic pace where each level makes the falling pieces a little faster.'
  },
  hard: {
    label: 'Hard',
    dropMs: 480,
    minDropMs: 120,
    note: 'A faster arcade pace with sharper level-based acceleration.'
  }
};

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

function shuffle(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function drawFromBag(currentBag = []) {
  const nextBag = currentBag.length ? [...currentBag] : shuffle([...pieceTypes]);
  const type = nextBag.pop();
  return { type, bag: nextBag };
}

function createPiece(type) {
  return {
    type,
    matrix: SHAPES[type].matrix.map((row) => [...row]),
    row: 0,
    col: Math.floor((COLS - SHAPES[type].matrix[0].length) / 2)
  };
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]).reverse());
}

function hasCollision(board, piece, nextRow = piece.row, nextCol = piece.col, nextMatrix = piece.matrix) {
  for (let row = 0; row < nextMatrix.length; row += 1) {
    for (let col = 0; col < nextMatrix[row].length; col += 1) {
      if (!nextMatrix[row][col]) {
        continue;
      }

      const boardRow = nextRow + row;
      const boardCol = nextCol + col;

      if (boardCol < 0 || boardCol >= COLS || boardRow >= ROWS) {
        return true;
      }

      if (boardRow >= 0 && board[boardRow][boardCol]) {
        return true;
      }
    }
  }

  return false;
}

function mergePiece(board, piece) {
  const nextBoard = board.map((row) => [...row]);
  piece.matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (!value) {
        return;
      }
      const boardRow = piece.row + rowIndex;
      const boardCol = piece.col + colIndex;
      if (boardRow >= 0) {
        nextBoard[boardRow][boardCol] = piece.type;
      }
    });
  });
  return nextBoard;
}

function clearCompletedLines(board) {
  const remainingRows = board.filter((row) => row.some((cell) => !cell));
  const linesCleared = ROWS - remainingRows.length;
  if (linesCleared === 0) {
    return { board, linesCleared: 0 };
  }

  const nextBoard = [
    ...Array.from({ length: linesCleared }, () => Array.from({ length: COLS }, () => null)),
    ...remainingRows
  ];

  return {
    board: nextBoard,
    linesCleared
  };
}

function getLineScore(linesCleared, level = 1) {
  if (linesCleared === 1) return 100 * level;
  if (linesCleared === 2) return 300 * level;
  if (linesCleared === 3) return 500 * level;
  if (linesCleared >= 4) return 800 * level;
  return 0;
}

export default function QuietTetris({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-tetris-best-${difficulty}`;

  const [board, setBoard] = useState(createEmptyBoard);
  const [bag, setBag] = useState(() => shuffle([...pieceTypes]));
  const initialDrawRef = useRef(null);
  if (!initialDrawRef.current) {
    let initialBag = shuffle([...pieceTypes]);
    const first = initialBag.pop();
    if (initialBag.length === 0) initialBag = shuffle([...pieceTypes]);
    const second = initialBag.pop();
    initialDrawRef.current = { first, second, bag: initialBag };
  }
  const [currentPiece, setCurrentPiece] = useState(() => createPiece(initialDrawRef.current.first));
  const [nextType, setNextType] = useState(() => initialDrawRef.current.second);
  const [heldType, setHeldType] = useState(null);
  const [holdUsed, setHoldUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');
  const currentLevel = useMemo(() => Math.min(20, Math.floor(lines / 10) + 1), [lines]);
  const levelProgress = lines % 10;
  const dropInterval = useMemo(
    () => Math.max(config.minDropMs, Math.round(config.dropMs * (0.86 ** (currentLevel - 1)))),
    [config.dropMs, config.minDropMs, currentLevel]
  );
  const speedLabel = `${dropInterval}ms`;

  const resetPiecesFromBag = useCallback(() => {
    const firstDraw = drawFromBag([]);
    const secondDraw = drawFromBag(firstDraw.bag);
    setCurrentPiece(createPiece(firstDraw.type));
    setNextType(secondDraw.type);
    setBag(secondDraw.bag);
  }, []);

  useEffect(() => {
    setBoard(createEmptyBoard());
    resetPiecesFromBag();
    setHeldType(null);
    setHoldUsed(false);
    setScore(0);
    setLines(0);
    setGameState('start');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [bestScoreKey, resetPiecesFromBag]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    resetPiecesFromBag();
    setHeldType(null);
    setHoldUsed(false);
    setScore(0);
    setLines(0);
    setGameState('playing');
  }, [resetPiecesFromBag]);

  const lockCurrentPiece = useCallback((pieceToLock = currentPiece) => {
    const mergedBoard = mergePiece(board, pieceToLock);
    const { board: clearedBoard, linesCleared } = clearCompletedLines(mergedBoard);
    const nextScore = score + getLineScore(linesCleared, currentLevel);
    const nextLines = lines + linesCleared;
    const spawnedPiece = createPiece(nextType);
    const draw = drawFromBag(bag);

    setBoard(clearedBoard);
    setScore(nextScore);
    setLines(nextLines);
    setNextType(draw.type);
    setBag(draw.bag);
    setHoldUsed(false);

    if (hasCollision(clearedBoard, spawnedPiece, spawnedPiece.row, spawnedPiece.col, spawnedPiece.matrix)) {
      setCurrentPiece(spawnedPiece);
      setGameState('over');
      return;
    }

    setCurrentPiece(spawnedPiece);
  }, [bag, board, currentLevel, currentPiece, lines, nextType, score]);

  const movePiece = useCallback((rowDelta, colDelta) => {
    if (gameState !== 'playing') {
      return;
    }

    const nextRow = currentPiece.row + rowDelta;
    const nextCol = currentPiece.col + colDelta;

    if (hasCollision(board, currentPiece, nextRow, nextCol, currentPiece.matrix)) {
      if (rowDelta === 1 && colDelta === 0) {
        lockCurrentPiece(currentPiece);
      }
      return;
    }

    setCurrentPiece((previous) => ({ ...previous, row: nextRow, col: nextCol }));
  }, [board, currentPiece, gameState, lockCurrentPiece]);

  const rotatePiece = useCallback(() => {
    if (gameState !== 'playing') {
      return;
    }

    const rotatedMatrix = rotateMatrix(currentPiece.matrix);
    const offsets = [0, -1, 1, -2, 2];

    for (const offset of offsets) {
      if (!hasCollision(board, currentPiece, currentPiece.row, currentPiece.col + offset, rotatedMatrix)) {
        setCurrentPiece((previous) => ({ ...previous, matrix: rotatedMatrix, col: previous.col + offset }));
        return;
      }
    }
  }, [board, currentPiece, gameState]);

  const hardDrop = useCallback(() => {
    if (gameState !== 'playing') {
      return;
    }

    let nextRow = currentPiece.row;
    while (!hasCollision(board, currentPiece, nextRow + 1, currentPiece.col, currentPiece.matrix)) {
      nextRow += 1;
    }

    const droppedPiece = { ...currentPiece, row: nextRow };
    setCurrentPiece(droppedPiece);
    lockCurrentPiece(droppedPiece);
  }, [board, currentPiece, gameState, lockCurrentPiece]);

  const holdPiece = useCallback(() => {
    if (gameState !== 'playing' || holdUsed) {
      return;
    }

    const currentType = currentPiece.type;

    if (!heldType) {
      const spawnedPiece = createPiece(nextType);
      const draw = drawFromBag(bag);
      setHeldType(currentType);
      setNextType(draw.type);
      setBag(draw.bag);
      setHoldUsed(true);
      if (hasCollision(board, spawnedPiece, spawnedPiece.row, spawnedPiece.col, spawnedPiece.matrix)) {
        setCurrentPiece(spawnedPiece);
        setGameState('over');
        return;
      }
      setCurrentPiece(spawnedPiece);
      return;
    }

    const swappedPiece = createPiece(heldType);
    setHeldType(currentType);
    setHoldUsed(true);
    if (hasCollision(board, swappedPiece, swappedPiece.row, swappedPiece.col, swappedPiece.matrix)) {
      setCurrentPiece(swappedPiece);
      setGameState('over');
      return;
    }
    setCurrentPiece(swappedPiece);
  }, [bag, board, currentPiece, gameState, heldType, holdUsed, nextType]);

  useEffect(() => {
    if (gameState !== 'playing') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      movePiece(1, 0);
    }, dropInterval);

    return () => window.clearInterval(timer);
  }, [dropInterval, gameState, movePiece]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState !== 'playing' && (event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        startGame();
        return;
      }

      if (gameState !== 'playing') {
        return;
      }

      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        event.preventDefault();
        movePiece(0, -1);
      } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        event.preventDefault();
        movePiece(0, 1);
      } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        event.preventDefault();
        movePiece(1, 0);
      } else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        rotatePiece();
      } else if (event.code === 'KeyC' || event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        event.preventDefault();
        holdPiece();
      } else if (event.code === 'Space') {
        event.preventDefault();
        hardDrop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hardDrop, holdPiece, movePiece, rotatePiece, startGame]);

  useEffect(() => {
    if (gameState === 'over' && score > bestScore) {
      setBestScore(score);
      localStorage.setItem(bestScoreKey, String(score));
    }
  }, [bestScore, bestScoreKey, gameState, score]);

  const displayBoard = useMemo(() => {
    const nextBoard = board.map((row) => [...row]);
    if (currentPiece) {
      currentPiece.matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (!value) {
            return;
          }
          const boardRow = currentPiece.row + rowIndex;
          const boardCol = currentPiece.col + colIndex;
          if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
            nextBoard[boardRow][boardCol] = currentPiece.type;
          }
        });
      });
    }
    return nextBoard;
  }, [board, currentPiece]);

  const nextMatrix = SHAPES[nextType].matrix;
  const heldMatrix = heldType ? SHAPES[heldType].matrix : null;

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-8 ${isLofi ? 'border-[#e8dfd5]/80 bg-[#fff9f0] shadow-[0_32px_90px_rgba(83,62,44,0.12)]' : 'border-violet-100 bg-gradient-to-br from-white via-violet-50/82 to-sky-50/76'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[#fff9f0]/92" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4a3a2d 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-violet-200 bg-white/88 text-violet-700'}`}>
              <Sparkles size={14} /> {config.label} stack flow
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-violet-950'}`}>Tetris</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-violet-700'}`}>A cozy block-stacking game inspired by classic Tetris pacing. Pieces now use the modern 7-bag system, so each shuffled bag contains I, J, L, O, S, T, and Z once before refilling for a fairer flow.</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-amber-700' : 'text-violet-600'}`}>{config.note}</p>
          </div>
          <div className={`grid gap-2 rounded-[1.5rem] border p-3 shadow-sm sm:grid-cols-2 xl:grid-cols-5 lg:min-w-[34rem] ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-white/85 bg-white/80'}`}>
            {[
              { label: 'Score', value: score, tone: isLofi ? 'bg-amber-50 text-amber-900' : 'bg-violet-50 text-violet-950' },
              { label: 'Lines', value: lines, tone: isLofi ? 'bg-amber-50 text-amber-900' : 'bg-violet-50 text-violet-950' },
              { label: 'Level', value: currentLevel, tone: isLofi ? 'bg-amber-50 text-amber-900' : 'bg-violet-50 text-violet-950' },
              { label: 'Speed', value: speedLabel, tone: isLofi ? 'bg-amber-50 text-amber-900' : 'bg-violet-50 text-violet-950' },
              { label: 'Best', value: bestScore, tone: isLofi ? 'bg-amber-50 text-amber-900' : 'bg-violet-50 text-violet-950' }
            ].map((stat) => (
              <div key={stat.label} className={`rounded-[1.15rem] px-4 py-3 text-center ${stat.tone}`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'opacity-60' : 'text-violet-500'}`}>{stat.label}</p>
                <p className="mt-2 text-xl font-extrabold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <div className={`relative mx-auto w-full max-w-[22rem] rounded-[2rem] border p-4 shadow-inner sm:max-w-[24rem] sm:p-5 ${isLofi ? 'border-[#e8dfd5] bg-[#fdfaf5]' : 'border-violet-100 bg-[#f6f2ff]'}`}>
              <div className={`mb-4 rounded-[1.4rem] border p-3.5 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-white/75 bg-white/72'}`}>
                <div className={`flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-800' : 'text-violet-500'}`}>
                  <span>Level {currentLevel}</span>
                  <span>{10 - levelProgress} line{levelProgress === 9 ? '' : 's'} to next speed</span>
                </div>
                <div className={`mt-2.5 h-2.5 overflow-hidden rounded-full ${isLofi ? 'bg-amber-100/50' : 'bg-violet-100'}`}>
                  <div className={`h-full rounded-full transition-all ${isLofi ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-violet-500 to-sky-400'}`} style={{ width: `${levelProgress * 10}%` }} />
                </div>
              </div>
              <div className={`grid gap-[4px] rounded-[1.6rem] p-[4px] shadow-sm ${isLofi ? 'bg-[#d8c6b2]/30' : 'bg-[#ece6fb]'}`} style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                {displayBoard.flat().map((cell, index) => (
                  <div
                    key={`tetris-cell-${index + 1}`}
                    className={`aspect-square rounded-[0.45rem] border ${isLofi ? 'border-[#e8dfd5]/70' : 'border-white/70 bg-white/75'}`}
                    style={{ backgroundColor: cell ? (isLofi ? SHAPES[cell].lofiColor : SHAPES[cell].color) : (isLofi ? 'transparent' : '#fbf9ff') }}
                  >
                    {isLofi && cell && (
                      <div className="h-full w-full rounded-[0.35rem] bg-gradient-to-br from-white/35 to-transparent" />
                    )}
                  </div>
                ))}
              </div>

              {gameState !== 'playing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] px-4 text-center backdrop-blur-[6px] bg-white/75">
                  <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800' : 'text-violet-500'}`}>{gameState === 'start' ? 'Ready to stack' : 'Round over'}</p>
                  <h4 className={`mt-3 text-3xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-violet-950'}`}>{gameState === 'start' ? 'Settle the blocks and clear neat rows.' : 'The stack reached the top.'}</h4>
                  <button
                    className={`mt-5 rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-violet-900 hover:bg-violet-800'}`}
                    onClick={startGame}
                    type="button"
                  >
                    {gameState === 'start' ? 'Start Tetris' : 'Play again'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              <button className={`rounded-full border bg-white px-4 py-3 text-sm font-extrabold shadow-sm ${isLofi ? 'border-amber-200 text-amber-900' : 'border-violet-200 text-violet-900'}`} onClick={() => movePiece(0, -1)} type="button"><ArrowLeft size={16} className="mr-2 inline" />Left</button>
              <button className={`rounded-full border bg-white px-4 py-3 text-sm font-extrabold shadow-sm ${isLofi ? 'border-amber-200 text-amber-900' : 'border-violet-200 text-violet-900'}`} onClick={rotatePiece} type="button"><RotateCcw size={16} className="mr-2 inline" />Rotate</button>
              <button className={`rounded-full border bg-white px-4 py-3 text-sm font-extrabold shadow-sm ${isLofi ? 'border-amber-200 text-amber-900' : 'border-violet-200 text-violet-900'}`} onClick={() => movePiece(1, 0)} type="button"><ArrowDown size={16} className="mr-2 inline" />Down</button>
              <button className={`rounded-full px-4 py-3 text-sm font-extrabold shadow-sm ${holdUsed ? (isLofi ? 'bg-amber-100 text-amber-400' : 'bg-violet-100 text-violet-400') : (isLofi ? 'border border-amber-200 bg-white text-amber-900' : 'border border-violet-200 bg-white text-violet-900')}`} onClick={holdPiece} type="button">Hold</button>
              <button className={`rounded-full px-4 py-3 text-sm font-extrabold text-white shadow-sm ${isLofi ? 'bg-[#4a3a2d]' : 'bg-violet-900'}`} onClick={hardDrop} type="button">Drop</button>
            </div>
          </div>

          <div className="space-y-4 text-center xl:text-left">
            <div className={`rounded-[1.5rem] border p-4 shadow-sm ${isLofi ? 'border-[#e8dfd5]/80 bg-white/72 backdrop-blur-sm' : 'border-white/80 bg-white/88'}`}>
              <div className="flex items-center justify-between gap-3">
                <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800' : 'text-violet-500'}`}>Hold block</p>
                <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${holdUsed ? (isLofi ? 'bg-amber-100 text-amber-400' : 'bg-violet-100 text-violet-400') : (isLofi ? 'bg-amber-800 text-white' : 'bg-violet-900 text-white')}`}>{holdUsed ? 'Used' : 'Ready'}</span>
              </div>
              <button
                className={`mt-4 inline-grid gap-1 rounded-[1.1rem] p-3 text-left ${isLofi ? 'bg-[#faedcd]/65' : 'bg-violet-50'}`}
                onClick={holdPiece}
                style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
                type="button"
              >
                {Array.from({ length: 16 }, (_, index) => {
                  const row = Math.floor(index / 4);
                  const col = index % 4;
                  const hasBlock = heldMatrix?.[row]?.[col];
                  return (
                    <div
                      key={`held-block-${index + 1}`}
                      className={`h-6 w-6 rounded-[0.45rem] border ${isLofi ? 'border-[#e8dfd5]/70' : 'border-white/70 sm:h-7 sm:w-7'}`}
                      style={{ backgroundColor: hasBlock ? (isLofi ? SHAPES[heldType].lofiColor : SHAPES[heldType].color) : (isLofi ? 'transparent' : '#ffffff') }}
                    />
                  );
                })}
              </button>
              <p className={`mt-3 text-xs font-semibold ${isLofi ? 'text-amber-800/70' : 'text-violet-600'}`}>Press C or Shift to store/swap once per falling piece.</p>
            </div>
            <div className={`rounded-[1.5rem] border p-4 shadow-sm ${isLofi ? 'border-[#e8dfd5]/80 bg-white/72 backdrop-blur-sm' : 'border-white/80 bg-white/88'}`}>
              <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800' : 'text-violet-500'}`}>Next block</p>
              <div className={`mt-4 inline-grid gap-1 rounded-[1.1rem] p-3 ${isLofi ? 'bg-[#faedcd]/65' : 'bg-violet-50'}`} style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                {Array.from({ length: 16 }, (_, index) => {
                  const row = Math.floor(index / 4);
                  const col = index % 4;
                  const hasBlock = nextMatrix[row]?.[col];
                  return (
                    <div
                      key={`next-block-${index + 1}`}
                      className={`h-6 w-6 rounded-[0.45rem] border ${isLofi ? 'border-[#e8dfd5]/70' : 'border-white/70 sm:h-7 sm:w-7'}`}
                      style={{ backgroundColor: hasBlock ? (isLofi ? SHAPES[nextType].lofiColor : SHAPES[nextType].color) : (isLofi ? 'transparent' : '#ffffff') }}
                    />
                  );
                })}
              </div>
            </div>
            <div className={`rounded-[1.5rem] border p-4 shadow-sm ${isLofi ? 'border-[#e8dfd5]/80 bg-white/72 backdrop-blur-sm' : 'border-white/80 bg-white/88'}`}>
              <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${isLofi ? 'text-amber-800' : 'text-violet-500'}`}>Controls</p>
              <ul className={`mt-3 space-y-2 text-sm leading-6 ${isLofi ? 'text-[#6e5a4a]' : 'text-violet-700'}`}>
                <li>- Left / right to slide</li>
                <li>- Up to rotate</li>
                <li>- Down to soft drop</li>
                <li>- C / Shift to hold or swap</li>
                <li>- Space to hard drop</li>
              </ul>
            </div>
            <button className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'border border-amber-200 text-amber-900' : 'text-violet-900'}`} onClick={startGame} type="button">
              <RotateCcw size={16} /> Reset stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
