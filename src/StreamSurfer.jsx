import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    startSpeed: 3.8,
    speedRamp: 0.14,
    spawnFloor: 42,
    spawnBase: 108,
    moveEase: 0.25,
    label: 'Easy',
    note: 'Slower water and more room to glide around hazards.',
  },
  medium: {
    startSpeed: 4.8,
    speedRamp: 0.22,
    spawnFloor: 30,
    spawnBase: 88,
    moveEase: 0.2,
    label: 'Medium',
    note: 'Balanced and rhythmic for a steady little reset.',
  },
  hard: {
    startSpeed: 6.2,
    speedRamp: 0.3,
    spawnFloor: 22,
    spawnBase: 70,
    moveEase: 0.16,
    label: 'Hard',
    note: 'Fast water, denser hazards, and tighter reactions for a sharper challenge.',
  },
};

export default function StreamSurfer({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const highScoreKey = `quiet-journal-surfer-high-${difficulty}`;

  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(highScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  const stateRef = useRef({
    lane: 1,
    visualX: 300,
    speed: config.startSpeed,
    obstacles: [],
    frames: 0,
    score: 0,
    waterOffset: 0,
  });

  const laneWidth = 200;
  const getLaneCenter = (lane) => lane * laneWidth + laneWidth / 2;

  useEffect(() => {
    stateRef.current = {
      lane: 1,
      visualX: 300,
      speed: config.startSpeed,
      obstacles: [],
      frames: 0,
      score: 0,
      waterOffset: 0,
    };
    setScore(0);
    setGameState('start');
    setHighScore(parseInt(localStorage.getItem(highScoreKey) || '0', 10));
  }, [config.startSpeed, highScoreKey]);

  const handleMove = (direction) => {
    if (gameState !== 'playing') {
      return;
    }
    const state = stateRef.current;
    if (direction === -1 && state.lane > 0) {
      state.lane -= 1;
    }
    if (direction === 1 && state.lane < 2) {
      state.lane += 1;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        handleMove(-1);
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        handleMove(1);
      }
      if (event.code === 'Space' && gameState !== 'playing') {
        event.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, config.startSpeed]);

  const startGame = () => {
    stateRef.current = {
      lane: 1,
      visualX: 300,
      speed: config.startSpeed,
      obstacles: [],
      frames: 0,
      score: 0,
      waterOffset: 0,
    };
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const ctx = canvas.getContext('2d');
    let animationId;

    const drawFrog = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
      ctx.shadowBlur = 12;

      const headGradient = ctx.createLinearGradient(0, -26, 0, 24);
      headGradient.addColorStop(0, '#16a34a');
      headGradient.addColorStop(1, '#4b9f43');
      const throatGradient = ctx.createLinearGradient(0, 2, 0, 28);
      throatGradient.addColorStop(0, '#f7e46a');
      throatGradient.addColorStop(1, '#f1a45d');

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.roundRect(-24, -18, 48, 34, 16);
      ctx.fill();

      ctx.fillStyle = throatGradient;
      ctx.beginPath();
      ctx.roundRect(-19, -2, 38, 20, 10);
      ctx.fill();

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(-13, -16, 9, 0, Math.PI * 2);
      ctx.arc(13, -16, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f3d35f';
      ctx.beginPath();
      ctx.arc(-13, -16, 5.5, 0, Math.PI * 2);
      ctx.arc(13, -16, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#201a24';
      ctx.beginPath();
      ctx.arc(-13, -16, 2.8, 0, Math.PI * 2);
      ctx.arc(13, -16, 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      ctx.arc(-15, -18, 1.3, 0, Math.PI * 2);
      ctx.arc(11, -18, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2b3b2b';
      ctx.beginPath();
      ctx.arc(-4, -6, 1.4, 0, Math.PI * 2);
      ctx.arc(4, -6, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#3b5535';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-9, 2);
      ctx.quadraticCurveTo(0, 6, 9, 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawLilyPad = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#739f62';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8f0eb';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(25, -12);
      ctx.lineTo(25, 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      const state = stateRef.current;

      ctx.fillStyle = '#e8f0eb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#d4e3dc';
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -state.waterOffset;
      ctx.beginPath();
      ctx.moveTo(200, 0);
      ctx.lineTo(200, canvas.height);
      ctx.moveTo(400, 0);
      ctx.lineTo(400, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      if (gameState === 'playing') {
        state.frames += 1;
        state.waterOffset += state.speed;

        if (state.frames % Math.max(config.spawnFloor, config.spawnBase - Math.floor(state.speed * 5)) === 0) {
          const lane = Math.floor(Math.random() * 3);
          state.obstacles.push({ lane, y: -50, passed: false });
        }

        if (state.frames % 300 === 0) {
          state.speed += config.speedRamp;
        }

        const targetX = getLaneCenter(state.lane);
        state.visualX += (targetX - state.visualX) * config.moveEase;

        const playerY = canvas.height - 80;

        state.obstacles.forEach((obstacle) => {
          obstacle.y += state.speed;
          drawLilyPad(getLaneCenter(obstacle.lane), obstacle.y);

          if (Math.abs(getLaneCenter(obstacle.lane) - state.visualX) < 30 && Math.abs(obstacle.y - playerY) < 35) {
            setGameState('over');
          }

          if (!obstacle.passed && obstacle.y > playerY + 30) {
            obstacle.passed = true;
            state.score += 1;
            setScore(state.score);
          }
        });

        state.obstacles = state.obstacles.filter((obstacle) => obstacle.y < canvas.height + 50);
      } else if (gameState === 'start') {
        state.waterOffset += 1;
        state.visualX = getLaneCenter(1);
      }

      drawFrog(state.visualX, canvas.height - 80);
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [config.moveEase, config.spawnBase, config.spawnFloor, config.speedRamp, gameState]);

  useEffect(() => {
    if (gameState === 'over' && score > highScore) {
      setHighScore(score);
      localStorage.setItem(highScoreKey, String(score));
    }
  }, [gameState, highScoreKey, highScore, score]);

  return (
    <div className="mx-auto mt-12 w-full max-w-2xl pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-teal-700 shadow-sm">
            <Sparkles size={14} /> {config.label} current
          </div>
          <h3 className="mt-3 text-2xl font-bold text-teal-900">Lilypad Hopper</h3>
          <p className="text-sm font-semibold text-teal-700">A frog-themed 3-lane pond dodge that feels lighter on mobile.</p>
          <p className="mt-1 text-sm text-teal-600">{config.note}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-extrabold uppercase tracking-widest text-teal-700">
          <span className="rounded-full bg-teal-100 px-4 py-2 shadow-sm">Score: {score}</span>
          <span className="rounded-full border border-teal-200 bg-white px-4 py-2 shadow-sm">Best: {highScore}</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-teal-200 shadow-sm transition hover:shadow-soft" style={{ aspectRatio: '3/2' }}>
        <canvas ref={canvasRef} width={600} height={400} className="block h-full w-full touch-none" />

        {gameState === 'playing' && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:hidden">
            <button
              className="pointer-events-auto inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-2xl bg-white/88 px-4 py-3 text-sm font-extrabold text-teal-900 shadow-sm backdrop-blur"
              onTouchStart={(event) => {
                event.preventDefault();
                handleMove(-1);
              }}
              type="button"
            >
              <ArrowLeft size={18} className="mr-2" /> Hop left
            </button>
            <button
              className="pointer-events-auto inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-2xl bg-white/88 px-4 py-3 text-sm font-extrabold text-teal-900 shadow-sm backdrop-blur"
              onTouchStart={(event) => {
                event.preventDefault();
                handleMove(1);
              }}
              type="button"
            >
              Hop right <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        )}

        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 px-4 text-center backdrop-blur-[3px]">
            <button onClick={startGame} className="mb-4 flex items-center gap-3 rounded-full bg-teal-700 px-6 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-teal-600 sm:px-8" type="button">
              <Play size={18} /> Start hopping
            </button>
            <p className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-teal-900 sm:gap-4 sm:px-5">
              <span><ArrowLeft size={16} className="mr-1 inline" /> Left</span>
              <span className="hidden h-4 w-px bg-teal-200 sm:block" />
              <span>Right <ArrowRight size={16} className="ml-1 inline" /></span>
            </p>
          </div>
        )}

        {gameState === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 px-4 text-center backdrop-blur-[5px]">
            <p className="mb-2 font-display text-3xl font-extrabold text-teal-950 sm:text-4xl">Your frog slipped off the pad.</p>
            <p className="mb-3 text-lg font-bold text-teal-800">Final Score: {score}</p>
            <p className="mb-8 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-teal-700">{config.note}</p>
            <button
              onClick={startGame}
              className="flex items-center gap-3 rounded-full bg-teal-700 px-6 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-teal-600 sm:px-8"
              type="button"
            >
              <RotateCcw size={18} /> Hop again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
