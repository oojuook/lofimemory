import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

const ROWS = 20;
const COLS = 10;

const SHAPES = {
  I: {
    color: '#67d7f7',
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  O: {
    color: '#f5cb55',
    matrix: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    color: '#b48cff',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  S: {
    color: '#73d38e',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  Z: {
    color: '#f48aa4',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  },
  J: {
    color: '#7aa0ff',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  L: {
    color: '#ffb45f',
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
    dropMs: 880,
    note: 'A slower stack rate so it is easier to settle into the board.'
  },
  medium: {
    label: 'Medium',
    dropMs: 620,
    note: 'A classic pace with enough pressure to stay satisfying.'
  },
  hard: {
    label: 'Hard',
    dropMs: 420,
    note: 'Faster falling pieces so every decision matters more.'
  }
};

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

function pickRandomType(previousType = '') {
  const choices = pieceTypes.filter((type) => type !== previousType);
  return choices[Math.floor(Math.random() * choices.length)] || pieceTypes[0];
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

function getLineScore(linesCleared) {
  if (linesCleared === 1) return 100;
  if (linesCleared === 2) return 300;
  if (linesCleared === 3) return 500;
  if (linesCleared >= 4) return 800;
  return 0;
}

export default function QuietTetris({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-tetris-best-${difficulty}`;

  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(() => createPiece(pickRandomType()));
  const [nextType, setNextType] = useState(() => pickRandomType());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  useEffect(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(createPiece(pickRandomType()));
    setNextType(pickRandomType());
    setScore(0);
    setLines(0);
    setGameState('start');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [bestScoreKey]);

  const startGame = () => {
    const firstType = pickRandomType();
    const upcoming = pickRandomType(firstType);
    setBoard(createEmptyBoard());
    setCurrentPiece(createPiece(firstType));
    setNextType(upcoming);
    setScore(0);
    setLines(0);
    setGameState('playing');
  };

  const lockCurrentPiece = (pieceToLock = currentPiece) => {
    const mergedBoard = mergePiece(board, pieceToLock);
    const { board: clearedBoard, linesCleared } = clearCompletedLines(mergedBoard);
    const nextScore = score + getLineScore(linesCleared);
    const nextLines = lines + linesCleared;
    const spawnedPiece = createPiece(nextType);
    const upcomingType = pickRandomType(nextType);

    setBoard(clearedBoard);
    setScore(nextScore);
    setLines(nextLines);
    setNextType(upcomingType);

    if (hasCollision(clearedBoard, spawnedPiece, spawnedPiece.row, spawnedPiece.col, spawnedPiece.matrix)) {
      setCurrentPiece(spawnedPiece);
      setGameState('over');
      return;
    }

    setCurrentPiece(spawnedPiece);
  };

  const movePiece = (rowDelta, colDelta) => {
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
  };

  const rotatePiece = () => {
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
  };

  const hardDrop = () => {
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
  };

  useEffect(() => {
    if (gameState !== 'playing') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      movePiece(1, 0);
    }, config.dropMs);

    return () => window.clearInterval(timer);
  }, [board, config.dropMs, currentPiece, gameState, nextType, score, lines]);

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
      } else if (event.code === 'Space') {
        event.preventDefault();
        hardDrop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, currentPiece, gameState, nextType, score, lines]);

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

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50/82 to-sky-50/76 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-violet-700 shadow-sm">
              <Sparkles size={14} /> {config.label} stack flow
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-violet-950">Quiet Tetris</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-violet-700">A cozy block-stacking game for people who want something more arcadey without losing the calm visual feel. The difficulty changes the falling speed, so easy, medium, and hard genuinely play differently.</p>
            <p className="mt-2 text-sm font-semibold text-violet-600">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[31rem]">
            <div className="rounded-[1.15rem] bg-violet-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-500">Score</p>
              <p className="mt-2 text-xl font-extrabold text-violet-950">{score}</p>
            </div>
            <div className="rounded-[1.15rem] bg-violet-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-500">Lines</p>
              <p className="mt-2 text-xl font-extrabold text-violet-950">{lines}</p>
            </div>
            <div className="rounded-[1.15rem] bg-violet-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-violet-950">{bestScore}</p>
            </div>
            <div className="rounded-[1.15rem] bg-violet-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-500">Drop</p>
              <p className="mt-2 text-xl font-extrabold text-violet-950">{config.dropMs}ms</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
          <div>
            <div className="relative rounded-[1.8rem] border border-violet-100 bg-[#f6f2ff] p-3 shadow-inner sm:p-4">
              <div className="grid gap-[3px] rounded-[1.2rem] bg-[#ece6fb] p-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                {displayBoard.flat().map((cell, index) => (
                  <div
                    key={`tetris-cell-${index + 1}`}
                    className="aspect-square rounded-[0.35rem] border border-white/70 bg-white/75"
                    style={{ backgroundColor: cell ? SHAPES[cell].color : '#fbf9ff' }}
                  />
                ))}
              </div>

              {gameState !== 'playing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.8rem] bg-white/78 px-4 text-center backdrop-blur-[3px]">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-violet-500">{gameState === 'start' ? 'Ready to stack' : 'Round over'}</p>
                  <h4 className="mt-3 text-3xl font-extrabold text-violet-950">{gameState === 'start' ? 'Settle the blocks and clear neat rows.' : 'The stack reached the top.'}</h4>
                  <button
                    className="mt-5 rounded-full bg-violet-900 px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-800"
                    onClick={startGame}
                    type="button"
                  >
                    {gameState === 'start' ? 'Start Quiet Tetris' : 'Play again'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <button className="rounded-full border border-violet-200 bg-white px-4 py-3 text-sm font-extrabold text-violet-900 shadow-sm" onClick={() => movePiece(0, -1)} type="button"><ArrowLeft size={16} className="mr-2 inline" />Left</button>
              <button className="rounded-full border border-violet-200 bg-white px-4 py-3 text-sm font-extrabold text-violet-900 shadow-sm" onClick={rotatePiece} type="button"><RotateCcw size={16} className="mr-2 inline" />Rotate</button>
              <button className="rounded-full border border-violet-200 bg-white px-4 py-3 text-sm font-extrabold text-violet-900 shadow-sm" onClick={() => movePiece(1, 0)} type="button"><ArrowDown size={16} className="mr-2 inline" />Down</button>
              <button className="rounded-full bg-violet-900 px-4 py-3 text-sm font-extrabold text-white shadow-sm" onClick={hardDrop} type="button">Drop</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-white/80 bg-white/88 p-4 shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-violet-500">Next block</p>
              <div className="mt-4 inline-grid gap-1 rounded-[1.1rem] bg-violet-50 p-3" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                {Array.from({ length: 16 }, (_, index) => {
                  const row = Math.floor(index / 4);
                  const col = index % 4;
                  const hasBlock = nextMatrix[row]?.[col];
                  return (
                    <div
                      key={`next-block-${index + 1}`}
                      className="h-7 w-7 rounded-[0.45rem] border border-white/70"
                      style={{ backgroundColor: hasBlock ? SHAPES[nextType].color : '#ffffff' }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/80 bg-white/88 p-4 shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-violet-500">Controls</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-violet-700">
                <li>- Left / right to slide</li>
                <li>- Up to rotate</li>
                <li>- Down to soft drop</li>
                <li>- Space to hard drop</li>
              </ul>
            </div>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-violet-900 shadow-sm transition hover:-translate-y-0.5" onClick={startGame} type="button">
              <RotateCcw size={16} /> Reset stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
