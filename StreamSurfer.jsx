import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

export default function StreamSurfer() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('quiet-journal-surfer-high') || '0'));
  const [gameState, setGameState] = useState('start');

  const stateRef = useRef({
    lane: 1,
    visualX: 300,
    speed: 4.5,
    obstacles: [],
    frames: 0,
    score: 0,
    waterOffset: 0
  });

  const laneWidth = 200;
  const getLaneCenter = (lane) => lane * laneWidth + laneWidth / 2;

  const handleMove = (dir) => {
    if (gameState !== 'playing') return;
    const s = stateRef.current;
    if (dir === -1 && s.lane > 0) s.lane--;
    if (dir === 1 && s.lane < 2) s.lane++;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') handleMove(-1);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') handleMove(1);
      if (e.code === 'Space' && gameState !== 'playing') {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    stateRef.current = { lane: 1, visualX: 300, speed: 4.5, obstacles: [], frames: 0, score: 0, waterOffset: 0 };
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      
      // inner fold
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
      // Cutout
      ctx.fillStyle = '#e8f0eb'; // Match water color
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
      
      // Water background
      ctx.fillStyle = '#e8f0eb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lane dividers
      ctx.strokeStyle = '#d4e3dc';
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -state.waterOffset;
      ctx.beginPath();
      ctx.moveTo(200, 0); ctx.lineTo(200, canvas.height);
      ctx.moveTo(400, 0); ctx.lineTo(400, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      if (gameState === 'playing') {
        state.frames++;
        state.waterOffset += state.speed;
        
        // Spawn obstacles
        if (state.frames % Math.max(30, 90 - Math.floor(state.speed * 5)) === 0) {
          const lane = Math.floor(Math.random() * 3);
          state.obstacles.push({ lane, y: -50, passed: false });
        }

        // Increase speed very slowly
        if (state.frames % 300 === 0) state.speed += 0.2;

        // Smooth lane switching
        const targetX = getLaneCenter(state.lane);
        state.visualX += (targetX - state.visualX) * 0.2;

        // Update obstacles
        const playerY = canvas.height - 80;
        
        state.obstacles.forEach(obs => {
          obs.y += state.speed;
          drawLilyPad(getLaneCenter(obs.lane), obs.y);
          
          // Collision
          if (Math.abs(getLaneCenter(obs.lane) - state.visualX) < 30 && Math.abs(obs.y - playerY) < 35) {
            setGameState('over');
          }
          
          // Score
          if (!obs.passed && obs.y > playerY + 30) {
            obs.passed = true;
            state.score++;
            setScore(state.score);
          }
        });

        state.obstacles = state.obstacles.filter(obs => obs.y < canvas.height + 50);

      } else if (gameState === 'start') {
        state.waterOffset += 1;
        state.visualX = getLaneCenter(1);
      }

      // Draw Player
      drawBoat(state.visualX, canvas.height - 80);

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'over' && score > highScore) {
      setHighScore(score);
      localStorage.setItem('quiet-journal-surfer-high', score.toString());
    }
  }, [gameState, score, highScore]);

  return (
    <div className="mx-auto max-w-2xl w-full mt-12 pb-12">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-teal-900">Stream Surfer</h3>
          <p className="text-sm font-semibold text-teal-700">A rhythmic 3-lane dodge game to clear your mind.</p>
        </div>
        <div className="flex gap-4 text-sm font-extrabold uppercase tracking-widest text-teal-700">
          <span className="rounded-full bg-teal-100 px-4 py-2 shadow-sm">Score: {score}</span>
          <span className="rounded-full bg-white px-4 py-2 border border-teal-200 shadow-sm">Best: {highScore}</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-teal-200 shadow-sm transition hover:shadow-soft" style={{ aspectRatio: '3/2' }}>
        <canvas 
          ref={canvasRef}
          width={600}
          height={400}
          className="block w-full h-full touch-none"
        />
        
        {/* Mobile controls overlay */}
        {gameState === 'playing' && (
          <div className="absolute inset-0 flex sm:hidden">
            <div className="flex-1" onTouchStart={(e) => { e.preventDefault(); handleMove(-1); }} />
            <div className="flex-1" onTouchStart={(e) => { e.preventDefault(); handleMove(1); }} />
          </div>
        )}
        
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[3px]">
            <button onClick={startGame} className="mb-4 flex items-center gap-3 rounded-full bg-teal-700 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-teal-600">
              <Play size={18} /> Start Surfing
            </button>
            <p className="text-sm font-semibold text-teal-900 bg-white/80 px-5 py-2 rounded-full flex gap-4 items-center">
              <span><ArrowLeft size={16} className="inline mr-1"/> Left</span>
              <span className="w-px h-4 bg-teal-200"></span>
              <span>Right <ArrowRight size={16} className="inline ml-1"/></span>
            </p>
          </div>
        )}
        
        {gameState === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[5px]">
            <p className="mb-2 font-display text-4xl font-extrabold text-teal-950">You bumped a lily pad.</p>
            <p className="mb-8 text-lg font-bold text-teal-800">Final Score: {score}</p>
            <button 
              onClick={startGame}
              className="flex items-center gap-3 rounded-full bg-teal-700 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-teal-600"
            >
              <RotateCcw size={18} /> Surf again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
