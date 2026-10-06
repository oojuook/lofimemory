import React, { useEffect, useMemo, useState } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

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
    drawCount: 1,
    note: 'Classic one-card draw with a little more attention on tidy moves.'
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
  if (!card) {
    return (
      <button
        aria-label="Empty card slot"
        className={`${compact ? 'h-16 w-11' : 'h-[4.8rem] w-14'} rounded-xl border border-dashed border-violet-200 bg-white/38`}
        onClick={onClick}
        type="button"
      />
    );
  }

  if (!card.faceUp) {
    return (
      <button
        aria-label="Hidden card"
        className={`${compact ? 'h-16 w-11' : 'h-[4.8rem] w-14'} rounded-xl border border-violet-200 bg-gradient-to-br from-violet-200 via-sky-100 to-white shadow-sm ring-1 ring-white/70`}
        onClick={onClick}
        type="button"
      >
        <span className="text-lg text-violet-500">✦</span>
      </button>
    );
  }

  return (
    <button
      className={`${compact ? 'h-16 w-11' : 'h-[4.8rem] w-14'} flex flex-col justify-between rounded-xl border bg-white px-2 py-1.5 text-left font-extrabold shadow-sm transition hover:-translate-y-0.5 ${selected ? 'border-violet-500 ring-4 ring-violet-200' : 'border-white/80'} ${cardColor(card)}`}
      onClick={onClick}
      type="button"
    >
      <span className="text-sm leading-none">{card.rank}</span>
      <span className="self-center text-xl leading-none">{card.suit}</span>
      <span className="self-end text-sm leading-none">{card.rank}</span>
    </button>
  );
}

export default function Solitaire({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const [game, setGame] = useState(() => dealGame());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setGame(dealGame());
    setSelected(null);
  }, [difficulty]);

  const foundationCount = useMemo(() => Object.values(game.foundations).reduce((total, pile) => total + pile.length, 0), [game.foundations]);
  const hasWon = foundationCount === 52;

  const resetGame = () => {
    setGame(dealGame());
    setSelected(null);
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
  const wasteTop = game.waste[game.waste.length - 1];

  return (
    <div className="mx-auto mt-12 w-full max-w-[1080px] pb-12">
      <div className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-white via-amber-50/78 to-rose-50/70 p-5 shadow-soft lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-amber-700 shadow-sm">
              <Sparkles size={14} /> {config.label} card flow
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-amber-950">Solitaire</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-amber-800">A calm Klondike-style solitaire table for slower card sorting. Click a card to pick it up, then click a column or foundation to place it.</p>
            <p className="mt-2 text-sm font-semibold text-amber-700">{config.note}</p>
          </div>
          <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:min-w-[25rem]">
            <div className="rounded-[1.15rem] bg-amber-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Moves</p>
              <p className="mt-2 text-xl font-extrabold text-amber-950">{game.moves}</p>
            </div>
            <div className="rounded-[1.15rem] bg-amber-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Home</p>
              <p className="mt-2 text-xl font-extrabold text-amber-950">{foundationCount}/52</p>
            </div>
            <div className="rounded-[1.15rem] bg-amber-50 px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Draw</p>
              <p className="mt-2 text-xl font-extrabold text-amber-950">{config.drawCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-white/80 bg-emerald-900/90 p-4 shadow-inner sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-3">
              <div className="relative">
                {game.stock.length > 0 ? <Card card={{ id: 'stock', faceUp: false }} compact onClick={drawFromStock} /> : <Card compact onClick={drawFromStock} />}
                <span className="mt-1 block text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/80">Deck {game.stock.length}</span>
              </div>
              <Card card={wasteTop} compact selected={selected?.type === 'waste'} onClick={selectWaste} />
            </div>

            <div className="flex flex-wrap gap-3">
              {SUITS.map((suit) => {
                const pile = game.foundations[suit];
                const topCard = pile[pile.length - 1];
                return (
                  <div key={suit} className="text-center">
                    <Card card={topCard} compact selected={selected?.type === 'foundation' && selected.suit === suit} onClick={() => selectFoundation(suit)} />
                    <span className={`mt-1 block text-sm font-extrabold ${isRed(suit) ? 'text-rose-200' : 'text-white/85'}`}>{suit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2 overflow-x-auto pb-2 sm:gap-3">
            {game.tableau.map((column, columnIndex) => (
              <div key={`column-${columnIndex + 1}`} className="min-w-[4rem] space-y-[-2rem] rounded-2xl bg-white/8 p-1.5 pb-10">
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

        <div className="mt-4 flex flex-col gap-3 rounded-[1.4rem] border border-amber-100 bg-white/86 p-4 text-sm font-semibold text-amber-800 sm:flex-row sm:items-center sm:justify-between">
          <p>{hasWon ? 'You cleared the full table — beautifully done.' : game.message}</p>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800" onClick={resetGame} type="button">
            {hasWon ? <Play size={16} /> : <RotateCcw size={16} />} {hasWon ? 'Play again' : 'Reset deck'}
          </button>
        </div>
      </div>
    </div>
  );
}
