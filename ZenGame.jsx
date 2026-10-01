import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function ZenGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('quiet-journal-highscore') || '0'));
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'over'

  const stateRef = useRef({
    leafY: 200,
    velocity: 0,
    obstacles: [],
    frames: 0,
    score: 0
  });

  const jump = () => {
    if (gameState === 'playing') {
      stateRef.current.velocity = -5.8; // Soft upward drift
    } else if (gameState === 'start' || gameState === 'over') {
      stateRef.current = {
        leafY: 200,
        velocity: -5.8,
        obstacles: [],
        frames: 0,
        score: 0
      };
      setScore(0);
      setGameState('playing');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const drawLeaf = (x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#587f49'; 
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(18, -12, 18, 6);
      ctx.quadraticCurveTo(18, 18, 0, 18);
      ctx.quadraticCurveTo(-18, 18, -18, 6);
      ctx.quadraticCurveTo(-18, -12, 0, -12);
      ctx.fill();
      
      // Leaf vein
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
      
      // Background
      ctx.fillStyle = '#f7faf4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rolling hills aesthetic background
      ctx.fillStyle = '#edf4e8';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, canvas.height - 80);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 200, canvas.width, canvas.height - 60);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      if (gameState === 'playing') {
        state.velocity += 0.28; // soft gravity
        state.leafY += state.velocity;
        
        if (state.frames % 130 === 0) {
          const gapTop = Math.random() * (canvas.height - 280) + 60;
          state.obstacles.push({ x: canvas.width, gapTop, passed: false });
        }

        state.obstacles.forEach(obs => {
          obs.x -= 2.5; 
          
          // Bamboo/Pillars
          ctx.fillStyle = '#dcebd3'; 
          const gapSize = 170;
          const obsWidth = 45;
          
          ctx.beginPath();
          ctx.roundRect(obs.x, -20, obsWidth, obs.gapTop + 20, 12);
          ctx.fill();
          
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.gapTop + gapSize, obsWidth, canvas.height - obs.gapTop - gapSize + 20, 12);
          ctx.fill();
          
          // Collisions
          const leafRadius = 14;
          const leafX = 100;
          
          const hitTop = (leafX + leafRadius > obs.x && leafX - leafRadius < obs.x + obsWidth && state.leafY - leafRadius < obs.gapTop);
          const hitBottom = (leafX + leafRadius > obs.x && leafX - leafRadius < obs.x + obsWidth && state.leafY + leafRadius > obs.gapTop + gapSize);
          
          if (hitTop || hitBottom) {
            setGameState('over');
          }
          
          if (!obs.passed && obs.x + obsWidth < leafX) {
            obs.passed = true;
            state.score++;
            setScore(state.score);
          }
        });

        state.obstacles = state.obstacles.filter(obs => obs.x > -100);
        
        if (state.leafY > canvas.height + 20 || state.leafY < -20) {
          setGameState('over');
        }
      } else if (gameState === 'start') {
        state.leafY = 200 + Math.sin(Date.now() / 400) * 12;
      }

      // Draw leaf
      const angle = Math.min(Math.max(state.velocity * 0.08, -0.4), 1.2);
      drawLeaf(100, state.leafY, angle);

      state.frames++;
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'over' && score > highScore) {
      setHighScore(score);
      localStorage.setItem('quiet-journal-highscore', score.toString());
    }
  }, [gameState, score, highScore]);

  return (
    <div className="mx-auto max-w-2xl w-full">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-sage-900">Drifting Leaf</h3>
          <p className="text-sm font-semibold text-sage-700">A calming fidget game for your restless mind.</p>
        </div>
        <div className="flex gap-4 text-sm font-extrabold uppercase tracking-widest text-sage-700">
          <span className="rounded-full bg-sage-100 px-4 py-2 shadow-sm">Score: {score}</span>
          <span className="rounded-full bg-white px-4 py-2 border border-sage-200 shadow-sm">Best: {highScore}</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-sage-200 shadow-sm transition hover:shadow-soft" style={{ aspectRatio: '3/2' }}>
        <canvas 
          ref={canvasRef}
          width={600}
          height={400}
          className="block w-full h-full cursor-pointer touch-none"
          onClick={jump}
        />
        
        {gameState === 'start' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[3px]">
            <button className="pointer-events-auto mb-4 flex items-center gap-3 rounded-full bg-sage-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-700">
              <Play size={18} /> Tap to float
            </button>
            <p className="text-sm font-semibold text-sage-900 bg-white/70 px-4 py-1.5 rounded-full">Press Space or click to drift.</p>
          </div>
        )}
        
        {gameState === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[5px]">
            <p className="mb-2 font-display text-4xl font-extrabold text-sage-950">The leaf landed.</p>
            <p className="mb-8 text-lg font-bold text-sage-800">Final Score: {score}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); jump(); }}
              className="flex items-center gap-3 rounded-full bg-sage-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-700"
            >
              <RotateCcw size={18} /> Drift again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
