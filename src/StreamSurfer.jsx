import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const difficultySettings = {
  easy: {
    startSpeed: 4,
    speedRamp: 0.16,
    spawnFloor: 38,
    spawnBase: 100,
    moveEase: 0.24,
    label: 'Easy',
    note: 'Slower water and more room to glide around hazards.'
  },
  medium: {
    startSpeed: 4.5,
    speedRamp: 0.2,
    spawnFloor: 30,
    spawnBase: 90,
    moveEase: 0.2,
    label: 'Medium',
    note: 'Balanced and rhythmic for a steady little reset.'
  },
  hard: {
    startSpeed: 5.3,
    speedRamp: 0.24,
    spawnFloor: 24,
    spawnBase: 80,
    moveEase: 0.17,
    label: 'Hard',
    note: 'Quicker streams and tighter reactions for sharper focus.'
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
    if (gameState !== 'playing') return;
    const state = stateRef.current;
    if (direction === -1 && state.lane > 0) state.lane -= 1;
    if (direction === 1 && state.lane < 2) state.lane += 1;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') handleMove(-1);
      if (event.code === 'ArrowRight' || event.code === 'KeyD') handleMove(1);
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
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let animationId;

    const drawBoat = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(18, 15);
      ctx.lineTo(0, 5);
      ctx.lineTo(-18, 15);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f0f5f2';
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(18, 15);
      ctx.lineTo(0, 5);
      ctx.closePath();
      ctx.fill();
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

        if (state.frames % 300 === 0) state.speed += config.speedRamp;

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

      drawBoat(state.visualX, canvas.height - 80);
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
          <h3 className="mt-3 text-2xl font-bold text-teal-900">Stream Surfer</h3>
          <p className="text-sm font-semibold text-teal-700">A rhythmic 3-lane dodge game to clear your mind.</p>
          <p className="mt-1 text-sm text-teal-600">{config.note}</p>
        </div>
        <div className="flex gap-4 text-sm font-extrabold uppercase tracking-widest text-teal-700">
          <span className="rounded-full bg-teal-100 px-4 py-2 shadow-sm">Score: {score}</span>
          <span className="rounded-full border border-teal-200 bg-white px-4 py-2 shadow-sm">Best: {highScore}</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-teal-200 shadow-sm transition hover:shadow-soft" style={{ aspectRatio: '3/2' }}>
        <canvas ref={canvasRef} width={600} height={400} className="block h-full w-full touch-none" />

        {gameState === 'playing' && (
          <div className="absolute inset-0 flex sm:hidden">
            <div className="flex-1" onTouchStart={(event) => { event.preventDefault(); handleMove(-1); }} />
            <div className="flex-1" onTouchStart={(event) => { event.preventDefault(); handleMove(1); }} />
          </div>
        )}

        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[3px]">
            <button onClick={startGame} className="mb-4 flex items-center gap-3 rounded-full bg-teal-700 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-teal-600" type="button">
              <Play size={18} /> Start surfing
            </button>
            <p className="flex items-center gap-4 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-teal-900">
              <span><ArrowLeft size={16} className="mr-1 inline" /> Left</span>
              <span className="h-4 w-px bg-teal-200" />
              <span>Right <ArrowRight size={16} className="ml-1 inline" /></span>
            </p>
          </div>
        )}

        {gameState === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[5px]">
            <p className="mb-2 font-display text-4xl font-extrabold text-teal-950">You bumped a lily pad.</p>
            <p className="mb-3 text-lg font-bold text-teal-800">Final Score: {score}</p>
            <p className="mb-8 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-teal-700">{config.note}</p>
            <button
              onClick={startGame}
              className="flex items-center gap-3 rounded-full bg-teal-700 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-teal-600"
              type="button"
            >
              <RotateCcw size={18} /> Surf again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
