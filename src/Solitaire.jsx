import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, Minimize2, Play, RotateCcw } from 'lucide-react';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const difficultySettings = {
  easy: {
    label: 'Easy',
    drawCount: 1,
    note: 'Draw one card at a time for a softer, beginner-friendly round.'
  },
  medium: {
    label: 'Medium',
    drawCount: 2,
    note: 'Draw two cards at a time for a slightly trickier but still cozy round.'
  },
  hard: {
    label: 'Hard',
    drawCount: 3,
    note: 'Draw three cards at once for a more classic solitaire challenge.'
  }
};

const isRed = (suit) => suit === '♥' || suit === '♦';
const cardColor = (card) => (isRed(card.suit) ? 'text-rose-500' : 'text-slate-800');

function createDeck() {
  return SUITS.flatMap((suit) => RANKS.map((rank, index) => ({
    id: `${suit}-${rank}`,
    suit,
    rank,
    value: index + 1,
    faceUp: false
  })));
}

function shuffleDeck(deck) {
  const shuffled = deck.map((card) => ({ ...card }));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function dealGame() {
  const deck = shuffleDeck(createDeck());
  const tableau = Array.from({ length: 7 }, (_, columnIndex) => (
    Array.from({ length: columnIndex + 1 }, () => deck.shift()).map((card, cardIndex, cards) => ({
      ...card,
      faceUp: cardIndex === cards.length - 1
    }))
  ));

  return {
    stock: deck.map((card) => ({ ...card, faceUp: false })),
    waste: [],
    tableau,
    foundations: SUITS.reduce((acc, suit) => ({ ...acc, [suit]: [] }), {}),
    moves: 0,
    message: 'Draw a card or move an open card.'
  };
}

function canMoveToTableau(card, destinationColumn) {
  const topCard = destinationColumn[destinationColumn.length - 1];
  if (!topCard) {
    return card.value === 13;
  }
  return topCard.faceUp && topCard.value === card.value + 1 && isRed(topCard.suit) !== isRed(card.suit);
}

function canMoveToFoundation(card, foundation) {
  const topCard = foundation[foundation.length - 1];
  if (!topCard) {
    return card.value === 1;
  }
  return topCard.suit === card.suit && card.value === topCard.value + 1;
}

function Card({ card, selected = false, compact = false, onClick }) {
  const sizeClass = compact ? 'h-[4.35rem] w-[3rem] sm:h-[5.35rem] sm:w-[3.75rem]' : 'h-[5.35rem] w-[3.75rem] sm:h-24 sm:w-16';
  const baseClass = `${sizeClass} shrink-0 rounded-[0.8rem] transition duration-200`;

  if (!card) {
    return (
      <button
        aria-label="Empty card slot"
        className={`${baseClass} border-2 border-white/20 bg-emerald-950/16 shadow-inner`}
        onClick={onClick}
        type="button"
      />
    );
  }

  if (!card.faceUp) {
    return (
      <button
        aria-label="Hidden card"
        className={`${baseClass} grid place-items-center border border-emerald-100/55 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(145deg,#0f8f50,#08733f_48%,#075a33)] shadow-[0_5px_12px_rgba(0,0,0,0.22)] ring-1 ring-emerald-300/30 hover:-translate-y-0.5`}
        onClick={onClick}
        type="button"
      >
        <div className="grid h-8 w-8 place-items-center rounded-full border border-white/35 bg-white/12 sm:h-10 sm:w-10">
          <span className="text-sm font-black text-white/72">✦</span>
        </div>
      </button>
    );
  }

  return (
    <button
      className={`${baseClass} relative flex flex-col justify-between border bg-[#fffdf8] p-1.5 text-left font-black shadow-[0_5px_12px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 ${selected ? 'z-20 -translate-y-1 border-amber-300 ring-4 ring-amber-200/80' : 'border-white/95'} ${cardColor(card)}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex flex-col leading-none">
        <span className="text-[12px] sm:text-sm">{card.rank}</span>
        <span className="text-[11px] opacity-85 sm:text-xs">{card.suit}</span>
      </div>
      <span className="self-center text-2xl leading-none sm:text-3xl">{card.suit}</span>
      <div className="rotate-180 self-end leading-none opacity-55">
        <span className="text-[12px] sm:text-sm">{card.rank}</span>
      </div>
    </button>
  );
}

function WastePile({ cards, drawCount, selected = false, onClick }) {
  const visibleCards = cards.slice(-Math.max(1, drawCount));
  const compactHeight = 'h-[4.35rem] sm:h-[5.35rem]';
  const stackWidthClass = drawCount >= 3 ? 'w-[5.8rem] sm:w-[7rem]' : drawCount === 2 ? 'w-[4.9rem] sm:w-[6rem]' : 'w-[3rem] sm:w-[3.75rem]';

  if (visibleCards.length === 0) {
    return <Card compact onClick={onClick} />;
  }

  return (
    <div className={`relative ${compactHeight} ${stackWidthClass}`}>
      {visibleCards.map((card, index) => {
        const isTopCard = index === visibleCards.length - 1;
        const offsetX = drawCount >= 3 ? index * 20 : index * 16;
        const offsetY = drawCount >= 3 ? index * 10 : index * 7;
        return (
          <div
            className="absolute left-0 top-0"
            key={`${card.id}-${index}`}
            style={{ transform: `translate(${offsetX}px, ${offsetY}px)`, zIndex: index + 1 }}
          >
            <Card card={card} compact selected={selected && isTopCard} onClick={onClick} />
          </div>
        );
      })}
    </div>
  );
}

export default function Solitaire({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const containerRef = useRef(null);
  const [game, setGame] = useState(() => dealGame());
  const [selected, setSelected] = useState(null);
  const [winCards, setWinCards] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setGame(dealGame());
    setSelected(null);
    setWinCards([]);
  }, [difficulty]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const foundationCount = useMemo(() => Object.values(game.foundations).reduce((total, pile) => total + pile.length, 0), [game.foundations]);
  const hasWon = foundationCount === 52;

  useEffect(() => {
    if (hasWon && winCards.length === 0) {
      const cards = [];
      const suits = SUITS;
      for (let i = 0; i < 52; i += 1) {
        const suit = suits[i % 4];
        const rank = RANKS[Math.floor(i / 4)];
        cards.push({
          id: `win-${i}`,
          suit,
          rank,
          x: (Math.random() - 0.5) * 1200,
          y: (Math.random() - 0.5) * 800 + 400,
          r: (Math.random() - 0.5) * 720,
          delay: i * 50
        });
      }
      setWinCards(cards);
    }
  }, [hasWon, winCards.length]);

  const resetGame = () => {
    setGame(dealGame());
    setSelected(null);
    setWinCards([]);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch (error) {
      setGame((previous) => ({
        ...previous,
        message: 'Fullscreen is not available in this browser yet.'
      }));
    }
  };

  const drawFromStock = () => {
    setSelected(null);
    setGame((previous) => {
      if (previous.stock.length === 0) {
        if (previous.waste.length === 0) {
          return { ...previous, message: 'No cards to draw yet.' };
        }
        return {
          ...previous,
          stock: [...previous.waste].reverse().map((card) => ({ ...card, faceUp: false })),
          waste: [],
          moves: previous.moves + 1,
          message: 'Recycled the waste pile back into the deck.'
        };
      }

      const drawCount = Math.min(config.drawCount, previous.stock.length);
      const drawnCards = previous.stock.slice(-drawCount).map((card) => ({ ...card, faceUp: true }));
      return {
        ...previous,
        stock: previous.stock.slice(0, -drawCount),
        waste: [...previous.waste, ...drawnCards],
        moves: previous.moves + 1,
        message: `Drew ${drawCount} card${drawCount > 1 ? 's' : ''}.`
      };
    });
  };

  const revealTopCard = (columnIndex) => {
    setGame((previous) => {
      const column = previous.tableau[columnIndex];
      const topCard = column[column.length - 1];
      if (!topCard || topCard.faceUp) {
        return previous;
      }
      const tableau = previous.tableau.map((pile, index) => (
        index === columnIndex ? pile.map((card, cardIndex) => (cardIndex === pile.length - 1 ? { ...card, faceUp: true } : card)) : pile
      ));
      return { ...previous, tableau, moves: previous.moves + 1, message: 'Turned over a hidden card.' };
    });
  };

  const getSelectedCards = (state = game) => {
    if (!selected) return [];
    if (selected.type === 'waste') {
      const card = state.waste[state.waste.length - 1];
      return card ? [card] : [];
    }
    if (selected.type === 'tableau') {
      return state.tableau[selected.columnIndex].slice(selected.cardIndex);
    }
    if (selected.type === 'foundation') {
      const pile = state.foundations[selected.suit];
      const card = pile[pile.length - 1];
      return card ? [card] : [];
    }
    return [];
  };

  const removeSelectedCards = (state, cards) => {
    if (selected.type === 'waste') {
      return { ...state, waste: state.waste.slice(0, -1) };
    }
    if (selected.type === 'tableau') {
      const tableau = state.tableau.map((pile, index) => (index === selected.columnIndex ? pile.slice(0, selected.cardIndex) : pile));
      const sourcePile = tableau[selected.columnIndex];
      const topCard = sourcePile[sourcePile.length - 1];
      if (topCard && !topCard.faceUp) {
        sourcePile[sourcePile.length - 1] = { ...topCard, faceUp: true };
      }
      return { ...state, tableau };
    }
    if (selected.type === 'foundation') {
      return {
        ...state,
        foundations: {
          ...state.foundations,
          [selected.suit]: state.foundations[selected.suit].slice(0, -cards.length)
        }
      };
    }
    return state;
  };

  const moveSelectedToTableau = (columnIndex) => {
    if (!selected) return;
    setGame((previous) => {
      const cards = getSelectedCards(previous);
      if (cards.length === 0 || !canMoveToTableau(cards[0], previous.tableau[columnIndex])) {
        return { ...previous, message: 'That card does not fit there yet.' };
      }
      const withoutCards = removeSelectedCards(previous, cards);
      const tableau = withoutCards.tableau.map((pile, index) => (index === columnIndex ? [...pile, ...cards] : pile));
      return { ...withoutCards, tableau, moves: previous.moves + 1, message: 'Moved the card stack.' };
    });
    setSelected(null);
  };

  const moveSelectedToFoundation = (suit) => {
    if (!selected) return;
    setGame((previous) => {
      const cards = getSelectedCards(previous);
      if (cards.length !== 1 || cards[0].suit !== suit || !canMoveToFoundation(cards[0], previous.foundations[suit])) {
        return { ...previous, message: 'Foundations build upward from Ace to King.' };
      }
      const withoutCards = removeSelectedCards(previous, cards);
      return {
        ...withoutCards,
        foundations: {
          ...withoutCards.foundations,
          [suit]: [...withoutCards.foundations[suit], cards[0]]
        },
        moves: previous.moves + 1,
        message: `Placed ${cards[0].rank}${cards[0].suit} on the foundation.`
      };
    });
    setSelected(null);
  };

  const selectWaste = () => {
    if (game.waste.length === 0) return;
    setSelected({ type: 'waste' });
  };

  const selectFoundation = (suit) => {
    const pile = game.foundations[suit];
    if (selected) {
      moveSelectedToFoundation(suit);
      return;
    }
    if (pile.length > 0) {
      setSelected({ type: 'foundation', suit });
    }
  };

  const selectTableauCard = (columnIndex, cardIndex) => {
    const card = game.tableau[columnIndex][cardIndex];
    const isTopCard = cardIndex === game.tableau[columnIndex].length - 1;

    if (!card.faceUp) {
      if (isTopCard) revealTopCard(columnIndex);
      return;
    }

    if (selected) {
      moveSelectedToTableau(columnIndex);
      return;
    }

    setSelected({ type: 'tableau', columnIndex, cardIndex });
  };

  const selectedKey = selected ? `${selected.type}-${selected.columnIndex ?? selected.suit ?? 'waste'}-${selected.cardIndex ?? 0}` : '';

  return (
    <div ref={containerRef} className={`mx-auto w-full ${isFullscreen ? 'min-h-screen bg-[#07542f] p-3 sm:p-5' : 'pb-6 sm:pb-8'}`}>
      <div className={`overflow-hidden rounded-[1.8rem] border border-emerald-950/25 bg-[#0b6f3c] shadow-[0_22px_50px_rgba(8,69,38,0.28)] ${isFullscreen ? 'flex min-h-[calc(100vh-1.5rem)] flex-col sm:min-h-[calc(100vh-2.5rem)]' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#086133] px-4 py-3 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/14 text-lg shadow-inner">♣</div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-100/80">Clean card table</p>
              <h3 className="font-display text-2xl font-black tracking-tight">Solitaire</h3>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">
            <button className="rounded-full bg-white px-4 py-2 text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50" onClick={resetGame} type="button">New</button>
            <button className="inline-flex items-center gap-2 rounded-full bg-white/13 px-4 py-2 text-white transition hover:-translate-y-0.5 hover:bg-white/20" onClick={toggleFullscreen} type="button">
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {isFullscreen ? 'Exit full' : 'Full screen'}
            </button>
            <span className="rounded-full bg-white/13 px-4 py-2">{config.label}</span>
            <span className="rounded-full bg-white/13 px-4 py-2">Moves {game.moves}</span>
            <span className="rounded-full bg-white/13 px-4 py-2">Home {foundationCount}/52</span>
          </div>
        </div>

        <div className={`relative min-h-[560px] overflow-x-auto bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,#0b7c43,#075b33)] p-4 sm:p-6 lg:p-8 ${isFullscreen ? 'flex-1' : ''}`}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 1px 12px)' }} />
          
          {hasWon && (
            <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
              {winCards.map((card) => (
                <div
                  key={card.id}
                  className="solitaire-win-card"
                  style={{
                    '--win-x': `${card.x}px`,
                    '--win-y': `${card.y}px`,
                    '--win-r': `${card.r}deg`,
                    animationDelay: `${card.delay}ms`,
                    left: '50%',
                    top: '40%'
                  }}
                >
                  <div className={`h-[5.35rem] w-[3.75rem] sm:h-24 sm:w-16 flex flex-col justify-between rounded-[0.8rem] border border-white/95 bg-[#fffdf8] p-1.5 text-left font-black shadow-lg ${isRed(card.suit) ? 'text-rose-500' : 'text-slate-800'}`}>
                    <div className="flex flex-col leading-none">
                      <span className="text-[12px] sm:text-sm">{card.rank}</span>
                      <span className="text-[11px] opacity-85 sm:text-xs">{card.suit}</span>
                    </div>
                    <span className="self-center text-2xl leading-none sm:text-3xl">{card.suit}</span>
                    <div className="rotate-180 self-end leading-none opacity-55">
                      <span className="text-[12px] sm:text-sm">{card.rank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`relative mx-auto flex min-w-[560px] max-w-[920px] flex-col gap-8 ${isFullscreen ? 'h-full' : ''}`}>
            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4">
                <div className="text-center">
                  {game.stock.length > 0 ? <Card card={{ id: 'stock', faceUp: false }} compact onClick={drawFromStock} /> : <Card compact onClick={drawFromStock} />}
                  <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/78">Deck {game.stock.length}</span>
                </div>
                <div className="text-center">
                  <WastePile cards={game.waste} drawCount={config.drawCount} selected={selected?.type === 'waste'} onClick={selectWaste} />
                  <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/78">Waste</span>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {SUITS.map((suit) => {
                  const pile = game.foundations[suit];
                  const topCard = pile[pile.length - 1];
                  return (
                    <div key={suit} className="text-center">
                      <Card card={topCard} compact selected={selected?.type === 'foundation' && selected.suit === suit} onClick={() => selectFoundation(suit)} />
                      <span className={`mt-2 block text-sm font-black ${isRed(suit) ? 'text-rose-100' : 'text-white/90'}`}>{suit}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 pb-8 sm:gap-4 lg:gap-5">
              {game.tableau.map((column, columnIndex) => (
                <div key={`column-${columnIndex + 1}`} className="min-h-[19rem] min-w-[3.6rem] space-y-[-2.45rem] rounded-[1.1rem] bg-emerald-950/10 p-1.5 pb-20 sm:space-y-[-2.85rem]">
                  {column.length === 0 ? (
                    <Card compact onClick={() => moveSelectedToTableau(columnIndex)} />
                  ) : column.map((card, cardIndex) => {
                    const isSelected = selectedKey === `tableau-${columnIndex}-${cardIndex}`;
                    return (
                      <Card
                        card={card}
                        compact
                        key={card.id}
                        selected={isSelected}
                        onClick={() => selectTableauCard(columnIndex, cardIndex)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-[#07542f] px-4 py-4 text-sm font-semibold text-emerald-50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{hasWon ? 'Done — you cleared the full table beautifully.' : game.message}</p>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-emerald-900 shadow-sm transition hover:-translate-y-0.5" onClick={resetGame} type="button">
            {hasWon ? <Play size={16} /> : <RotateCcw size={16} />} {hasWon ? 'Play again' : 'Reset deck'}
          </button>
        </div>
      </div>
    </div>
  );
}
