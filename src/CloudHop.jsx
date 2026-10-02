import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Play, RotateCcw, Sunrise } from 'lucide-react';

const WIDTH = 640;
const HEIGHT = 360;
const STORAGE_KEY = 'quiet-journal-cloud-hop-best';
const GRAVITY = 0.52;
const JUMP = -10.4;
const GROUND_Y = 290;

const createPlatforms = () => [
  { x: 180, y: 250, width: 90, height: 14 },
  { x: 340, y: 210, width: 90, height: 14 },
  { x: 510, y: 170, width: 90, height: 14 }
];

const createInitialState = () => ({
  player: { x: 90, y: GROUND_Y - 28, w: 24, h: 28, vy: 0, grounded: true },
  blocks: createPlatforms(),
  enemies: [{ x: 420, y: GROUND_Y - 18, w: 24, h: 18 }, { x: 690, y: GROUND_Y - 18, w: 24, h: 18 }],
  coins: [
    { x: 220, y: 220, r: 8, taken: false },
    { x: 385, y: 180, r: 8, taken: false },
    { x: 548, y: 140, r: 8, taken: false },
    { x: 760, y: 228, r: 8, taken: false }
  ],
  speed: 3.8,
  distance: 0,
  score: 0,
  frames: 0
});

const overlaps = (a, b) => !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);

export default function CloudHop() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef(createInitialState());

  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10));

  const jump = () => {
    const state = stateRef.current;
    if (gameState !== 'playing') {
      startGame();
      return;
    }
    if (state.player.grounded) {
      state.player.vy = JUMP;
      state.player.grounded = false;
    }
  };

  const startGame = () => {
    stateRef.current = createInitialState();
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === ' ' || event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const finishGame = () => {
      setGameState('over');
      setBestScore((current) => {
        if (stateRef.current.score > current) {
          localStorage.setItem(STORAGE_KEY, String(Math.floor(stateRef.current.score)));
          return Math.floor(stateRef.current.score);
        }
        return current;
      });
    };

    const recyclePlatform = (platform, offset) => ({
      ...platform,
      x: WIDTH + offset,
      y: 150 + Math.random() * 110
    });

    const update = () => {
      const state = stateRef.current;
      const { player } = state;
      state.frames += 1;
      state.distance += state.speed * 0.35;
      state.score = Math.floor(state.distance);

      player.vy += GRAVITY;
      player.y += player.vy;
      player.grounded = false;

      if (player.y + player.h >= GROUND_Y) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.grounded = true;
      }

      state.blocks = state.blocks.map((platform, index) => {
        const next = { ...platform, x: platform.x - state.speed };
        if (next.x + next.width < -40) return recyclePlatform(next, 160 + index * 120);
        return next;
      });

      state.blocks.forEach((platform) => {
        const wasAbove = player.y + player.h - player.vy <= platform.y;
        const onPlatform = player.x + player.w > platform.x && player.x < platform.x + platform.width && player.y + player.h >= platform.y && player.y + player.h <= platform.y + 18;
        if (wasAbove && onPlatform && player.vy >= 0) {
          player.y = platform.y - player.h;
          player.vy = 0;
          player.grounded = true;
        }
      });

      state.enemies = state.enemies.map((enemy, index) => {
        const next = { ...enemy, x: enemy.x - state.speed };
        if (next.x + next.w < -60) return { ...next, x: WIDTH + 240 + index * 180 };
        return next;
      });

      state.coins = state.coins.map((coin, index) => {
        const next = { ...coin, x: coin.x - state.speed };
        if (next.x + next.r < -40) return { ...next, x: WIDTH + 180 + index * 130, y: 150 + Math.random() * 95, taken: false };
        return next;
      });

      state.coins.forEach((coin) => {
        if (coin.taken) return;
        const dx = player.x + player.w / 2 - coin.x;
        const dy = player.y + player.h / 2 - coin.y;
        if (Math.hypot(dx, dy) < coin.r + 10) {
          coin.taken = true;
          state.score += 18;
        }
      });

      const hitEnemy = state.enemies.some((enemy) => overlaps(player, { ...enemy, y: enemy.y }));
      if (hitEnemy) {
        finishGame();
        return false;
      }

      if (player.y > HEIGHT + 40) {
        finishGame();
        return false;
      }

      if (state.frames % 8 === 0) setScore(Math.floor(state.score));
      return true;
    };

    const draw = () => {
      const state = stateRef.current;
      const { player } = state;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      sky.addColorStop(0, '#d9f4ff');
      sky.addColorStop(1, '#eff8f4');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      [[110, 64, 56], [280, 88, 62], [470, 58, 54], [560, 104, 70]].forEach(([x, y, w]) => {
        ctx.beginPath();
        ctx.arc(x, y, w / 2.8, 0, Math.PI * 2);
        ctx.arc(x + 26, y + 10, w / 3.2, 0, Math.PI * 2);
        ctx.arc(x - 24, y + 12, w / 3.4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#cde8b5';
      ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
      ctx.fillStyle = '#9dcc7b';
      ctx.fillRect(0, GROUND_Y - 8, WIDTH, 8);

      state.blocks.forEach((platform) => {
        ctx.fillStyle = '#b58b62';
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 8);
        ctx.fill();
        ctx.fillStyle = '#e5bf93';
        ctx.fillRect(platform.x + 6, platform.y + 4, platform.width - 12, 3);
      });

      state.coins.forEach((coin) => {
        if (coin.taken) return;
        ctx.fillStyle = '#ffd666';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff6cf';
        ctx.beginPath();
        ctx.arc(coin.x - 2, coin.y - 2, coin.r / 2.8, 0, Math.PI * 2);
        ctx.fill();
      });

      state.enemies.forEach((enemy) => {
        ctx.fillStyle = '#9c7a58';
        ctx.beginPath();
        ctx.roundRect(enemy.x, enemy.y, enemy.w, enemy.h, 8);
        ctx.fill();
        ctx.fillStyle = '#fff8ef';
        ctx.beginPath();
        ctx.arc(enemy.x + 7, enemy.y + 7, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + 16, enemy.y + 7, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#6aa35d';
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, player.w, player.h, 8);
      ctx.fill();
      ctx.fillStyle = '#f5f0dd';
      ctx.fillRect(player.x + 5, player.y + 5, player.w - 10, 10);
      ctx.fillStyle = '#375534';
      ctx.fillRect(player.x + 8, player.y + 18, 4, 8);
      ctx.fillRect(player.x + 14, player.y + 18, 4, 8);

      ctx.fillStyle = '#42594a';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText(`Coins ${Math.floor(state.score)}`, 18, 28);
      ctx.fillText(`Best ${bestScore}`, WIDTH - 86, 28);
    };

    const loop = () => {
      if (gameState === 'playing') {
        const keepGoing = update();
        draw();
        if (!keepGoing) return;
      } else {
        draw();
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [bestScore, gameState]);

  return (
    <div className="rounded-[2rem] border border-white/75 bg-gradient-to-br from-white to-amber-50/70 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-700">Platformer calm</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-sage-950">Cloud Hop</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-700">A softer Super Mario-inspired side-scroller. Keep hopping, grab the coins, and stay in the mellow flow.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-600">
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Best {bestScore}</span>
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Now {score}</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-amber-100 bg-white/70 shadow-inner">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full max-w-full bg-transparent" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800" onClick={startGame} type="button">
          {gameState === 'playing' ? <RotateCcw size={16} /> : <Play size={16} />}
          {gameState === 'playing' ? 'Restart run' : 'Start hop'}
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onClick={jump} type="button">
          <ArrowUp size={14} /> Jump
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600">
          <Sunrise size={14} /> Space / Up / W to hop
        </div>
      </div>
    </div>
  );
}
