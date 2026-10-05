import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;

const difficultySettings = {
  easy: {
    gravity: 0.6,
    jumpVelocity: -11.4,
    startSpeed: 6,
    maxSpeed: 10.8,
    spawnFloor: 60,
    spawnBase: 108,
    label: 'Easy',
    note: 'A softer desert run with more breathing room between cacti.',
  },
  medium: {
    gravity: 0.69,
    jumpVelocity: -11.9,
    startSpeed: 7.4,
    maxSpeed: 12.9,
    spawnFloor: 48,
    spawnBase: 90,
    label: 'Medium',
    note: 'A balanced offline dash for steady focus.',
  },
  hard: {
    gravity: 0.78,
    jumpVelocity: -12.35,
    startSpeed: 8.8,
    maxSpeed: 15.1,
    spawnFloor: 38,
    spawnBase: 76,
    label: 'Hard',
    note: 'Faster ground, tighter jumps, and denser cactus timing for a real challenge.',
  }
};

function buildInitialState(startSpeed) {
  return {
    dinoY: GROUND_Y,
    velocityY: 0,
    speed: startSpeed,
    score: 0,
    frames: 0,
    obstacles: [],
    dustOffset: 0,
    clouds: [
      { x: 120, y: 88, size: 30 },
      { x: 360, y: 62, size: 24 },
      { x: 560, y: 104, size: 34 }
    ]
  };
}

export default function DinosaurDash({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-dinosaur-dash-best-${difficulty}`;

  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  const stateRef = useRef(buildInitialState(config.startSpeed));

  useEffect(() => {
    stateRef.current = buildInitialState(config.startSpeed);
    setScore(0);
    setGameState('start');
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [bestScoreKey, config.startSpeed]);

  const startGame = useCallback(() => {
    stateRef.current = buildInitialState(config.startSpeed);
    setScore(0);
    setGameState('playing');
  }, [config.startSpeed]);

  const jump = useCallback(() => {
    const state = stateRef.current;
    if (gameState === 'start' || gameState === 'over') {
      startGame();
      stateRef.current.velocityY = config.jumpVelocity;
      return;
    }
    if (gameState === 'playing' && state.dinoY >= GROUND_Y - 1) {
      state.velocityY = config.jumpVelocity;
    }
  }, [config.jumpVelocity, gameState, startGame]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let animationId;

    const drawRoundedRect = (x, y, width, height, radius, fillStyle) => {
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    };

    const drawCloud = (x, y, size) => {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.38, 0, Math.PI * 2);
      ctx.arc(x + size * 0.34, y - size * 0.16, size * 0.3, 0, Math.PI * 2);
      ctx.arc(x + size * 0.64, y, size * 0.42, 0, Math.PI * 2);
      ctx.arc(x + size * 0.3, y + size * 0.14, size * 0.46, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawDino = (x, y, frame) => {
      const bob = gameState === 'playing' ? Math.sin(frame / 7) * 1.5 : Math.sin(Date.now() / 280) * 1.5;
      ctx.save();
      ctx.translate(x, y + bob);
      drawRoundedRect(-18, -44, 42, 30, 10, '#31453a');
      drawRoundedRect(8, -62, 26, 22, 9, '#31453a');
      drawRoundedRect(24, -54, 12, 10, 4, '#31453a');
      drawRoundedRect(-4, -66, 8, 12, 4, '#31453a');
      drawRoundedRect(4, -66, 8, 12, 4, '#31453a');
      drawRoundedRect(-16, -18, 10, 24, 5, '#31453a');
      drawRoundedRect(2, -18, 10, 24, 5, '#31453a');
      drawRoundedRect(-28, -34, 16, 9, 4, '#31453a');
      drawRoundedRect(-36, -28, 12, 8, 4, '#31453a');
      ctx.fillStyle = '#f8fbf5';
      ctx.beginPath();
      ctx.arc(22, -53, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#31453a';
      ctx.beginPath();
      ctx.arc(23, -53, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawCactus = (x, height, variant = 0) => {
      const width = variant === 1 ? 22 : 18;
      const y = GROUND_Y - height;
      drawRoundedRect(x, y, width, height, 6, '#87a96b');
      drawRoundedRect(x - 10, y + 22, 12, 38, 5, '#87a96b');
      if (variant === 1) {
        drawRoundedRect(x + width - 2, y + 34, 12, 46, 5, '#87a96b');
      }
      ctx.fillStyle = '#6f9158';
      for (let row = y + 10; row < GROUND_Y; row += 16) {
        ctx.fillRect(x + 4, row, width - 8, 2);
      }
    };

    const draw = () => {
      const state = stateRef.current;

      const background = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      background.addColorStop(0, '#fbf5ee');
      background.addColorStop(1, '#f1e5d7');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      state.clouds.forEach((cloud) => {
        cloud.x -= state.speed * 0.16;
        if (cloud.x < -90) {
          cloud.x = CANVAS_WIDTH + Math.random() * 80;
          cloud.y = 54 + Math.random() * 72;
          cloud.size = 20 + Math.random() * 24;
        }
        drawCloud(cloud.x, cloud.y, cloud.size);
      });

      ctx.fillStyle = 'rgba(210, 185, 155, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 16);
      ctx.quadraticCurveTo(140, GROUND_Y - 10, 260, GROUND_Y + 8);
      ctx.quadraticCurveTo(420, GROUND_Y + 26, CANVAS_WIDTH, GROUND_Y - 6);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.lineTo(0, CANVAS_HEIGHT);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#9f8567';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 8);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 8);
      ctx.stroke();

      state.dustOffset += state.speed;
      ctx.strokeStyle = '#d5c1ac';
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 16]);
      ctx.lineDashOffset = -state.dustOffset;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 18);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 18);
      ctx.stroke();
      ctx.setLineDash([]);

      if (gameState === 'playing') {
        state.frames += 1;
        state.speed = Math.min(config.maxSpeed, config.startSpeed + state.frames / 520);
        state.velocityY += config.gravity;
        state.dinoY = Math.min(GROUND_Y, state.dinoY + state.velocityY);
        if (state.dinoY >= GROUND_Y) {
          state.dinoY = GROUND_Y;
          state.velocityY = 0;
        }

        if (state.frames % Math.max(config.spawnFloor, config.spawnBase - Math.floor(state.speed * 3)) === 0) {
          const variant = Math.random() > 0.65 ? 1 : 0;
          const height = variant === 1 ? 72 : 62;
          const width = variant === 1 ? 32 : 24;
          state.obstacles.push({ x: CANVAS_WIDTH + 40, height, width, variant });
        }

        state.obstacles.forEach((obstacle) => {
          obstacle.x -= state.speed;
          drawCactus(obstacle.x, obstacle.height, obstacle.variant);

          const dinoLeft = 104;
          const dinoRight = 140;
          const dinoTop = state.dinoY - 62;
          const dinoBottom = state.dinoY + 8;
          const obstacleLeft = obstacle.x - 10;
          const obstacleRight = obstacle.x + obstacle.width + 10;
          const obstacleTop = GROUND_Y - obstacle.height;
          const obstacleBottom = GROUND_Y + 6;

          if (dinoRight > obstacleLeft && dinoLeft < obstacleRight && dinoBottom > obstacleTop && dinoTop < obstacleBottom) {
            setGameState('over');
          }
        });

        const activeObstacles = [];
        state.obstacles.forEach((obstacle) => {
          if (!obstacle.passed && obstacle.x + obstacle.width < 118) {
            obstacle.passed = true;
            state.score += 1;
            setScore(state.score);
          }
          if (obstacle.x > -80) activeObstacles.push(obstacle);
        });
        state.obstacles = activeObstacles;
      }

      drawDino(122, state.dinoY, state.frames);

      ctx.fillStyle = '#7a6655';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText('Offline desert run', 28, 36);

      animationId = window.requestAnimationFrame(draw);
    };

    animationId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(animationId);
  }, [config.gravity, config.maxSpeed, config.spawnBase, config.spawnFloor, config.startSpeed, gameState]);

  useEffect(() => {
    if (gameState === 'over' && score > bestScore) {
      setBestScore(score);
      localStorage.setItem(bestScoreKey, String(score));
    }
  }, [bestScore, bestScoreKey, gameState, score]);

  return (
    <div className="mx-auto mt-12 w-full max-w-2xl pb-12">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-stone-700 shadow-sm">
            <Sparkles size={14} /> {config.label} desert pace
          </div>
          <h3 className="mt-3 text-2xl font-bold text-stone-900">Dinosaur Dash</h3>
          <p className="text-sm font-semibold text-stone-700">A soft offline-runner spin on the classic no-internet dino game.</p>
          <p className="mt-1 text-sm text-stone-600">{config.note}</p>
        </div>
        <div className="flex gap-4 text-sm font-extrabold uppercase tracking-widest text-stone-700">
          <span className="rounded-full bg-stone-200/70 px-4 py-2 shadow-sm">Score: {score}</span>
          <span className="rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">Best: {bestScore}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[#f8efe3] shadow-sm transition hover:shadow-soft" style={{ aspectRatio: '9 / 5' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block h-full w-full cursor-pointer touch-none"
          onClick={jump}
        />

        {gameState === 'start' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-white/28 backdrop-blur-[3px]">
            <button className="pointer-events-auto mb-4 flex items-center gap-3 rounded-full bg-stone-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-stone-700" onClick={jump} type="button">
              <Play size={18} /> Tap to run
            </button>
            <p className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-stone-900">Press Space, ↑, W, or tap to jump.</p>
          </div>
        )}

        {gameState === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/45 backdrop-blur-[4px]">
            <p className="mb-2 font-display text-4xl font-extrabold text-stone-950">Connection restored.</p>
            <p className="mb-3 text-lg font-bold text-stone-800">Final score: {score}</p>
            <p className="mb-8 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-stone-700">{config.note}</p>
            <button
              onClick={startGame}
              className="flex items-center gap-3 rounded-full bg-stone-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-stone-700"
              type="button"
            >
              <RotateCcw size={18} /> Run again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
