import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit3, RotateCcw, Sparkles } from 'lucide-react';

const BOARD_SIZE = 9;
const BOX_SIZE = 3;
const DUPLICATE_GROUP_SIZE = 2;
const INNER_BORDER_WIDTH = 1;
const SUBGRID_BORDER_WIDTH = 3;
const INNER_BORDER_COLOR = '#ffffff';
const SUBGRID_BORDER_COLOR = '#b8c8c0';
const DIGITS = Array.from({ length: BOARD_SIZE }, (_, index) => index + 1);

const puzzleBank = {
  easy: [
    {
      id: 'easy-morning-window',
      puzzle: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      solution: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
    {
      id: 'easy-soft-lamp',
      puzzle: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
      solution: '483921657967345821251876493548132976729564138136798245372689514814253769695417382',
    },
  ],
  medium: [
    {
      id: 'medium-lofi-desk',
      puzzle: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
      solution: '435269781682571493197834562826195347374682915951743628519326874248957136763418259',
    },
    {
      id: 'medium-rain-window',
      puzzle: '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
      solution: '245981376169273584837564219976125438513498627482736951391657842728349165654812793',
    },
  ],
  hard: [
    {
      id: 'hard-night-train',
      puzzle: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
      solution: '462831957795426183381795426173984265659312748248567319926178534834259671517643892',
    },
    {
      id: 'hard-midnight-glow',
      puzzle: '005300000800000020070010500400005300010070006003200080060500009004000030000009700',
      solution: '145327698839654127672918543496185372218473956753296481367542819984761235521839764',
    },
  ],
};

const difficultySettings = {
  easy: {
    label: 'Easy',
    note: 'More starter numbers and a gentler way into the grid.',
  },
  medium: {
    label: 'Medium',
    note: 'A balanced Sudoku board when you want a calm logic loop.',
  },
  hard: {
    label: 'Hard',
    note: 'Fewer clues and a deeper focus stretch for quieter concentration.',
  },
};

function parseBoardString(value) {
  return Array.from({ length: BOARD_SIZE }, (_, rowIndex) => (
    Array.from({ length: BOARD_SIZE }, (_, colIndex) => Number(value[rowIndex * BOARD_SIZE + colIndex]))
  ));
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function getFirstEditableCell(board) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] === 0) {
        return { row, col };
      }
    }
  }

  return { row: 0, col: 0 };
}

function getCellId(row, col) {
  return `${row}-${col}`;
}

function pickPuzzle(pool, previousId = '') {
  const choices = pool.filter((entry) => entry.id !== previousId);
  return choices[Math.floor(Math.random() * choices.length)] || pool[0];
}

function collectConflicts(board) {
  const conflicts = new Set();

  const checkGroup = (cells) => {
    const seen = {};

    cells.forEach(({ row, col }) => {
      const value = board[row][col];
      if (!value) {
        return;
      }

      if (!seen[value]) {
        seen[value] = [{ row, col }];
        return;
      }

      seen[value].push({ row, col });
    });

    Object.values(seen).forEach((positions) => {
      if (positions.length < DUPLICATE_GROUP_SIZE) {
        return;
      }

      positions.forEach(({ row, col }) => conflicts.add(getCellId(row, col)));
    });
  };

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    checkGroup(Array.from({ length: BOARD_SIZE }, (_, col) => ({ row, col })));
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    checkGroup(Array.from({ length: BOARD_SIZE }, (_, row) => ({ row, col })));
  }

  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += BOX_SIZE) {
      const boxCells = [];

      for (let row = boxRow; row < boxRow + BOX_SIZE; row += 1) {
        for (let col = boxCol; col < boxCol + BOX_SIZE; col += 1) {
          boxCells.push({ row, col });
        }
      }

      checkGroup(boxCells);
    }
  }

  return conflicts;
}

function boardsMatch(board, solution) {
  return board.every((row, rowIndex) => (
    row.every((value, colIndex) => value === solution[rowIndex][colIndex])
  ));
}

function removeCellNotes(notesByCell, cellId) {
  if (!notesByCell[cellId]) {
    return notesByCell;
  }

  const nextNotes = { ...notesByCell };
  delete nextNotes[cellId];
  return nextNotes;
}

function toggleCellNote(notesByCell, cellId, value) {
  const currentNotes = notesByCell[cellId] || [];
  const alreadyPresent = currentNotes.includes(value);
  const nextValues = alreadyPresent
    ? currentNotes.filter((item) => item !== value)
    : [...currentNotes, value].sort((left, right) => left - right);

  if (nextValues.length === 0) {
    return removeCellNotes(notesByCell, cellId);
  }

  return {
    ...notesByCell,
    [cellId]: nextValues,
  };
}

function getSudokuBoxTone(rowIndex, colIndex) {
  const boxRow = Math.floor(rowIndex / BOX_SIZE);
  const boxCol = Math.floor(colIndex / BOX_SIZE);
  return (boxRow + boxCol) % 2 === 0 ? 'moss' : 'sand';
}

function getSudokuCellClass({
  boxTone,
  checkedWrong,
  conflict,
  editable,
  inSameBox,
  inSameCol,
  inSameRow,
  sameValue,
  selected,
}) {
  if (!editable) {
    return boxTone === 'moss' ? 'bg-[#e8efe5] text-slate-900' : 'bg-[#efe9df] text-slate-900';
  }

  if (checkedWrong || conflict) {
    return 'bg-rose-100 text-rose-900';
  }

  if (selected) {
    return 'bg-sky-200 text-sky-950';
  }

  if (sameValue) {
    return 'bg-amber-100 text-amber-950';
  }

  if (inSameRow || inSameCol || inSameBox) {
    return boxTone === 'moss' ? 'bg-sky-100 text-slate-900' : 'bg-[#e8f1fb] text-slate-900';
  }

  return boxTone === 'moss' ? 'bg-[#f4f8f1] text-slate-900' : 'bg-[#fbf6ee] text-slate-900';
}

function SudokuCellButton({ cellClass, cellId, colIndex, notes, onSelect, rowIndex, selected, value }) {
  return (
    <button
      key={cellId}
      className={`flex aspect-square min-h-[2.35rem] items-center justify-center rounded-[0.7rem] border text-base font-extrabold transition sm:min-h-[3.1rem] sm:text-lg ${selected ? 'border-sky-400 shadow-sm' : 'border-white/70'} ${cellClass}`}
      onClick={onSelect}
      style={{
        borderTopWidth: rowIndex % BOX_SIZE === 0 ? SUBGRID_BORDER_WIDTH : INNER_BORDER_WIDTH,
        borderLeftWidth: colIndex % BOX_SIZE === 0 ? SUBGRID_BORDER_WIDTH : INNER_BORDER_WIDTH,
        borderRightWidth: colIndex === BOARD_SIZE - 1 ? SUBGRID_BORDER_WIDTH : INNER_BORDER_WIDTH,
        borderBottomWidth: rowIndex === BOARD_SIZE - 1 ? SUBGRID_BORDER_WIDTH : INNER_BORDER_WIDTH,
        borderTopColor: rowIndex % BOX_SIZE === 0 ? SUBGRID_BORDER_COLOR : INNER_BORDER_COLOR,
        borderLeftColor: colIndex % BOX_SIZE === 0 ? SUBGRID_BORDER_COLOR : INNER_BORDER_COLOR,
        borderRightColor: colIndex === BOARD_SIZE - 1 ? SUBGRID_BORDER_COLOR : INNER_BORDER_COLOR,
        borderBottomColor: rowIndex === BOARD_SIZE - 1 ? SUBGRID_BORDER_COLOR : INNER_BORDER_COLOR,
      }}
      type="button"
    >
      {value ? (
        value
      ) : (
        <div className="grid w-full grid-cols-3 gap-[1px] px-[2px] text-[0.55rem] font-bold leading-none text-slate-500 sm:text-[0.65rem]">
          {DIGITS.map((digit) => (
            <span key={`${cellId}-${digit}`} className={notes.includes(digit) ? 'opacity-100' : 'opacity-0'}>
              {digit}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function SudokuBoard({
  activeValue,
  board,
  checkedCells,
  conflictSet,
  isEditableCell,
  notesByCell,
  selectedBoxCol,
  selectedBoxRow,
  selectedCell,
  setSelectedCell,
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/80 bg-white/92 p-4 shadow-sm">
      <div className="grid grid-cols-9 gap-1 rounded-[1.6rem] bg-[#c7d2ca] p-[7px] sm:p-3">
        {board.map((row, rowIndex) => row.map((value, colIndex) => {
          const cellId = getCellId(rowIndex, colIndex);
          const editable = isEditableCell(rowIndex, colIndex);
          const selected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const sameValue = activeValue !== 0 && activeValue === value;
          const checkedWrong = checkedCells.includes(cellId);
          const conflict = conflictSet.has(cellId);
          const inSameRow = selectedCell?.row === rowIndex;
          const inSameCol = selectedCell?.col === colIndex;
          const inSameBox = selectedCell
            && selectedBoxRow === Math.floor(rowIndex / BOX_SIZE)
            && selectedBoxCol === Math.floor(colIndex / BOX_SIZE);
          const boxTone = getSudokuBoxTone(rowIndex, colIndex);
          const cellClass = getSudokuCellClass({
            boxTone,
            checkedWrong,
            conflict,
            editable,
            inSameBox,
            inSameCol,
            inSameRow,
            sameValue,
            selected,
          });

          return (
            <SudokuCellButton
              cellClass={cellClass}
              cellId={cellId}
              colIndex={colIndex}
              key={cellId}
              notes={editable && value === 0 ? (notesByCell[cellId] || []) : []}
              onSelect={() => setSelectedCell({ row: rowIndex, col: colIndex })}
              rowIndex={rowIndex}
              selected={selected}
              value={value}
            />
          );
        }))}
      </div>
    </div>
  );
}

function SudokuHeader({ completedRounds, config, conflictCount, notesMode, openCells }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
          <Sparkles size={14} /> {config.label} sudoku flow
        </div>
        <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Quiet Sudoku</h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">
          A cozy Sudoku board for when you want a familiar logic puzzle that still feels slow, tidy,
          and easy to settle into.
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-600">{config.note}</p>
      </div>
      <div className="grid gap-2 rounded-[1.5rem] border border-white/85 bg-white/80 p-3 shadow-sm sm:grid-cols-4 lg:min-w-[28rem]">
        <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Solved</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950">{completedRounds}</p>
        </div>
        <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Open cells</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950">{openCells}</p>
        </div>
        <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Conflicts</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950">{conflictCount}</p>
        </div>
        <div className="rounded-[1.15rem] bg-slate-50 px-4 py-3 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Mode</p>
          <p className="mt-2 text-sm font-extrabold text-slate-950">{notesMode ? 'Pencil marks' : 'Fill numbers'}</p>
        </div>
      </div>
    </div>
  );
}

function SudokuSidebar({
  activeValue,
  checkBoard,
  clearSelectedCell,
  handleDigitInput,
  message,
  notesMode,
  revealSelectedCell,
  setNotesMode,
  startFreshPuzzle,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-600">Soft guidance</p>
          <button
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] transition ${notesMode ? 'bg-sky-100 text-sky-950' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            onClick={() => setNotesMode((previous) => !previous)}
            type="button"
          >
            <Edit3 size={12} /> {notesMode ? 'Pencil on' : 'Pencil off'}
          </button>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-700">{message}</p>
        <p className="mt-2 text-xs font-semibold text-slate-500">Press <span className="font-extrabold text-slate-700">N</span> to toggle pencil marks, then tap 1–9 to add tiny notes.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
            onClick={checkBoard}
            type="button"
          >
            Check board
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-white"
            onClick={revealSelectedCell}
            type="button"
          >
            Reveal selected cell
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
            onClick={clearSelectedCell}
            type="button"
          >
            Clear square
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
            onClick={startFreshPuzzle}
            type="button"
          >
            <RotateCcw size={16} /> New board
          </button>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-600">Number pad</p>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${notesMode ? 'bg-sky-100 text-sky-900' : 'bg-slate-100 text-slate-600'}`}>
            {notesMode ? 'Pencil marks' : 'Fill mode'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {DIGITS.map((number) => (
            <button
              key={number}
              className={`rounded-2xl border px-0 py-3 text-sm font-extrabold transition ${activeValue === number && !notesMode ? 'border-sky-300 bg-sky-100 text-sky-950' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white'}`}
              onClick={() => handleDigitInput(number)}
              type="button"
            >
              {number}
            </button>
          ))}
          <button
            className="col-span-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
            onClick={clearSelectedCell}
            type="button"
          >
            {notesMode ? 'Digit taps add or remove pencil marks. Backspace clears the square.' : 'Tap 1–9 or use your keyboard. Backspace clears.'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuietSudoku({ difficulty = 'medium' }) {
  const config = difficultySettings[difficulty] || difficultySettings.medium;
  const pool = puzzleBank[difficulty] || puzzleBank.medium;
  const roundsKey = `quiet-journal-quiet-sudoku-rounds-${difficulty}`;

  const [activePuzzle, setActivePuzzle] = useState(() => pickPuzzle(pool));
  const [board, setBoard] = useState(() => parseBoardString(activePuzzle.puzzle));
  const [selectedCell, setSelectedCell] = useState(() => getFirstEditableCell(parseBoardString(activePuzzle.puzzle)));
  const [message, setMessage] = useState('Tap a square and place one number at a time — no rush.');
  const [checkedCells, setCheckedCells] = useState([]);
  const [completedRounds, setCompletedRounds] = useState(() => parseInt(localStorage.getItem(roundsKey) || '0', 10));
  const [roundStatus, setRoundStatus] = useState('playing');
  const [notesMode, setNotesMode] = useState(false);
  const [notesByCell, setNotesByCell] = useState({});

  const puzzleBoard = useMemo(() => parseBoardString(activePuzzle.puzzle), [activePuzzle.puzzle]);
  const solutionBoard = useMemo(() => parseBoardString(activePuzzle.solution), [activePuzzle.solution]);
  const conflictSet = useMemo(() => collectConflicts(board), [board]);
  const openCells = useMemo(() => board.flat().filter((value) => value === 0).length, [board]);

  const activeValue = selectedCell ? board[selectedCell.row][selectedCell.col] : 0;
  const selectedBoxRow = selectedCell ? Math.floor(selectedCell.row / BOX_SIZE) : -1;
  const selectedBoxCol = selectedCell ? Math.floor(selectedCell.col / BOX_SIZE) : -1;

  const isEditableCell = useCallback((row, col) => puzzleBoard[row][col] === 0, [puzzleBoard]);

  const resetPuzzleState = useCallback((nextPuzzle, nextMessage) => {
    const nextBoard = parseBoardString(nextPuzzle.puzzle);
    setActivePuzzle(nextPuzzle);
    setBoard(nextBoard);
    setSelectedCell(getFirstEditableCell(nextBoard));
    setMessage(nextMessage);
    setCheckedCells([]);
    setRoundStatus('playing');
    setNotesMode(false);
    setNotesByCell({});
    setCompletedRounds(parseInt(localStorage.getItem(roundsKey) || '0', 10));
  }, [roundsKey]);

  useEffect(() => {
    resetPuzzleState(pickPuzzle(pool), 'Tap a square and place one number at a time — no rush.');
  }, [pool, resetPuzzleState]);

  const clearCellNotes = useCallback((cellId) => {
    setNotesByCell((previous) => removeCellNotes(previous, cellId));
  }, []);

  const placeValue = useCallback((value) => {
    if (!selectedCell || roundStatus === 'solved') {
      return;
    }

    const { row, col } = selectedCell;
    if (!isEditableCell(row, col)) {
      setMessage('That square is part of the starter pattern. Pick an open one.');
      return;
    }

    const cellId = getCellId(row, col);
    setBoard((previousBoard) => {
      const nextBoard = cloneBoard(previousBoard);
      nextBoard[row][col] = value;
      return nextBoard;
    });
    clearCellNotes(cellId);
    setCheckedCells((previous) => previous.filter((currentCellId) => currentCellId !== cellId));

    if (value === 0) {
      setMessage('Square cleared — take another look whenever you want.');
      return;
    }

    if (value === solutionBoard[row][col]) {
      setMessage('Nice — that number fits cleanly.');
      return;
    }

    setMessage('Keep going. You can always use check board for a gentle nudge.');
  }, [clearCellNotes, isEditableCell, roundStatus, selectedCell, solutionBoard]);

  const toggleSelectedNote = useCallback((value) => {
    if (!selectedCell || roundStatus === 'solved') {
      return;
    }

    const { row, col } = selectedCell;
    if (!isEditableCell(row, col)) {
      setMessage('Starter squares do not need pencil marks.');
      return;
    }

    if (board[row][col] !== 0) {
      setMessage('Clear the square first if you want to leave pencil marks there.');
      return;
    }

    const cellId = getCellId(row, col);
    const alreadyPresent = (notesByCell[cellId] || []).includes(value);
    setNotesByCell((previous) => toggleCellNote(previous, cellId, value));
    setCheckedCells((previous) => previous.filter((currentCellId) => currentCellId !== cellId));
    setMessage(alreadyPresent ? `Pencil mark ${value} removed.` : `Pencil mark ${value} added.`);
  }, [board, isEditableCell, notesByCell, roundStatus, selectedCell]);

  const handleDigitInput = useCallback((value) => {
    if (notesMode) {
      toggleSelectedNote(value);
      return;
    }

    placeValue(value);
  }, [notesMode, placeValue, toggleSelectedNote]);

  const clearSelectedCell = useCallback(() => {
    placeValue(0);
  }, [placeValue]);

  const startFreshPuzzle = useCallback(() => {
    resetPuzzleState(pickPuzzle(pool, activePuzzle.id), 'Fresh board, same soft logic mood.');
  }, [activePuzzle.id, pool, resetPuzzleState]);

  const checkBoard = useCallback(() => {
    if (roundStatus === 'solved') {
      setMessage('Already solved — enjoy the quiet little win.');
      return;
    }

    const wrongCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value || value === solutionBoard[rowIndex][colIndex]) {
          return;
        }

        wrongCells.push(getCellId(rowIndex, colIndex));
      });
    });

    setCheckedCells(wrongCells);
    if (wrongCells.length) {
      setMessage('A few squares want another look. The red ones are worth revisiting.');
      return;
    }

    if (conflictSet.size) {
      setMessage('You are close — there are still a few row, column, or box conflicts to smooth out.');
      return;
    }

    setMessage(openCells === 0 ? 'Everything looks clean.' : 'So far so good — keep filling the quiet gaps.');
  }, [board, conflictSet.size, openCells, roundStatus, solutionBoard]);

  const revealSelectedCell = useCallback(() => {
    if (!selectedCell) {
      setMessage('Pick a square first and I can reveal that one.');
      return;
    }

    const { row, col } = selectedCell;
    if (!isEditableCell(row, col)) {
      setMessage('That square is already given to you.');
      return;
    }

    const cellId = getCellId(row, col);
    setBoard((previousBoard) => {
      const nextBoard = cloneBoard(previousBoard);
      nextBoard[row][col] = solutionBoard[row][col];
      return nextBoard;
    });
    clearCellNotes(cellId);
    setCheckedCells((previous) => previous.filter((currentCellId) => currentCellId !== cellId));
    setMessage('One square revealed — let the rest unfold from there.');
  }, [clearCellNotes, isEditableCell, selectedCell, solutionBoard]);

  useEffect(() => {
    if (roundStatus === 'solved' || conflictSet.size > 0) {
      return;
    }

    if (!boardsMatch(board, solutionBoard)) {
      return;
    }

    const nextRounds = completedRounds + 1;
    setRoundStatus('solved');
    setCompletedRounds(nextRounds);
    localStorage.setItem(roundsKey, String(nextRounds));
    setMessage('Sudoku complete — soft win, nice and steady.');
  }, [board, completedRounds, conflictSet, roundStatus, roundsKey, solutionBoard]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCell || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        setNotesMode((previous) => {
          const next = !previous;
          setMessage(next ? 'Pencil marks on — tap digits to leave tiny notes.' : 'Pencil marks off — digits will fill the square again.');
          return next;
        });
        return;
      }

      if (event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        handleDigitInput(Number(event.key));
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        event.preventDefault();
        clearSelectedCell();
        return;
      }

      const movement = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };

      const nextMove = movement[event.key];
      if (!nextMove) {
        return;
      }

      event.preventDefault();
      setSelectedCell((previous) => ({
        row: Math.min(BOARD_SIZE - 1, Math.max(0, previous.row + nextMove[0])),
        col: Math.min(BOARD_SIZE - 1, Math.max(0, previous.col + nextMove[1])),
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelectedCell, handleDigitInput, selectedCell]);

  return (
    <div className="mx-auto mt-12 w-full max-w-[1040px] pb-12">
      <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-white via-slate-50/80 to-sand-50/80 p-5 shadow-soft lg:p-6">
        <SudokuHeader
          completedRounds={completedRounds}
          config={config}
          conflictCount={conflictSet.size}
          notesMode={notesMode}
          openCells={openCells}
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <SudokuBoard
            activeValue={activeValue}
            board={board}
            checkedCells={checkedCells}
            conflictSet={conflictSet}
            isEditableCell={isEditableCell}
            notesByCell={notesByCell}
            selectedBoxCol={selectedBoxCol}
            selectedBoxRow={selectedBoxRow}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
          />
          <SudokuSidebar
            activeValue={activeValue}
            checkBoard={checkBoard}
            clearSelectedCell={clearSelectedCell}
            handleDigitInput={handleDigitInput}
            message={message}
            notesMode={notesMode}
            revealSelectedCell={revealSelectedCell}
            setNotesMode={setNotesMode}
            startFreshPuzzle={startFreshPuzzle}
          />
        </div>
      </div>
    </div>
  );
}
