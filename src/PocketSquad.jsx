import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, RotateCcw, Users } from 'lucide-react';

const WIDTH = 620;
const HEIGHT = 340;
const STORAGE_KEY = 'quiet-journal-pocket-squad-best';
const LANE_WIDTH = WIDTH / 3;
const PLAYER_Y = HEIGHT - 64;

const getLaneCenter = (lane) => lane * LANE_WIDTH + LANE_WIDTH / 2;

const POSITIVE_GATES = [
  { type: 'add', value: 6, label: '+6', color: '#c8efcf' },
  { type: 'add', value: 10, label: '+10', color: '#d4efe1' },
  { type: 'mult', value: 2, label: 'x2', color: '#d9f4ef' }
];

const NEGATIVE_GATES = [
  { type: 'loss', value: 5, label: '-5', color: '#f6ddd4' },
  { type: 'loss', value: 8, label: '-8', color: '#f4d3ca' }
];

const createInitialState = () => ({
  lane: 1,
  visualX: getLaneCenter(1),
  rows: [],
  frames: 0,
  squad: 12,
  distance: 0,
  score: 0
});

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function PocketSquad() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef(createInitialState());

  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [squad, setSquad] = useState(12);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10));

  const moveLane = (direction) => {
    if (gameState !== 'playing') return;
    stateRef.current.lane = Math.max(0, Math.min(2, stateRef.current.lane + direction));
  };

  const startGame = () => {
    stateRef.current = createInitialState();
    setScore(0);
    setSquad(12);
    setGameState('playing');
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') moveLane(-1);
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') moveLane(1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const spawnRow = () => {
      const positives = shuffle(POSITIVE_GATES).slice(0, 2);
      const negative = NEGATIVE_GATES[Math.floor(Math.random() * NEGATIVE_GATES.length)];
      const lanes = shuffle([
        { ...positives[0] },
        { ...positives[1] },
        { ...negative }
      ]);

      stateRef.current.rows.push({
        y: -70,
        applied: false,
        lanes
      });
    };

    const finishGame = () => {
      setGameState('over');
      setBestScore((current) => {
        if (stateRef.current.score > current) {
          localStorage.setItem(STORAGE_KEY, String(stateRef.current.score));
          return stateRef.current.score;
        }
        return current;
      });
    };

    const applyGate = (effect) => {
      const state = stateRef.current;
      if (effect.type === 'add') state.squad += effect.value;
      if (effect.type === 'mult') state.squad = Math.ceil(state.squad * effect.value);
      if (effect.type === 'loss') state.squad -= effect.value;
      setSquad(Math.max(state.squad, 0));
      if (state.squad <= 0) finishGame();
    };

    const update = () => {
      const state = stateRef.current;
      state.frames += 1;
      state.distance += 0.45;
      state.score = Math.floor(state.distance + state.squad * 4);
      state.visualX += (getLaneCenter(state.lane) - state.visualX) * 0.16;

      if (state.frames % 72 === 0) spawnRow();

      state.rows = state.rows
        .map((row) => ({ ...row, y: row.y + 4.2 }))
        .filter((row) => row.y < HEIGHT + 70);

      state.rows.forEach((row) => {
        if (!row.applied && row.y >= PLAYER_Y - 24) {
          row.applied = true;
          applyGate(row.lanes[state.lane]);
        }
      });

      if (state.frames % 10 === 0) setScore(state.score);
    };

    const draw = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      bg.addColorStop(0, '#f8fbf7');
      bg.addColorStop(1, '#e4f0e2');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let lane = 0; lane < 3; lane += 1) {
        ctx.fillStyle = lane % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(214,233,219,0.4)';
        ctx.fillRect(lane * LANE_WIDTH + 8, 0, LANE_WIDTH - 16, HEIGHT);
      }

      ctx.strokeStyle = 'rgba(130, 158, 126, 0.18)';
      ctx.lineWidth = 2;
      for (let lane = 1; lane < 3; lane += 1) {
        ctx.beginPath();
        ctx.moveTo(lane * LANE_WIDTH, 0);
        ctx.lineTo(lane * LANE_WIDTH, HEIGHT);
        ctx.stroke();
      }

      state.rows.forEach((row) => {
        row.lanes.forEach((effect, laneIndex) => {
          const x = laneIndex * LANE_WIDTH + 24;
          ctx.fillStyle = effect.color;
          ctx.strokeStyle = effect.type === 'loss' ? '#d59d90' : '#93b593';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x, row.y, LANE_WIDTH - 48, 52, 18);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#35503a';
          ctx.font = '700 24px Inter, sans-serif';
          ctx.fillText(effect.label, x + 28, row.y + 32);
        });
      });

      const baseX = state.visualX;
      ctx.fillStyle = 'rgba(92,131,78,0.18)';
      ctx.beginPath();
      ctx.arc(baseX, PLAYER_Y + 12, 38, 0, Math.PI * 2);
      ctx.fill();

      const dots = Math.min(state.squad, 18);
      for (let index = 0; index < dots; index += 1) {
        const ring = Math.floor(index / 6);
        const offset = index % 6;
        const angle = (offset / 6) * Math.PI * 2;
        const radius = 12 + ring * 10;
        ctx.fillStyle = ring === 0 ? '#6f975e' : '#89ad79';
        ctx.beginPath();
        ctx.arc(baseX + Math.cos(angle) * radius, PLAYER_Y + Math.sin(angle) * radius, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#45643b';
      ctx.beginPath();
      ctx.arc(baseX, PLAYER_Y, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef9ef';
      ctx.font = '800 18px Inter, sans-serif';
      ctx.fillText(String(Math.max(state.squad, 0)), baseX - 10, PLAYER_Y + 6);

      ctx.fillStyle = '#4b5e47';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText(`Squad ${Math.max(state.squad, 0)}`, 18, 28);
      ctx.fillText(`Best ${bestScore}`, WIDTH - 86, 28);
      ctx.fillText(`Run ${Math.floor(state.distance)}m`, WIDTH / 2 - 40, 28);
    };

    const loop = () => {
      if (gameState === 'playing') update();
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, bestScore]);

  return (
    <div className="rounded-[2rem] border border-white/75 bg-gradient-to-br from-white to-sky-50/70 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sky-700">Lane-run calm</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-sage-950">Pocket Squad</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-700">Inspired by Last War choices. Slide between lanes, pick the best gates, and keep your tiny calm crew together.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-600">
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Best {bestScore}</span>
          <span className="rounded-full border border-sage-200 bg-white px-3 py-2">Crew {squad}</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-sky-100 bg-white/70 shadow-inner">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full max-w-full bg-transparent" />
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
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onClick={() => moveLane(-1)} type="button">
          <ArrowLeft size={14} /> Left
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600" onClick={() => moveLane(1)} type="button">
          <ArrowRight size={14} /> Right
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-sage-600">
          <Users size={14} /> Arrows / A D to switch lanes
        </div>
      </div>
    </div>
  );
}
