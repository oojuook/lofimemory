import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export default function ZenGame({ difficulty = 'medium', theme = 'lofi', viewportMode = 'embedded' }) {
  const isLofi = theme === 'lofi';
  const isExpandedLayout = viewportMode === 'fullscreen';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const bestScoreKey = `quiet-journal-highscore-${difficulty}`;

  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window === 'undefined' ? 1280 : window.innerWidth,
    height: typeof window === 'undefined' ? 720 : window.innerHeight
  }));
  const isPhoneViewport = viewportSize.width < 768;
  const isPhonePortraitFullscreen = isExpandedLayout && isPhoneViewport;
  const canvasWidth = isPhonePortraitFullscreen ? 360 : 600;
  const canvasHeight = isPhonePortraitFullscreen ? 640 : 400;
  const initialLeafY = canvasHeight / 2;
  const playerX = isPhonePortraitFullscreen ? 106 : 100;
  const gameplayGapSize = isPhonePortraitFullscreen ? config.gapSize + 26 : config.gapSize;
  const obstacleWidth = isPhonePortraitFullscreen ? 52 : 45;

  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [gameState, setGameState] = useState('start');

  const stateRef = useRef({
    leafY: initialLeafY,
    velocity: 0,
    obstacles: [],
    frames: 0,
    score: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    stateRef.current = {
      leafY: initialLeafY,
      velocity: 0,
      obstacles: [],
      frames: 0,
      score: 0
    };
    setScore(0);
    setGameState('start');
    setHighScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  }, [bestScoreKey, initialLeafY]);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      stateRef.current.velocity = config.jumpVelocity;
    } else if (gameState === 'start' || gameState === 'over') {
      stateRef.current = {
        leafY: initialLeafY,
        velocity: config.jumpVelocity,
        obstacles: [],
        frames: 0,
        score: 0
      };
      setScore(0);
      setGameState('playing');
    }
  }, [config.jumpVelocity, gameState, initialLeafY]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
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

    const drawLeaf = (x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      if (isLofi) {
        ctx.fillStyle = '#f8efe2';
        ctx.beginPath();
        ctx.ellipse(0, 3, 15, 19, 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b08968';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f6d5d8';
        [-14, -6, 2, 10].forEach((offsetX, index) => {
          ctx.beginPath();
          ctx.ellipse(offsetX, -14 + Math.abs(index - 1.5), 5.2, 8.5, offsetX * 0.04, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#a3b18a';
        ctx.beginPath();
        ctx.ellipse(0, -10, 5.5, 10.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#6b8f71';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.quadraticCurveTo(1, -10, 0, -2);
        ctx.stroke();

        ctx.fillStyle = '#3d3025';
        ctx.beginPath();
        ctx.arc(-4.5, 1, 1.4, 0, Math.PI * 2);
        ctx.arc(4.5, 1, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#7f5539';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 5.5, 4.8, 0.15, Math.PI - 0.15);
        ctx.stroke();

        ctx.fillStyle = '#ffcad4';
        ctx.beginPath();
        ctx.ellipse(-8.5, 5, 3.2, 2.1, 0, 0, Math.PI * 2);
        ctx.ellipse(8.5, 5, 3.2, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.82)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, -7);
        ctx.quadraticCurveTo(0, -1, 0, 13);
        ctx.stroke();

        ctx.restore();
        return;
      }

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

      ctx.fillStyle = isLofi ? '#fff9f0' : '#f7faf4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isLofi) {
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#fffaf4');
        skyGradient.addColorStop(0.55, '#faedcd');
        skyGradient.addColorStop(1, '#f8efe2');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.ellipse(canvas.width * 0.2, canvas.height * 0.16, 56, 20, -0.08, 0, Math.PI * 2);
        ctx.ellipse(canvas.width * 0.72, canvas.height * 0.22, 68, 24, 0.06, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(74, 58, 45, 0.04)';
        for (let i = 0; i < canvas.width; i += 24) {
          for (let j = 0; j < canvas.height; j += 24) {
            ctx.fillRect(i, j, 1.5, 1.5);
          }
        }
      }

      ctx.fillStyle = isLofi ? '#fdfaf5' : '#edf4e8';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, canvas.height - 80);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 200, canvas.width, canvas.height - 60);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      if (isLofi) {
        ctx.strokeStyle = '#e8dfd5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 80);
        ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 200, canvas.width, canvas.height - 60);
        ctx.stroke();
      }

      if (gameState === 'playing') {
        state.velocity += config.gravity;
        state.leafY += state.velocity;

        if (state.frames % config.spawnRate === 0) {
          const gapTop = Math.random() * (canvas.height - (gameplayGapSize + 110)) + 55;
          state.obstacles.push({ x: canvas.width, gapTop, passed: false });
        }

        state.obstacles.forEach((obstacle) => {
          obstacle.x -= config.obstacleSpeed;

          ctx.fillStyle = isLofi ? '#faedcd' : '#dcebd3';

          ctx.beginPath();
          ctx.roundRect(obstacle.x, -20, obstacleWidth, obstacle.gapTop + 20, 12);
          ctx.fill();

          if (isLofi) {
            ctx.strokeStyle = '#e8dfd5';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.roundRect(obstacle.x, obstacle.gapTop + gameplayGapSize, obstacleWidth, canvas.height - obstacle.gapTop - gameplayGapSize + 20, 12);
          ctx.fill();

          if (isLofi) {
            ctx.stroke();
          }

          const leafRadius = 14;
          const hitTop = playerX + leafRadius > obstacle.x && playerX - leafRadius < obstacle.x + obstacleWidth && state.leafY - leafRadius < obstacle.gapTop;
          const hitBottom = playerX + leafRadius > obstacle.x && playerX - leafRadius < obstacle.x + obstacleWidth && state.leafY + leafRadius > obstacle.gapTop + gameplayGapSize;

          if (hitTop || hitBottom) {
            setGameState('over');
          }

          if (!obstacle.passed && obstacle.x + obstacleWidth < playerX) {
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
        state.leafY = initialLeafY + Math.sin(Date.now() / 400) * 12;
      }

      const angle = Math.min(Math.max(state.velocity * 0.08, -0.4), 1.2);
      drawLeaf(playerX, state.leafY, angle);

      state.frames += 1;
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [config.gravity, config.obstacleSpeed, config.spawnRate, gameState, gameplayGapSize, initialLeafY, isLofi, obstacleWidth, playerX]);

  useEffect(() => {
    if (gameState === 'over' && score > highScore) {
      setHighScore(score);
      localStorage.setItem(bestScoreKey, String(score));
    }
  }, [bestScoreKey, gameState, highScore, score]);

  const levelText = useMemo(() => config.label, [config.label]);

  return (
    <div className={`mx-auto w-full ${isExpandedLayout ? 'h-full flex-1 flex items-center justify-center max-w-none overflow-hidden' : 'mt-12 max-w-3xl pb-12'}`}>
      <div className={isExpandedLayout ? 'relative' : `relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-[#e8dfd5]/80 bg-[#fff9f0] shadow-[0_28px_80px_rgba(83,62,44,0.12)]' : 'border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sky-50/74'}`}>
        {isLofi ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(255,249,240,0.92)_45%,rgba(189,224,254,0.45)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6e5a4a 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          </>
        ) : null}

        {!isExpandedLayout ? (
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/85 text-amber-800' : 'border-sage-200 bg-white/88 text-sage-700'}`}>
              <Sparkles size={14} /> {levelText} drift
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-sage-900'}`}>Drifting Seed</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>A calming float-through game with warm cream skies, pastel obstacles, and quieter feedback for restless thoughts.</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-600'}`}>{config.note}</p>
          </div>
          <div className={`grid gap-2 p-3 shadow-sm sm:grid-cols-3 ${isLofi ? 'rounded-[1.5rem] border border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'rounded-[1.5rem] border border-white/85 bg-white/80'}`}>
            {[
              ['Score', score],
              ['Best', highScore],
              ['Pace', levelText]
            ].map(([label, value]) => (
              <div key={label} className={`${isLofi ? 'rounded-[1.2rem] bg-[#faedcd] text-[#3d3025]' : 'rounded-[1.15rem] bg-sage-50'} px-4 py-3 text-center`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-[#6e5a4a]/70' : 'text-sage-500'}`}>{label}</p>
                <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
        ) : null}

        <div className={`relative z-10 ${isExpandedLayout ? (isPhonePortraitFullscreen ? 'mx-auto w-full max-w-[min(92vw,430px)]' : 'w-full max-w-[min(96vw,1200px)]') : 'mt-5 rounded-[1.5rem] border p-3 shadow-sm sm:p-4'} ${isExpandedLayout ? (isLofi ? 'rounded-[2rem] border border-[#e8dfd5]/80 bg-white/72 p-3 shadow-[0_22px_50px_rgba(83,62,44,0.12)] backdrop-blur-sm sm:p-4' : 'rounded-[2rem] border border-white/85 bg-white/78 p-3 shadow-soft sm:p-4') : (isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-sage-200 bg-white')}`}>
          <div className={`relative overflow-hidden ${isExpandedLayout ? (isPhonePortraitFullscreen ? 'rounded-[1.8rem]' : 'rounded-[1.4rem]') : 'rounded-[1.5rem] border'} ${isLofi ? (isExpandedLayout ? 'bg-[#fff9f0]' : 'border-[#e8dfd5] bg-[#fff9f0]') : (isExpandedLayout ? 'bg-white' : 'border-sage-200')} shadow-sm`} style={{ aspectRatio: isPhonePortraitFullscreen ? '9 / 16' : '3 / 2' }}>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="block h-full w-full cursor-pointer touch-none"
              onClick={jump}
            />
            {isExpandedLayout ? (
              <div className={`absolute z-50 pointer-events-none ${isPhonePortraitFullscreen ? 'left-1/2 top-4 -translate-x-1/2 sm:top-5' : 'right-4 top-4 sm:right-6 sm:top-6'}`}>
                <div className={`flex items-center gap-3 rounded-[1.35rem] border p-2.5 shadow-sm backdrop-blur-md pointer-events-auto ${isLofi ? 'border-[#e8dfd5]/90 bg-white/78 text-[#4a3a2d]' : 'border-white/20 bg-black/10 text-white'}`}>
                   <div className={`px-3 py-1 text-center ${isLofi ? 'border-r border-[#e8dfd5]/90' : 'border-r border-white/20'}`}>
                     <p className={`text-[9px] font-black uppercase tracking-widest ${isLofi ? 'text-[#6e5a4a]/70' : 'text-white/70'}`}>Score</p>
                     <p className="text-lg font-black">{score}</p>
                   </div>
                   <div className="px-3 py-1 text-center">
                     <p className={`text-[9px] font-black uppercase tracking-widest ${isLofi ? 'text-[#6e5a4a]/70' : 'text-white/70'}`}>Best</p>
                     <p className="text-lg font-black">{highScore}</p>
                   </div>
                </div>
              </div>
            ) : null}

            {gameState === 'start' && !isExpandedLayout && (
              <div className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center backdrop-blur-[3px] ${isLofi ? 'bg-white/28' : 'bg-white/30'}`}>
                <button className={`pointer-events-auto mb-4 flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-sage-800 hover:bg-sage-700'}`} onClick={jump} type="button">
                  <Play size={18} /> Tap to float
                </button>
                <p className={`rounded-full border px-4 py-2 text-sm font-semibold ${isLofi ? 'border-[#e8dfd5] bg-white/78 text-[#4a3a2d]' : 'bg-white/70 text-sage-900'}`}>Press Space or click to drift.</p>
              </div>
            )}

            {gameState === 'over' && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center backdrop-blur-[5px] ${isLofi ? 'bg-white/46' : 'bg-white/50'}`}>
                <p className={`mb-2 font-display text-4xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>{isLofi ? 'The seed settled.' : 'The leaf landed.'}</p>
                <p className={`mb-3 text-lg font-bold ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-800'}`}>Final Score: {score}</p>
                <p className={`mb-8 rounded-full border px-4 py-2 text-sm font-semibold ${isLofi ? 'border-[#e8dfd5] bg-white/78 text-[#4a3a2d]' : 'bg-white/75 text-sage-700'}`}>{config.note}</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    jump();
                  }}
                  className={`flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-sage-800 hover:bg-sage-700'}`}
                  type="button"
                >
                  <RotateCcw size={18} /> Drift again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
