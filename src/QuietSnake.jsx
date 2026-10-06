import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Play, RotateCcw, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    cellCount: 14,
    speedMs: 150,
    label: 'Easy',
    note: 'Slower turns and a roomier board for an easier warm-up.'
  },
  medium: {
    cellCount: 16,
    speedMs: 105,
    label: 'Medium',
    note: 'A steadier classic snake pace with enough pressure to stay focused.'
  },
  hard: {
    cellCount: 18,
    speedMs: 78,
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
  const directionRef = useRef({ x: 1, y: 0 });
  const turnQueueRef = useRef([]);
  const [food, setFood] = useState(() => getRandomFood(config.cellCount, createInitialSnake(config.cellCount)));
  const foodRef = useRef(food);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  const resetGame = useCallback((nextState = 'start') => {
    const initialSnake = createInitialSnake(config.cellCount);
    const nextFood = getRandomFood(config.cellCount, initialSnake);
    setSnake(initialSnake);
    directionRef.current = { x: 1, y: 0 };
    turnQueueRef.current = [];
    foodRef.current = nextFood;
    setFood(nextFood);
    setScore(0);
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
    setGameState(nextState);
  }, [bestScoreKey, config.cellCount]);

  useEffect(() => {
    resetGame('start');
  }, [resetGame]);

  const queueTurn = useCallback((next) => {
    const queuedTurns = turnQueueRef.current;
    const lastDirection = queuedTurns[queuedTurns.length - 1] || directionRef.current;

    if (
      queuedTurns.length >= 3
      || (lastDirection.x === next.x && lastDirection.y === next.y)
      || isReverseDirection(lastDirection, next)
    ) {
      return;
    }

    turnQueueRef.current = [...queuedTurns, next];
  }, []);

  const startGame = useCallback((openingDirection = null) => {
    const validOpeningDirection = openingDirection && Number.isFinite(openingDirection.x) && Number.isFinite(openingDirection.y) ? openingDirection : null;
    resetGame('playing');
    if (validOpeningDirection && !isReverseDirection({ x: 1, y: 0 }, validOpeningDirection)) {
      turnQueueRef.current = [validOpeningDirection];
    }
  }, [resetGame]);

  const requestTurn = useCallback((next) => {
    if (gameState === 'start' || gameState === 'over') {
      startGame(next);
      return;
    }
    queueTurn(next);
  }, [gameState, queueTurn, startGame]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const next = directionMap[event.code];
      if (!next) {
        return;
      }

      event.preventDefault();
      requestTurn(next);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestTurn]);

  useEffect(() => {
    if (gameState !== 'playing') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const queuedDirection = turnQueueRef.current[0];
      let activeDirection = directionRef.current;

      if (queuedDirection) {
        turnQueueRef.current = turnQueueRef.current.slice(1);
        if (!isReverseDirection(activeDirection, queuedDirection)) {
          activeDirection = queuedDirection;
        }
      }

      directionRef.current = activeDirection;

      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const nextHead = {
          x: (head.x + activeDirection.x + config.cellCount) % config.cellCount,
          y: (head.y + activeDirection.y + config.cellCount) % config.cellCount,
        };
        const currentFood = foodRef.current;
        const didEat = nextHead.x === currentFood.x && nextHead.y === currentFood.y;
        const hitSelf = currentSnake.some((segment, index) => {
          if (!didEat && index === currentSnake.length - 1) {
            return false;
          }
          return segment.x === nextHead.x && segment.y === nextHead.y;
        });

        if (hitSelf) {
          setGameState('over');
          turnQueueRef.current = [];
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
          const nextFood = getRandomFood(config.cellCount, nextSnake);
          foodRef.current = nextFood;
          setFood(nextFood);
        }

        return nextSnake;
      });
    }, config.speedMs);

    return () => window.clearInterval(intervalId);
  }, [bestScoreKey, config.cellCount, config.speedMs, gameState]);

  const snakeCellSet = useMemo(() => new Set(snake.map((segment) => `${segment.x}-${segment.y}`)), [snake]);

  const cells = useMemo(() => Array.from({ length: config.cellCount * config.cellCount }, (_, index) => {
    const x = index % config.cellCount;
    const y = Math.floor(index / config.cellCount);
    const key = `${x}-${y}`;
    const head = snake[0];
    const isHead = head?.x === x && head?.y === y;
    const isSnake = snakeCellSet.has(key);
    const isFood = food.x === x && food.y === y;
    return { key, isFood, isHead, isSnake };
  }), [config.cellCount, food, snake, snakeCellSet]);

  const cellClass = config.cellCount >= 18 ? 'h-4 w-4 sm:h-5 sm:w-5' : config.cellCount >= 16 ? 'h-[1.125rem] w-[1.125rem] sm:h-[1.375rem] sm:w-[1.375rem]' : 'h-5 w-5 sm:h-6 sm:w-6';

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[1.1rem] border-[4px] border-[#111111] bg-[#c8d8b6] p-5 shadow-[10px_10px_0_rgba(17,17,17,0.12)] lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#111111] px-3 py-1.5 font-mono text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f3f6ea] shadow-[4px_4px_0_rgba(17,17,17,0.14)]">
              <Sparkles size={14} /> {config.label} snake flow
            </div>
            <h3 className="mt-4 font-mono text-3xl font-bold tracking-tight text-[#111111]">Quiet Snake</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#30412a]">A classic snake run with a cleaner retro board, wrap-around edges, and quick arcade rounds when you want something simple and sharp.</p>
            <p className="mt-2 text-sm font-semibold text-[#466038]">{config.note}</p>
          </div>
          <div className="grid gap-2 border-4 border-[#111111] bg-[#dfe9cf] p-3 shadow-[6px_6px_0_rgba(17,17,17,0.12)] sm:grid-cols-3 lg:min-w-[21rem]">
            <div className="border-2 border-[#111111] bg-[#9abf88] px-4 py-3 text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#22311d]">Score</p>
              <p className="mt-2 font-mono text-2xl font-extrabold text-[#111111]">{score}</p>
            </div>
            <div className="border-2 border-[#111111] bg-[#9abf88] px-4 py-3 text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#22311d]">Best</p>
              <p className="mt-2 font-mono text-2xl font-extrabold text-[#111111]">{bestScore}</p>
            </div>
            <div className="border-2 border-[#111111] bg-[#9abf88] px-4 py-3 text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#22311d]">Board</p>
              <p className="mt-2 font-mono text-2xl font-extrabold text-[#111111]">{config.cellCount}×{config.cellCount}</p>
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
                      onClick={() => startGame()}
                      type="button"
                    >
                      {gameState === 'over' ? <RotateCcw size={16} /> : <Play size={16} />} {gameState === 'over' ? 'Play again' : 'Start run'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <button className="border-2 border-[#111111] bg-[#dfe9cf] px-4 py-3 text-sm font-extrabold text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5" onClick={() => requestTurn({ x: 0, y: -1 })} type="button"><ArrowUp size={16} className="mr-2 inline" />Up</button>
              <button className="border-2 border-[#111111] bg-[#dfe9cf] px-4 py-3 text-sm font-extrabold text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5" onClick={() => requestTurn({ x: -1, y: 0 })} type="button"><ArrowLeft size={16} className="mr-2 inline" />Left</button>
              <button className="border-2 border-[#111111] bg-[#dfe9cf] px-4 py-3 text-sm font-extrabold text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5" onClick={() => requestTurn({ x: 1, y: 0 })} type="button"><ArrowRight size={16} className="mr-2 inline" />Right</button>
              <button className="border-2 border-[#111111] bg-[#dfe9cf] px-4 py-3 text-sm font-extrabold text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5" onClick={() => requestTurn({ x: 0, y: 1 })} type="button"><ArrowDown size={16} className="mr-2 inline" />Down</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-4 border-[#111111] bg-[#dfe9cf] p-4 shadow-[6px_6px_0_rgba(17,17,17,0.12)]">
              <p className="font-mono text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#30412a]">How it plays</p>
              <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-[#30412a]">
                <li>- Steer into the fruit to grow the line.</li>
                <li>- Slip through one edge and reappear on the opposite side.</li>
                <li>- Only your own body ends the run, so keep the trail tidy.</li>
              </ul>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-[#111111] bg-[#111111] px-4 py-3 text-sm font-extrabold text-[#f3f6ea] shadow-[4px_4px_0_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5"
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
