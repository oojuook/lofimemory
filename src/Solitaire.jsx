import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, Minimize2, Play, RotateCcw, Sparkles } from 'lucide-react';

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
const cardColor = (card, isLofi = false) => {
  if (isRed(card.suit)) return isLofi ? 'text-[#ff8fa3]' : 'text-rose-500';
  return isLofi ? 'text-[#6e5a4a]' : 'text-slate-800';
};

function selectionsMatch(first, second) {
  if (!first || !second) return false;
  return first.type === second.type
    && first.columnIndex === second.columnIndex
    && first.cardIndex === second.cardIndex
    && first.suit === second.suit;
}

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

function Card({
  card,
  selected = false,
  compact = false,
  onClick,
  onDoubleClick,
  draggable = false,
  onPointerDown,
  cardRef,
  ghosted = false,
  dropTarget,
  cardStyle,
  isLofi = false
}) {
  const sizeClass = compact ? 'h-[4.35rem] w-[3rem] sm:h-[5.35rem] sm:w-[3.75rem]' : 'h-[5.35rem] w-[3.75rem] sm:h-24 sm:w-16';
  const baseClass = `${sizeClass} shrink-0 rounded-[0.8rem] transition duration-200`;

  if (!card) {
    return (
      <button
        ref={cardRef}
        aria-label="Empty card slot"
        className={`${baseClass} border-2 ${isLofi ? 'border-amber-200/40 bg-amber-900/5' : 'border-white/20 bg-emerald-950/16'} shadow-inner ${ghosted ? 'opacity-0' : ''}`}
        data-drop-target={dropTarget}
        onClick={onClick}
        style={cardStyle}
        type="button"
      />
    );
  }

  if (!card.faceUp) {
    return (
      <button
        ref={cardRef}
        aria-label="Hidden card"
        className={`${baseClass} grid place-items-center border ${isLofi ? 'border-amber-200/60 bg-gradient-to-br from-[#d4a373] via-[#a98467] to-[#6c584c]' : 'border-emerald-100/55 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(145deg,#0f8f50,#08733f_48%,#075a33)]'} shadow-[0_5px_12px_rgba(0,0,0,0.22)] ${isLofi ? 'ring-1 ring-amber-100/20' : 'ring-1 ring-emerald-300/30'} hover:-translate-y-0.5 ${ghosted ? 'opacity-0' : ''}`}
        data-drop-target={dropTarget}
        onClick={onClick}
        style={cardStyle}
        type="button"
      >
        <div className={`grid h-8 w-8 place-items-center rounded-full border ${isLofi ? 'border-white/20 bg-white/5' : 'border-white/35 bg-white/12'} sm:h-10 sm:w-10`}>
          <span className={`text-sm font-black ${isLofi ? 'text-white/40' : 'text-white/72'}`}>✦</span>
        </div>
      </button>
    );
  }

  return (
    <button
      className={`${baseClass} relative flex flex-col justify-between border ${isLofi ? 'bg-[#fdfaf5] border-[#e8dfd5]' : 'bg-[#fffdf8] border-white/95'} p-1.5 text-left font-black shadow-[0_5px_12px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 ${selected ? `z-20 -translate-y-1 ${isLofi ? 'border-amber-400 ring-4 ring-amber-200/50' : 'border-amber-300 ring-4 ring-amber-200/80'}` : ''} ${cardColor(card, isLofi)} ${ghosted ? 'opacity-0' : ''} ${draggable ? 'cursor-grab active:cursor-grabbing touch-none select-none' : ''}`}
      data-drop-target={dropTarget}
      draggable={false}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onPointerDown={draggable ? onPointerDown : undefined}
      ref={cardRef}
      style={cardStyle}
      type="button"
    >
      <div className="flex flex-col leading-none">
        <span className="text-[12px] sm:text-sm">{card.rank}</span>
        <span className={`text-[11px] ${isLofi ? 'opacity-70' : 'opacity-85'} sm:text-xs`}>{card.suit}</span>
      </div>
      <span className="self-center text-2xl leading-none sm:text-3xl">{card.suit}</span>
      <div className={`rotate-180 self-end leading-none ${isLofi ? 'opacity-40' : 'opacity-55'}`}>
        <span className="text-[12px] sm:text-sm">{card.rank}</span>
      </div>
      {isLofi && (
        <div className="absolute inset-0 rounded-[0.8rem] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      )}
    </button>
  );
}

function WastePile({
  cards,
  drawCount,
  selected = false,
  onClick,
  onDoubleClick,
  draggable = false,
  onPointerDown,
  cardRef,
  ghosted = false,
  dropTarget,
  cardStyle,
  isLofi = false
}) {
  const visibleCards = cards.slice(-Math.max(1, drawCount));
  const compactHeight = 'h-[4.35rem] sm:h-[5.35rem]';
  const stackWidthClass = drawCount >= 3 ? 'w-[5.8rem] sm:w-[7rem]' : drawCount === 2 ? 'w-[4.9rem] sm:w-[6rem]' : 'w-[3rem] sm:w-[3.75rem]';

  if (visibleCards.length === 0) {
    return <Card compact isLofi={isLofi} onClick={onClick} />;
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
            key={card.id}
            style={{ transform: `translate(${offsetX}px, ${offsetY}px)`, zIndex: index + 1 }}
          >
            <Card
              card={card}
              compact
              isLofi={isLofi}
              cardRef={isTopCard ? cardRef : undefined}
              cardStyle={isTopCard ? cardStyle : undefined}
              draggable={Boolean(draggable && isTopCard)}
              dropTarget={dropTarget}
              ghosted={Boolean(ghosted && isTopCard)}
              selected={Boolean(selected && isTopCard)}
              onClick={isTopCard ? onClick : undefined}
              onDoubleClick={isTopCard ? onDoubleClick : undefined}
              onPointerDown={isTopCard ? onPointerDown : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Solitaire({ difficulty = 'medium', theme = 'lofi' }) {
  const isLofi = theme === 'lofi';
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const containerRef = useRef(null);
  const playfieldRef = useRef(null);
  const foundationRefs = useRef({});
  const cardRefs = useRef({});
  const autoFinishTimerRef = useRef(null);
  const moveSelectionToFoundationRef = useRef(null);
  const moveSelectionToTableauRef = useRef(null);
  const updateDragPreviewPositionRef = useRef(null);
  const getPointerDropTargetRef = useRef(null);
  const triggerAutoFinishRef = useRef(null);
  const pendingDragRef = useRef(null);
  const suppressClickUntilRef = useRef(0);
  const [game, setGame] = useState(() => dealGame());
  const [selected, setSelected] = useState(null);
  const [draggedSelection, setDraggedSelection] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [flightCards, setFlightCards] = useState([]);
  const [isAutoFinishing, setIsAutoFinishing] = useState(false);
  const [winCards, setWinCards] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setGame(dealGame());
    setSelected(null);
    pendingDragRef.current = null;
    suppressClickUntilRef.current = 0;
    setDraggedSelection(null);
    setDragOverTarget(null);
    setDragPreview(null);
    setFlightCards([]);
    window.clearTimeout(autoFinishTimerRef.current);
    setIsAutoFinishing(false);
    setWinCards([]);
  }, [difficulty]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => () => window.clearTimeout(autoFinishTimerRef.current), []);

  const foundationCount = useMemo(() => Object.values(game.foundations).reduce((total, pile) => total + pile.length, 0), [game.foundations]);
  const hasWon = foundationCount === 52;
  const canAutoFinish = useMemo(() => (
    !hasWon
    && game.stock.length === 0
    && game.waste.length === 0
    && game.tableau.every((column) => column.every((card) => card.faceUp))
  ), [game.stock.length, game.tableau, game.waste.length, hasWon]);

  const isClickSuppressed = () => Date.now() < suppressClickUntilRef.current;
  const suppressNextClick = () => {
    suppressClickUntilRef.current = Date.now() + 250;
  };

  const getSelectionKey = (source) => {
    if (!source) return '';
    if (source.type === 'tableau') {
      return `tableau-${source.columnIndex}-${source.cardIndex}`;
    }
    if (source.type === 'foundation') {
      return `foundation-${source.suit}`;
    }
    return source.type;
  };

  const setCardNode = (source) => (node) => {
    const key = getSelectionKey(source);
    if (!key) return;
    if (node) {
      cardRefs.current[key] = node;
    } else {
      delete cardRefs.current[key];
    }
  };

  const setFoundationNode = (suit) => (node) => {
    if (node) {
      foundationRefs.current[suit] = node;
    } else {
      delete foundationRefs.current[suit];
    }
  };

  const queueFlightCard = (source, card) => {
    const sourceNode = cardRefs.current[getSelectionKey(source)];
    const targetNode = foundationRefs.current[card.suit];
    const fieldNode = playfieldRef.current;
    if (!sourceNode || !targetNode || !fieldNode) return;

    const sourceRect = sourceNode.getBoundingClientRect();
    const targetRect = targetNode.getBoundingClientRect();
    const fieldRect = fieldNode.getBoundingClientRect();
    const id = `${card.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setFlightCards((previous) => ([
      ...previous,
      {
        id,
        card,
        startX: sourceRect.left - fieldRect.left,
        startY: sourceRect.top - fieldRect.top,
        endX: targetRect.left - fieldRect.left,
        endY: targetRect.top - fieldRect.top
      }
    ]));

    window.setTimeout(() => {
      setFlightCards((previous) => previous.filter((item) => item.id !== id));
    }, 420);
  };

  const findAutoFinishMove = (state) => {
    for (let columnIndex = 0; columnIndex < state.tableau.length; columnIndex += 1) {
      const column = state.tableau[columnIndex];
      const card = column[column.length - 1];
      if (card && canMoveToFoundation(card, state.foundations[card.suit])) {
        return {
          source: { type: 'tableau', columnIndex, cardIndex: column.length - 1 },
          suit: card.suit,
          card
        };
      }
    }
    return null;
  };

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
    pendingDragRef.current = null;
    suppressClickUntilRef.current = 0;
    setDraggedSelection(null);
    setDragOverTarget(null);
    setDragPreview(null);
    setFlightCards([]);
    window.clearTimeout(autoFinishTimerRef.current);
    setIsAutoFinishing(false);
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
    } catch {
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

  const getCardsFromSelection = (source = selected, state = game) => {
    if (!source) return [];
    if (source.type === 'waste') {
      const card = state.waste[state.waste.length - 1];
      return card ? [card] : [];
    }
    if (source.type === 'tableau') {
      return state.tableau[source.columnIndex].slice(source.cardIndex);
    }
    if (source.type === 'foundation') {
      const pile = state.foundations[source.suit];
      const card = pile[pile.length - 1];
      return card ? [card] : [];
    }
    return [];
  };

  const removeCardsFromSelection = (state, source, cards) => {
    if (!source) return state;
    if (source.type === 'waste') {
      return { ...state, waste: state.waste.slice(0, -1) };
    }
    if (source.type === 'tableau') {
      const tableau = state.tableau.map((pile, index) => (index === source.columnIndex ? pile.slice(0, source.cardIndex) : pile));
      const sourcePile = tableau[source.columnIndex];
      const topCard = sourcePile[sourcePile.length - 1];
      if (topCard && !topCard.faceUp) {
        sourcePile[sourcePile.length - 1] = { ...topCard, faceUp: true };
      }
      return { ...state, tableau };
    }
    if (source.type === 'foundation') {
      return {
        ...state,
        foundations: {
          ...state.foundations,
          [source.suit]: state.foundations[source.suit].slice(0, -cards.length)
        }
      };
    }
    return state;
  };

  const moveSelectionToTableau = (columnIndex, source = selected) => {
    if (!source) return;
    setGame((previous) => {
      const cards = getCardsFromSelection(source, previous);
      if (
        cards.length === 0
        || (source.type === 'tableau' && source.columnIndex === columnIndex)
        || !canMoveToTableau(cards[0], previous.tableau[columnIndex])
      ) {
        return { ...previous, message: 'That card does not fit there yet.' };
      }
      const withoutCards = removeCardsFromSelection(previous, source, cards);
      const tableau = withoutCards.tableau.map((pile, index) => (index === columnIndex ? [...pile, ...cards] : pile));
      return { ...withoutCards, tableau, moves: previous.moves + 1, message: 'Moved the card stack.' };
    });
    if (selectionsMatch(selected, source)) {
      setSelected(null);
    }
    setDraggedSelection(null);
    setDragOverTarget(null);
  };

  const moveSelectionToFoundation = (suit, source = selected) => {
    if (!source) return;
    const currentCards = getCardsFromSelection(source, game);
    if (
      currentCards.length === 1
      && currentCards[0].suit === suit
      && canMoveToFoundation(currentCards[0], game.foundations[suit])
    ) {
      queueFlightCard(source, currentCards[0]);
    }
    setGame((previous) => {
      const cards = getCardsFromSelection(source, previous);
      if (
        cards.length !== 1
        || cards[0].suit !== suit
        || (source.type === 'foundation' && source.suit === suit)
        || !canMoveToFoundation(cards[0], previous.foundations[suit])
      ) {
        return { ...previous, message: 'Foundations build upward from Ace to King.' };
      }
      const withoutCards = removeCardsFromSelection(previous, source, cards);
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
    if (selectionsMatch(selected, source)) {
      setSelected(null);
    }
    setDraggedSelection(null);
    setDragOverTarget(null);
    setDragPreview(null);
  };

  const tryAutoFoundation = (source) => {
    if (!source) return false;
    const cards = getCardsFromSelection(source, game);
    if (cards.length !== 1) return false;
    const [card] = cards;
    if (!card.faceUp) return false;
    if (!canMoveToFoundation(card, game.foundations[card.suit])) return false;
    moveSelectionToFoundation(card.suit, source);
    return true;
  };

  const triggerAutoFinish = () => {
    if (!canAutoFinish || isAutoFinishing || hasWon) return false;
    const nextMove = findAutoFinishMove(game);
    if (!nextMove) return false;
    setIsAutoFinishing(true);
    moveSelectionToFoundation(nextMove.suit, nextMove.source);
    return true;
  };

  triggerAutoFinishRef.current = triggerAutoFinish;

  useEffect(() => {
    if (!isAutoFinishing) return undefined;
    const nextMove = findAutoFinishMove(game);
    if (!nextMove) {
      setIsAutoFinishing(false);
      return undefined;
    }
    autoFinishTimerRef.current = window.setTimeout(() => {
      moveSelectionToFoundationRef.current?.(nextMove.suit, nextMove.source);
    }, 180);
    return () => window.clearTimeout(autoFinishTimerRef.current);
  }, [game, isAutoFinishing]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.key?.toLowerCase() === 'f') {
        if (triggerAutoFinishRef.current?.()) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!canAutoFinish && isAutoFinishing) {
      window.clearTimeout(autoFinishTimerRef.current);
      setIsAutoFinishing(false);
    }
  }, [canAutoFinish, isAutoFinishing]);

  const selectWaste = () => {
    if (isClickSuppressed() || game.waste.length === 0) return;
    setSelected({ type: 'waste' });
  };

  const selectFoundation = (suit) => {
    if (isClickSuppressed()) return;
    const pile = game.foundations[suit];
    if (selected) {
      moveSelectionToFoundation(suit);
      return;
    }
    if (pile.length > 0) {
      setSelected({ type: 'foundation', suit });
    }
  };

  const selectTableauCard = (columnIndex, cardIndex) => {
    if (isClickSuppressed()) return;
    const card = game.tableau[columnIndex][cardIndex];
    const isTopCard = cardIndex === game.tableau[columnIndex].length - 1;

    if (!card.faceUp) {
      if (isTopCard) revealTopCard(columnIndex);
      return;
    }

    if (selected) {
      moveSelectionToTableau(columnIndex);
      return;
    }

    setSelected({ type: 'tableau', columnIndex, cardIndex });
  };

  const doubleClickWaste = () => {
    if (isClickSuppressed()) return;
    tryAutoFoundation({ type: 'waste' });
  };

  const doubleClickTableauCard = (columnIndex, cardIndex) => {
    if (isClickSuppressed()) return;
    tryAutoFoundation({ type: 'tableau', columnIndex, cardIndex });
  };

  const updateDragPreviewPosition = (clientX, clientY, source = draggedSelection, pointerMeta = pendingDragRef.current) => {
    if (!source || clientX === null || clientX === undefined || clientY === null || clientY === undefined) return;
    setDragPreview({
      source,
      deltaX: clientX - (pointerMeta?.startX ?? clientX),
      deltaY: clientY - (pointerMeta?.startY ?? clientY)
    });
  };

  const getPointerDropTarget = (clientX, clientY, source = draggedSelection) => {
    if (!source) return null;
    const targetElement = document.elementFromPoint(clientX, clientY)?.closest('[data-drop-target]');
    const target = targetElement?.dataset.dropTarget;
    if (!target) return null;

    if (target.startsWith('tableau-')) {
      const columnIndex = Number(target.replace('tableau-', ''));
      const cards = getCardsFromSelection(source, game);
      if (
        cards.length === 0
        || (source.type === 'tableau' && source.columnIndex === columnIndex)
        || !canMoveToTableau(cards[0], game.tableau[columnIndex])
      ) {
        return null;
      }
      return { kind: 'tableau', key: target, columnIndex };
    }

    if (target.startsWith('foundation-')) {
      const suit = target.replace('foundation-', '');
      const cards = getCardsFromSelection(source, game);
      if (
        cards.length !== 1
        || cards[0].suit !== suit
        || (source.type === 'foundation' && source.suit === suit)
        || !canMoveToFoundation(cards[0], game.foundations[suit])
      ) {
        return null;
      }
      return { kind: 'foundation', key: target, suit };
    }

    return null;
  };

  moveSelectionToFoundationRef.current = moveSelectionToFoundation;
  moveSelectionToTableauRef.current = moveSelectionToTableau;
  updateDragPreviewPositionRef.current = updateDragPreviewPosition;
  getPointerDropTargetRef.current = getPointerDropTarget;

  const beginPointerDrag = (event, source) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const sourceRect = event.currentTarget.getBoundingClientRect();
    pendingDragRef.current = {
      source,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - sourceRect.left,
      offsetY: event.clientY - sourceRect.top,
      dragging: false
    };
  };

  const clearPointerDrag = () => {
    pendingDragRef.current = null;
    setDraggedSelection(null);
    setDragOverTarget(null);
    setDragPreview(null);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      const pending = pendingDragRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;

      const distance = Math.hypot(event.clientX - pending.startX, event.clientY - pending.startY);
      if (!pending.dragging) {
        if (distance < 6) return;
        pending.dragging = true;
        suppressNextClick();
        setDraggedSelection(pending.source);
        setSelected(pending.source);
      }

      event.preventDefault();
      updateDragPreviewPositionRef.current?.(event.clientX, event.clientY, pending.source, pending);
      const dropTarget = getPointerDropTargetRef.current?.(event.clientX, event.clientY, pending.source);
      setDragOverTarget(dropTarget?.key ?? null);
    };

    const handlePointerUp = (event) => {
      const pending = pendingDragRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      pendingDragRef.current = null;

      if (!pending.dragging) return;

      suppressNextClick();
      const dropTarget = getPointerDropTargetRef.current?.(event.clientX, event.clientY, pending.source);
      if (dropTarget?.kind === 'tableau') {
        moveSelectionToTableauRef.current?.(dropTarget.columnIndex, pending.source);
        return;
      }
      if (dropTarget?.kind === 'foundation') {
        moveSelectionToFoundationRef.current?.(dropTarget.suit, pending.source);
        return;
      }
      setDraggedSelection(null);
      setDragOverTarget(null);
      setDragPreview(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', clearPointerDrag);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', clearPointerDrag);
    };
  }, []);

  const selectedKey = selected ? `${selected.type}-${selected.columnIndex ?? selected.suit ?? 'waste'}-${selected.cardIndex ?? 0}` : '';

  const isCardGhosted = () => false;

  const getDraggedCardStyle = (source) => {
    if (!dragPreview || !draggedSelection || !source) return undefined;
    if (source.type === 'tableau' && draggedSelection.type === 'tableau') {
      if (source.columnIndex !== draggedSelection.columnIndex || source.cardIndex < draggedSelection.cardIndex) {
        return undefined;
      }
    } else if (!selectionsMatch(source, draggedSelection)) {
      return undefined;
    }

    return {
      transform: `translate(${dragPreview.deltaX}px, ${dragPreview.deltaY}px)`,
      transition: 'none',
      pointerEvents: 'none',
      position: 'relative',
      zIndex: 80
    };
  };

  return (
    <div ref={containerRef} className={`mx-auto w-full ${isFullscreen ? `${isLofi ? 'bg-[#fff7ec]' : 'bg-[#07542f]'} min-h-screen p-3 sm:p-5` : 'pb-6 sm:pb-8'}`}>
      <div className={`overflow-hidden rounded-[2rem] border shadow-[0_22px_50px_rgba(83,62,44,0.12)] ${isLofi ? 'border-[#e8dfd5]/80 bg-[#fff7ec]' : 'border-emerald-950/25 bg-[#0b6f3c]'} ${isFullscreen ? 'flex min-h-[calc(100vh-1.5rem)] flex-col sm:min-h-[calc(100vh-2.5rem)]' : ''}`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:px-6 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/72 text-[#3d3025] backdrop-blur-sm' : 'border-white/10 bg-[#086133] text-white'}`}>
          <div className="flex items-center gap-3">
            {isLofi ? (
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/85 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-amber-800 shadow-sm">
                  <Sparkles size={14} /> {config.label} card flow
                </div>
                <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-[#3d3025]">Solitaire</h3>
                <p className="mt-1 text-sm font-semibold text-[#6e5a4a]">{config.note}</p>
              </div>
            ) : (
              <>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/14 text-lg shadow-inner">♣</div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-100/80">Clean card table</p>
                  <h3 className="font-display text-2xl font-black tracking-tight">Solitaire</h3>
                </div>
              </>
            )}
          </div>
          <div className={`flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${isLofi ? 'text-[#6e5a4a]' : ''}`}>
            <button className={`rounded-full px-4 py-2 shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] text-white hover:bg-[#3d3025]' : 'bg-white text-emerald-900 hover:bg-emerald-50'}`} onClick={resetGame} type="button">New</button>
            <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:-translate-y-0.5 ${isLofi ? 'border border-[#e8dfd5] bg-white text-[#4a3a2d] hover:bg-[#fff9f0]' : 'bg-white/13 text-white hover:bg-white/20'}`} onClick={toggleFullscreen} type="button">
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {isFullscreen ? 'Exit full' : 'Full screen'}
            </button>
            {canAutoFinish ? (
              <button className={`rounded-full px-4 py-2 shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#faedcd] text-[#4a3a2d] hover:bg-[#f7e4b7]' : 'bg-amber-300 text-emerald-950 hover:bg-amber-200'}`} onClick={triggerAutoFinish} type="button">
                {isAutoFinishing ? 'Finishing…' : 'Auto finish · F'}
              </button>
            ) : null}
            <span className={`rounded-full px-4 py-2 ${isLofi ? 'border border-[#e8dfd5] bg-white/80 text-[#4a3a2d]' : 'bg-white/13'}`}>{config.label}</span>
            <span className={`rounded-full px-4 py-2 ${isLofi ? 'border border-[#e8dfd5] bg-white/80 text-[#4a3a2d]' : 'bg-white/13'}`}>Moves {game.moves}</span>
            <span className={`rounded-full px-4 py-2 ${isLofi ? 'border border-[#e8dfd5] bg-white/80 text-[#4a3a2d]' : 'bg-white/13'}`}>Home {foundationCount}/52</span>
          </div>
        </div>

        <div className={`relative min-h-[560px] overflow-auto p-4 sm:p-6 lg:p-8 ${isFullscreen ? 'flex-1' : ''} ${isLofi ? 'bg-[#fff7ec]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,#0b7c43,#075b33)]'}`}>
          <div className={`pointer-events-none absolute inset-0 opacity-[0.06] ${isLofi ? 'hidden' : ''}`} style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 1px 12px)' }} />
          {isLofi && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,58,45,0.04),transparent_70%)] opacity-40 pointer-events-none" />
          )}
          
          {hasWon ? (
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
                  <div className={`h-[5.35rem] w-[3.75rem] sm:h-24 sm:w-16 flex flex-col justify-between rounded-[0.8rem] border p-1.5 text-left font-black shadow-lg ${isLofi ? 'border-[#e8dfd5] bg-[#fdfaf5]' : 'border-white/95 bg-[#fffdf8]'} ${cardColor(card, isLofi)}`}>
                    <div className="flex flex-col leading-none">
                      <span className="text-[12px] sm:text-sm">{card.rank}</span>
                      <span className={`text-[11px] ${isLofi ? 'opacity-70' : 'opacity-85'} sm:text-xs`}>{card.suit}</span>
                    </div>
                    <span className="self-center text-2xl leading-none sm:text-3xl">{card.suit}</span>
                    <div className={`rotate-180 self-end leading-none ${isLofi ? 'opacity-40' : 'opacity-55'}`}>
                      <span className="text-[12px] sm:text-sm">{card.rank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div ref={playfieldRef} className={`relative mx-auto flex min-w-[560px] max-w-[920px] flex-col gap-8 ${isFullscreen ? 'h-full' : ''}`}>
            <style>
              {`@keyframes foundation-flight {
                from {
                  transform: translate(var(--from-x), var(--from-y)) rotate(-6deg) scale(1);
                  opacity: 0.96;
                }
                to {
                  transform: translate(var(--to-x), var(--to-y)) rotate(0deg) scale(0.94);
                  opacity: 0.12;
                }
              }`}
            </style>
            {flightCards.length > 0 ? (
              <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
                {flightCards.map((item) => (
                  <div
                    className="absolute left-0 top-0"
                    key={item.id}
                    style={{
                      '--from-x': `${item.startX}px`,
                      '--from-y': `${item.startY}px`,
                      '--to-x': `${item.endX}px`,
                      '--to-y': `${item.endY}px`,
                      animation: 'foundation-flight 420ms ease-out forwards'
                    }}
                  >
                    <Card card={item.card} compact isLofi={isLofi} />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4">
                <div className="text-center">
                  {game.stock.length > 0 ? (
                    <Card card={{ id: 'stock', faceUp: false }} compact isLofi={isLofi} onClick={drawFromStock} />
                  ) : (
                    <Card compact isLofi={isLofi} onClick={drawFromStock} />
                  )}
                  <span className={`mt-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] ${isLofi ? 'text-amber-800/70' : 'text-white/78'}`}>Deck {game.stock.length}</span>
                </div>
                <div className="text-center">
                  <WastePile
                    cards={game.waste}
                    drawCount={config.drawCount}
                    isLofi={isLofi}
                    cardRef={setCardNode({ type: 'waste' })}
                    cardStyle={getDraggedCardStyle({ type: 'waste' })}
                    draggable={game.waste.length > 0}
                    dropTarget="waste"
                    ghosted={isCardGhosted({ type: 'waste' })}
                    selected={selected?.type === 'waste'}
                    onClick={selectWaste}
                    onDoubleClick={doubleClickWaste}
                    onPointerDown={(event) => beginPointerDrag(event, { type: 'waste' })}
                  />
                  <span className={`mt-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] ${isLofi ? 'text-amber-800/70' : 'text-white/78'}`}>Waste</span>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {SUITS.map((suit) => {
                  const pile = game.foundations[suit];
                  const topCard = pile[pile.length - 1];
                  const isDragTarget = dragOverTarget === `foundation-${suit}`;
                  return (
                    <div key={suit} className={`rounded-[1rem] p-1 text-center transition ${isDragTarget ? (isLofi ? 'bg-amber-900/10 ring-2 ring-amber-200/50' : 'bg-white/12 ring-2 ring-amber-200/70') : ''}`}>
                      <Card
                        card={topCard}
                        compact
                        isLofi={isLofi}
                        cardRef={(node) => {
                          setFoundationNode(suit)(node);
                          if (topCard) {
                            setCardNode({ type: 'foundation', suit })(node);
                          }
                        }}
                        draggable={Boolean(topCard)}
                        cardStyle={getDraggedCardStyle({ type: 'foundation', suit })}
                        dropTarget={`foundation-${suit}`}
                        ghosted={isCardGhosted({ type: 'foundation', suit })}
                        selected={selected?.type === 'foundation' && selected.suit === suit}
                        onClick={() => selectFoundation(suit)}
                        onPointerDown={topCard ? (event) => beginPointerDrag(event, { type: 'foundation', suit }) : undefined}
                      />
                      <span className={`mt-2 block text-sm font-black ${isRed(suit) ? (isLofi ? 'text-[#ff8fa3]' : 'text-rose-100') : (isLofi ? 'text-[#6e5a4a]' : 'text-white/90')}`}>{suit}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 pb-8 sm:gap-4 lg:gap-5">
              {game.tableau.map((column, columnIndex) => (
                <div
                  key={`column-${columnIndex + 1}`}
                  className={`min-h-[19rem] min-w-[3.6rem] space-y-[-2.45rem] rounded-[1.1rem] p-1.5 pb-20 transition sm:space-y-[-2.85rem] ${dragOverTarget === `tableau-${columnIndex}` ? (isLofi ? 'bg-amber-900/10 ring-2 ring-amber-200/50' : 'bg-white/14 ring-2 ring-amber-200/70') : (isLofi ? 'bg-amber-900/5' : 'bg-emerald-950/10')}`}
                  data-drop-target={`tableau-${columnIndex}`}
                >
                  {column.length === 0 ? (
                    <Card compact dropTarget={`tableau-${columnIndex}`} isLofi={isLofi} onClick={() => moveSelectionToTableau(columnIndex)} />
                  ) : column.map((card, cardIndex) => {
                    const isSelected = selectedKey === `tableau-${columnIndex}-${cardIndex}`;
                    return (
                      <Card
                        card={card}
                        compact
                        isLofi={isLofi}
                        cardRef={setCardNode({ type: 'tableau', columnIndex, cardIndex })}
                        draggable={card.faceUp}
                        cardStyle={getDraggedCardStyle({ type: 'tableau', columnIndex, cardIndex })}
                        dropTarget={`tableau-${columnIndex}`}
                        ghosted={isCardGhosted({ type: 'tableau', columnIndex, cardIndex })}
                        key={card.id}
                        selected={isSelected}
                        onClick={() => selectTableauCard(columnIndex, cardIndex)}
                        onDoubleClick={() => doubleClickTableauCard(columnIndex, cardIndex)}
                        onPointerDown={card.faceUp ? (event) => beginPointerDrag(event, { type: 'tableau', columnIndex, cardIndex }) : undefined}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-3 border-t px-4 py-4 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between sm:px-6 ${isLofi ? 'border-[#e8dfd5]/80 bg-white/72 text-[#6e5a4a] backdrop-blur-sm' : 'bg-[#07542f] text-emerald-50'}`}>
          <p>{hasWon ? 'Done — you cleared the full table beautifully.' : canAutoFinish ? 'Everything is revealed — press F or tap Auto finish to sweep the cards home.' : game.message}</p>
          <button className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 ${isLofi ? 'bg-[#4a3a2d] text-white' : 'bg-white text-emerald-900'}`} onClick={resetGame} type="button">
            {hasWon ? <Play size={16} /> : <RotateCcw size={16} />} {hasWon ? 'Play again' : 'Reset deck'}
          </button>
        </div>
      </div>
    </div>
  );
}
