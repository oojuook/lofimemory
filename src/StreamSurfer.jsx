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
    note: 'Slower water and more room to glide around hazards.'
  },
  medium: {
    startSpeed: 4.8,
    speedRamp: 0.22,
    spawnFloor: 30,
    spawnBase: 88,
    moveEase: 0.2,
    label: 'Medium',
    note: 'Balanced and rhythmic for a steady little reset.'
  },
  hard: {
    startSpeed: 7.1,
    speedRamp: 0.38,
    spawnFloor: 16,
    spawnBase: 58,
    moveEase: 0.14,
    label: 'Hard',
    note: 'Much faster water, denser hazards, and tighter reactions for a sharper challenge.'
  }
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
    waterOffset: 0
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
      waterOffset: 0
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
      waterOffset: 0
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
      ctx.shadowColor = 'rgba(21, 57, 31, 0.16)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#2f7b37';
      ctx.beginPath();
      ctx.arc(-18, -18, 12, 0, Math.PI * 2);
      ctx.arc(18, -18, 12, 0, Math.PI * 2);
      ctx.roundRect(-33, -18, 66, 48, 24);
      ctx.fill();

      ctx.fillStyle = '#73df58';
      ctx.beginPath();
      ctx.arc(-18, -18, 9.5, 0, Math.PI * 2);
      ctx.arc(18, -18, 9.5, 0, Math.PI * 2);
      ctx.roundRect(-29, -16, 58, 42, 22);
      ctx.fill();

      ctx.fillStyle = '#d2f3be';
      ctx.beginPath();
      ctx.moveTo(-21, 4);
      ctx.quadraticCurveTo(-17, 22, 0, 24);
      ctx.quadraticCurveTo(17, 22, 21, 4);
      ctx.quadraticCurveTo(12, -2, 0, 0);
      ctx.quadraticCurveTo(-12, -2, -21, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ef99a8';
      ctx.beginPath();
      ctx.ellipse(-22, 6, 5.5, 3.8, 0, 0, Math.PI * 2);
      ctx.ellipse(22, 6, 5.5, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-18, -18, 7.2, 0, Math.PI * 2);
      ctx.arc(18, -18, 7.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#171717';
      ctx.beginPath();
      ctx.arc(-18, -18, 5.4, 0, Math.PI * 2);
      ctx.arc(18, -18, 5.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-20.4, -20.2, 1.4, 0, Math.PI * 2);
      ctx.arc(20.4, -20.2, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2f7b37';
      ctx.beginPath();
      ctx.arc(-4.6, -4.2, 1.4, 0, Math.PI * 2);
      ctx.arc(4.6, -4.2, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawLilyPad = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#5da05b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 31, 24, -0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7dd06f';
      ctx.beginPath();
      ctx.ellipse(-2, -2, 23, 17, -0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dff4e4';
      ctx.beginPath();
      ctx.moveTo(3, 0);
      ctx.lineTo(32, -14);
      ctx.lineTo(32, 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      const state = stateRef.current;

      const pondGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      pondGradient.addColorStop(0, '#eef8f1');
      pondGradient.addColorStop(0.5, '#dff3e5');
      pondGradient.addColorStop(1, '#d2ead8');
      ctx.fillStyle = pondGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let rippleIndex = 0; rippleIndex < 5; rippleIndex += 1) {
        const rippleY = (rippleIndex * 88 + state.waterOffset * 0.35) % (canvas.height + 90) - 45;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, rippleY);
        ctx.quadraticCurveTo(canvas.width / 2, rippleY + 18, canvas.width - 24, rippleY);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(153, 205, 177, 0.9)';
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
        const playerCollisionX = getLaneCenter(state.lane);

        state.obstacles.forEach((obstacle) => {
          obstacle.y += state.speed;
          drawLilyPad(getLaneCenter(obstacle.lane), obstacle.y);

          if (Math.abs(getLaneCenter(obstacle.lane) - playerCollisionX) < 56 && Math.abs(obstacle.y - playerY) < 42) {
            setGameState('over');
          }

          if (!obstacle.passed && obstacle.y > playerY + 36) {
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
