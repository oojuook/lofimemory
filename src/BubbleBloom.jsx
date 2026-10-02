import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, RotateCcw, Sparkles, Upload } from 'lucide-react';

const WIDTH = 620;
const HEIGHT = 360;
const STORAGE_KEY = 'quiet-journal-bubble-bloom-best';
const GRAVITY = 0.48;
const MOVE_SPEED = 3.4;
const JUMP_SPEED = -8.8;

const PLATFORMS = [
  { x: 40, y: 308, width: 540, height: 16 },
  { x: 42, y: 236, width: 150, height: 12 },
  { x: 244, y: 236, width: 132, height: 12 },
  { x: 428, y: 236, width: 150, height: 12 },
  { x: 98, y: 164, width: 126, height: 12 },
  { x: 398, y: 164, width: 126, height: 12 },
  { x: 220, y: 98, width: 180, height: 12 }
];

const makeEnemies = (stage) => [
  { id: `a-${stage}`, x: 110, y: 278, vx: 1.1 + stage * 0.08, vy: 0, w: 20, h: 20, bubbled: false },
  { id: `b-${stage}`, x: 300, y: 206, vx: -1.2 - stage * 0.05, vy: 0, w: 20, h: 20, bubbled: false },
  { id: `c-${stage}`, x: 500, y: 134, vx: 1 + stage * 0.04, vy: 0, w: 20, h: 20, bubbled: false }
];

const createInitialState = (stage = 1) => ({
  player: { x: 84, y: 278, vx: 0, vy: 0, w: 26, h: 26, facing: 1, grounded: false },
  bubbles: [],
  enemies: makeEnemies(stage),
  stage,
  frames: 0,
  score: 0
});

const intersects = (a, b) => !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);

const resolvePlatformLanding = (entity, previousY) => {
  entity.grounded = false;
  PLATFORMS.forEach((platform) => {
    const withinX = entity.x + entity.w > platform.x && entity.x < platform.x + platform.width;
    const crossedTop = previousY + entity.h <= platform.y && entity.y + entity.h >= platform.y;
    if (withinX && crossedTop && entity.vy >= 0) {
      entity.y = platform.y - entity.h;
      entity.vy = 0;
      entity.grounded = true;
    }
  });
};

export default function BubbleBloom() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const inputRef = useRef({ left: false, right: false });
  const stateRef = useRef(createInitialState());

  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10));

  const spawnBubble = () => {
    if (gameState !== 'playing') return;
    const state = stateRef.current;
    const { player } = state;
    state.bubbles.push({
      id: `bubble-${Date.now()}-${Math.random()}`,
      x: player.x + player.w / 2,
      y: player.y + 10,
      vx: 4.6 * player.facing,
      vy: -0.4,
      radius: 12,
      life: 0,
      trappedEnemyId: null
    });
  };

  const jump = () => {
    if (gameState === 'playing' && stateRef.current.player.grounded) {
      stateRef.current.player.vy = JUMP_SPEED;
      stateRef.current.player.grounded = false;
    } else if (gameState !== 'playing') {
      startGame();
    }
  };

  const startGame = () => {
    stateRef.current = createInitialState(1);
    setStage(1);
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') inputRef.current.left = true;
      if (key === 'arrowright' || key === 'd') inputRef.current.right = true;
      if (key === 'arrowup' || key === 'w' || key === ' ') {
        event.preventDefault();
        jump();
      }
      if (key === 'enter' || key === 'shift') spawnBubble();
    };

    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') inputRef.current.left = false;
      if (key === 'arrowright' || key === 'd') inputRef.current.right = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const finishRun = () => {
      setGameState('over');
      setBestScore((current) => {
        if (stateRef.current.score > current) {
          localStorage.setItem(STORAGE_KEY, String(Math.floor(stateRef.current.score)));
          return Math.floor(stateRef.current.score);
        }
        return current;
      });
    };

    const goToNextStage = () => {
      const nextStage = stateRef.current.stage + 1;
      stateRef.current = {
        ...createInitialState(nextStage),
        score: stateRef.current.score + 40
      };
      setStage(nextStage);
    };

    const update = () => {
      const state = stateRef.current;
      const { player } = state;
      state.frames += 1;
      const previousY = player.y;

      player.vx = 0;
      if (inputRef.current.left) {
        player.vx = -MOVE_SPEED;
        player.facing = -1;
      }
      if (inputRef.current.right) {
        player.vx = MOVE_SPEED;
        player.facing = 1;
      }

      player.x += player.vx;
      if (player.x < -player.w) player.x = WIDTH;
      if (player.x > WIDTH) player.x = -player.w;

      player.vy += GRAVITY;
      player.y += player.vy;
      resolvePlatformLanding(player, previousY);

      if (player.y > HEIGHT + 40) {
        finishRun();
        return false;
      }

      state.enemies.forEach((enemy) => {
        if (enemy.bubbled) {
          enemy.y -= 1.1;
          return;
        }

        const enemyPreviousY = enemy.y;
        enemy.x += enemy.vx;
        if (enemy.x < 0 || enemy.x + enemy.w > WIDTH) enemy.vx *= -1;
        enemy.vy += 0.42;
        enemy.y += enemy.vy;
        resolvePlatformLanding(enemy, enemyPreviousY);
      });

      state.bubbles = state.bubbles
        .map((bubble) => {
          const nextBubble = { ...bubble, life: bubble.life + 1 };
          nextBubble.x += nextBubble.vx;
          nextBubble.y += nextBubble.trappedEnemyId ? -1.1 : nextBubble.vy;
          if (!nextBubble.trappedEnemyId) nextBubble.vx *= 0.992;
          return nextBubble;
        })
        .filter((bubble) => bubble.life < 240 && bubble.y > -40 && bubble.x > -40 && bubble.x < WIDTH + 40);

      state.bubbles.forEach((bubble) => {
        if (bubble.trappedEnemyId) {
          const trapped = state.enemies.find((enemy) => enemy.id === bubble.trappedEnemyId);
          if (trapped) {
            trapped.x = bubble.x - trapped.w / 2;
            trapped.y = bubble.y - trapped.h / 2;
          }
          return;
        }

        state.enemies.forEach((enemy) => {
          if (enemy.bubbled) return;
          const dx = bubble.x - (enemy.x + enemy.w / 2);
          const dy = bubble.y - (enemy.y + enemy.h / 2);
          if (Math.hypot(dx, dy) < bubble.radius + enemy.w / 2 - 2) {
            enemy.bubbled = true;
            bubble.trappedEnemyId = enemy.id;
          }
        });
      });

      state.enemies = state.enemies.filter((enemy) => {
        if (!enemy.bubbled) {
          const touchingPlayer = intersects(player, enemy);
          if (touchingPlayer) {
            finishRun();
            return true;
          }
          return true;
        }

        const popped = intersects(player, enemy);
        if (popped) {
          state.score += 22;
          state.bubbles = state.bubbles.filter((bubble) => bubble.trappedEnemyId !== enemy.id);
          return false;
        }
        return enemy.y + enemy.h > -30;
      });

      if (state.enemies.length === 0) {
        goToNextStage();
      }

      if (state.frames % 8 === 0) setScore(Math.floor(state.score));
      return true;
    };

    const draw = () => {
      const state = stateRef.current;
      const { player } = state;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      bg.addColorStop(0, '#14172a');
      bg.addColorStop(1, '#1d2451');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < 18; i += 1) {
        ctx.fillStyle = i % 3 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(145,168,255,0.06)';
        ctx.beginPath();
        ctx.arc((i * 37) % WIDTH, 24 + (i * 29) % 120, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      PLATFORMS.forEach((platform) => {
        ctx.fillStyle = '#7d82d9';
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 12);
        ctx.fill();
        ctx.fillStyle = '#b3b7ff';
        ctx.fillRect(platform.x + 8, platform.y + 4, platform.width - 16, 3);
      });

      state.bubbles.forEach((bubble) => {
        ctx.fillStyle = bubble.trappedEnemyId ? 'rgba(120, 238, 255, 0.34)' : 'rgba(145, 236, 255, 0.22)';
        ctx.strokeStyle = '#92ebff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      state.enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.bubbled ? '#ffd36f' : '#ff8db9';
        ctx.beginPath();
        ctx.roundRect(enemy.x, enemy.y, enemy.w, enemy.h, 9);
        ctx.fill();
        ctx.fillStyle = '#1f2048';
        ctx.beginPath();
        ctx.arc(enemy.x + 6, enemy.y + 8, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + 14, enemy.y + 8, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#76f3a6';
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, player.w, player.h, 10);
      ctx.fill();
      ctx.fillStyle = '#20354f';
      ctx.beginPath();
      ctx.arc(player.x + 8, player.y + 10, 2.2, 0, Math.PI * 2);
      ctx.arc(player.x + 18, player.y + 10, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f4fbff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(player.x + player.w / 2, player.y + 5);
      ctx.lineTo(player.x + player.w / 2 + player.facing * 12, player.y + 2);
      ctx.stroke();

      ctx.fillStyle = '#f7f3ff';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText(`Stage ${state.stage}`, 18, 28);
      ctx.fillText(`Score ${Math.floor(state.score)}`, 18, 48);
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
  }, [bestScore, gameState]);

  return (
    <div className="rounded-[2rem] border border-white/75 bg-gradient-to-br from-white to-sky-50/70 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sky-700">Bubble platform calm</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-sage-950">Bubble Bloom</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-700">A Bubble Bobble-inspired chill platformer. Float through one room, trap the little bloom creatures, then pop them to clear the stage.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-600">
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Stage {stage}</span>
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Best {bestScore}</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-sky-100 bg-white/70 shadow-inner">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full max-w-full bg-transparent" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800" onClick={startGame} type="button">
          {gameState === 'playing' ? <RotateCcw size={16} /> : <Play size={16} />}
          {gameState === 'playing' ? 'Restart room' : 'Start bloom'}
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onPointerDown={() => { inputRef.current.left = true; }} onPointerUp={() => { inputRef.current.left = false; }} onPointerLeave={() => { inputRef.current.left = false; }} type="button">
          <ArrowLeft size={14} /> Left
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onPointerDown={() => { inputRef.current.right = true; }} onPointerUp={() => { inputRef.current.right = false; }} onPointerLeave={() => { inputRef.current.right = false; }} type="button">
          <ArrowRight size={14} /> Right
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onClick={jump} type="button">
          <Upload size={14} /> Jump
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onClick={spawnBubble} type="button">
          <Sparkles size={14} /> Bubble
        </button>
      </div>
    </div>
  );
}
