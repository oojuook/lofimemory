import React, { useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const difficultyMeta = {
  easy: { label: 'Easy', goal: 6 },
  medium: { label: 'Medium', goal: 10 },
  hard: { label: 'Hard', goal: 14 }
};

function GameShell({ eyebrow, title, description, stats = [], children, onReset, resetLabel = 'Reset' }) {
  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/82 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700 shadow-sm">
              <Sparkles size={14} /> {eyebrow}
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-sage-950">{title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">{description}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[24rem]">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.15rem] bg-sage-50 px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sage-500">{stat.label}</p>
                <p className="mt-2 text-xl font-extrabold text-sage-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">{children}</div>
        {onReset && (
          <div className="mt-5 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5" onClick={onReset} type="button">
              <RotateCcw size={16} /> {resetLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ZenSandGarden({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const [rakes, setRakes] = useState([]);
  const addRake = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRakes((current) => [...current.slice(-18), { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }]);
  };
  return (
    <GameShell eyebrow={`${meta.label} clear your mind`} title="Zen Sand Garden" description="Tap the soft sand to draw slow rake circles, arrange little stones, and make a calming pattern before you journal." stats={[{ label: 'Rake marks', value: rakes.length }, { label: 'Stones', value: 5 }, { label: 'Mood', value: 'Calm' }]} onReset={() => setRakes([])} resetLabel="Smooth sand">
      <button onClick={addRake} className="relative h-[360px] w-full overflow-hidden rounded-[2rem] border border-amber-100 bg-gradient-to-br from-[#f5e7cf] to-[#dfc8a8] shadow-inner" type="button">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-radial-gradient(circle at 50% 50%, rgba(126,98,63,.28) 0 1px, transparent 2px 16px)' }} />
        {[14, 28, 42, 68, 82].map((left, index) => <span key={left} className="absolute h-8 w-11 rounded-full bg-stone-500/55 shadow-sm" style={{ left: `${left}%`, top: `${22 + (index % 3) * 18}%` }} />)}
        {rakes.map((mark, index) => <span key={`${mark.x}-${index}`} className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-800/25" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} />)}
      </button>
    </GameShell>
  );
}

export function BubblePopGame({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const goal = meta.goal + 8;
  const initial = useMemo(() => Array.from({ length: goal }, (_, index) => ({ id: index, popped: false })), [goal]);
  const [bubbles, setBubbles] = useState(initial);
  const popped = bubbles.filter((bubble) => bubble.popped).length;
  const pop = (id) => setBubbles((current) => current.map((bubble) => bubble.id === id ? { ...bubble, popped: true } : bubble));
  const reset = () => setBubbles(initial.map((bubble) => ({ ...bubble, popped: false })));
  return (
    <GameShell eyebrow={`${meta.label} fidget reset`} title="Bubble Pop" description="Pop soft bubbles one by one for a quiet fidget-game loop that feels light, simple, and satisfying." stats={[{ label: 'Popped', value: `${popped}/${goal}` }, { label: 'Goal', value: goal }, { label: 'Reset', value: popped === goal ? 'Done' : 'Soft' }]} onReset={reset} resetLabel="Refill bubbles">
      <div className="grid grid-cols-4 gap-3 rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 sm:grid-cols-6">
        {bubbles.map((bubble) => <button key={bubble.id} onClick={() => pop(bubble.id)} disabled={bubble.popped} className={`aspect-square rounded-full border transition ${bubble.popped ? 'scale-75 border-white/50 bg-white/40 opacity-40' : 'border-white bg-cyan-200/80 shadow-lift hover:-translate-y-1'}`} type="button" />)}
      </div>
    </GameShell>
  );
}

export function PetalCatcher({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const goal = meta.goal;
  const [score, setScore] = useState(0);
  const petals = ['🌸', '🍃', '🪷', '✨', '🌼', '🌙', '🌺', '☁️', '🌷', '💮', '🍂', '🫧', '🌻', '🪻'].slice(0, goal);
  return (
    <GameShell eyebrow={`${meta.label} soft arcade`} title="Petal Catcher" description="Catch falling petals in a tiny basket. It is a simple nature-themed arcade game for a quick relaxing break." stats={[{ label: 'Caught', value: `${score}/${goal}` }, { label: 'Petals', value: goal }, { label: 'Pace', value: 'Gentle' }]} onReset={() => setScore(0)} resetLabel="Release petals">
      <div className="grid grid-cols-4 gap-3 rounded-[2rem] border border-rose-100 bg-gradient-to-br from-rose-50 via-amber-50 to-emerald-50 p-4 sm:grid-cols-7">
        {petals.map((petal, index) => <button key={`${petal}-${index}`} onClick={() => setScore((current) => Math.min(goal, current + 1))} disabled={score > index} className={`aspect-square rounded-[1.25rem] border bg-white/78 text-2xl shadow-sm transition hover:-translate-y-1 ${score > index ? 'opacity-35' : ''}`} type="button">{petal}</button>)}
      </div>
    </GameShell>
  );
}

const mahjongTiles = ['🀄', '🌸', '🍃', '☁️', '🌙', '✨', '🫖', '🐚'];
export function MahjongSolitaire({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const pairCount = difficulty === 'hard' ? 8 : difficulty === 'easy' ? 5 : 6;
  const [tiles, setTiles] = useState(() => mahjongTiles.slice(0, pairCount).flatMap((tile, index) => [{ tile, id: `${index}a`, matched: false }, { tile, id: `${index}b`, matched: false }]).sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState(null);
  const matched = tiles.filter((tile) => tile.matched).length / 2;
  const select = (entry) => {
    if (entry.matched) return;
    if (!selected) return setSelected(entry.id);
    const first = tiles.find((tile) => tile.id === selected);
    if (first?.tile === entry.tile && first.id !== entry.id) setTiles((current) => current.map((tile) => tile.id === first.id || tile.id === entry.id ? { ...tile, matched: true } : tile));
    setSelected(null);
  };
  const reset = () => setTiles(mahjongTiles.slice(0, pairCount).flatMap((tile, index) => [{ tile, id: `${index}a`, matched: false }, { tile, id: `${index}b`, matched: false }]).sort(() => Math.random() - 0.5));
  return (
    <GameShell eyebrow={`${meta.label} cozy logic`} title="Mahjong Solitaire" description="Match calm tile pairs in a soft Mahjong-inspired board made for cozy focus and short puzzle breaks." stats={[{ label: 'Pairs', value: `${matched}/${pairCount}` }, { label: 'Tiles', value: pairCount * 2 }, { label: 'Mode', value: 'Match' }]} onReset={reset} resetLabel="New layout">
      <div className="grid grid-cols-4 gap-3 rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-sage-50 p-4 sm:grid-cols-6">
        {tiles.map((entry) => <button key={entry.id} onClick={() => select(entry)} disabled={entry.matched} className={`aspect-[4/5] rounded-[1rem] border bg-white text-3xl shadow-sm transition hover:-translate-y-1 ${selected === entry.id ? 'ring-2 ring-sage-400' : ''} ${entry.matched ? 'opacity-25' : ''}`} type="button">{entry.tile}</button>)}
      </div>
    </GameShell>
  );
}

export function SpotTheDifference({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const differences = ['lamp', 'moon', 'leaf', 'cup', 'star'].slice(0, difficulty === 'easy' ? 3 : difficulty === 'hard' ? 5 : 4);
  const [found, setFound] = useState([]);
  const toggle = (id) => setFound((current) => current.includes(id) ? current : [...current, id]);
  return (
    <GameShell eyebrow={`${meta.label} visual focus`} title="Spot the Difference" description="Compare two tiny lofi rooms and find the gentle differences. It is calm visual focus without pressure." stats={[{ label: 'Found', value: `${found.length}/${differences.length}` }, { label: 'Scenes', value: 2 }, { label: 'Focus', value: 'Calm' }]} onReset={() => setFound([])} resetLabel="Hide differences">
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((scene) => <div key={scene} className="relative h-72 rounded-[2rem] border border-sage-100 bg-gradient-to-br from-sky-50 to-amber-50 p-5 shadow-inner"><span className="absolute left-7 top-8 text-4xl">🪟</span><span className="absolute bottom-8 left-10 text-4xl">🛋️</span><span className="absolute bottom-8 right-10 text-4xl">🪴</span><span className="absolute right-10 top-10 text-3xl">☕</span>{scene === 1 && differences.map((id, index) => <button key={id} onClick={() => toggle(id)} className={`absolute h-9 w-9 rounded-full border-2 ${found.includes(id) ? 'border-emerald-500 bg-emerald-100' : 'border-white/80 bg-white/40'}`} style={{ left: `${18 + index * 16}%`, top: `${22 + (index % 2) * 32}%` }} type="button">{found.includes(id) ? '✓' : ''}</button>)}</div>)}
      </div>
    </GameShell>
  );
}

export function ConnectTheDots({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const total = difficulty === 'easy' ? 7 : difficulty === 'hard' ? 13 : 10;
  const [next, setNext] = useState(1);
  const dots = Array.from({ length: total }, (_, index) => ({ n: index + 1, x: 12 + ((index * 23) % 76), y: 18 + ((index * 37) % 62) }));
  const click = (n) => { if (n === next) setNext((current) => current + 1); };
  return (
    <GameShell eyebrow={`${meta.label} relaxing path`} title="Connect the Dots" description="Tap the dots in order to draw a small lofi constellation. Simple, relaxing, and beginner-friendly." stats={[{ label: 'Next', value: next > total ? 'Done' : next }, { label: 'Dots', value: total }, { label: 'Line', value: `${Math.min(next - 1, total)}/${total}` }]} onReset={() => setNext(1)} resetLabel="Clear path">
      <div className="relative h-[380px] rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-sky-50 to-amber-50 shadow-inner">
        {dots.map((dot) => <button key={dot.n} onClick={() => click(dot.n)} className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-sm font-black shadow-sm transition ${dot.n < next ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : dot.n === next ? 'border-indigo-300 bg-white text-indigo-800 hover:-translate-y-2' : 'border-white bg-white/70 text-sage-500'}`} style={{ left: `${dot.x}%`, top: `${dot.y}%` }} type="button">{dot.n}</button>)}
      </div>
    </GameShell>
  );
}

export function TinyGardenIdle({ difficulty = 'medium' }) {
  const meta = difficultyMeta[difficulty] || difficultyMeta.medium;
  const [seeds, setSeeds] = useState(3);
  const [plants, setPlants] = useState([]);
  const plant = () => { if (seeds > 0) { setSeeds(seeds - 1); setPlants((current) => [...current, { id: Date.now(), stage: 0 }]); } };
  const grow = () => setPlants((current) => current.map((plant) => ({ ...plant, stage: Math.min(2, plant.stage + 1) })));
  return (
    <GameShell eyebrow={`${meta.label} daily return`} title="Tiny Garden Idle" description="Plant seeds, grow them slowly, and come back for a cute garden reset. A soft idle game for daily retention." stats={[{ label: 'Seeds', value: seeds }, { label: 'Plants', value: plants.length }, { label: 'Bloom', value: plants.filter((plant) => plant.stage === 2).length }]} onReset={() => { setSeeds(3); setPlants([]); }} resetLabel="Clear garden">
      <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-lime-50 p-5 shadow-inner">
        <div className="mb-4 flex flex-wrap gap-2"><button onClick={plant} className="rounded-full bg-sage-900 px-4 py-2 text-sm font-extrabold text-white" type="button">Plant seed</button><button onClick={grow} className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm" type="button">Water garden</button></div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">{Array.from({ length: 12 }, (_, index) => { const plantItem = plants[index]; return <div key={index} className="flex aspect-square items-center justify-center rounded-[1.25rem] border border-white/80 bg-white/72 text-3xl shadow-sm">{plantItem ? ['🌱', '🌿', '🌷'][plantItem.stage] : '·'}</div>; })}</div>
      </div>
    </GameShell>
  );
}
