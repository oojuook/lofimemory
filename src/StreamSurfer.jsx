import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const difficultySettings = {
  easy: {
    startSpeed: 3.8,
    speedRamp: 0.14,
    spawnFloor: 48,
    spawnBase: 84,
    moveEase: 0.25,
    label: 'Easy',
    note: 'Slower water and more room to glide around hazards.'
  },
  medium: {
    startSpeed: 4.8,
    speedRamp: 0.22,
    spawnFloor: 36,
    spawnBase: 72,
    moveEase: 0.2,
    label: 'Medium',
    note: 'Balanced and rhythmic for a steady little reset.'
  },
  hard: {
    startSpeed: 10.5,
    speedRamp: 0.52,
    spawnFloor: 18,
    spawnBase: 42,
    moveEase: 0.12,
    label: 'Hard',
    note: 'Extreme water speed, rapid hazards, and very tight lilypad spacing for a high-focus challenge.'
  }
};

export default function StreamSurfer({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const highScoreKey = `quiet-journal-surfer-high-${difficulty}`;

  const canvasRef = useRef(null);
  const gameStateRef = useRef('start');
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
    spawnCooldown: config.spawnBase,
    hitFrames: 0,
    hitObstacle: null
  });

  const laneWidth = 200;
  const getLaneCenter = (lane) => lane * laneWidth + laneWidth / 2;

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current = {
      lane: 1,
      visualX: 300,
      speed: config.startSpeed,
      obstacles: [],
      frames: 0,
      score: 0,
      waterOffset: 0,
      spawnCooldown: config.spawnBase,
      hitFrames: 0,
      hitObstacle: null
    };
    gameStateRef.current = 'start';
    setScore(0);
    setGameState('start');
    setHighScore(parseInt(localStorage.getItem(highScoreKey) || '0', 10));
  }, [config.startSpeed, highScoreKey]);

  const handleMove = (direction) => {
    if (gameStateRef.current !== 'playing') {
      return;
    }

    const state = stateRef.current;
    const nextLane = Math.min(2, Math.max(0, state.lane + direction));

    if (nextLane === state.lane) {
      return;
    }

    state.lane = nextLane;
    const targetX = getLaneCenter(nextLane);
    state.visualX += (targetX - state.visualX) * 0.68;
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
      spawnCooldown: config.spawnBase,
      hitFrames: 0,
      hitObstacle: null
    };
    gameStateRef.current = 'playing';
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
    const waterTop = isLofi ? '#fff7ec' : '#eef8f1';
    const waterMid = isLofi ? '#dcecf3' : '#dff3e5';
    const waterBottom = isLofi ? '#bfd8ca' : '#d2ead8';
    const rippleColor = isLofi ? 'rgba(255, 255, 255, 0.62)' : 'rgba(255, 255, 255, 0.5)';
    const laneColor = isLofi ? 'rgba(212, 163, 115, 0.9)' : 'rgba(153, 205, 177, 0.9)';
    const frogDark = isLofi ? '#6f8f72' : '#2f7b37';
    const frogLight = isLofi ? '#aac8a0' : '#73df58';
    const frogBelly = isLofi ? '#f7ead8' : '#d2f3be';
    const frogBlush = isLofi ? '#f0b6b8' : '#ef99a8';
    const padDark = isLofi ? '#7a9d72' : '#4f9752';
    const padLight = isLofi ? '#a7c693' : '#7dd06f';
    const padVein = isLofi ? '#fff1dd' : '#dff4e4';

    const drawFrog = (x, y, hit = false) => {
      ctx.save();
      ctx.translate(x + (hit ? Math.sin(stateRef.current.hitFrames * 1.7) * 3 : 0), y + (hit ? 5 : 0));
      if (hit) {
        ctx.rotate(Math.sin(stateRef.current.hitFrames * 0.9) * 0.08);
      }
      ctx.shadowColor = 'rgba(21, 57, 31, 0.16)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = frogDark;
      ctx.beginPath();
      ctx.arc(-18, -18, 12, 0, Math.PI * 2);
      ctx.arc(18, -18, 12, 0, Math.PI * 2);
      ctx.roundRect(-33, -18, 66, 48, 24);
      ctx.fill();

      ctx.fillStyle = frogLight;
      ctx.beginPath();
      ctx.arc(-18, -18, 9.5, 0, Math.PI * 2);
      ctx.arc(18, -18, 9.5, 0, Math.PI * 2);
      ctx.roundRect(-29, -16, 58, 42, 22);
      ctx.fill();

      ctx.fillStyle = frogBelly;
      ctx.beginPath();
      ctx.moveTo(-21, 4);
      ctx.quadraticCurveTo(-17, 22, 0, 24);
      ctx.quadraticCurveTo(17, 22, 21, 4);
      ctx.quadraticCurveTo(12, -2, 0, 0);
      ctx.quadraticCurveTo(-12, -2, -21, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = frogBlush;
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

      ctx.fillStyle = frogDark;
      ctx.beginPath();
      ctx.arc(-4.6, -4.2, 1.4, 0, Math.PI * 2);
      ctx.arc(4.6, -4.2, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawLilyPad = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.shadowColor = 'rgba(34, 91, 63, 0.18)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = padDark;
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 27, -0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = padLight;
      ctx.beginPath();
      ctx.ellipse(-2, -2, 27, 20, -0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = padVein;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(34, -17);
      ctx.lineTo(34, 17);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(233, 252, 236, 0.85)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(-14, -6);
      ctx.quadraticCurveTo(-2, 0, 13, 6);
      ctx.stroke();
      ctx.restore();
    };

    const drawHitBurst = (x, y, frame) => {
      const pulse = Math.max(0, frame);
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = isLofi
        ? `rgba(110, 90, 74, ${Math.min(0.86, 0.22 + pulse / 28)})`
        : `rgba(31, 84, 58, ${Math.min(0.86, 0.22 + pulse / 28)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 42 - pulse * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      for (let index = 0; index < 6; index += 1) {
        const angle = (Math.PI * 2 * index) / 6;
        const distance = 26 + (22 - pulse) * 0.65;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * distance, Math.sin(angle) * distance, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = () => {
      const state = stateRef.current;
      const currentGameState = gameStateRef.current;

      const pondGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      pondGradient.addColorStop(0, waterTop);
      pondGradient.addColorStop(0.5, waterMid);
      pondGradient.addColorStop(1, waterBottom);
      ctx.fillStyle = pondGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let rippleIndex = 0; rippleIndex < 5; rippleIndex += 1) {
        const rippleY = (rippleIndex * 88 + state.waterOffset * 0.35) % (canvas.height + 90) - 45;
        ctx.strokeStyle = rippleColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, rippleY);
        ctx.quadraticCurveTo(canvas.width / 2, rippleY + 18, canvas.width - 24, rippleY);
        ctx.stroke();
      }

      ctx.strokeStyle = laneColor;
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

      if (currentGameState === 'playing') {
        state.frames += 1;
        state.waterOffset += state.speed;

        state.spawnCooldown -= 1;
        if (state.spawnCooldown <= 0) {
          const lane = Math.floor(Math.random() * 3);
          state.obstacles.push({ lane, y: -62, passed: false });
          const safeGap = Math.max(config.spawnFloor, config.spawnBase - Math.floor(state.speed * 3.5));
          state.spawnCooldown = Math.round(safeGap + randomBetween(4, 18));
        }

        if (state.frames % 300 === 0) {
          state.speed += config.speedRamp;
        }

        const targetX = getLaneCenter(state.lane);
        state.visualX += (targetX - state.visualX) * config.moveEase;

        const playerY = canvas.height - 80;
        const playerCollisionX = state.visualX;

        let didHit = false;
        state.obstacles.forEach((obstacle) => {
          obstacle.y += state.speed;
          drawLilyPad(getLaneCenter(obstacle.lane), obstacle.y);

          if (!didHit) {
            const obstacleX = getLaneCenter(obstacle.lane);
            const horizontalOverlap = Math.abs(obstacleX - playerCollisionX) < 34;
            const verticalOverlap = Math.abs(obstacle.y - (playerY + 8)) < 22;
            if (horizontalOverlap && verticalOverlap) {
              didHit = true;
              state.hitFrames = 26;
              state.hitObstacle = { ...obstacle };
              gameStateRef.current = 'hit';
              setGameState('hit');
            }
          }

          if (!didHit && !obstacle.passed && obstacle.y > playerY + 36) {
            obstacle.passed = true;
            state.score += 1;
            setScore(state.score);
          }
        });

        state.obstacles = state.obstacles.filter((obstacle) => obstacle.y < canvas.height + 50);
      } else if (currentGameState === 'hit') {
        state.waterOffset += Math.max(0.8, state.speed * 0.18);
        state.obstacles.forEach((obstacle) => drawLilyPad(getLaneCenter(obstacle.lane), obstacle.y));
        if (state.hitObstacle) {
          drawHitBurst(getLaneCenter(state.hitObstacle.lane), state.hitObstacle.y, state.hitFrames);
        }
        state.hitFrames -= 1;
        if (state.hitFrames <= 0) {
          gameStateRef.current = 'over';
          setGameState('over');
        }
      } else if (currentGameState === 'start') {
        state.waterOffset += 1;
        state.visualX = getLaneCenter(1);
      }

      drawFrog(state.visualX, canvas.height - 80, currentGameState === 'hit');
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [config.moveEase, config.spawnBase, config.spawnFloor, config.speedRamp, gameState, isLofi]);

  useEffect(() => {
    if (gameState === 'over' && score > highScore) {
      setHighScore(score);
      localStorage.setItem(highScoreKey, String(score));
    }
  }, [gameState, highScoreKey, highScore, score]);

  return (
    <div className="mx-auto mt-12 w-full max-w-2xl pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_28px_80px_rgba(83,62,44,0.12)]' : 'border-teal-200 bg-gradient-to-br from-white via-teal-50/70 to-sky-50/78'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,236,0.9)_45%,rgba(220,236,243,0.78)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #7a6250 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          </>
        )}
        <div className="relative z-10 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-teal-200 bg-white/88 text-teal-700'}`}>
              <Sparkles size={14} /> {config.label} current
            </div>
            <h3 className={`mt-3 text-2xl font-bold ${isLofi ? 'text-[#3d3025]' : 'text-teal-900'}`}>Lilypad Hopper</h3>
            <p className={`text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-teal-700'}`}>{isLofi ? 'A lofi pond dodge with pastel water, warm glass controls, and a softer arcade rhythm.' : 'A frog-themed 3-lane pond dodge that feels lighter on mobile.'}</p>
            <p className={`mt-1 text-sm ${isLofi ? 'text-[#8c755f]' : 'text-teal-600'}`}>{config.note}</p>
          </div>
          <div className={`flex flex-wrap gap-3 text-sm font-extrabold uppercase tracking-widest ${isLofi ? 'text-amber-900' : 'text-teal-700'}`}>
            <span className={`rounded-full px-4 py-2 shadow-sm ${isLofi ? 'bg-amber-50 border border-white/70' : 'bg-teal-100'}`}>Score: {score}</span>
            <span className={`rounded-full px-4 py-2 shadow-sm ${isLofi ? 'border border-white/70 bg-white/82 backdrop-blur-sm' : 'border border-teal-200 bg-white'}`}>Best: {highScore}</span>
          </div>
        </div>
        <div className={`relative overflow-hidden rounded-[2rem] border shadow-sm transition hover:shadow-soft ${isLofi ? 'border-white/70 bg-white/60 backdrop-blur-sm' : 'border-teal-200'}`} style={{ aspectRatio: '3/2' }}>
          <canvas ref={canvasRef} width={600} height={400} className="block h-full w-full touch-none" />

          {gameState === 'playing' && (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:hidden">
              <button
                className={`pointer-events-auto inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm backdrop-blur ${isLofi ? 'bg-white/84 text-amber-900' : 'bg-white/88 text-teal-900'}`}
                onTouchStart={(event) => {
                  event.preventDefault();
                  handleMove(-1);
                }}
                type="button"
              >
                <ArrowLeft size={18} className="mr-2" /> Hop left
              </button>
              <button
                className={`pointer-events-auto inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm backdrop-blur ${isLofi ? 'bg-white/84 text-amber-900' : 'bg-white/88 text-teal-900'}`}
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
            <div className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center backdrop-blur-[3px] ${isLofi ? 'bg-white/34' : 'bg-white/30'}`}>
              <button onClick={startGame} className={`mb-4 flex items-center gap-3 rounded-full px-6 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 sm:px-8 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-teal-700 hover:bg-teal-600'}`} type="button">
                <Play size={18} /> Start hopping
              </button>
              <p className={`flex flex-wrap items-center justify-center gap-3 rounded-full px-4 py-2 text-sm font-semibold sm:gap-4 sm:px-5 ${isLofi ? 'bg-white/76 text-[#4a3a2d]' : 'bg-white/80 text-teal-900'}`}>
                <span><ArrowLeft size={16} className="mr-1 inline" /> Left</span>
                <span className={`hidden h-4 w-px sm:block ${isLofi ? 'bg-amber-200' : 'bg-teal-200'}`} />
                <span>Right <ArrowRight size={16} className="ml-1 inline" /></span>
              </p>
            </div>
          )}

          {gameState === 'over' && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center backdrop-blur-[5px] ${isLofi ? 'bg-white/48' : 'bg-white/60'}`}>
              <p className={`mb-2 font-display text-3xl font-extrabold sm:text-4xl ${isLofi ? 'text-[#3d3025]' : 'text-teal-950'}`}>Your frog slipped off the pad.</p>
              <p className={`mb-3 text-lg font-bold ${isLofi ? 'text-[#6e5a4a]' : 'text-teal-800'}`}>Final Score: {score}</p>
              <p className={`mb-8 rounded-full px-4 py-2 text-sm font-semibold ${isLofi ? 'bg-white/76 text-[#4a3a2d]' : 'bg-white/75 text-teal-700'}`}>{config.note}</p>
              <button
                onClick={startGame}
                className={`flex items-center gap-3 rounded-full px-6 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 sm:px-8 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-teal-700 hover:bg-teal-600'}`}
                type="button"
              >
                <RotateCcw size={18} /> Hop again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
