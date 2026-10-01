import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const ICONS = ['🌿', '🪴', '💧', '🍵', '☁️', '🕊️', '🦦', '🌸'];

export default function LotusMatch() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('quiet-journal-match-best') || '0'));

  const initializeGame = () => {
    const shuffled = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matched.length === ICONS.length * 2) {
      if (bestScore === 0 || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('quiet-journal-match-best', moves.toString());
      }
    }
  }, [matched, moves, bestScore]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]].icon === cards[newFlipped[1]].icon) {
        setMatched([...matched, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const isWon = cards.length > 0 && matched.length === cards.length;

  return (
    <div className="mx-auto max-w-2xl w-full mt-12 pb-12">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-rose-900">Lotus Match</h3>
          <p className="text-sm font-semibold text-rose-700">A gentle memory game to center your thoughts.</p>
        </div>
        <div className="flex gap-4 text-sm font-extrabold uppercase tracking-widest text-rose-700">
          <span className="rounded-full bg-rose-100 px-4 py-2 shadow-sm">Moves: {moves}</span>
          <span className="rounded-full bg-white px-4 py-2 border border-rose-200 shadow-sm">Best: {bestScore > 0 ? bestScore : '-'}</span>
        </div>
      </div>
      
      <div className="relative rounded-[2rem] border border-rose-200 bg-rose-50/50 p-6 shadow-sm transition hover:shadow-soft">
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`group relative flex aspect-square items-center justify-center rounded-2xl text-4xl transition-all duration-300 transform-gpu perspective-1000 shadow-sm ${
                  isFlipped 
                    ? 'bg-white border border-rose-200 rotate-y-180' 
                    : 'bg-rose-200 border border-rose-300 hover:-translate-y-1 hover:bg-rose-300'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Back of card (visible when not flipped) */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                  <Sparkles className="text-rose-400 opacity-50" size={24} />
                </div>
                
                {/* Front of card (visible when flipped) */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300 rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                  {card.icon}
                </div>
              </button>
            );
          })}
        </div>

        {isWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[4px] rounded-[2rem]">
            <p className="mb-2 font-display text-4xl font-extrabold text-rose-950">Mind cleared.</p>
            <p className="mb-8 text-lg font-bold text-rose-800">Completed in {moves} moves</p>
            <button 
              onClick={initializeGame}
              className="flex items-center gap-3 rounded-full bg-rose-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-rose-700"
            >
              <RotateCcw size={18} /> Reshuffle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
