import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Play, RotateCcw, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    cellCount: 14,
    speedMs: 190,
    label: 'Easy',
    note: 'Slower turns and a roomier board for an easier warm-up.'
  },
  medium: {
    cellCount: 16,
    speedMs: 135,
    label: 'Medium',
    note: 'A steadier classic snake pace with enough pressure to stay focused.'
  },
  hard: {
    cellCount: 18,
    speedMs: 96,
    label: 'Hard',
    note: 'Sharper turns and a faster rhythm for a more intense run.'
  }
};

const directionMap = {
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 },
};

function createInitialSnake(cellCount) {
  const center = Math.floor(cellCount / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center }
  ];
}

function getRandomFood(cellCount, snake) {
  const occupied = new Set(snake.map((segment) => `${segment.x}-${segment.y}`));
  const openCells = [];

  for (let y = 0; y < cellCount; y += 1) {
    for (let x = 0; x < cellCount; x += 1) {
      const key = `${x}-${y}`;
      if (!occupied.has(key)) {
        openCells.push({ x, y });
      }
    }
  }

  return openCells[Math.floor(Math.random() * openCells.length)] || { x: 0, y: 0 };
}

function isReverseDirection(current, next) {
  return current.x + next.x === 0 && current.y + next.y === 0;
}

export default function QuietSnake({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-quiet-snake-best-${difficulty}`;

  const [snake, setSnake] = useState(() => createInitialSnake(config.cellCount));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(() => getRandomFood(config.cellCount, createInitialSnake(config.cellCount)));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  const resetGame = useCallback((nextState = 'start') => {
    const initialSnake = createInitialSnake(config.cellCount);
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setFood(getRandomFood(config.cellCount, initialSnake));
    setScore(0);
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
    setGameState(nextState);
  }, [bestScoreKey, config.cellCount]);

  useEffect(() => {
    resetGame('start');
  }, [resetGame]);

  const turnSnake = useCallback((next) => {
    setNextDirection((current) => {
      const activeDirection = gameState === 'playing' ? direction : current;
      if (isReverseDirection(activeDirection, next)) {
        return current;
      }
      return next;
    });
  }, [direction, gameState]);

  const startGame = useCallback(() => {
    resetGame('playing');
  }, [resetGame]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const next = directionMap[event.code];
      if (!next) {
        return;
      }

      event.preventDefault();
      if (gameState === 'start' || gameState === 'over') {
        startGame();
        return;
      }

      turnSnake(next);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, turnSnake]);

  useEffect(() => {
    if (gameState !== 'playing') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setDirection((currentDirection) => {
        const activeDirection = isReverseDirection(currentDirection, nextDirection) ? currentDirection : nextDirection;

        setSnake((currentSnake) => {
          const head = currentSnake[0];
          const nextHead = {
            x: (head.x + activeDirection.x + config.cellCount) % config.cellCount,
            y: (head.y + activeDirection.y + config.cellCount) % config.cellCount,
          };
          const didEat = nextHead.x === food.x && nextHead.y === food.y;
          const hitSelf = currentSnake.some((segment, index) => {
            if (!didEat && index === currentSnake.length - 1) {
              return false;
            }
            return segment.x === nextHead.x && segment.y === nextHead.y;
          });

          if (hitSelf) {
            setGameState('over');
            return currentSnake;
          }

          const nextSnake = [nextHead, ...currentSnake];

          if (!didEat) {
            nextSnake.pop();
          } else {
            setScore((previous) => {
              const nextScore = previous + 1;
              const storedBest = parseInt(localStorage.getItem(bestScoreKey) || '0', 10);
              if (nextScore > storedBest) {
                localStorage.setItem(bestScoreKey, String(nextScore));
                setBestScore(nextScore);
              }
              return nextScore;
            });
            setFood(getRandomFood(config.cellCount, nextSnake));
          }

          return nextSnake;
        });

        return activeDirection;
      });
    }, config.speedMs);

    return () => window.clearInterval(intervalId);
  }, [bestScoreKey, config.cellCount, config.speedMs, food, nextDirection, gameState]);

  const cells = useMemo(() => Array.from({ length: config.cellCount * config.cellCount }, (_, index) => {
    const x = index % config.cellCount;
    const y = Math.floor(index / config.cellCount);
    const key = `${x}-${y}`;
    const head = snake[0];
    const isHead = head?.x === x && head?.y === y;
    const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    return { key, isFood, isHead, isSnake };
  }), [config.cellCount, food, snake]);

  const cellClass = config.cellCount >= 18 ? 'h-4 w-4 sm:h-5 sm:w-5' : config.cellCount >= 16 ? 'h-[1.125rem] w-[1.125rem] sm:h-[1.375rem] sm:w-[1.375rem]' : 'h-5 w-5 sm:h-6 sm:w-6';

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/82 to-lime-50/72 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
              <Sparkles size={14} /> {config.label} snake flow
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-emerald-950">Quiet Snake</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-emerald-800">A classic snake run with a cleaner retro board, wrap-around edges, and quick arcade rounds when you want something simple and sharp.</p>
            <p className="mt-2 text-sm font-semibold text-emerald-700">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[21rem]">
            <div className="rounded-[1.15rem] bg-emerald-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-500">Score</p>
              <p className="mt-2 text-xl font-extrabold text-emerald-950">{score}</p>
            </div>
            <div className="rounded-[1.15rem] bg-emerald-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-500">Best</p>
              <p className="mt-2 text-xl font-extrabold text-emerald-950">{bestScore}</p>
            </div>
            <div className="rounded-[1.15rem] bg-emerald-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-500">Board</p>
              <p className="mt-2 text-xl font-extrabold text-emerald-950">{config.cellCount}×{config.cellCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <div className="relative mx-auto w-full max-w-[26rem] border-[10px] border-[#5f7754] bg-[#9abf88] p-4 shadow-[inset_0_0_0_2px_rgba(20,20,20,0.08)] sm:p-5">
              <div className="grid bg-[#9abf88]" style={{ gridTemplateColumns: `repeat(${config.cellCount}, minmax(0, 1fr))` }}>
                {cells.map((cell) => (
                  <div
                    key={cell.key}
                    className={`relative ${cellClass} ${cell.isSnake ? 'bg-[#111111]' : 'bg-transparent'}`}
                  >
                    {cell.isFood ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-3 w-3 sm:h-3.5 sm:w-3.5">
                          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#111111]" />
                          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#111111]" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {gameState !== 'playing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#9abf88]/86 p-4 backdrop-blur-[1px]">
                  <div className="max-w-sm border-4 border-[#111111] bg-[#cfe0bc] px-5 py-5 text-center shadow-[8px_8px_0_rgba(17,17,17,0.14)]">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#30412a]">{gameState === 'over' ? 'Run over' : 'Ready to glide'}</p>
                    <h4 className="mt-3 text-3xl font-extrabold text-[#111111]">{gameState === 'over' ? 'You clipped the trail' : 'Start a retro snake round'}</h4>
                    <p className="mt-3 text-sm leading-7 text-[#30412a]">{gameState === 'over' ? 'Loop again and keep the line clean for a longer run.' : 'Use the arrow keys or touch controls to chase the fruit and wrap through the board edges.'}</p>
                    <button
                      className="mt-5 inline-flex items-center gap-2 border-2 border-[#111111] bg-[#111111] px-5 py-3 text-sm font-extrabold text-[#f3f6ea] shadow-[4px_4px_0_rgba(17,17,17,0.16)] transition hover:-translate-y-0.5"
                      onClick={startGame}
                      type="button"
                    >
                      {gameState === 'over' ? <RotateCcw size={16} /> : <Play size={16} />} {gameState === 'over' ? 'Play again' : 'Start run'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <button className="rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-sm" onClick={() => turnSnake({ x: 0, y: -1 })} type="button"><ArrowUp size={16} className="mr-2 inline" />Up</button>
              <button className="rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-sm" onClick={() => turnSnake({ x: -1, y: 0 })} type="button"><ArrowLeft size={16} className="mr-2 inline" />Left</button>
              <button className="rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-sm" onClick={() => turnSnake({ x: 1, y: 0 })} type="button"><ArrowRight size={16} className="mr-2 inline" />Right</button>
              <button className="rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-sm" onClick={() => turnSnake({ x: 0, y: 1 })} type="button"><ArrowDown size={16} className="mr-2 inline" />Down</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-4 shadow-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-600">How it plays</p>
              <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-emerald-800">
                <li>- Steer into the fruit to grow the line.</li>
                <li>- Slip through one edge and reappear on the opposite side.</li>
                <li>- Only your own body ends the run, so keep the trail tidy.</li>
              </ul>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-sm transition hover:-translate-y-0.5"
              onClick={() => resetGame('start')}
              type="button"
            >
              <RotateCcw size={16} /> Reset board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
