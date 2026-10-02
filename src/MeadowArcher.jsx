import React, { useEffect, useRef, useState } from 'react';
import { Move, Play, RotateCcw } from 'lucide-react';

const WIDTH = 620;
const HEIGHT = 360;
const STORAGE_KEY = 'quiet-journal-meadow-archer-high';

const createInitialState = () => ({
  player: { x: WIDTH / 2, y: HEIGHT - 58, size: 18 },
  enemies: [],
  shots: [],
  frames: 0,
  score: 0,
  survived: 0
});

export default function MeadowArcher() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const keysRef = useRef({});
  const pointerRef = useRef({ active: false, x: WIDTH / 2, y: HEIGHT - 58 });
  const stateRef = useRef(createInitialState());

  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10));

  const startGame = () => {
    stateRef.current = createInitialState();
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      keysRef.current[event.key.toLowerCase()] = true;
    };
    const onKeyUp = (event) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const endRun = () => {
      setGameState('over');
      setBestScore((current) => {
        if (stateRef.current.score > current) {
          localStorage.setItem(STORAGE_KEY, String(stateRef.current.score));
          return stateRef.current.score;
        }
        return current;
      });
    };

    const spawnEnemy = () => {
      const x = 48 + Math.random() * (WIDTH - 96);
      stateRef.current.enemies.push({
        x,
        y: -18,
        radius: 15 + Math.random() * 7,
        speed: 1.3 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.9
      });
    };

    const update = () => {
      const state = stateRef.current;
      state.frames += 1;
      state.survived += 1;

      const { player } = state;
      const speed = 4.6;
      const left = keysRef.current.arrowleft || keysRef.current.a;
      const right = keysRef.current.arrowright || keysRef.current.d;
      const up = keysRef.current.arrowup || keysRef.current.w;
      const down = keysRef.current.arrowdown || keysRef.current.s;

      if (left) player.x -= speed;
      if (right) player.x += speed;
      if (up) player.y -= speed;
      if (down) player.y += speed;

      if (pointerRef.current.active) {
        player.x += (pointerRef.current.x - player.x) * 0.18;
        player.y += (pointerRef.current.y - player.y) * 0.18;
      }

      player.x = Math.max(24, Math.min(WIDTH - 24, player.x));
      player.y = Math.max(40, Math.min(HEIGHT - 30, player.y));

      if (state.frames % 16 === 0) {
        state.shots.push({ x: player.x, y: player.y - 12, radius: 5, speed: 7.4 });
      }

      if (state.frames % 34 === 0) spawnEnemy();

      state.shots = state.shots
        .map((shot) => ({ ...shot, y: shot.y - shot.speed }))
        .filter((shot) => shot.y > -20);

      state.enemies = state.enemies
        .map((enemy) => ({ ...enemy, x: enemy.x + enemy.drift, y: enemy.y + enemy.speed }))
        .filter((enemy) => enemy.y < HEIGHT + 30);

      const survivingShots = [];
      const survivingEnemies = [];

      state.enemies.forEach((enemy) => {
        let defeated = false;

        for (let index = 0; index < state.shots.length; index += 1) {
          const shot = state.shots[index];
          const dx = shot.x - enemy.x;
          const dy = shot.y - enemy.y;
          if (Math.hypot(dx, dy) < enemy.radius + shot.radius) {
            state.shots.splice(index, 1);
            state.score += 12;
            defeated = true;
            break;
          }
        }

        if (!defeated) survivingEnemies.push(enemy);
      });

      state.shots.forEach((shot) => survivingShots.push(shot));
      state.shots = survivingShots;
      state.enemies = survivingEnemies;

      const collided = state.enemies.some((enemy) => Math.hypot(enemy.x - player.x, enemy.y - player.y) < enemy.radius + player.size - 6);
      if (collided) {
        setScore(state.score);
        endRun();
        return false;
      }

      if (state.frames % 6 === 0) {
        setScore(state.score + Math.floor(state.survived / 15));
      }

      state.score += 0.08;
      return true;
    };

    const draw = () => {
      const state = stateRef.current;
      const { player } = state;

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      bg.addColorStop(0, '#f6fbf6');
      bg.addColorStop(1, '#deefe2');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < 10; i += 1) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(146, 175, 144, 0.09)';
        ctx.fillRect(0, i * 42, WIDTH, 22);
      }

      ctx.fillStyle = 'rgba(103, 143, 92, 0.18)';
      ctx.beginPath();
      ctx.arc(player.x, player.y + 8, player.size + 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6f975e';
      state.shots.forEach((shot) => {
        ctx.beginPath();
        ctx.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      state.enemies.forEach((enemy) => {
        ctx.fillStyle = '#87a06d';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f7f1dc';
        ctx.beginPath();
        ctx.arc(enemy.x - 4, enemy.y - 2, 2.2, 0, Math.PI * 2);
        ctx.arc(enemy.x + 4, enemy.y - 2, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#6f975e';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fdf8ef';
      ctx.beginPath();
      ctx.arc(player.x, player.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fdf8ef';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 18);
      ctx.lineTo(player.x, player.y - 30);
      ctx.stroke();

      ctx.fillStyle = '#496445';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText(`Petals ${Math.floor(state.score)}`, 18, 28);
      ctx.fillText(`Best ${bestScore}`, WIDTH - 90, 28);
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
  }, [gameState, bestScore]);

  return (
    <div className="rounded-[2rem] border border-white/75 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-700">Auto-shooter calm</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-sage-950">Meadow Archer</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-700">Inspired by Archero energy, but softer. Drift around the meadow and let the petals auto-fire for you.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-600">
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Best {bestScore}</span>
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Now {Math.floor(score)}</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-white/70 shadow-inner">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="w-full max-w-full bg-transparent"
          onPointerDown={(event) => {
            if (gameState !== 'playing') return;
            pointerRef.current.active = true;
            const rect = event.currentTarget.getBoundingClientRect();
            pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * WIDTH;
            pointerRef.current.y = ((event.clientY - rect.top) / rect.height) * HEIGHT;
          }}
          onPointerMove={(event) => {
            if (!pointerRef.current.active || gameState !== 'playing') return;
            const rect = event.currentTarget.getBoundingClientRect();
            pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * WIDTH;
            pointerRef.current.y = ((event.clientY - rect.top) / rect.height) * HEIGHT;
          }}
          onPointerUp={() => {
            pointerRef.current.active = false;
          }}
          onPointerLeave={() => {
            pointerRef.current.active = false;
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800"
          onClick={startGame}
          type="button"
        >
          {gameState === 'playing' ? <RotateCcw size={16} /> : <Play size={16} />}
          {gameState === 'playing' ? 'Restart run' : 'Start run'}
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600">
          <Move size={14} /> Drag or use WASD / arrows
        </div>
      </div>
    </div>
  );
}
