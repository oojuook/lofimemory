import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, RotateCcw, Sparkles, Timer } from 'lucide-react';

const difficultySettings = {
  easy: {
    size: 3,
    shuffleMoves: 38,
    label: 'Easy',
    note: 'A small 3×3 cozy puzzle with gentle shuffling for a relaxing first round.'
  },
  medium: {
    size: 4,
    shuffleMoves: 86,
    label: 'Medium',
    note: 'A balanced 4×4 jigsaw-style slider with enough movement to feel satisfying.'
  },
  hard: {
    size: 5,
    shuffleMoves: 150,
    label: 'Hard',
    note: 'A fuller 5×5 puzzle for focused players who want a deeper calm challenge.'
  }
};

const JIGSAW_WALLPAPER = '/lofi-jigsaw-wallpaper.png';
const CUSTOM_JIGSAW_WALLPAPER_KEY = 'quiet-journal-lofi-jigsaw-custom-wallpaper-v1';

function buildSolvedBoard(size) {
  const total = size * size;
  return Array.from({ length: total }, (_, index) => (index === total - 1 ? null : index));
}

function getNeighbors(emptyIndex, size) {
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;
  const neighbors = [];
  if (row > 0) neighbors.push(emptyIndex - size);
  if (row < size - 1) neighbors.push(emptyIndex + size);
  if (col > 0) neighbors.push(emptyIndex - 1);
  if (col < size - 1) neighbors.push(emptyIndex + 1);
  return neighbors;
}

function shuffleBoard(size, shuffleMoves) {
  let board = buildSolvedBoard(size);
  let emptyIndex = board.length - 1;
  let previousIndex = -1;

  for (let move = 0; move < shuffleMoves; move += 1) {
    const options = getNeighbors(emptyIndex, size).filter((index) => index !== previousIndex);
    const nextIndex = options[Math.floor(Math.random() * options.length)] ?? getNeighbors(emptyIndex, size)[0];
    board = [...board];
    board[emptyIndex] = board[nextIndex];
    board[nextIndex] = null;
    previousIndex = emptyIndex;
    emptyIndex = nextIndex;
  }

  return board;
}

function isSolved(board) {
  return board.every((tile, index) => (index === board.length - 1 ? tile === null : tile === index));
}

function getMoveLabel(moves) {
  if (moves === 0) return 'No moves yet';
  if (moves === 1) return '1 soft move';
  return `${moves} soft moves`;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function TileArtwork({ tile, size, imageSrc, isLofi = false }) {
  if (tile === null) return null;

  const row = Math.floor(tile / size);
  const col = tile % size;
  const total = size * size;

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[1rem] ${isLofi ? 'bg-[#f6ead9]' : 'bg-sage-100'}`}>
      <div
        className="absolute inset-0 scale-[1.02] bg-cover"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${size * 100}% ${size * 100}%`,
          backgroundPosition: `${size === 1 ? 0 : (col / (size - 1)) * 100}% ${size === 1 ? 0 : (row / (size - 1)) * 100}%`
        }}
      />
      <div className={`absolute inset-0 ${isLofi ? 'bg-gradient-to-br from-white/22 via-transparent to-[#4a3a2d]/18' : 'bg-gradient-to-br from-white/12 via-transparent to-sage-950/10'}`} />
      <div className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black shadow-sm ${isLofi ? 'bg-white/78 text-[#4a3a2d]' : 'bg-white/70 text-sage-800'}`}>{tile + 1}/{total - 1}</div>
    </div>
  );
}

export default function LofiJigsaw({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const { size, shuffleMoves, label, note } = config;
  const totalTiles = size * size - 1;
  const bestScoreKey = `quiet-journal-lofi-jigsaw-best-${difficulty}`;

  const [board, setBoard] = useState(() => shuffleBoard(size, shuffleMoves));
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('playing');
  const [time, setTime] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  const [customWallpaper, setCustomWallpaper] = useState(() => localStorage.getItem(CUSTOM_JIGSAW_WALLPAPER_KEY) || '');
  const puzzleImage = customWallpaper || JIGSAW_WALLPAPER;

  const timerRef = useRef(null);

  useEffect(() => {
    setBoard(shuffleBoard(size, shuffleMoves));
    setMoves(0);
    setStatus('playing');
    setTime(0);
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [size, shuffleMoves, bestScoreKey]);

  useEffect(() => {
    if (status === 'won' && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [status]);

  const emptyIndex = board.indexOf(null);
  const neighborSet = useMemo(() => new Set(getNeighbors(emptyIndex, size)), [emptyIndex, size]);
  const solved = status === 'won';

  const resetPuzzle = () => {
    setBoard(shuffleBoard(size, shuffleMoves));
    setMoves(0);
    setStatus('playing');
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    setBestScore(parseInt(localStorage.getItem(bestScoreKey) || '0', 10));
  };

  const handleWallpaperUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;

      const image = new Image();
      image.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.86);
        setCustomWallpaper(compressed);
        localStorage.setItem(CUSTOM_JIGSAW_WALLPAPER_KEY, compressed);
        resetPuzzle();
      };
      image.onerror = () => {
        setCustomWallpaper(result);
        localStorage.setItem(CUSTOM_JIGSAW_WALLPAPER_KEY, result);
        resetPuzzle();
      };
      image.src = result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const restoreDefaultWallpaper = () => {
    setCustomWallpaper('');
    localStorage.removeItem(CUSTOM_JIGSAW_WALLPAPER_KEY);
    resetPuzzle();
  };

  const moveTile = (index) => {
    if (solved || !neighborSet.has(index)) return;

    const next = [...board];
    next[emptyIndex] = board[index];
    next[index] = null;
    const nextMoves = moves + 1;

    setBoard(next);
    setMoves(nextMoves);

    if (isSolved(next)) {
      setStatus('won');
      setBestScore((currentBest) => {
        if (currentBest === 0 || nextMoves < currentBest) {
          localStorage.setItem(bestScoreKey, String(nextMoves));
          return nextMoves;
        }
        return currentBest;
      });
    }
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-[980px] pb-12">
      <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-soft lg:p-6 ${isLofi ? 'border-amber-200/50 bg-[#fff7ec] shadow-[0_30px_90px_rgba(83,62,44,0.12)]' : 'border-sage-100 bg-gradient-to-br from-white via-sage-50/82 to-sand-50/82'}`}>
        {isLofi && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,236,0.9)_42%,rgba(250,237,205,0.84)_100%)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #7a6250 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-sm ${isLofi ? 'border-amber-200 bg-white/80 text-amber-800' : 'border-sage-200 bg-white/88 text-sage-700'}`}>
              <Sparkles size={14} /> {label} lofi jigsaw
            </div>
            <h3 className={`mt-4 text-3xl font-bold tracking-tight ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>Lofi Jigsaw Puzzle</h3>
            <p className={`mt-2 max-w-2xl text-sm leading-7 ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>Slide soft image pieces back into place and rebuild a tiny lofi landscape. It is a cozy puzzle for study breaks, relaxing browser play, and quiet journal moments.</p>
            <p className={`mt-2 text-sm font-semibold ${isLofi ? 'text-amber-700' : 'text-sage-600'}`}>{note}</p>
            <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.18em] ${isLofi ? 'text-amber-800/60' : 'text-sage-500'}`}>{size}×{size} board • {totalTiles} picture pieces • relaxing sliding puzzle</p>
          </div>
          <div className={`grid gap-2 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[24rem] ${isLofi ? 'rounded-[1.35rem] border border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'rounded-[1.5rem] border border-white/85 bg-white/80'}`}>
            {[
              ['Moves', moves],
              ['Time', formatTime(time)],
              ['Best', bestScore || '—']
            ].map(([statLabel, value]) => (
              <div key={statLabel} className={`${isLofi ? 'rounded-[0.95rem] bg-amber-50/90 text-amber-900' : 'rounded-[1.15rem] bg-sage-50'} px-4 py-3 text-center`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isLofi ? 'text-amber-800/60' : 'text-sage-500'} ${statLabel === 'Time' ? 'inline-flex items-center justify-center gap-1' : ''}`}>{statLabel === 'Time' ? <><Timer size={11} /> Time</> : statLabel}</p>
                <p className={`mt-2 text-xl font-extrabold ${isLofi ? 'text-[#3d3025]' : 'text-sage-950'}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative z-10 mt-5 flex flex-col gap-3 rounded-[1.5rem] border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-white/80 bg-white/72'}`}>
          <div className="flex items-center gap-3">
             {solved && <div className={`flex h-8 items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest shadow-sm ${isLofi ? 'bg-[#ccd5ae] text-[#3d3025]' : 'bg-emerald-100 text-emerald-800'} animate-bounce`}>Done!</div>}
             <p className={`text-sm font-semibold ${isLofi ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>{solved ? 'The whole scene is back together — soft work.' : `Tap a piece beside the empty space to slide it. ${getMoveLabel(moves)} so far.`}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] hover:bg-[#3d3025]' : 'bg-sage-900 hover:bg-sage-800'}`}>
              <ImagePlus size={16} /> Use your wallpaper
              <input accept="image/*" className="hidden" onChange={handleWallpaperUpload} type="file" />
            </label>
            {customWallpaper && (
              <button
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'border border-[#e8dfd5] bg-white text-[#4a3a2d]' : 'bg-white text-sage-900'}`}
                onClick={restoreDefaultWallpaper}
                type="button"
              >
                Default image
              </button>
            )}
            <button
              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'border border-[#e8dfd5] bg-white text-[#4a3a2d]' : 'bg-white text-sage-900'}`}
              onClick={resetPuzzle}
              type="button"
            >
              <RotateCcw size={16} /> {solved ? 'Play again' : 'Shuffle new puzzle'}
            </button>
          </div>
        </div>

        <div className={`relative z-10 mt-5 rounded-[1.5rem] border p-3 shadow-soft sm:p-4 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 backdrop-blur-sm' : 'border-white/85 bg-white/72'}`}>
          <div className={`mb-3 overflow-hidden rounded-[1.4rem] border shadow-sm ${isLofi ? 'border-[#e8dfd5]/80 bg-white/78 backdrop-blur-sm' : 'border-white/80 bg-white/70'}`}>
            <img src={puzzleImage} alt={customWallpaper ? 'Custom wallpaper reference for the jigsaw puzzle' : 'Lofi wallpaper reference for the jigsaw puzzle'} className="h-40 w-full object-cover sm:h-56" />
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {board.map((tile, index) => (
              <button
                key={`${tile ?? 'empty'}-${index}`}
                aria-label={tile === null ? 'Empty jigsaw space' : `Move puzzle piece ${tile + 1}`}
                className={`aspect-square rounded-[1.15rem] border text-left shadow-sm transition-all duration-300 ease-out ${tile === null ? (isLofi ? 'border-dashed border-amber-200/80 bg-amber-50/60' : 'border-dashed border-sage-200 bg-sage-50/60') : neighborSet.has(index) && !solved ? (isLofi ? 'border-white/90 bg-white hover:-translate-y-0.5 hover:shadow-lift' : 'border-white/90 bg-white hover:-translate-y-0.5 hover:shadow-lift') : (isLofi ? 'border-white/80 bg-white/86' : 'border-white/80 bg-white/86')} ${solved ? (isLofi ? 'ring-2 ring-amber-200' : 'ring-2 ring-emerald-200') : ''}`}
                style={neighborSet.has(index) && !solved ? { animation: 'jigsawTileNudge 3.2s infinite ease-in-out' } : undefined}
                disabled={tile === null || solved || !neighborSet.has(index)}
                onClick={() => moveTile(index)}
                type="button"
              >
                <TileArtwork tile={tile} size={size} imageSrc={puzzleImage} isLofi={isLofi} />
              </button>
            ))}
          </div>
        </div>

        <div className={`relative z-10 mt-5 rounded-[1.5rem] border px-4 py-4 text-sm font-semibold shadow-sm ${isLofi ? 'border-[#e8dfd5]/80 bg-white/70 text-[#6e5a4a] backdrop-blur-sm' : 'border-white/75 bg-white/76 text-sage-700'}`}>
          Lofi Jigsaw Puzzle is designed for people searching for relaxing puzzle games, cozy browser games, and simple online jigsaw-style play. Pair it with a quick journal note afterward to turn a small game break into a calm reflection.
        </div>
      </div>
    </div>
  );
}
