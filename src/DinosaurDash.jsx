import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 260;
const GROUND_LINE_Y = 206;
const DINO_X = 72;
const DINO_STAND_WIDTH = 44;
const DINO_STAND_HEIGHT = 48;
const DINO_DUCK_WIDTH = 58;
const DINO_DUCK_HEIGHT = 30;

const difficultySettings = {
  easy: {
    gravity: 0.68,
    jumpVelocity: -13.2,
    startSpeed: 7.2,
    maxSpeed: 11.2,
    acceleration: 0.0026,
    spawnMin: 350,
    spawnMax: 500,
    fallBoost: 0.16,
    label: 'Easy',
    note: 'Closer to the original runner, with very generous cactus spacing for easier reading.'
  },
  medium: {
    gravity: 0.72,
    jumpVelocity: -13.7,
    startSpeed: 8.2,
    maxSpeed: 13.2,
    acceleration: 0.0031,
    spawnMin: 310,
    spawnMax: 450,
    fallBoost: 0.22,
    label: 'Medium',
    note: 'The closest match to the classic Chrome runner feel, with cleaner and fairer spacing between obstacles.'
  },
  hard: {
    gravity: 0.78,
    jumpVelocity: -14.1,
    startSpeed: 9.2,
    maxSpeed: 15.3,
    acceleration: 0.0039,
    spawnMin: 265,
    spawnMax: 380,
    fallBoost: 0.3,
    label: 'Hard',
    note: 'Faster ground and a more demanding rhythm, but still spaced enough to stay playable.'
  }
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getGroundTop(ducking = false) {
  return GROUND_LINE_Y - (ducking ? DINO_DUCK_HEIGHT : DINO_STAND_HEIGHT);
}

function buildInitialState(startSpeed) {
  return {
    dinoY: getGroundTop(false),
    velocityY: 0,
    ducking: false,
    speed: startSpeed,
    frames: 0,
    distance: 0,
    score: 0,
    obstacleCooldown: 260,
    obstacles: [],
    groundOffset: 0,
    clouds: [
      { x: 210, y: 62, width: 46 },
      { x: 540, y: 46, width: 32 },
      { x: 790, y: 78, width: 42 }
    ]
  };
}

function getScoreDisplay(score) {
  return String(score).padStart(5, '0');
}

function createObstacle(score) {
  const cactusChoices = [
    { type: 'small-cactus', width: 18, height: 38, y: GROUND_LINE_Y - 38 },
    { type: 'large-cactus', width: 24, height: 50, y: GROUND_LINE_Y - 50 },
    { type: 'double-cactus', width: 40, height: 40, y: GROUND_LINE_Y - 40 },
    { type: 'triple-cactus', width: 58, height: 42, y: GROUND_LINE_Y - 42 }
  ];

  const birdHeights = [GROUND_LINE_Y - 54, GROUND_LINE_Y - 64];
  const allowBird = score >= 220 && Math.random() > 0.82;

  if (allowBird) {
    return {
      type: 'ptero',
      width: 46,
      height: 32,
      y: birdHeights[Math.floor(Math.random() * birdHeights.length)],
      x: CANVAS_WIDTH + 36,
      flapFrame: 0,
      passed: false
    };
  }

  const template = cactusChoices[Math.floor(Math.random() * cactusChoices.length)];
  return {
    ...template,
    x: CANVAS_WIDTH + 36,
    passed: false
  };
}

function intersects(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function getDinoHitbox(state) {
  if (state.ducking && state.velocityY === 0) {
    return {
      left: DINO_X + 4,
      right: DINO_X + DINO_DUCK_WIDTH - 6,
      top: state.dinoY + 6,
      bottom: state.dinoY + DINO_DUCK_HEIGHT - 2
    };
  }

  return {
    left: DINO_X + 6,
    right: DINO_X + DINO_STAND_WIDTH - 5,
    top: state.dinoY + 4,
    bottom: state.dinoY + DINO_STAND_HEIGHT - 2
  };
}

function getObstacleHitbox(obstacle) {
  if (obstacle.type === 'ptero') {
    return {
      left: obstacle.x + 4,
      right: obstacle.x + obstacle.width - 4,
      top: obstacle.y + 6,
      bottom: obstacle.y + obstacle.height - 5
    };
  }

  return {
    left: obstacle.x + 2,
    right: obstacle.x + obstacle.width - 2,
    top: obstacle.y + 2,
    bottom: obstacle.y + obstacle.height
  };
}

export default function DinosaurDash({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-dinosaur-dash-best-${difficulty}`;

  const canvasRef = useRef(null);
  const stateRef = useRef(buildInitialState(config.startSpeed));
  const gameStateRef = useRef('start');
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const lastRenderedScoreRef = useRef(0);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => bestScoreRef.current);
  const [gameState, setGameState] = useState('start');

  const resetToStart = useCallback(() => {
    stateRef.current = buildInitialState(config.startSpeed);
    gameStateRef.current = 'start';
    setGameState('start');
    const storedBest = parseInt(localStorage.getItem(bestScoreKey) || '0', 10);
    scoreRef.current = 0;
    lastRenderedScoreRef.current = 0;
    bestScoreRef.current = storedBest;
    setScore(0);
    setBestScore(storedBest);
  }, [bestScoreKey, config.startSpeed]);

  useEffect(() => {
    resetToStart();
  }, [resetToStart]);

  const startGame = useCallback((withJump = false) => {
    const freshState = buildInitialState(config.startSpeed);
    if (withJump) {
      freshState.velocityY = config.jumpVelocity;
    }
    stateRef.current = freshState;
    gameStateRef.current = 'playing';
    scoreRef.current = 0;
    lastRenderedScoreRef.current = 0;
    setGameState('playing');
    setScore(0);
  }, [config.jumpVelocity, config.startSpeed]);

  const jump = useCallback(() => {
    const state = stateRef.current;

    if (gameStateRef.current === 'start' || gameStateRef.current === 'over') {
      startGame(true);
      return;
    }

    const isGrounded = state.velocityY === 0 && state.dinoY >= getGroundTop(state.ducking) - 1;
    if (!isGrounded) {
      return;
    }

    state.ducking = false;
    state.dinoY = getGroundTop(false);
    state.velocityY = config.jumpVelocity;
  }, [config.jumpVelocity, startGame]);

  const setDuck = useCallback((shouldDuck) => {
    const state = stateRef.current;
    if (gameStateRef.current !== 'playing') {
      return;
    }

    if (shouldDuck) {
      if (state.velocityY === 0) {
        state.ducking = true;
        state.dinoY = getGroundTop(true);
      } else if (state.velocityY > 0) {
        state.ducking = true;
        state.velocityY += config.fallBoost;
      }
      return;
    }

    if (state.velocityY === 0) {
      state.ducking = false;
      state.dinoY = getGroundTop(false);
    } else {
      state.ducking = false;
    }
  }, [config.fallBoost]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) {
        return;
      }

      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        jump();
      }

      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        event.preventDefault();
        setDuck(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        event.preventDefault();
        setDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, setDuck]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let animationId;
    const inkColor = isLofi ? '#6c584c' : '#535353';
    const cloudColor = isLofi ? '#c4b3a5' : '#535353';
    const eyeColor = isLofi ? '#fffaf4' : '#f7f7f7';
    const scoreColor = isLofi ? '#4a3a2d' : '#4f4f4f';
    const skyTop = isLofi ? '#fffaf3' : '#efefef';
    const skyBottom = isLofi ? '#f4dfc8' : '#efefef';
    const groundColor = isLofi ? '#8b6b52' : '#535353';

    const drawCloud = (x, y, width) => {
      ctx.fillStyle = cloudColor;
      ctx.fillRect(x, y + 12, width, 3);
      ctx.fillRect(x + 6, y + 6, width - 12, 3);
      ctx.fillRect(x + 12, y, width - 24, 3);
      ctx.fillRect(x + 18, y + 18, width - 30, 3);
    };

    const drawGround = (offset) => {
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, GROUND_LINE_Y, CANVAS_WIDTH, 2);

      for (let x = -offset; x < CANVAS_WIDTH + 60; x += 32) {
        ctx.fillRect(x, GROUND_LINE_Y + 12, 14, 2);
        ctx.fillRect(x + 20, GROUND_LINE_Y + 16, 10, 2);
        ctx.fillRect(x + 6, GROUND_LINE_Y + 20, 5, 2);
      }
    };

    const drawStandingDino = (x, y, frame) => {
      const stepFrame = Math.floor(frame / 6) % 2;
      ctx.fillStyle = inkColor;
      ctx.fillRect(x + 10, y, 20, 18);
      ctx.fillRect(x + 4, y + 18, 28, 18);
      ctx.fillRect(x, y + 24, 10, 6);
      ctx.fillRect(x + 30, y + 8, 12, 10);
      ctx.fillRect(x + 34, y + 16, 8, 4);
      ctx.fillRect(x + 14, y - 10, 10, 10);
      ctx.fillRect(x + 8, y + 22, 6, 8);
      ctx.fillRect(x + 12, y + 34, 6, 14);
      ctx.fillRect(x + 26, y + 34, 6, 14);
      ctx.fillRect(x + 20, y + 20, 4, 8);
      ctx.fillStyle = eyeColor;
      ctx.fillRect(x + 26, y + 6, 4, 4);
      ctx.fillStyle = inkColor;
      if (stepFrame === 0) {
        ctx.fillRect(x + 12, y + 44, 10, 4);
        ctx.fillRect(x + 26, y + 40, 10, 4);
      } else {
        ctx.fillRect(x + 12, y + 40, 10, 4);
        ctx.fillRect(x + 26, y + 44, 10, 4);
      }
    };

    const drawDuckingDino = (x, y, frame) => {
      const stepFrame = Math.floor(frame / 5) % 2;
      ctx.fillStyle = inkColor;
      ctx.fillRect(x + 8, y + 6, 34, 16);
      ctx.fillRect(x + 18, y, 16, 12);
      ctx.fillRect(x + 34, y + 4, 16, 8);
      ctx.fillRect(x, y + 12, 12, 6);
      ctx.fillRect(x + 10, y + 20, 8, 10);
      ctx.fillRect(x + 36, y + 20, 8, 10);
      ctx.fillStyle = eyeColor;
      ctx.fillRect(x + 28, y + 4, 4, 4);
      ctx.fillStyle = inkColor;
      if (stepFrame === 0) {
        ctx.fillRect(x + 8, y + 26, 16, 4);
        ctx.fillRect(x + 30, y + 22, 16, 4);
      } else {
        ctx.fillRect(x + 8, y + 22, 16, 4);
        ctx.fillRect(x + 30, y + 26, 16, 4);
      }
    };

    const drawCactus = (obstacle) => {
      const { x, y, type } = obstacle;
      ctx.fillStyle = inkColor;

      if (type === 'small-cactus') {
        ctx.fillRect(x + 6, y, 8, 38);
        ctx.fillRect(x, y + 14, 6, 10);
        ctx.fillRect(x + 14, y + 10, 6, 12);
        return;
      }

      if (type === 'large-cactus') {
        ctx.fillRect(x + 8, y, 10, 50);
        ctx.fillRect(x, y + 18, 8, 14);
        ctx.fillRect(x + 18, y + 12, 8, 18);
        return;
      }

      if (type === 'double-cactus') {
        ctx.fillRect(x + 4, y + 6, 8, 34);
        ctx.fillRect(x + 18, y, 10, 40);
        ctx.fillRect(x + 30, y + 10, 8, 30);
        return;
      }

      ctx.fillRect(x + 4, y + 10, 8, 32);
      ctx.fillRect(x + 20, y, 10, 42);
      ctx.fillRect(x + 40, y + 8, 10, 34);
    };

    const drawPtero = (obstacle, frame) => {
      const wingFrame = Math.floor(frame / 8) % 2;
      const { x, y } = obstacle;
      ctx.fillStyle = inkColor;
      ctx.fillRect(x + 16, y + 10, 18, 10);
      ctx.fillRect(x + 30, y + 6, 12, 6);
      ctx.fillRect(x + 6, y + 12, 12, 4);
      ctx.fillRect(x + 14, y + 18, 8, 10);
      ctx.fillRect(x + 28, y + 18, 8, 10);
      if (wingFrame === 0) {
        ctx.fillRect(x, y + 8, 16, 4);
        ctx.fillRect(x + 20, y, 16, 4);
      } else {
        ctx.fillRect(x + 2, y + 2, 16, 4);
        ctx.fillRect(x + 18, y + 16, 18, 4);
      }
    };

    const drawScoreboard = (currentScore, highScore) => {
      ctx.fillStyle = scoreColor;
      ctx.font = '700 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DINO DASH', CANVAS_WIDTH / 2, 34);
      ctx.font = '700 18px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`HI ${getScoreDisplay(highScore)} ${getScoreDisplay(currentScore)}`, CANVAS_WIDTH - 28, 30);
      ctx.textAlign = 'left';
    };

    const drawFrame = () => {
      const state = stateRef.current;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (isLofi) {
        const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        skyGradient.addColorStop(0, skyTop);
        skyGradient.addColorStop(1, skyBottom);
        ctx.fillStyle = skyGradient;
      } else {
        ctx.fillStyle = skyTop;
      }
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      state.clouds.forEach((cloud) => {
        if (gameStateRef.current === 'playing') {
          cloud.x -= state.speed * 0.16;
          if (cloud.x < -cloud.width - 20) {
            cloud.x = CANVAS_WIDTH + randomBetween(30, 120);
            cloud.y = randomBetween(30, 84);
            cloud.width = randomBetween(28, 52);
          }
        }
        drawCloud(cloud.x, cloud.y, cloud.width);
      });

      if (gameStateRef.current === 'playing') {
        state.frames += 1;
        state.speed = Math.min(config.maxSpeed, config.startSpeed + state.frames * config.acceleration);
        state.distance += state.speed * 0.12;
        state.groundOffset = (state.groundOffset + state.speed) % 32;

        if (state.velocityY !== 0 || state.dinoY < getGroundTop(state.ducking) - 1) {
          state.velocityY += config.gravity + (state.ducking && state.velocityY > 0 ? config.fallBoost : 0);
          state.dinoY += state.velocityY;
        }

        if (state.ducking && state.velocityY === 0) {
          state.dinoY = getGroundTop(true);
        }

        if (!state.ducking && state.velocityY === 0) {
          state.dinoY = getGroundTop(false);
        }

        if (state.dinoY >= getGroundTop(false)) {
          state.dinoY = state.ducking ? getGroundTop(true) : getGroundTop(false);
          state.velocityY = 0;
        }

        state.obstacleCooldown -= state.speed;
        if (state.obstacleCooldown <= 0) {
          const nextObstacle = createObstacle(state.score);
          state.obstacles.push(nextObstacle);
          const variedGap = randomBetween(config.spawnMin, config.spawnMax)
            + randomBetween(-70, 95)
            + (Math.random() > 0.76 ? randomBetween(95, 185) : 0)
            - (Math.random() > 0.84 ? randomBetween(35, 70) : 0);
          state.obstacleCooldown = Math.max(config.spawnMin * 0.72, variedGap + nextObstacle.width * randomBetween(1.6, 3.4) + Math.min(42, state.score * 0.04));
        }

        const dinoHitbox = getDinoHitbox(state);
        const remainingObstacles = [];

        state.obstacles.forEach((obstacle) => {
          obstacle.x -= state.speed;

          if (!obstacle.passed && obstacle.x + obstacle.width < DINO_X + 12) {
            obstacle.passed = true;
          }

          if (obstacle.x + obstacle.width > -40) {
            remainingObstacles.push(obstacle);
          }

          if (gameStateRef.current === 'playing' && intersects(dinoHitbox, getObstacleHitbox(obstacle))) {
            gameStateRef.current = 'over';
            setScore(scoreRef.current);
            setGameState('over');
          }
        });

        state.obstacles = remainingObstacles;

        const nextScore = Math.floor(state.distance);
        if (nextScore !== state.score) {
          state.score = nextScore;
          scoreRef.current = nextScore;
          if (nextScore - lastRenderedScoreRef.current >= 5 || nextScore < 15) {
            lastRenderedScoreRef.current = nextScore;
            setScore(nextScore);
          }
          if (nextScore > bestScoreRef.current) {
            bestScoreRef.current = nextScore;
          }
        }
      }

      drawGround(state.groundOffset);

      state.obstacles.forEach((obstacle) => {
        if (obstacle.type === 'ptero') {
          drawPtero(obstacle, state.frames);
        } else {
          drawCactus(obstacle);
        }
      });

      if (state.ducking && state.velocityY === 0) {
        drawDuckingDino(DINO_X, state.dinoY, state.frames);
      } else {
        drawStandingDino(DINO_X, state.dinoY, state.frames);
      }

      drawScoreboard(scoreRef.current, bestScoreRef.current);
      animationId = window.requestAnimationFrame(drawFrame);
    };

    animationId = window.requestAnimationFrame(drawFrame);
    return () => window.cancelAnimationFrame(animationId);
  }, [config.acceleration, config.fallBoost, config.gravity, config.maxSpeed, config.spawnMax, config.spawnMin, config.startSpeed, isLofi]);

  useEffect(() => {
    if (gameState === 'over' && score > bestScore) {
      bestScoreRef.current = score;
      setBestScore(score);
      localStorage.setItem(bestScoreKey, String(score));
    }
  }, [bestScore, bestScoreKey, gameState, score]);

  return (
    <div className="mx-auto mt-12 w-full max-w-4xl pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_28px_80px_rgba(83,62,44,0.12)]' : 'border-stone-200 bg-gradient-to-br from-white via-stone-50/75 to-stone-100/85'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,236,0.9)_45%,rgba(250,237,205,0.84)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #7a6250 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          </>
        )}
        <div className="relative z-10 mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-stone-300 bg-white text-stone-700'}`}>
              <Sparkles size={14} /> {config.label} runner pace
            </div>
            <h3 className={`mt-3 text-2xl font-bold ${isLofi ? 'text-[#3d3025]' : 'text-stone-900'}`}>Dinosaur Dash</h3>
            <p className={`text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-stone-700'}`}>{isLofi ? 'A lofi canyon runner with warm sky tones, paper-soft glass panels, and a calmer retro arcade mood.' : 'A much closer take on the classic no-internet dinosaur runner.'}</p>
            <p className={`mt-1 text-sm ${isLofi ? 'text-[#8c755f]' : 'text-stone-600'}`}>{config.note}</p>
          </div>
          <div className={`flex flex-wrap gap-3 text-sm font-extrabold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-900' : 'text-stone-700'}`}>
            <span className={`rounded-full px-4 py-2 shadow-sm ${isLofi ? 'bg-amber-50 border border-white/70' : 'border border-stone-300 bg-white'}`}>Score {score}</span>
            <span className={`rounded-full px-4 py-2 shadow-sm ${isLofi ? 'bg-white/82 border border-white/70 backdrop-blur-sm' : 'border border-stone-300 bg-white'}`}>Best {bestScore}</span>
          </div>
        </div>

        <div className={`relative z-10 rounded-[1.5rem] border p-3 shadow-sm sm:p-4 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-stone-300 bg-white'}`}>
          <div className={`mb-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-800/70' : 'text-stone-600'}`}>
            <span className={`rounded-full px-3 py-1 ${isLofi ? 'border border-amber-200 bg-amber-50/85' : 'border border-stone-200'}`}>Space / ↑ jump</span>
            <span className={`rounded-full px-3 py-1 ${isLofi ? 'border border-amber-200 bg-amber-50/85' : 'border border-stone-200'}`}>↓ duck</span>
            <span className={`rounded-full px-3 py-1 ${isLofi ? 'border border-amber-200 bg-amber-50/85' : 'border border-stone-200'}`}>Tap to jump</span>
          </div>

          <div className={`relative overflow-hidden rounded-[1.5rem] border ${isLofi ? 'border-[#e7d7c7] bg-[linear-gradient(180deg,#fffaf3_0%,#f4dfc8_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]' : 'border-stone-300 bg-[#f7f7f7]'}`} style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="block h-full w-full cursor-pointer touch-none"
              onClick={jump}
              style={{ imageRendering: 'pixelated' }}
            />

            {gameState === 'start' && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center ${isLofi ? 'bg-white/38 backdrop-blur-[3px]' : 'bg-white/80'}`}>
                <button
                  className={`mb-4 flex items-center gap-3 rounded-full px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] shadow-sm hover:bg-[#3d3025]' : 'border border-stone-800 bg-stone-900 hover:bg-stone-800'}`}
                  onClick={() => startGame(true)}
                  type="button"
                >
                  <Play size={16} /> Start run
                </button>
                <p className={`rounded-full px-4 py-2 text-sm font-semibold ${isLofi ? 'border border-white/70 bg-white/72 text-[#4a3a2d]' : 'border border-stone-300 bg-white text-stone-800'}`}>Jump over cacti, duck under low birds, and keep the run going.</p>
              </div>
            )}

            {gameState === 'over' && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center ${isLofi ? 'bg-white/46 backdrop-blur-[4px]' : 'bg-white/86'}`}>
                <p className={`text-3xl font-extrabold uppercase tracking-[0.24em] ${isLofi ? 'text-[#3d3025]' : 'text-stone-900'}`}>Game over</p>
                <p className={`mt-3 text-base font-bold ${isLofi ? 'text-[#6e5a4a]' : 'text-stone-700'}`}>Final score: {score}</p>
                <button
                  onClick={() => startGame(false)}
                  className={`mt-6 flex items-center gap-3 rounded-full px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] shadow-sm hover:bg-[#3d3025]' : 'border border-stone-800 bg-stone-900 hover:bg-stone-800'}`}
                  type="button"
                >
                  <RotateCcw size={16} /> Restart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
