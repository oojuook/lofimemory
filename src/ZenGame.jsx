import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    gravity: 0.22,
    jumpVelocity: -5.2,
    obstacleSpeed: 2,
    gapSize: 198,
    spawnRate: 156,
    label: 'Easy',
    note: 'A slower drift with a wider path to breathe through.'
  },
  medium: {
    gravity: 0.29,
    jumpVelocity: -5.9,
    obstacleSpeed: 2.65,
    gapSize: 170,
    spawnRate: 128,
    label: 'Medium',
    note: 'Balanced and floaty — a calm focus rhythm.'
  },
  hard: {
    gravity: 0.42,
    jumpVelocity: -6.55,
    obstacleSpeed: 4.2,
    gapSize: 128,
    spawnRate: 86,
    label: 'Hard',
    note: 'Much faster gaps and tighter pipes for a noticeably sharper challenge.'
  }
};

export default function ZenGame({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-highscore-${difficulty}`;

  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  const stateRef = useRef({
    leafY: 200,
    velocity: 0,
    obstacles: [],
    frames: 0,
    score: 0
  });

  useEffect(() => {
    stateRef.current = {
      leafY: 200,
      velocity: 0,
      obstacles: [],
      frames: 0,
      score: 0
    };
    setScore(0);
    setGameState('start');
    setHighScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [bestScoreKey]);

  const jump = () => {
    if (gameState === 'playing') {
      stateRef.current.velocity = config.jumpVelocity;
    } else if (gameState === 'start' || gameState === 'over') {
      stateRef.current = {
        leafY: 200,
        velocity: config.jumpVelocity,
        obstacles: [],
        frames: 0,
        score: 0
      };
      setScore(0);
      setGameState('playing');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, config.jumpVelocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let animationId;

    const drawLeaf = (x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#587f49';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(18, -12, 18, 6);
      ctx.quadraticCurveTo(18, 18, 0, 18);
      ctx.quadraticCurveTo(-18, 18, -18, 6);
      ctx.quadraticCurveTo(-18, -12, 0, -12);
      ctx.fill();

      ctx.strokeStyle = '#edf4e8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.quadraticCurveTo(5, 5, 0, 16);
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      const state = stateRef.current;

      ctx.fillStyle = '#f7faf4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#edf4e8';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, canvas.height - 80);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 200, canvas.width, canvas.height - 60);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      if (gameState === 'playing') {
        state.velocity += config.gravity;
        state.leafY += state.velocity;

        if (state.frames % config.spawnRate === 0) {
          const gapTop = Math.random() * (canvas.height - (config.gapSize + 110)) + 55;
          state.obstacles.push({ x: canvas.width, gapTop, passed: false });
        }

        state.obstacles.forEach((obstacle) => {
          obstacle.x -= config.obstacleSpeed;

          ctx.fillStyle = '#dcebd3';
          const obstacleWidth = 45;

          ctx.beginPath();
          ctx.roundRect(obstacle.x, -20, obstacleWidth, obstacle.gapTop + 20, 12);
          ctx.fill();

          ctx.beginPath();
          ctx.roundRect(obstacle.x, obstacle.gapTop + config.gapSize, obstacleWidth, canvas.height - obstacle.gapTop - config.gapSize + 20, 12);
          ctx.fill();

          const leafRadius = 14;
          const leafX = 100;
          const hitTop = leafX + leafRadius > obstacle.x && leafX - leafRadius < obstacle.x + obstacleWidth && state.leafY - leafRadius < obstacle.gapTop;
          const hitBottom = leafX + leafRadius > obstacle.x && leafX - leafRadius < obstacle.x + obstacleWidth && state.leafY + leafRadius > obstacle.gapTop + config.gapSize;

          if (hitTop || hitBottom) {
            setGameState('over');
          }

          if (!obstacle.passed && obstacle.x + obstacleWidth < leafX) {
            obstacle.passed = true;
            state.score += 1;
            setScore(state.score);
          }
        });

        state.obstacles = state.obstacles.filter((obstacle) => obstacle.x > -100);

        if (state.leafY > canvas.height + 20 || state.leafY < -20) {
          setGameState('over');
        }
      } else if (gameState === 'start') {
        state.leafY = 200 + Math.sin(Date.now() / 400) * 12;
      }

      const angle = Math.min(Math.max(state.velocity * 0.08, -0.4), 1.2);
      drawLeaf(100, state.leafY, angle);

      state.frames += 1;
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [config.gapSize, config.gravity, config.obstacleSpeed, config.spawnRate, gameState]);

  useEffect(() => {
    if (gameState === 'over' && score > highScore) {
      setHighScore(score);
      localStorage.setItem(bestScoreKey, String(score));
    }
  }, [bestScoreKey, gameState, highScore, score]);

  const levelText = useMemo(() => config.label, [config.label]);

  return (
    <div className="mx-auto mt-12 w-full max-w-2xl pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
            <Sparkles size={14} /> {levelText} drift
          </div>
          <h3 className="mt-3 text-2xl font-bold text-sage-900">Drifting Seed</h3>
          <p className="text-sm font-semibold text-sage-700">A calming float-through game for restless thoughts.</p>
          <p className="mt-1 text-sm text-sage-600">{config.note}</p>
        </div>
        <div className="flex gap-4 text-sm font-extrabold uppercase tracking-widest text-sage-700">
          <span className="rounded-full bg-sage-100 px-4 py-2 shadow-sm">Score: {score}</span>
          <span className="rounded-full border border-sage-200 bg-white px-4 py-2 shadow-sm">Best: {highScore}</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-sage-200 shadow-sm transition hover:shadow-soft" style={{ aspectRatio: '3/2' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="block h-full w-full cursor-pointer touch-none"
          onClick={jump}
        />

        {gameState === 'start' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[3px]">
            <button className="pointer-events-auto mb-4 flex items-center gap-3 rounded-full bg-sage-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-700" onClick={jump} type="button">
              <Play size={18} /> Tap to float
            </button>
            <p className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-sage-900">Press Space or click to drift.</p>
          </div>
        )}

        {gameState === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[5px]">
            <p className="mb-2 font-display text-4xl font-extrabold text-sage-950">The leaf landed.</p>
            <p className="mb-3 text-lg font-bold text-sage-800">Final Score: {score}</p>
            <p className="mb-8 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-sage-700">{config.note}</p>
            <button
              onClick={(event) => {
                event.stopPropagation();
                jump();
              }}
              className="flex items-center gap-3 rounded-full bg-sage-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-700"
              type="button"
            >
              <RotateCcw size={18} /> Drift again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
