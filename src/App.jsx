import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import radioVinylIcon from './assets/optimized/lofi-radio-vinyl.webp';
import minesweeperIconImage from './assets/optimized/minesweeper-icon.webp';
import solitaireIconImage from './assets/optimized/solitaire-icon.webp';
import solitairePreviewImage from './assets/optimized/solitaire-preview.webp';
import sudokuIconImage from './assets/optimized/sudoku-icon.webp';
import wordleIconImage from './assets/optimized/wordle-icon.webp';
import dinoDashPreviewImage from './assets/optimized/dino-dash-preview.webp';
import dinoDashIconImage from './assets/optimized/dino-dash-icon.webp';
import rainWallpaperImage from './assets/optimized/rain-wallpaper.webp';
import fireWallpaperImage from './assets/optimized/fire-wallpaper.webp';
import lofiRoomWallpaperImage from './assets/optimized/lofi-room-wallpaper.webp';
import maplestoryThemeWallpaperImage from './assets/optimized/maplestory-theme-wallpaper.webp';
import hogwartsMusicRoomImage from './assets/optimized/hogwarts-music-room.webp';
import lofiMemoryHeaderImage from './assets/optimized/lofi-memory-header.webp';
import lotusMatchPreviewImage from './assets/optimized/lotus-match-preview.webp';
import gamesSectionPreviewImage from './assets/optimized/games-section-preview.webp';
import diarySectionPreviewImage from './assets/optimized/diary-section-preview.webp';
import notesSectionPreviewImage from './assets/optimized/notes-section-preview.webp';
import musicSectionPreviewImage from './assets/optimized/music-section-preview.webp';
import memoriesSectionPreviewImage from './assets/optimized/memories-section-preview.webp';
import designSectionPreviewImage from './assets/optimized/design-section-preview.webp';
import gameSolitairePreview from './assets/optimized/game-solitaire-preview.webp';
import gameMindSweeperPreview from './assets/optimized/game-mind-sweeper-preview.webp';
import gameDriftingSeedPreview from './assets/optimized/game-drifting-seed-preview.webp';
import gameLilypadPreview from './assets/optimized/game-lilypad-preview.webp';
import gameJigsawPreview from './assets/optimized/game-jigsaw-preview.webp';
import gameLotusPreview from './assets/optimized/game-lotus-preview.webp';
import gameTilesPreview from './assets/optimized/game-tiles-preview.webp';
import gameTetrisPreview from './assets/optimized/game-tetris-preview.webp';
import gameSlidePreview from './assets/optimized/game-slide-preview.webp';
import gameSudokuPreview from './assets/optimized/game-sudoku-preview.webp';
import gameWordlePreview from './assets/optimized/game-wordle-preview.webp';
import gameWordsPreview from './assets/optimized/game-words-preview.webp';
import gameTypingPreview from './assets/optimized/game-typing-preview.webp';
import gameCluesPreview from './assets/optimized/game-clues-preview.webp';
import gameSnakePreview from './assets/optimized/game-snake-preview.webp';
import gameDinoPreview from './assets/optimized/game-dino-preview.webp';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import {
  Headphones,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Cloud,
  CloudRain,
  CloudSun,
  Compass,
  Feather,
  Eye,
  EyeOff,
  FileText,
  Gamepad2,
  Grid2x2,
  Heart,
  HeartHandshake,
  ImagePlus,
  Layers,
  Leaf,
  Lock,
  Mail,
  Map,
  Keyboard,
  Moon,
  Newspaper,
  Palette,
  PenLine,
  Plus,
  Puzzle,
  Quote,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Trash2,
  TreePine,
  Type,
  Waves,
  Wind,
  Zap,
  Flame,
} from 'lucide-react';
import WriteTab from './components/WriteTab';
import NotesTab from './components/NotesTab';
import MemoriesTab from './components/MemoriesTab';
import BreatheTab from './components/BreatheTab';
import InsightsTab from './components/InsightsTab';
import UnwindTab from './components/UnwindTab';
import HomeDesignPanel from './components/HomeDesignPanel';
import ThemeStudio from './components/ThemeStudio';
import PrivacyGate from './components/PrivacyGate';
import PinSettingsDialog from './components/PinSettingsDialog';
import GameSplash from './components/GameSplash';
import { auth, db, getMessagingIfSupported, googleProvider } from './firebase';
// Lazy load large game components to reduce initial bundle size
const ZenGame = lazy(() => import('./ZenGame'));
const StreamSurfer = lazy(() => import('./StreamSurfer'));
const LotusMatch = lazy(() => import('./LotusMatch'));
const DinosaurDash = lazy(() => import('./DinosaurDash'));
const MindSweeper = lazy(() => import('./MindSweeper'));
const QuietTiles = lazy(() => import('./QuietTiles'));
const QuietTetris = lazy(() => import('./QuietTetris'));
const QuietSlide = lazy(() => import('./QuietSlide'));
const QuietWords = lazy(() => import('./QuietWords'));
const TypingSpeedTest = lazy(() => import('./TypingSpeedTest'));
const QuietClues = lazy(() => import('./QuietClues'));
const QuietWordle = lazy(() => import('./QuietWordle'));
const QuietSudoku = lazy(() => import('./QuietSudoku'));
const QuietSnake = lazy(() => import('./QuietSnake'));
const Solitaire = lazy(() => import('./Solitaire'));
const LofiJigsaw = lazy(() => import('./LofiJigsaw'));
const FocusTreeRoom = lazy(() => import('./FocusTreeRoom'));
import { StatCard, WeatherGlyph } from './components/SmallComponents.jsx';

const STORAGE_KEY = 'quiet-harbor-journal-v1';
const PIN_KEY = 'quiet-harbor-pin-v1';
const CUSTOM_WEATHER_STORAGE_KEY = 'quiet-journal-custom-weather-v1';
const CUSTOM_QUOTES_STORAGE_KEY = 'quiet-journal-custom-quotes-v1';
const QUOTE_STYLE_STORAGE_KEY = 'quiet-journal-quote-style-v1';
const JOURNAL_STYLE_STORAGE_KEY = 'quiet-journal-style-v1';
const COMPANION_STORAGE_KEY = 'quiet-journal-companion-v1';
const PLANNER_STORAGE_KEY = 'quiet-journal-planner-v1';
const IMPORTANT_DATES_STORAGE_KEY = 'quiet-journal-important-dates';
const IMPORTANT_DATES_REMINDER_LOG_KEY = 'quiet-journal-important-date-reminder-log-v1';
const CLOUD_PLANNER_DOC_ID = 'plannerBoard';
const CLOUD_IMPORTANT_DATES_DOC_ID = 'importantDates';
const CLOUD_PUSH_NOTIFICATIONS_DOC_ID = 'pushNotifications';
const WEB_PUSH_STATUS_STORAGE_KEY = 'quiet-journal-web-push-status-v1';
const MASTER_ADMIN_EMAIL = 'ngtzewei96@gmail.com';
const SEO_STUDIO_API_KEY_STORAGE_KEY = 'quiet-journal-seo-studio-api-key-v1';
const SEO_STUDIO_PROMPT_STORAGE_KEY = 'quiet-journal-seo-studio-prompt-v1';
const SEO_STUDIO_REPORT_STORAGE_KEY = 'quiet-journal-seo-studio-report-v1';
const SEO_STUDIO_LAST_RUN_STORAGE_KEY = 'quiet-journal-seo-studio-last-run-v1';
const ADMIN_VIEW_MODE_STORAGE_KEY = 'quiet-journal-admin-view-mode-v1';
const DEFAULT_SEO_STUDIO_PROMPT = 'Review the website and suggest the next calm, high-impact SEO improvements for diary, journal, mood journal, and beginner writing searches without harming the user experience.';

function getInitialCompanion() {
  const defaults = {
    character: '🐭',
    leaf: '',
    rainEnabled: true,
    sootSpritesEnabled: true,
    animation: 'breathe',
    size: 80,
    x: 0,
    y: 0
  };
  try {
    const saved = localStorage.getItem(COMPANION_STORAGE_KEY);
    if (saved) {
      const parsed = { ...defaults, ...JSON.parse(saved) };
      if (parsed.leaf === '🍃') parsed.leaf = '';
      return parsed;
    }
  } catch {}
  return defaults;
}

const journalFontOptions = [
  { id: 'serif', label: 'Elegant Serif', css: '"Cormorant Garamond", Georgia, serif' },
  { id: 'sans', label: 'Clean Sans', css: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { id: 'hand', label: 'Soft Script', css: '"Segoe Print", "Bradley Hand", cursive' }
];

const journalSizeOptions = [
  { id: 'sm', label: 'Cozy', value: '1rem' },
  { id: 'md', label: 'Balanced', value: '1.12rem' },
  { id: 'lg', label: 'Spacious', value: '1.25rem' }
];

const quoteFontOptions = [
  { id: 'serif', label: 'Elegant Serif', css: '"Cormorant Garamond", Georgia, serif' },
  { id: 'sans', label: 'Clean Sans', css: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { id: 'hand', label: 'Journal Script', css: '"Segoe Print", "Bradley Hand", cursive' }
];

const quoteSizeOptions = [
  { id: 'sm', label: 'Soft', value: '1.5rem' },
  { id: 'md', label: 'Balanced', value: '1.9rem' },
  { id: 'lg', label: 'Focused', value: '2.5rem' }
];

const moods = [
  { label: 'Happy', emoji: '☀️', value: 6, color: 'bg-amber-300' },
  { label: 'Calm', emoji: '🏖️', value: 5, color: 'bg-sage-300' },
  { label: 'Neutral', emoji: '⛅', value: 4, color: 'bg-slate-200' },
  { label: 'Sad', emoji: '🌧️', value: 3, color: 'bg-blue-200' },
  { label: 'Anxious', emoji: '🌪️', value: 2, color: 'bg-rose-200' },
  { label: 'Angry', emoji: '🔥', value: 1, color: 'bg-orange-300' }
];

const prompts = [
  'What made you smile today?',
  'Name one thing you are grateful for right now.',
  'How are you really feeling in this moment?',
  'What do you need to hear from yourself today?',
  'What is one thing you can let go of?',
  'Describe a cozy game moment that felt relaxing.',
  'What games have helped you clear your mind lately?',
  'If you were in a lofi world right now, what would it look like?',
  'What small win did you have today?',
  'How would you describe your mood to a friend?',
  'If anger is here, what is it trying to protect?'
];

const hangoutInvitations = [
  {
    title: 'Listen and settle in',
    eyebrow: 'Lofi music',
    detail: 'Start the soft radio, relax, and let the page feel like a calm digital room.',
    tab: 'home',
    icon: Headphones
  },
  {
    title: 'Keep today together',
    eyebrow: 'Notes',
    detail: 'Drop reminders, errands, and small to-dos into one calm spot.',
    tab: 'notes',
    icon: FileText
  },
  {
    title: 'Play relaxing games',
    eyebrow: 'Chill games',
    detail: 'Open a gentle game while the music plays when you want a small reset.',
    tab: 'unwind',
    icon: Leaf
  }
];

const rewardMessages = [
  'Saved. You gave today a soft place to land. 🌿',
  'A quiet page is waiting for future you now. ☁️',
  'You showed up for yourself. That is worth keeping. 🤍',
  'Another little bloom settled into your archive. 🌷',
  'This space is gentler because you returned to it. ✨',
  'Your journal held that moment safely. 🌙',
  'One honest page is more than enough for today. 🌱'
];

const quotes = [
  'You are allowed to go slowly. Small steps still move you forward.',
  'Rest is not a reward. It is part of the rhythm.',
  'Let this moment be enough to begin again.',
  'Your feelings can be real without being permanent.',
  'Breathe like the tide: arrive, soften, return.',
  'A quiet day can still be a brave day.',
  'Be gentle with yourself. You are doing the best you can.',
  'Slow progress is still progress.',
  'It is okay to take a break. The world can wait.',
  'You deserve the same kindness you give to others.',
  'Not every day has to be productive to be meaningful.',
  'Small wins are still wins worth celebrating.',
  'Your worth is not measured by your productivity.',
  'Peace begins with a single deep breath.',
  'The sun will rise, and you will try again with fresh eyes.',
  'Soft hearts can still be strong hearts.',
  'Let go of what you cannot control today.',
  'There is courage in simply showing up.',
  'Healing is not linear; it is perfectly okay to backtrack.',
  'You are exactly where you need to be in this moment.',
  'Today is a new page, write it gently.',
  'Even the darkest night will end and the sun will rise.',
  'Your pace does not need to match anyone elses.',
  'Let your thoughts pass like clouds in a quiet sky.',
  'Choose one small thing today that brings you peace.',
  'Growth happens quietly, beneath the surface.',
  'It is enough to simply exist right now.',
  'You are not behind; you are on your own timeline.',
  'A calm mind brings inner strength and self-confidence.',
  'Do not let yesterday take up too much of today.',
  'The present moment is filled with joy and happiness.',
  'Sometimes the most productive thing you can do is relax.',
  'You carry so much. It is okay to set some of it down.',
  'Be like water—flexible, yet powerful enough to reshape stone.',
  'The journey of a thousand miles begins with a single step.',
  'Kindness towards yourself is the greatest medicine.',
  'Inhale the future, exhale the past.',
  'Stars cannot shine without darkness.',
  'Let yourself rest in the spaces between words.',
  'Trust the timing of your life.',
  'Every moment is a fresh beginning.',
  'You are capable of amazing things, even on hard days.',
  'What feels like an ending is often just a new beginning.',
  'Quiet the mind, and the soul will speak.',
  'Be patient with yourself. Nothing in nature blooms all year.',
  'You are a work in progress, and that is perfectly fine.',
  'The world is better because you are in it.',
  'Your story is still being written.',
  'Take life one breath at a time.',
  'Wherever you are, be there fully.'
];

const resources = [
  {
    title: 'The 3-minute grounding reset',
    text: 'Name five things you see, four you feel, three you hear, two you smell, and one thing you can taste. Let the room become real again before you write.'
  },
  {
    title: 'A gentle body check-in',
    text: 'Start at your forehead and move slowly to your shoulders, chest, hands, stomach, legs, and feet. Notice tension without trying to force it away.'
  },
  {
    title: 'Tiny routine, big kindness',
    text: 'Choose one small daily anchor: water after waking, sunlight for two minutes, or one sentence in your journal before sleep.'
  },
  {
    title: 'When thoughts feel loud',
    text: 'Write the loudest thought as a sentence, then write: “A kinder way to say this might be…” This helps create distance without ignoring the feeling.'
  },
  {
    title: 'A low-energy reflection',
    text: 'Use three short lines: “Today felt…”, “I needed…”, and “Tomorrow I can try…”. A useful entry does not need to be long.'
  },
  {
    title: 'A safe closing ritual',
    text: 'End your entry by naming one object in the room, one sensation in your body, and one small action you can take next.'
  }
];

const tips = [
  'Write for honesty, not for grammar.',
  'Start with one sentence when a blank page feels too big.',
  'Track patterns without judging yourself for having them.',
  'End entries with one small next step or one thing you can release.',
  'Use prompts as doors, not assignments.',
  'Try naming the feeling before explaining it.',
  'Reread only when it feels supportive, not when it becomes self-criticism.',
  'Keep one “comfort list” of people, places, songs, and rituals that help.'
];

const wellnessArticles = [
  { title: 'Why daily word puzzles make relaxing breaks easier', read: 'Article • 4 min read', body: 'See why daily word puzzles feel so satisfying during short breaks and how a calm five-letter word game can fit naturally into a relaxing online routine.', href: '/article-daily-word-puzzles-relax.html' },
  { title: 'Why word guessing games feel good when your mind is busy', read: 'Article • 4 min read', body: 'Understand why guess-the-word games feel grounding when your mind is overloaded and how a calm word puzzle round can become a simple reset.', href: '/article-word-guessing-games-busy-mind.html' },
  { title: 'How gentle memory games provide cognitive relief before writing', read: 'Article • 4 min read', body: 'Understand why playing a simple memory match game can help organize your thoughts and anchor your attention before journaling.', href: '/article-memory-games-cognitive-relief.html' },
  { title: 'How a digital journal can reduce distractions', read: 'Article • 4 min read', body: 'Explore why the right online setup can feel simpler, not noisier, when your goal is focusing on your thoughts.', href: '/article-digital-journal-distractions.html' },
  {
    title: 'Why brain dumping at night helps you sleep',
    read: 'Article • 4 min read',
    body: 'Discover how emptying your mind into a private journal before bed reduces mental clutter and supports a calmer evening routine.',
    href: '/article-brain-dumping-sleep.html'
  },
  {
    title: 'How to keep a digital journal without getting distracted',
    read: 'Article • 4 min read',
    body: 'Practical tips for maintaining focus while journaling online, choosing the right tools, and creating a calm digital space.',
    href: '/article-digital-journal-distractions.html'
  },
  {
    title: 'The psychology behind writing your feelings down',
    read: 'Article • 4 min read',
    body: 'Explore the psychological benefits of expressive writing and why putting emotions into words makes them easier to process.',
    href: '/article-psychology-of-journaling.html'
  },
  {
    title: 'How to protect your privacy when journaling online',
    read: 'Article • 4 min read',
    body: 'A guide to understanding digital privacy, secure diaries, and keeping your personal thoughts completely safe.',
    href: '/article-protect-privacy-journaling-online.html'
  },
  {
    title: 'How to start a journaling habit',
    read: 'Article • 7 min read',
    body: 'Building a journaling routine that feels gentle, sustainable, and truly helpful for your daily reflection.',
    href: '/article-how-to-start-journaling-habit.html'
  },
  {
    title: 'The unexpected benefits of a private online diary',
    read: 'Article • 6 min read',
    body: 'For centuries, people have kept written records of their lives. Today, transitioning that practice to a private online diary offers flexibility and organization.',
    href: '/article-benefits-of-private-online-diary.html'
  },
  {
    title: 'Journaling prompts for deep self-discovery',
    read: 'Article • 5 min read',
    body: 'Staring at a blank page can be intimidating. When you want to journal but don\'t know where to start, these carefully curated journaling prompts act as a gentle guide.',
    href: '/article-journaling-prompts-self-discovery.html'
  },
  {
    title: 'How to start journaling when you do not know what to write',
    read: 'Quick note',
    body: 'Start by describing the present moment instead of trying to summarize your whole life. Write what the room feels like, what your body is asking for, and one sentence that begins with “Right now…”. This removes the pressure to be deep and turns journaling into a simple check-in.'
  },
  {
    title: 'Using mood tracking without judging yourself',
    read: 'Gentle guide',
    body: 'A mood tracker is most helpful when it becomes a pattern finder, not a report card. Instead of asking “Why am I not better?”, try asking “What tends to happen before this mood?” or “What helped even a little?” Curiosity is more useful than criticism.'
  },
  {
    title: 'A calming evening reflection routine',
    read: 'Quick note',
    body: 'Before sleep, keep the routine small: one thing that felt difficult, one thing that felt supportive, and one thing you can set down for tonight. This creates a gentle ending without turning bedtime into another task.'
  },
  {
    title: 'What to write on a difficult day',
    read: 'Support note',
    body: 'On difficult days, write in fragments. Try “I feel…”, “I wish…”, “I need…”, and “One safe next step is…”. Short phrases can carry a lot. You do not need to explain your feelings perfectly for them to matter.'
  },
  {
    title: 'Making a personal comfort menu',
    read: 'Gentle guide',
    body: 'A comfort menu is a short list of options for when your mind feels crowded. Include one body-based option, one connection option, one practical option, and one rest option. When stress rises, choose from the menu instead of starting from zero.'
  },
  {
    title: 'The difference between reflection and rumination',
    read: 'Gentle guide',
    body: 'Reflection often leads to understanding, kindness, or a next step. Rumination loops without relief. If writing starts to feel like a spiral, pause and shift to grounding: describe what you see, drink water, or write one compassionate closing sentence.'
  },
  {
    title: 'Gentle prompts for self-understanding',
    read: 'Quick note',
    body: 'Prompts work best when they open a door rather than demand an answer. Try: “What part of me needs patience?”, “What felt manageable today?”, or “What would support look like in the next hour?”'
  },
  {
    title: 'Building a journal habit that survives busy weeks',
    read: 'Gentle guide',
    body: 'A sustainable journal habit should be easy to return to. Set the bar low: one sentence counts, one mood check-in counts, and skipping a day does not erase the practice. The goal is a place to come back to.'
  },
  {
    title: 'Private online diary vs a paper journal',
    read: 'Comparison',
    body: 'A private online diary is easier to revisit, search, and keep close through daily life, while a paper journal can feel tactile and slower. The better choice is the one you will genuinely return to. For many people, privacy controls, mood tracking, and easier access make a digital diary feel more sustainable.',
    href: '/article-benefits-of-private-online-diary.html'
  },
  {
    title: 'How to keep a diary privately online',
    read: 'Helpful guide',
    body: 'If you want to keep a diary privately online, choose one calm space, use a consistent login, add a lock when it helps, and keep your entries easy to begin. Privacy is not just technical. It also comes from trusting the place where you write.',
    href: '/article-protect-privacy-journaling-online.html'
  }
];

const seoLandingBlocks = [
  {
    title: 'Digital calm and focus',
    text: 'Learn how a digital journal can reduce distractions and create a simpler, quieter online space for your thoughts.',
    href: '/article-digital-journal-distractions.html'
  },
  {
    title: 'Privacy when journaling online',
    text: 'A practical guide to understanding digital privacy, secure diaries, and keeping your personal thoughts safe.',
    href: '/article-protect-privacy-journaling-online.html'
  },
  {
    title: 'Starting a writing habit',
    text: 'Learn how to build a journaling routine that feels gentle, sustainable, and easy to return to every day.',
    href: '/article-how-to-start-journaling-habit.html'
  },
  {
    title: 'The psychology of writing',
    text: 'Understand why putting emotions into words makes them easier to organize and process during your breaks.',
    href: '/article-psychology-of-journaling.html'
  },
  {
    title: 'Evening reflection routine',
    text: 'See how a short pre-sleep writing habit can reduce mental clutter and support a calmer evening routine.',
    href: '/article-brain-dumping-sleep.html'
  },
  {
    title: 'Read the Lofi Memory blog',
    text: 'Start with a curated reading hub that explains the product more clearly and links to the strongest original articles first.',
    href: '/blog.html'
  },
  {
    title: 'Editorial policy',
    text: 'Review how Lofi Memory handles accuracy, originality, corrections, and the boundary between wellbeing language and medical claims.',
    href: '/editorial-policy.html'
  },
  {
    title: 'Privacy policy',
    text: 'See how journal storage, browser data, sign-in, notifications, embeds, and advertising-related technologies are explained to visitors.',
    href: '/privacy.html'
  },
  {
    title: 'Free cozy focus journal app',
    text: 'A clearer landing page for search visitors: focus sessions, lofi music, private writing, notes, reminders, mood tracking, and calm games in one free browser tab.',
    href: '/free-cozy-focus-journal-app.html'
  },
  {
    title: 'What is Lofi Memory?',
    text: 'Read the product definition: Lofi Memory is a cozy browser space to relax, focus, journal, write down your thoughts, listen to lofi music, and take calm game breaks.',
    href: '/lofi-memory.html'
  },
  {
    title: 'Relax, focus, journal, and write thoughts',
    text: 'See how Lofi Memory combines relaxation, focus support, private thought capture, lofi music, notes, reminders, and calm games in one space.',
    href: '/relax-focus-journal.html'
  },
  {
    title: 'Benefits of online diaries',
    text: 'Explore when a browser-based diary can feel more flexible and organized than scattered digital notes.',
    href: '/article-benefits-of-private-online-diary.html'
  }
];

const seoFaqs = [
  {
    question: 'What is Lofi Memory?',
    answer: 'Lofi Memory is a cozy browser space to relax, focus, journal, and write down your thoughts. It combines lofi music, private writing, mood tracking, notes, reminders, Focus Tree sessions, and calm browser games in one gentle web app.'
  },
  {
    question: 'Can I use Lofi Memory as a private online diary?',
    answer: 'Yes. You can use it as a private online diary to write personal entries, track your mood, and keep your journaling space calm and personal.'
  },
  {
    question: 'Does Lofi Memory include mood tracking?',
    answer: 'Yes. The journal includes mood tracking so you can log how you feel and notice patterns over time without making the experience feel heavy or complicated.'
  },
  {
    question: 'Can I lock my diary entries?',
    answer: 'Yes. You can add an optional lock PIN for the browser, change the PIN later, or remove the lock if you no longer want to use it.'
  },
  {
    question: 'Can I add photos to my diary entries?',
    answer: 'Yes. You can upload photos to journal entries and then click them to move or resize them directly in the editor.'
  },
  {
    question: 'Where can I write a diary online?',
    answer: 'Lofi Memory gives you a browser-based private journal and online diary for writing personal entries, tracking moods, saving memories, and returning to your thoughts after a calm study or game break.'
  },
  {
    question: 'How do I start writing a diary?',
    answer: 'Start small. Pick one honest detail from the day, one feeling, or one thing you want to remember. Lofi Memory also includes prompts and beginner-friendly diary pages to help you start.'
  },
  {
    question: 'Where can I write a journal online?',
    answer: 'If you want a softer online journal, Lofi Memory works as a digital journal for daily writing, private reflection, prompts, and optional lock protection.'
  },
  {
    question: 'Can Lofi Memory work like a diary app or journal app?',
    answer: 'Yes. You can use it like a diary app or journal app for quick entries, mood check-ins, photos, and private reflection that stays easy to revisit over time.'
  },
  {
    question: 'Does Lofi Memory also have guides for prompts and daily reflection?',
    answer: 'Yes. The blog now points to the strongest articles first, including privacy-focused journaling, daily reflection, journaling habits, sleep-friendly brain dumping, and calmer game-break reads.'
  },
  {
    question: 'Can I use Lofi Memory for notes, reminders, and recurring tasks too?',
    answer: 'Yes. Alongside the diary, Lofi Memory includes a notes space with to-dos, due dates, reminders, and recurring tasks so practical planning can stay separate from reflective writing.'
  },
  {
    question: 'Is Lofi Memory good for building a journaling habit?',
    answer: 'Yes. The app is built for small repeatable check-ins, starter prompts, mood tracking, and habit-friendly notes so journaling feels easier to keep returning to.'
  }
];

const seoGuidePages = [
  { label: 'Featured hub', title: 'Lofi Memory blog', text: 'Browse the strongest original articles, trust pages, and calmer reading paths in one curated place.', href: '/blog.html' },
  { label: 'Trust page', title: 'About Lofi Memory', text: 'Understand what the product includes, how it fits together, and why the design stays intentionally calm.', href: '/about.html' },
  { label: 'Trust page', title: 'Editorial policy', text: 'See how originality, accuracy, corrections, and wellbeing boundaries are handled across the site.', href: '/editorial-policy.html' },
  { label: 'Trust page', title: 'Privacy policy', text: 'Review how storage, sign-in, notifications, embedded media, and advertising-related technologies are described.', href: '/privacy.html' },
  { label: 'Trust page', title: 'Advertising policy', text: 'See how ads, Google AdSense, placement quality, editorial independence, and calm user experience are handled.', href: '/advertising-policy.html' },
  { label: 'Trust page', title: 'Diary and corrections', text: 'Find the direct support route for privacy requests, content corrections, bug reports, and ad questions.', href: '/contact.html' },
  { label: 'Helpful read', title: 'How to protect your privacy when journaling online', text: 'A practical read on trust, storage expectations, and what to look for before you write online.', href: '/article-protect-privacy-journaling-online.html' },
  { label: 'Helpful read', title: 'The psychology of journaling', text: 'Understand why writing can reduce mental noise and make thoughts easier to process.', href: '/article-psychology-of-journaling.html' },
  { label: 'Helpful read', title: 'How to start a journaling habit', text: 'Learn how to build a writing routine that feels realistic enough to keep through busy weeks.', href: '/article-how-to-start-journaling-habit.html' },
  { label: 'Helpful read', title: 'Benefits of a private online diary', text: 'See when a browser-based diary can feel more flexible, organized, and sustainable than scattered notes.', href: '/article-benefits-of-private-online-diary.html' },
  { label: 'Helpful read', title: 'Brain dumping before sleep', text: 'See how a short writing habit can reduce bedtime mental clutter and support calmer evenings.', href: '/article-brain-dumping-sleep.html' },
  { label: 'Helpful read', title: 'How a digital journal can reduce distractions', text: 'Explore why the right online setup can feel simpler, not noisier, when your goal is focus.', href: '/article-digital-journal-distractions.html' },
  { label: 'Helpful read', title: 'Journaling prompts for self-discovery', text: 'Use gentler prompts that help you begin without turning the page into a performance.', href: '/article-journaling-prompts-self-discovery.html' },
  { label: 'Helpful read', title: 'Memory games before writing', text: 'Read why a short puzzle break can help your attention settle before reflection.', href: '/article-memory-games-cognitive-relief.html' },
  { label: 'Helpful read', title: 'Daily word puzzles for relaxing breaks', text: 'See why familiar word loops can feel grounding when you want a tidy reset.', href: '/article-daily-word-puzzles-relax.html' },
  { label: 'Helpful read', title: 'Aesthetic study break routine for students', text: 'Use lofi music, the Focus Tree room, private journaling, and tiny game resets as one calm study loop.', href: '/article-study-break-routine-students.html' },
  { label: 'Painkiller guide', title: 'Stop scrolling and start studying', text: 'A practical guide for students who lose study time to scrolling and need a calmer focus anchor.', href: '/stop-scrolling-and-start-studying.html' },
  { label: 'Study guide', title: 'Lofi study room with a Focus Tree timer for students', text: 'A practical guide for students who want lofi music, a visible-page Focus Tree timer, private journaling, notes, and calm breaks in one room.', href: '/lofi-study-room-focus-tree-timer.html' },
  { label: 'Answer hub', title: '100 journaling and cozy game questions answered', text: 'Direct answers for overthinking, study stress, private journaling, tired brains, and calm game breaks in one readable guide.', href: '/journaling-games-long-tail-seo.html' },
  { label: 'ICP kit', title: 'Student Focus Kit', text: 'Open a student-facing kit with Focus Tree positioning, cozy study loops, and practical ways to share the room with classmates.', href: '/student-focus-kit.html' },
  { label: 'Helpful read', title: 'Word guessing games when your mind is busy', text: 'Learn how small pattern-recognition wins can provide relief without demanding too much energy.', href: '/article-word-guessing-games-busy-mind.html' }
];

const seoGuideGroups = [
  {
    title: 'Start with trust and product clarity',
    description: 'Best for visitors who want to understand what Lofi Memory is, how content is reviewed, and how privacy or support questions are handled.',
    links: seoGuidePages.filter((page) => ['Lofi Memory blog', 'About Lofi Memory', 'Editorial policy', 'Privacy policy', 'Diary and corrections'].includes(page.title))
  },
  {
    title: 'Read the strongest journaling articles',
    description: 'Best for people exploring private writing, calmer routines, sleep-friendly reflection, and digital focus habits.',
    links: seoGuidePages.filter((page) => ['How to protect your privacy when journaling online', 'The psychology of journaling', 'How to start a journaling habit', 'Benefits of a private online diary', 'Brain dumping before sleep', 'How a digital journal can reduce distractions', 'Journaling prompts for self-discovery'].includes(page.title))
  },
  {
    title: 'Explore calmer game-break reads',
    description: 'Best for visitors who like the music-and-games side of Lofi Memory but still want article-level value before they click around.',
    links: seoGuidePages.filter((page) => ['Stop scrolling and start studying', 'Lofi study room with a Focus Tree timer for students', '100 journaling and cozy game questions answered', 'Student Focus Kit', 'Aesthetic study break routine for students', 'Memory games before writing', 'Daily word puzzles for relaxing breaks', 'Word guessing games when your mind is busy'].includes(page.title))
  }
];

const seoPopularSearches = [
  { label: 'Lofi Memory blog', href: '/blog.html' },
  { label: 'HTML sitemap', href: '/sitemap.html' },
  { label: 'About Lofi Memory', href: '/about.html' },
  { label: 'Contact us', href: '/contact.html' },
  { label: 'Privacy policy', href: '/privacy.html' },
  { label: 'Terms of service', href: '/terms.html' },
  { label: 'Benefits of a private online diary', href: '/article-benefits-of-private-online-diary.html' },
  { label: 'How to start a journaling habit', href: '/article-how-to-start-journaling-habit.html' },
  { label: 'Protect privacy when journaling online', href: '/article-protect-privacy-journaling-online.html' },
  { label: 'Why journaling helps', href: '/article-psychology-of-journaling.html' },
  { label: 'Memory games before writing', href: '/article-memory-games-cognitive-relief.html' },
  { label: 'Brain dumping before sleep', href: '/article-brain-dumping-sleep.html' },
  { label: 'Journaling prompts for self-discovery', href: '/article-journaling-prompts-self-discovery.html' },
  { label: 'Word guessing games', href: '/article-word-guessing-games-busy-mind.html' },
  { label: 'Aesthetic study break routine', href: '/article-study-break-routine-students.html' },
  { label: 'Daily word puzzles', href: '/article-daily-word-puzzles-relax.html' }
];

const seoKeywordClusters = [
  {
    title: 'Private journaling',
    text: 'A curated hub for private journaling, gratitude diaries, aesthetic online notes, and student reflection tools.'
  },
  {
    title: 'Relaxing game breaks',
    text: 'Cozy browser games, single player puzzles, no-download relaxing games, and simple word puzzles for study breaks.'
  },
  {
    title: 'Lofi focus ambience',
    text: 'Lofi focus music, aesthetic study timers, focus music online, and calming background lofi for writing.'
  }
];

const THEME_STORAGE_KEY = 'quiet-journal-theme-v1';
const DESIGN_STORAGE_KEY = 'quiet-journal-design-v1';
const CUSTOM_COLOR_STORAGE_KEY = 'quiet-journal-custom-color-v1';
const CUSTOM_CD_IMAGE_STORAGE_KEY = 'quiet-journal-custom-cd-image-v1';
const QUOTE_BG_STORAGE_KEY = 'quiet-journal-quote-bg-v1';
const COMFORT_MODE_STORAGE_KEY = 'quiet-journal-comfort-mode-v1';
const WALLPAPER_STORAGE_KEY = 'quiet-journal-wallpaper-v1';

const colorThemes = [
  { id: 'sage', name: 'Lofi Vinyl', accent: '#4f6b45', soft: '#edf4e8', glow: '#b8d4aa', image: radioVinylIcon, imageTone: 'from-[#172217]/55 via-transparent to-[#4f6b45]/50' },
  { id: 'lavender', name: 'Midnight Jazz', accent: '#6651a6', soft: '#f0ecfb', glow: '#c6b7ec', image: hogwartsMusicRoomImage, imageTone: 'from-[#151223]/62 via-[#392f68]/12 to-[#6651a6]/58' },
  { id: 'ocean', name: 'Cassette Blue', accent: '#336f8b', soft: '#e7f3f8', glow: '#a6d4e2', image: rainWallpaperImage, imageTone: 'from-[#0f2d3a]/58 via-transparent to-[#336f8b]/58' },
  { id: 'sunrise', name: 'Sunset Radio', accent: '#b46c3d', soft: '#fff0df', glow: '#edbd8c', image: fireWallpaperImage, imageTone: 'from-[#3a2112]/58 via-transparent to-[#b46c3d]/62' },
  { id: 'rose', name: 'Rose Piano', accent: '#9f6278', soft: '#fbebf0', glow: '#e6b5c6', image: lofiRoomWallpaperImage, imageTone: 'from-[#311924]/58 via-transparent to-[#9f6278]/58' }
];

const designStyles = [
  { id: 'soft', name: 'Soft Cards', description: 'Rounded, airy, and gentle.', radius: '1.5rem', texture: 'none' },
  { id: 'editorial', name: 'Editorial', description: 'More magazine-like and refined.', radius: '0.85rem', texture: 'linear-gradient(135deg, rgba(255,255,255,0.52), rgba(255,255,255,0))' },
  { id: 'playful', name: 'Playful Calm', description: 'Bubbly shapes with a lighter mood.', radius: '2.25rem', texture: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.55), transparent 28%)' }
];

const quoteCardColors = [
  { name: 'Forest', value: '#45643b' },
  { name: 'Lavender', value: '#6f5c99' },
  { name: 'Ocean', value: '#2f7585' },
  { name: 'Clay', value: '#9a6847' },
  { name: 'Rose', value: '#9b5f6b' },
  { name: 'Charcoal', value: '#2f3a37' }
];

const journalAtmospherePresets = [
  {
    id: 'quiet-morning',
    name: 'Quiet Morning',
    note: 'Warm light, elegant words, and a steady pace.',
    themeId: 'sunrise',
    designId: 'soft',
    quoteBg: '#9a6847',
    journalFontId: 'serif',
    quoteFontId: 'serif',
    companionAnimation: 'float'
  },
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    note: 'Cool tones for slower thoughts and softer check-ins.',
    themeId: 'ocean',
    designId: 'editorial',
    quoteBg: '#2f7585',
    journalFontId: 'serif',
    quoteFontId: 'sans',
    companionAnimation: 'wave'
  },
  {
    id: 'soft-night',
    name: 'Soft Night',
    note: 'A gentle evening mood for deeper reflection.',
    themeId: 'lavender',
    designId: 'editorial',
    quoteBg: '#6f5c99',
    journalFontId: 'sans',
    quoteFontId: 'serif',
    companionAnimation: 'breathe'
  },
  {
    id: 'golden-dusk',
    name: 'Golden Dusk',
    note: 'Cozy warmth when you want the page to feel personal.',
    themeId: 'rose',
    designId: 'playful',
    quoteBg: '#9b5f6b',
    journalFontId: 'hand',
    quoteFontId: 'hand',
    companionAnimation: 'bounce'
  }
];

const breatheRoomOptions = [
  {
    id: 'rain',
    title: 'Rainy Lofi Window',
    sound: 'Rainy music + soft ambience',
    description: 'Rainy lofi music with a blue-green wallpaper for slower breathing, calm focus, and late-night writing.',
    icon: CloudRain,
    status: 'Rainy lofi window selected — rain music ambience is ready.',
    gradient: 'from-sky-100 via-cyan-50 to-sage-50',
    textTone: 'text-sky-800',
    ringTone: 'ring-sky-200',
    volume: 28,
    decoration: '☔',
    videoId: 'mPZkdNFkNps',
    wallpaper: rainWallpaperImage
  },
  {
    id: 'fire',
    title: 'Fireplace Lofi Nook',
    sound: 'Fire burning music',
    description: 'Warm fire crackle music with a hearth wallpaper for cozy journaling, reading, and study resets.',
    icon: Flame,
    status: 'Fireplace lofi nook selected — fire burning music is ready.',
    gradient: 'from-orange-100 via-amber-50 to-rose-50',
    textTone: 'text-orange-800',
    ringTone: 'ring-orange-200',
    volume: 30,
    decoration: '🪵',
    videoId: 'UgHKb_7884o',
    wallpaper: fireWallpaperImage
  },
  {
    id: 'lofi',
    title: 'Lofi Desk',
    sound: 'Lofi music',
    description: 'A soft study-room wallpaper that turns the cozy lofi radio back on.',
    icon: Headphones,
    status: 'Lofi wallpaper selected — cozy radio is ready.',
    gradient: 'from-rose-100 via-violet-50 to-sage-50',
    textTone: 'text-rose-800',
    ringTone: 'ring-rose-200',
    volume: 35,
    decoration: '🎧',
    videoId: 'rFZHOHl-L8A',
    wallpaper: lofiRoomWallpaperImage
  },
  {
    id: 'maple',
    title: 'MapleStory Theme',
    sound: 'MapleStory music',
    description: 'A nostalgic MapleStory-inspired YouTube track with a dreamy lofi wallpaper for cozy focus and late-night desk vibes.',
    icon: Headphones,
    status: 'MapleStory Theme selected — the updated YouTube song is ready.',
    gradient: 'from-amber-100 via-orange-50 to-rose-50',
    textTone: 'text-amber-900',
    ringTone: 'ring-amber-200',
    volume: 32,
    decoration: '🍁',
    videoId: '3DEkF2uvPoc',
    wallpaper: maplestoryThemeWallpaperImage
  },
  {
    id: 'hogwarts',
    title: 'Hogwarts Music Room',
    sound: 'Hogwarts ambience',
    description: 'A candlelit castle-inspired music room for magical studying, quiet journaling, and cozy late-night focus.',
    icon: Sparkles,
    status: 'Hogwarts Music Room selected — the magical study ambience is ready.',
    gradient: 'from-stone-200 via-amber-100 to-violet-100',
    textTone: 'text-violet-900',
    ringTone: 'ring-violet-200',
    volume: 34,
    decoration: '🏰',
    showDecoration: false,
    videoId: 'BQrxsyGTztM',
    startSeconds: 8741,
    wallpaper: hogwartsMusicRoomImage,
    imagePosition: 'center 44%'
  }
];

const todayISO = () => new Date().toISOString().slice(0, 10);

function getInitialSelectedCalendarDate() {
  if (typeof window === 'undefined') return todayISO();
  const dateValue = new URLSearchParams(window.location.search).get('date') || '';
  return /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : todayISO();
}

function getInitialActiveTab() {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#', '');
  if (hash === 'diary') return 'write';
  const params = new URLSearchParams(window.location.search);
  const requestedTab = params.get('tab') || '';
  const allowedTabs = new Set(['home', 'unwind', 'focus', 'write', 'notes', 'memories', 'breathe', 'insights', 'design']);
  if (allowedTabs.has(requestedTab)) return requestedTab;
  if (/^\d{4}-\d{2}-\d{2}$/.test(params.get('date') || '')) return 'memories';
  return 'home';
}

function getInitialHomeSection() {
  if (typeof window === 'undefined') return 'overview';
  const hash = window.location.hash.replace('#', '');
  const allowedSections = new Set(['home', 'overview', 'about', 'guides', 'seo-landing', 'resources', 'articles', 'faq', 'contact', 'privacy', 'terms']);
  if (hash === 'diary') return 'overview';
  if (!allowedSections.has(hash)) return 'overview';
  if (hash === 'home') return 'overview';
  if (hash === 'seo-landing') return 'guides';
  return hash;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
}

function shiftMonthKey(monthKey, offset) {
  const [year, month] = monthKey.split('-').map(Number);
  const next = new Date(year, month - 1 + offset, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
}

function buildCalendarDays(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return {
        day,
        dateKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      };
    })
  ];
}

function SeedIcon({ size = 18, className = '' }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3.4c4.6 0 7.6 3.1 7.6 7.3 0 5-4 9.9-7.6 9.9s-7.6-4.9-7.6-9.9c0-4.2 3-7.3 7.6-7.3Z" fill="currentColor" opacity="0.92" />
      <path d="M12 5.2c1.7 3.2 1.9 7.7 0 13" stroke="#f5fbef" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10.2c1.8-.4 3.3-1.2 4.4-2.4" stroke="#f5fbef" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function FrogIcon({ size = 18 }) {
  return <span aria-hidden="true" style={{ fontSize: `${size + 6}px`, lineHeight: 1 }}>🐸</span>;
}

function TetrisIcon({ size = 18, className = '' }) {
  const block = 'h-[0.32em] w-[0.32em] rounded-[0.08em] bg-current shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]';
  return (
    <span aria-hidden="true" className={`grid grid-cols-3 gap-[0.07em] ${className}`} style={{ fontSize: `${size * 1.45}px`, lineHeight: 1 }}>
      <span className={block} /><span className={block} /><span className={block} />
      <span className="h-[0.32em] w-[0.32em]" /><span className={block} /><span className="h-[0.32em] w-[0.32em]" />
      <span className="h-[0.32em] w-[0.32em]" /><span className={block} /><span className={block} />
    </span>
  );
}

function SnakeIcon({ size = 18 }) {
  return (
    <span aria-hidden="true" className="inline-flex items-center justify-center" style={{ width: size + 8, height: size + 8 }}>
      <span className="grid grid-cols-3 gap-[2px] rotate-12">
        {[0, 1, 2, 3, 4].map((segment) => (
          <span key={segment} className={`h-[6px] w-[6px] rounded-[2px] bg-current ${segment === 0 ? 'col-start-2' : ''}`} />
        ))}
      </span>
    </span>
  );
}

function ImageGameIcon({ src, alt, size = 18, className = '' }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center justify-center overflow-hidden rounded-xl ${className}`} style={{ width: size + 14, height: size + 14 }}>
      <img alt={alt} className="h-full w-full object-cover" src={src} />
    </span>
  );
}

function MinesweeperImageIcon(props) {
  return <ImageGameIcon {...props} alt="Minesweeper icon" src={minesweeperIconImage} />;
}

function SolitaireImageIcon(props) {
  return <ImageGameIcon {...props} alt="Solitaire icon" src={solitaireIconImage} />;
}

function SudokuImageIcon(props) {
  return <ImageGameIcon {...props} alt="Sudoku icon" src={sudokuIconImage} />;
}

function WordleImageIcon(props) {
  return <ImageGameIcon {...props} alt="Daily word puzzle icon" src={wordleIconImage} />;
}

function DinoDashImageIcon(props) {
  return <ImageGameIcon {...props} alt="Dino Dash icon" src={dinoDashIconImage} />;
}

function DinosaurIcon({ size = 18 }) {
  return (
    <span aria-hidden="true" className="relative inline-block" style={{ width: size + 10, height: size + 6 }}>
      <span className="absolute left-[0.42em] top-[0.16em] h-[0.62em] w-[0.72em] rounded-[0.12em] bg-current" />
      <span className="absolute left-[0.9em] top-[0.02em] h-[0.18em] w-[0.18em] rounded-full bg-white" />
      <span className="absolute left-[0.08em] top-[0.7em] h-[0.52em] w-[1.05em] rounded-[0.18em] bg-current" />
      <span className="absolute left-0 top-[0.82em] h-[0.18em] w-[0.5em] -rotate-12 rounded-full bg-current" />
      <span className="absolute left-[0.42em] top-[1.15em] h-[0.46em] w-[0.16em] rounded-full bg-current" />
      <span className="absolute left-[0.78em] top-[1.15em] h-[0.38em] w-[0.16em] rounded-full bg-current" />
    </span>
  );
}


function getForecastVisuals(forecast) {
  const weatherCode = typeof forecast === 'object' ? forecast?.weatherCode : forecast;
  const condition = typeof forecast === 'object' ? forecast?.condition : null;

  if (condition === 'mostly-cloudy') {
    return { emoji: '🌥️', label: 'Mostly cloudy', Icon: CloudSun, chipClass: 'bg-slate-100 text-slate-700' };
  }

  if (condition === 'rain') {
    return { emoji: '🌧️', label: 'Rain', Icon: CloudRain, chipClass: 'bg-sky-100 text-sky-800' };
  }

  if (condition === 'thunderstorm') {
    return { emoji: '⛈️', label: 'Thunderstorm', Icon: CloudRain, chipClass: 'bg-indigo-100 text-indigo-800' };
  }

  if ([0, 1].includes(weatherCode)) {
    return { emoji: '☀️', label: 'Clear', Icon: CloudSun, chipClass: 'bg-amber-100 text-amber-800' };
  }

  if ([2, 3, 45, 48].includes(weatherCode)) {
    return { emoji: '🌥️', label: 'Mostly cloudy', Icon: CloudSun, chipClass: 'bg-slate-100 text-slate-700' };
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { emoji: '🌦️', label: 'Drizzle', Icon: CloudRain, chipClass: 'bg-sky-100 text-sky-800' };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { emoji: '🌧️', label: 'Rain', Icon: CloudRain, chipClass: 'bg-sky-100 text-sky-800' };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { emoji: '❄️', label: 'Snow', Icon: Cloud, chipClass: 'bg-cyan-100 text-cyan-800' };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return { emoji: '⛈️', label: 'Thunderstorm', Icon: CloudRain, chipClass: 'bg-indigo-100 text-indigo-800' };
  }

  return { emoji: '🌤️', label: 'Forecast', Icon: CloudSun, chipClass: 'bg-sage-100 text-sage-800' };
}

function formatForecastTemperature(value) {
  return Number.isFinite(value) ? `${Math.round(value)}°` : '—';
}

function getGoogleStyleCondition(weatherCode, precipitationProbability = 0, cloudCover = 0) {
  if ([95, 96, 99].includes(weatherCode) && precipitationProbability >= 55) return 'thunderstorm';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode) && precipitationProbability >= 45) return 'rain';
  if ([51, 53, 55, 56, 57].includes(weatherCode) && precipitationProbability >= 45) return 'rain';
  if (cloudCover >= 45 || [2, 3, 45, 48, 95, 96, 99].includes(weatherCode)) return 'mostly-cloudy';
  return null;
}

function isSingaporeForecastLocation(coords) {
  return coords.latitude >= 1.15 && coords.latitude <= 1.48 && coords.longitude >= 103.6 && coords.longitude <= 104.1;
}

function buildGoogleWeatherReferenceForecast(startDateKey) {
  const googleReferenceDays = [
    { offset: 0, condition: 'mostly-cloudy', maxTemp: 32, minTemp: 28, weatherCode: 3 },
    { offset: 1, condition: 'mostly-cloudy', maxTemp: 32, minTemp: 28, weatherCode: 3 },
    { offset: 2, condition: 'mostly-cloudy', maxTemp: 31, minTemp: 28, weatherCode: 3 },
    { offset: 3, condition: 'rain', maxTemp: 31, minTemp: 28, weatherCode: 61 },
    { offset: 4, condition: 'rain', maxTemp: 31, minTemp: 28, weatherCode: 61 },
    { offset: 5, condition: 'thunderstorm', maxTemp: 31, minTemp: 28, weatherCode: 95 },
    { offset: 6, condition: 'mostly-cloudy', maxTemp: 31, minTemp: 28, weatherCode: 3 },
    { offset: 7, condition: 'mostly-cloudy', maxTemp: 32, minTemp: 28, weatherCode: 3 }
  ];
  const startDate = new Date(`${startDateKey}T00:00:00`);

  return Object.fromEntries(googleReferenceDays.map((day) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + day.offset);
    const dateKey = date.toISOString().slice(0, 10);
    return [dateKey, { ...day, dateKey, source: 'Google Weather reference' }];
  }));
}

function buildForecastByDate(dailyForecast = {}) {
  const dates = dailyForecast.time || [];
  const codes = dailyForecast.weather_code || [];
  const maxTemps = dailyForecast.temperature_2m_max || [];
  const minTemps = dailyForecast.temperature_2m_min || [];
  const precipitationProbabilities = dailyForecast.precipitation_probability_max || [];
  const cloudCovers = dailyForecast.cloud_cover_mean || [];

  return Object.fromEntries(dates.map((dateKey, index) => {
    const precipitationProbability = precipitationProbabilities[index] || 0;
    const cloudCover = cloudCovers[index] || 0;
    return [dateKey, {
      dateKey,
      weatherCode: codes[index],
      condition: getGoogleStyleCondition(codes[index], precipitationProbability, cloudCover),
      maxTemp: maxTemps[index],
      minTemp: minTemps[index],
      precipitationProbability,
      cloudCover
    }];
  }));
}


function getInitialEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed)
      ? parsed.map((entry) => ({
          ...entry,
          entryType: entry?.entryType === 'journal' ? 'journal' : 'diary'
        }))
      : [];
  } catch {
    return [];
  }
}

function normalizeImportantDatesRecord(value) {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(
    Object.entries(value).map(([dateKey, item]) => {
      if (typeof item === 'string') {
        return [dateKey, { note: item, time: '', remindersEnabled: true, createdAt: new Date().toISOString() }];
      }
      return [dateKey, {
        note: typeof item?.note === 'string' ? item.note : '',
        details: typeof item?.details === 'string' ? item.details : '',
        time: typeof item?.time === 'string' ? item.time : '',
        remindersEnabled: item?.remindersEnabled !== false,
        createdAt: item?.createdAt || new Date().toISOString()
      }];
    }).filter(([, item]) => item.note)
  );
}

function getInitialImportantDates() {
  try {
    const saved = localStorage.getItem(IMPORTANT_DATES_STORAGE_KEY);
    if (!saved) return {};
    return normalizeImportantDatesRecord(JSON.parse(saved));
  } catch {
    return {};
  }
}

function getSavedPin() {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
}

function getInitialCustomWeathers() {
  try {
    const saved = localStorage.getItem(CUSTOM_WEATHER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function getInitialCustomQuotes() {
  try {
    const saved = localStorage.getItem(CUSTOM_QUOTES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function getInitialQuoteStyle() {
  try {
    const saved = localStorage.getItem(QUOTE_STYLE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    fontId: 'serif',
    sizeId: 'md',
    textColor: '#ffffff'
  };
}

function getInitialJournalStyle() {
  try {
    const saved = localStorage.getItem(JOURNAL_STYLE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    fontId: 'sans',
    sizeId: 'md'
  };
}

function normalizePlannerTodo(todo) {
  const status = todo?.status === 'doing' || todo?.status === 'done' || todo?.status === 'todo'
    ? todo.status
    : (todo?.done ? 'done' : 'todo');
  const priority = todo?.priority === 'low' || todo?.priority === 'high' ? todo.priority : 'medium';
  const recurrence = todo?.recurrence === 'daily' || todo?.recurrence === 'weekly' || todo?.recurrence === 'monthly' ? todo.recurrence : 'none';
  const dueDate = typeof todo?.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(todo.dueDate) ? todo.dueDate : '';
  return {
    id: typeof todo?.id === 'string' ? todo.id : crypto.randomUUID(),
    text: typeof todo?.text === 'string' ? todo.text.trim() : '',
    status,
    priority,
    recurrence,
    dueDate,
    done: status === 'done'
  };
}

function normalizePlannerBoard(value) {
  return {
    text: typeof value?.text === 'string' ? value.text : '',
    todos: Array.isArray(value?.todos)
      ? value.todos
        .map(normalizePlannerTodo)
        .filter((todo) => todo.text)
      : []
  };
}

function getInitialPlannerBoard() {
  try {
    const saved = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (saved) {
      return normalizePlannerBoard(JSON.parse(saved));
    }
  } catch {}
  return {
    text: '',
    todos: []
  };
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString));
}

function formatReminderTime(timeValue) {
  if (!timeValue) return '';
  const [hoursString, minutesString] = timeValue.split(':');
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeValue;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function formatShortDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(`${dateString}T00:00:00`));
}

function getPlannerStatusLabel(status) {
  if (status === 'doing') return 'In progress';
  if (status === 'done') return 'Done';
  return 'To do';
}

function getPlannerPriorityLabel(priority) {
  if (priority === 'high') return 'High';
  if (priority === 'low') return 'Low';
  return 'Medium';
}

function getPlannerRecurrenceLabel(recurrence) {
  if (recurrence === 'daily') return 'Daily';
  if (recurrence === 'weekly') return 'Weekly';
  if (recurrence === 'monthly') return 'Monthly';
  return 'One-time';
}

function getNextPlannerDueDate(dueDate, recurrence) {
  if (!dueDate || recurrence === 'none') return '';
  const nextDate = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(nextDate.getTime())) return '';
  if (recurrence === 'daily') nextDate.setDate(nextDate.getDate() + 1);
  if (recurrence === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
  if (recurrence === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate.toISOString().slice(0, 10);
}

function isPlannerTodoOverdue(todo) {
  return Boolean(todo?.dueDate) && todo.status !== 'done' && todo.dueDate < todayISO();
}

function getReminderDate(dateKey, timeValue = '') {
  const fallbackTime = timeValue || '09:00';
  const parsed = new Date(`${dateKey}T${fallbackTime}:00`);
  return Number.isNaN(parsed.getTime()) ? new Date(dateKey) : parsed;
}

function getRelativeReminderLabel(dateKey) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const target = new Date(`${dateKey}T00:00:00`);
  const diffDays = Math.round((target.getTime() - startOfToday.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
  return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
}

function showImportantReminderNotification({ title, body, dateKey, reminderType, note, time }) {
  if (typeof window === 'undefined') return Promise.resolve();
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready
      .then((registration) => registration.showNotification(title, {
        body,
        tag: `important-reminder:${dateKey}:${reminderType}`,
        renotify: false,
        requireInteraction: reminderType === 'today',
        data: {
          dateKey,
          reminderType,
          note,
          time,
          tab: 'memories'
        }
      }))
      .catch((error) => {
        console.error('Service worker reminder failed', error);
        if ('Notification' in window) {
          new window.Notification(title, { body });
        }
      });
  }
  if ('Notification' in window) {
    new window.Notification(title, { body });
  }
  return Promise.resolve();
}

function sanitizeJournalHtml(html = '') {
  const raw = String(html || '');
  if (!raw) return '';
  if (typeof document === 'undefined') {
    return raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/ on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }

  const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'U', 'UL', 'OL', 'LI', 'IMG']);
  const template = document.createElement('template');
  template.innerHTML = raw;

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return document.createDocumentFragment();
    }

    const tag = node.tagName.toUpperCase();
    const fragment = document.createDocumentFragment();

    if (!allowedTags.has(tag)) {
      Array.from(node.childNodes).forEach((child) => {
        fragment.appendChild(sanitizeNode(child));
      });
      return fragment;
    }

    const safeEl = document.createElement(tag.toLowerCase());

    if (tag === 'IMG') {
      const src = node.getAttribute('src') || '';
      const safeSrc = /^(data:image\/|https?:\/\/|blob:)/i.test(src) ? src : '';
      if (!safeSrc) return fragment;
      safeEl.setAttribute('src', safeSrc);
      safeEl.setAttribute('alt', node.getAttribute('alt') || 'Journal photo');
      safeEl.setAttribute('class', 'journal-inline-img');
      safeEl.draggable = false;
      safeEl.style.maxWidth = '100%';
      safeEl.style.height = 'auto';
      safeEl.style.display = 'block';
      safeEl.style.margin = '1rem auto';
      safeEl.style.borderRadius = '1rem';
      safeEl.style.position = 'relative';
      safeEl.style.transform = 'translate(0px, 0px)';
      return safeEl;
    }

    Array.from(node.childNodes).forEach((child) => {
      safeEl.appendChild(sanitizeNode(child));
    });

    return safeEl;
  };

  const container = document.createElement('div');
  Array.from(template.content.childNodes).forEach((child) => {
    container.appendChild(sanitizeNode(child));
  });
  return container.innerHTML;
}

function getPlainTextFromHtml(html = '') {
  const safeHtml = sanitizeJournalHtml(html);
  if (typeof document === 'undefined') {
    return safeHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = safeHtml;
  return (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim();
}

function getCompanionFrameDimensions(size, isVideo, isUploadedMedia) {
  if (!isUploadedMedia) {
    return { width: size, height: size };
  }
  if (isVideo) {
    return {
      width: Math.min(size * 1.9, 560),
      height: Math.min(size * 1.45, 400)
    };
  }
  return {
    width: Math.min(size * 2.1, 560),
    height: Math.min(size * 1.55, 420)
  };
}

function clampCompanionPosition(size, x, y, containerWidth, containerHeight, isVideo, isUploadedMedia) {
  const frame = getCompanionFrameDimensions(size, isVideo, isUploadedMedia);
  const maxX = Math.max(0, (containerWidth - frame.width) / 2);
  const maxY = Math.max(0, (containerHeight - frame.height) / 2);
  return {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxY, Math.min(maxY, y))
  };
}

function CozyPanelFallback({ label = 'Loading cozy space...' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[2rem] border border-[#e8dfd5] bg-white/75 px-6 py-10 text-[#6f5948] shadow-sm backdrop-blur">
      <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/50 bg-[#fffaf2] px-5 py-3 text-sm font-extrabold shadow-sm">
        <Leaf className="h-5 w-5 animate-pulse text-[#8e7159]" />
        {label}
      </div>
    </div>
  );
}

class CozyPanelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Cozy panel render failed', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleRetry() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      const { title = 'This cozy space had trouble opening.', description = 'Please try again. If it still feels blank, hop to another tab and come back once more.' } = this.props;
      return (
        <div className="flex min-h-[260px] items-center justify-center rounded-[2rem] border border-[#e8dfd5] bg-white/80 px-6 py-10 shadow-sm backdrop-blur">
          <div className="max-w-lg rounded-[2rem] border border-[#dbc7b1] bg-[#fffaf2] p-6 text-center shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-600">Panel recovery</p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">{description}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button className="rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-800" onClick={this.handleRetry} type="button">
                Try this panel again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LazyTabPanel({ children, label, resetKey, title, description }) {
  return (
    <CozyPanelErrorBoundary description={description} resetKey={resetKey} title={title}>
      <Suspense fallback={<CozyPanelFallback label={label} />}>{children}</Suspense>
    </CozyPanelErrorBoundary>
  );
}

function isSandboxPreviewHost(hostname = '') {
  return hostname.includes('aime-site.tiktok-row.net');
}

function App() {
  const initialActiveTab = getInitialActiveTab();
  const initialCalendarDate = getInitialSelectedCalendarDate();
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [writingCategory, setWritingCategory] = useState('diary');
  const [memoriesCategoryFilter, setMemoriesCategoryFilter] = useState('all');
  const entryTypeMeta = {
    diary: {
      label: 'Diary entry',
      shortLabel: 'Diary',
      helper: 'For what happened, what you finished, and what you want to remember.'
    },
    journal: {
      label: 'Journal entry',
      shortLabel: 'Journal',
      helper: 'For reflection, feelings, patterns, and gentle self-check-ins.'
    }
  };
  const [activeHomeSection, setActiveHomeSection] = useState(getInitialHomeSection);
  const [showEntryTransition, setShowEntryTransition] = useState(false);
  const [entryTransitionClosing, setEntryTransitionClosing] = useState(false);
  const [entries, setEntries] = useState(getInitialEntries);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [plannerBoard, setPlannerBoard] = useState(getInitialPlannerBoard);
  const [plannerTodoDraft, setPlannerTodoDraft] = useState('');
  const [plannerTodoPriorityDraft, setPlannerTodoPriorityDraft] = useState('medium');
  const [plannerTodoDueDateDraft, setPlannerTodoDueDateDraft] = useState('');
  const [plannerTodoRecurrenceDraft, setPlannerTodoRecurrenceDraft] = useState('none');
  const [plannerTodoFilter, setPlannerTodoFilter] = useState('all');
  const [editingPlannerTodoId, setEditingPlannerTodoId] = useState(null);
  const [editingPlannerTodoText, setEditingPlannerTodoText] = useState('');
  const [editingPlannerTodoPriority, setEditingPlannerTodoPriority] = useState('medium');
  const [editingPlannerTodoDueDate, setEditingPlannerTodoDueDate] = useState('');
  const [editingPlannerTodoRecurrence, setEditingPlannerTodoRecurrence] = useState('none');
  const [draggedPlannerTodoId, setDraggedPlannerTodoId] = useState(null);
  const [saveReward, setSaveReward] = useState('');
  const [selectedUnwindGame, setSelectedUnwindGame] = useState('solitaire');
  const [unwindViewMode, setUnwindViewMode] = useState('grid');
  const [isGameTransitioning, setIsGameTransitioning] = useState(false);
  const [activeTransitionGameId, setActiveTransitionGameId] = useState(null);
  const [memoriesView, setMemoriesView] = useState('calendar');
  const [gameVisualTheme, setGameVisualTheme] = useState('lofi');
  const showMinimalHomeOverview = false; // Always show full descriptive overview for better SEO and initial Bot review
  const homeEntryCards = [
    { id: 'write', title: 'Journal', description: 'Write one thought privately', icon: PenLine, iconTone: 'bg-[#dbead9] text-sage-700', onClick: () => navigateToTab('write'), preview: diarySectionPreviewImage },
    { id: 'focus', title: 'Focus Tree', description: 'Grow while studying', icon: Leaf, iconTone: 'bg-[#dbead9] text-emerald-700', onClick: () => navigateToTab('focus'), preview: musicSectionPreviewImage },
    { id: 'breathe', title: 'Music Room', description: 'Play soft lofi sounds', icon: Wind, iconTone: 'bg-[#dbe8f8] text-sky-700', onClick: () => navigateToTab('breathe'), preview: musicSectionPreviewImage },
    { id: 'unwind', title: 'Games', description: 'Calm browser breaks', icon: Gamepad2, iconTone: 'bg-[#d8dbff] text-violet-700', onClick: () => navigateToTab('unwind'), preview: gamesSectionPreviewImage },
    { id: 'notes', title: 'Notes', description: 'Quick tasks & reminders', icon: FileText, iconTone: 'bg-[#d8f0ec] text-teal-700', onClick: () => navigateToTab('notes'), preview: notesSectionPreviewImage },
    { id: 'memories', title: 'Memories', description: 'Save dates and moods', icon: CalendarDays, iconTone: 'bg-[#efe6d8] text-sand-700', onClick: () => navigateToTab('memories'), preview: memoriesSectionPreviewImage },
    { id: 'design', title: 'Design', description: 'Customize your space', icon: Palette, iconTone: 'bg-[#f4dce7] text-rose-700', onClick: () => navigateToTab('design'), preview: designSectionPreviewImage }
  ];
  const [selectedGameDifficulty, setSelectedGameDifficulty] = useState('medium');
  const selectedGameInterfaceRef = useRef(null);
  const shouldAutoScrollToGameRef = useRef(false);
  const [isRadioPlaying, setIsRadioPlaying] = useState(true);
  const [radioVolume, setRadioVolume] = useState(35);
  const [selectedBreatheRoom, setSelectedBreatheRoom] = useState('lofi');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [breatheRoomStatus, setBreatheRoomStatus] = useState('Lofi wallpaper selected');
  const [isRadioDialDragging, setIsRadioDialDragging] = useState(false);
  const [showRadioDialFeedback, setShowRadioDialFeedback] = useState(false);
  const [radioNeedsInteraction, setRadioNeedsInteraction] = useState(false);
  const [radioStatusMessage, setRadioStatusMessage] = useState('Auto-starting lofi radio');
  const [plannerNoteSearch, setPlannerNoteSearch] = useState('');
  const [customQuotes, setCustomQuotes] = useState(getInitialCustomQuotes);
  const [customQuoteDraft, setCustomQuoteDraft] = useState('');
  const [quoteStyle, setQuoteStyle] = useState(getInitialQuoteStyle);
  const [journalStyle, setJournalStyle] = useState(getInitialJournalStyle);
  const [petHappiness, setPetHappiness] = useState(60);
  const [petTreats, setPetTreats] = useState(0);
  const [petMood, setPetMood] = useState('walking');
  const [importantDates, setImportantDates] = useState(getInitialImportantDates);
  const [importanceModalOpen, setImportanceModalOpen] = useState(false);
  const [importanceDraft, setImportanceDraft] = useState('');
  const [importanceDetailsDraft, setImportanceDetailsDraft] = useState('');
  const [importanceTimeDraft, setImportanceTimeDraft] = useState('');
  const [importanceReminderEnabled, setImportanceReminderEnabled] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return window.Notification.permission;
  });
  const [notificationStatusMessage, setNotificationStatusMessage] = useState('');
  const [webPushStatus, setWebPushStatus] = useState(() => {
    if (typeof window === 'undefined') return 'Push setup not started.';
    return localStorage.getItem(WEB_PUSH_STATUS_STORAGE_KEY) || 'Push setup not started.';
  });
  const [webPushTokenReady, setWebPushTokenReady] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [petPosition, setPetPosition] = useState({ x: 20, y: 40 });
  const [petDirection, setPetDirection] = useState(1);
  const [petBubble, setPetBubble] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => initialCalendarDate.slice(0, 7));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(initialCalendarDate);
  const [calendarForecastByDate, setCalendarForecastByDate] = useState({});
  const [calendarForecastStatus, setCalendarForecastStatus] = useState('We can add a local forecast here once location access is allowed.');
  const [calendarForecastPermission, setCalendarForecastPermission] = useState('idle');
  const [calendarForecastLocation, setCalendarForecastLocation] = useState('');
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editMood, setEditMood] = useState('Calm');
  const editBodyRef = useRef(null);
  const [customWeathers, setCustomWeathers] = useState(getInitialCustomWeathers);
  const [customWeatherName, setCustomWeatherName] = useState('');
  const [customWeatherEmoji, setCustomWeatherEmoji] = useState('🌙');
  const [customWeatherImage, setCustomWeatherImage] = useState('');
  const [activePrompt, setActivePrompt] = useState(prompts[0]);
  const [hasPin, setHasPin] = useState(Boolean(getSavedPin()));
  const [locked, setLocked] = useState(Boolean(getSavedPin()));
  const [pinSettingsOpen, setPinSettingsOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(() => new Date().getDate() % quotes.length);
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'sage');
  const [selectedDesign, setSelectedDesign] = useState(() => localStorage.getItem(DESIGN_STORAGE_KEY) || 'editorial');
  const [customColor, setCustomColor] = useState(() => localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY) || '#587f49');
  const [customCdImage, setCustomCdImage] = useState(() => localStorage.getItem(CUSTOM_CD_IMAGE_STORAGE_KEY) || '');
  const [quoteBg, setQuoteBg] = useState(() => localStorage.getItem(QUOTE_BG_STORAGE_KEY) || '#45643b');
  const [wallpaperImage, setWallpaperImage] = useState(() => localStorage.getItem(WALLPAPER_STORAGE_KEY) || '');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [comfortMode, setComfortMode] = useState(() => localStorage.getItem(COMFORT_MODE_STORAGE_KEY) === 'true');
  const [companion, setCompanion] = useState(getInitialCompanion);
  const [companionSelected, setCompanionSelected] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState('Local mode');
  const [plannerCloudReady, setPlannerCloudReady] = useState(false);
  const [importantDatesCloudReady, setImportantDatesCloudReady] = useState(false);
  const [seoStudioApiKey, setSeoStudioApiKey] = useState(() => localStorage.getItem(SEO_STUDIO_API_KEY_STORAGE_KEY) || '');
  const [seoStudioPrompt, setSeoStudioPrompt] = useState(() => localStorage.getItem(SEO_STUDIO_PROMPT_STORAGE_KEY) || DEFAULT_SEO_STUDIO_PROMPT);
  const [seoStudioReport, setSeoStudioReport] = useState(() => localStorage.getItem(SEO_STUDIO_REPORT_STORAGE_KEY) || '');
  const [seoStudioLastRun, setSeoStudioLastRun] = useState(() => localStorage.getItem(SEO_STUDIO_LAST_RUN_STORAGE_KEY) || '');
  const [seoStudioLoading, setSeoStudioLoading] = useState(false);
  const [seoStudioError, setSeoStudioError] = useState('');
  const [seoStudioCopied, setSeoStudioCopied] = useState(false);
  const [cookieConsentAccepted, setCookieConsentAccepted] = useState(() => localStorage.getItem('quiet-journal-cookie-consent') === 'true');
  const [showSeoStudioKey, setShowSeoStudioKey] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState(() => localStorage.getItem(ADMIN_VIEW_MODE_STORAGE_KEY) || 'master');
  const [seoStudioModelUsed, setSeoStudioModelUsed] = useState('');
  const [showAllSearches, setShowAllSearches] = useState(false);
  const [interfaceMode, setInterfaceMode] = useState('pc');
  const entryBodyRef = useRef(null);
  const companionMediaRef = useRef(null);
  const plannerBoardRef = useRef(plannerBoard);
  const importantDatesRef = useRef(importantDates);
  const radioDialRef = useRef(null);
  const radioDialPointerIdRef = useRef(null);
  const radioDialFeedbackTimeoutRef = useRef(null);
  const radioPlayerContainerRef = useRef(null);
  const radioPlayerRef = useRef(null);
  const radioUnlockedRef = useRef(false);
  const radioNowPlayingRef = useRef('Lofi Desk');

  const isMasterAdmin = user?.email?.toLowerCase() === MASTER_ADMIN_EMAIL;
  const showAdminTools = isMasterAdmin && adminViewMode === 'master';

  const quickEmojis = ['✨', '🌸', '🍃', '☕', '🌙', '💛', '🌿', '☀️', '🧸', '🫧', '🍂', '🫶'];
  const homeSections = useMemo(() => {
    const sections = [
      { id: 'overview', label: 'Overview', icon: Waves, detail: 'Progress + shortcuts' },
      { id: 'about', label: 'About', icon: Compass, detail: 'How the journal works' },
      { id: 'guides', label: 'Guides', icon: BookOpen, detail: 'Reader guides + helpful pages' },
      { id: 'resources', label: 'Resources', icon: HeartHandshake, detail: 'Gentle practices' },
      { id: 'articles', label: 'Articles', icon: Newspaper, detail: 'Short reflections' },
      { id: 'faq', label: 'FAQ', icon: Sparkles, detail: 'Common questions' },
      { id: 'tips', label: 'Tips', icon: Leaf, detail: 'Ways to begin' },
      { id: 'privacy', label: 'Privacy', icon: Shield, detail: 'What stays private' },
      { id: 'terms', label: 'Terms', icon: Scale, detail: 'Helpful notes' },
      { id: 'contact', label: 'Contact', icon: Mail, detail: 'Reach the owner' }
    ];
    if (showAdminTools) {
      sections.push({ id: 'seo-studio', label: 'SEO Studio', icon: ShieldCheck, detail: 'Admin-only AI tools' });
    }
    return sections;
  }, [showAdminTools]);
  const primaryHomeSections = useMemo(
    () => homeSections.filter((section) => ['overview', 'about', 'guides', 'resources', 'faq', 'contact', 'seo-studio'].includes(section.id)),
    [homeSections]
  );
  const difficultyOptions = [
    { id: 'easy', label: 'Easy', detail: 'Slow and forgiving' },
    { id: 'medium', label: 'Medium', detail: 'Balanced chill' },
    { id: 'hard', label: 'Hard', detail: 'Sharper focus' }
  ];
  const chillResearchHighlights = [
    {
      title: 'What people like to play to unwind',
      text: 'Puzzle, memory, and low-pressure endless games are some of the most common comfort picks when people want to relax without a huge learning curve.'
    },
    {
      title: 'What helps people slow down',
      text: 'Music, deep breathing, short walks, journaling, and simple repeatable games all show up again and again as go-to stress relievers.'
    },
    {
      title: 'What Lofi Memory is leaning into',
      text: 'Cozy logic, soft movement, quick resets, and calm transitions between playing, breathing, planning, and writing.'
    }
  ];
  const unwindGames = [
    {
      id: 'solitaire',
      title: 'Solitaire',
      detail: 'Classic card reset',
      description: 'Play cozy Solitaire in a calm green-felt space while listening to lofi music, relaxing, and clearing your mind one move at a time.',
      icon: SolitaireImageIcon,
      tone: 'from-emerald-800 to-teal-900 text-white',
      preview: gameSolitairePreview,
      playingSpace: 'max-w-[1180px]',
      component: <Solitaire difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-snake',
      title: 'Snake Flow',
      detail: 'Classic arcade loop',
      isNew: true,
      description: 'A cozy snake run with clear turns and a gentle lofi feel, perfect for a short focus reset.',
      icon: SnakeIcon,
      tone: 'from-emerald-100 to-lime-50 text-emerald-700',
      preview: gameSnakePreview,
      playingSpace: 'max-w-[1040px]',
      component: <QuietSnake difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'mind-sweeper',
      title: 'Sweeper',
      detail: 'Logic reset',
      description: 'Clear soft logic tiles in a cozy sweeper board designed for mindful study breaks.',
      icon: MinesweeperImageIcon,
      tone: 'from-lime-100 to-emerald-50 text-emerald-700',
      preview: gameMindSweeperPreview,
      playingSpace: 'max-w-[980px]',
      component: <MindSweeper difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'drifting-leaf',
      title: 'Drifting Seed',
      detail: 'Soft endless glide',
      isNew: true,
      description: 'A slow, floaty game for clearing your head and settling into gentle focus during study breaks.',
      icon: SeedIcon,
      tone: 'from-emerald-100 to-sage-50 text-emerald-700',
      preview: gameDriftingSeedPreview,
      playingSpace: 'max-w-[900px]',
      component: <ZenGame difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'stream-surfer',
      title: 'Lilypad Hopper',
      detail: 'Gentle pond dodging',
      description: 'Hop through a calm lofi lily-pad run for a mindful reset between study blocks.',
      icon: FrogIcon,
      tone: 'from-sky-100 to-cyan-50 text-sky-700',
      preview: gameLilypadPreview,
      playingSpace: 'max-w-[1120px]',
      component: <StreamSurfer difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'lofi-jigsaw',
      title: 'Lofi Jigsaw',
      detail: 'Cozy picture puzzle',
      description: 'Slide a soft lofi scene back together for a relaxing puzzle break before journaling or between study sessions.',
      icon: ImagePlus,
      tone: 'from-emerald-100 via-amber-50 to-rose-50 text-emerald-700',
      preview: gameJigsawPreview,
      playingSpace: 'max-w-[1080px]',
      component: <LofiJigsaw difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'lotus-match',
      title: 'Lotus Match',
      detail: 'Quiet memory reset',
      description: 'Flip calm cards and settle your focus during a quiet study break or a calm afternoon.',
      icon: Heart,
      tone: 'from-rose-100 to-orange-50 text-rose-700',
      preview: gameLotusPreview,
      playingSpace: 'max-w-[1020px]',
      component: <LotusMatch difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-tiles',
      title: 'Tiles Flow',
      detail: 'Cozy 2048-style merge',
      description: 'Slide matching numbers together in a calm puzzle loop for mindful study breaks.',
      icon: Grid2x2,
      tone: 'from-violet-100 to-slate-50 text-violet-700',
      preview: gameTilesPreview,
      playingSpace: 'max-w-[820px]',
      component: <QuietTiles difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-tetris',
      title: 'Stacks',
      detail: 'Calm block stacking',
      description: 'Stack colorful blocks, clear tidy rows, and settle into a gentle focus loop made for cozy study breaks.',
      icon: TetrisIcon,
      tone: 'from-indigo-100 to-sky-50 text-indigo-700',
      preview: gameTetrisPreview,
      playingSpace: 'max-w-[1120px]',
      component: <QuietTetris difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-slide',
      title: 'Slide Flow',
      detail: 'Cozy sliding puzzle',
      description: 'Move tiles into place in a soft visual puzzle for a quiet study break reset.',
      icon: Puzzle,
      tone: 'from-amber-100 to-stone-50 text-amber-700',
      preview: gameSlidePreview,
      playingSpace: 'max-w-[860px]',
      component: <QuietSlide difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-sudoku',
      title: 'Sudoku',
      detail: 'Logic puzzle',
      description: 'Settle into a cozy Sudoku board with gentle checking and lofi visuals, built for mindful study breaks.',
      icon: SudokuImageIcon,
      tone: 'from-cyan-100 to-blue-50 text-cyan-700',
      preview: gameSudokuPreview,
      playingSpace: 'max-w-[980px]',
      component: <QuietSudoku difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-wordle',
      title: 'Daily Word Puzzle',
      detail: 'Gentle five-letter word game',
      description: 'Guess a cozy word in a gentle five-letter challenge when you want something familiar, tidy, and easy to replay.',
      icon: WordleImageIcon,
      tone: 'from-teal-100 to-sky-50 text-teal-700',
      preview: gameWordlePreview,
      playingSpace: 'max-w-[780px]',
      component: <QuietWordle difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-words',
      title: 'Word Scramble',
      detail: 'Calm word scramble',
      description: 'Unscramble soft words in a light, calm word loop for cozy focus breaks.',
      icon: Type,
      tone: 'from-fuchsia-100 to-rose-50 text-fuchsia-700',
      preview: gameWordsPreview,
      playingSpace: 'max-w-[860px]',
      component: <QuietWords difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'typing-speed-test',
      title: 'Typing Pace',
      detail: 'Typing test',
      description: 'Improve your typing pace with calm visuals and gentle lofi rhythms during your study breaks.',
      icon: Keyboard,
      tone: 'from-sky-100 to-indigo-50 text-sky-700',
      preview: gameTypingPreview,
      playingSpace: 'max-w-[960px]',
      component: <TypingSpeedTest difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'quiet-clues',
      title: 'Clues',
      detail: 'Word focus',
      description: 'Solve short cozy clues in a soft crossword-inspired flow for gentle focus breaks.',
      icon: Map,
      tone: 'from-amber-100 to-rose-50 text-amber-700',
      preview: gameCluesPreview,
      playingSpace: 'max-w-[820px]',
      component: <QuietClues difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    },
    {
      id: 'dinosaur-dash',
      title: 'Dinosaur Dash',
      detail: 'Gentle desert run',
      description: 'Jump through a soft desert loop when you want a little rhythm and play.',
      icon: DinoDashImageIcon,
      tone: 'from-orange-100 to-yellow-50 text-orange-700',
      preview: gameDinoPreview,
      playingSpace: 'max-w-[1060px]',
      component: <DinosaurDash difficulty={selectedGameDifficulty} theme={gameVisualTheme} viewportMode={isFullscreen ? 'fullscreen' : 'embedded'} />
    }
  ];
  const selectedUnwindGameConfig = unwindGames.find((game) => game.id === selectedUnwindGame) || unwindGames[0];
  const transitioningGameConfig = unwindGames.find((game) => game.id === activeTransitionGameId) || null;
  const selectedDifficultyConfig = difficultyOptions.find((difficulty) => difficulty.id === selectedGameDifficulty) || difficultyOptions[1];
  const isPhoneInterface = interfaceMode === 'phone';
  const isPcInterface = interfaceMode === 'pc';

    const selectUnwindGame = (gameId) => {

      setActiveTransitionGameId(gameId);

      setIsGameTransitioning(true);

      

      window.setTimeout(() => {

        setSelectedUnwindGame(gameId);

        setUnwindViewMode('detail');

        setIsGameTransitioning(false);

        shouldAutoScrollToGameRef.current = true;

        // Scroll immediately to make reveal smooth

        window.scrollTo({ top: 0, behavior: 'instant' });

      }, 1400);

    };

  

  const returnToGameLibrary = async () => {
    if (document.fullscreenElement === selectedGameInterfaceRef.current) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error('Exit fullscreen failed:', err);
      }
    }
    setUnwindViewMode('grid');
    window.setTimeout(() => {
      document.getElementById('game-library')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 80);
  };

  useEffect(() => {
    if (!shouldAutoScrollToGameRef.current || activeTab !== 'unwind' || unwindViewMode !== 'detail') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      selectedGameInterfaceRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      shouldAutoScrollToGameRef.current = false;
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [activeTab, selectedUnwindGame, unwindViewMode]);

  const homeSectionMap = {
    home: 'overview',
    overview: 'overview',
    about: 'about',
    'seo-landing': 'guides',
    guides: 'guides',
    resources: 'resources',
    articles: 'articles',
    faq: 'faq',
    tips: 'tips',
    privacy: 'privacy',
    terms: 'terms',
    contact: 'contact',
    'seo-studio': 'seo-studio'
  };

  const activeTheme = colorThemes.find((theme) => theme.id === selectedTheme) || colorThemes[0];
  const activeDesign = designStyles.find((style) => style.id === selectedDesign) || designStyles[0];
  const weatherOptions = useMemo(() => [...moods, ...customWeathers], [customWeathers]);
  const selectedMoodOption = useMemo(() => weatherOptions.find((item) => item.label === selectedMood) || moods[2], [selectedMood, weatherOptions]);
  const selectedMoodGuide = useMemo(() => {
    if (selectedMood === 'Angry') {
      return {
        title: 'Give the heat somewhere safe to land',
        detail: 'Write the sharp truth first, then the need, hurt, or boundary sitting underneath it.',
        summary: 'Anger can point to pressure, hurt, or a line that mattered to you.',
        shellClass: 'border-orange-100 bg-gradient-to-br from-orange-50/95 via-white to-rose-50/85',
        panelClass: 'bg-orange-50/85 ring-orange-100/90',
        chipClass: 'border-orange-200 bg-white/95 text-orange-700'
      };
    }
    if (selectedMood === 'Anxious') {
      return {
        title: 'Let the page slow the spiral',
        detail: 'Keep the sentence small and concrete. Start with what feels true right now instead of solving everything at once.',
        summary: 'A short check-in can turn anxious noise into something more nameable.',
        shellClass: 'border-rose-100 bg-gradient-to-br from-rose-50/90 via-white to-sage-50/80',
        panelClass: 'bg-rose-50/85 ring-rose-100/90',
        chipClass: 'border-rose-200 bg-white/95 text-rose-700'
      };
    }
    if (selectedMood === 'Sad') {
      return {
        title: 'Keep this page gentle',
        detail: 'You can write in fragments, pauses, or one honest line. The page does not need a polished version of the feeling.',
        summary: 'A quieter mood can still leave a clear and meaningful page behind.',
        shellClass: 'border-blue-100 bg-gradient-to-br from-blue-50/90 via-white to-sage-50/80',
        panelClass: 'bg-blue-50/85 ring-blue-100/90',
        chipClass: 'border-blue-200 bg-white/95 text-blue-700'
      };
    }
    return {
      title: 'A quick mood marker for today',
      detail: 'A simple mood label helps you return later and remember what the day actually felt like.',
      summary: 'Mood check-ins keep the writing flow softer and easier to revisit over time.',
      shellClass: 'border-[#e8dfd5] bg-[#fffaf2]/88',
      panelClass: 'bg-sage-50/85 ring-sage-100/80',
      chipClass: 'border-[#e8dfd5] bg-white/95 text-sage-700'
    };
  }, [selectedMood]);
  const moodStarterPrompts = useMemo(() => {
    if (selectedMood === 'Angry') return ['What crossed a line today', 'What felt unfair', 'What I need to protect now'];
    if (selectedMood === 'Anxious') return ['What feels uncertain', 'What would steady me', 'One thing that is true right now'];
    if (selectedMood === 'Sad') return ['What felt heavy today', 'What I wish someone knew', 'What would feel kind right now'];
    return ['Today felt like', 'What I keep coming back to', 'Right now I need'];
  }, [selectedMood]);
  const quoteLibrary = useMemo(() => [...quotes, ...customQuotes], [customQuotes]);
  const activeQuoteFont = quoteFontOptions.find((font) => font.id === quoteStyle.fontId)?.css || quoteFontOptions[0].css;
  const activeQuoteSize = quoteSizeOptions.find((size) => size.id === quoteStyle.sizeId)?.value || quoteSizeOptions[1].value;
  const activeJournalFont = journalFontOptions.find((font) => font.id === journalStyle.fontId)?.css || journalFontOptions[0].css;
  const activeJournalSize = journalSizeOptions.find((size) => size.id === journalStyle.sizeId)?.value || journalSizeOptions[1].value;
  const companionIsVideo = String(companion.character || '').startsWith('data:video');
  const companionIsUploadedMedia = String(companion.character || '').startsWith('data:') || String(companion.character || '').startsWith('http');
  const { width: companionFrameWidth, height: companionFrameHeight } = getCompanionFrameDimensions(companion.size, companionIsVideo, companionIsUploadedMedia);
  const themeStyle = {
    '--accent': selectedTheme === 'custom' ? customColor : activeTheme.accent,
    '--accent-soft': selectedTheme === 'custom' ? '#f4f1ec' : activeTheme.soft,
    '--accent-glow': selectedTheme === 'custom' ? customColor : activeTheme.glow,
    '--shape-radius': '3rem',
    '--theme-texture': activeDesign.texture,
    '--quote-bg': quoteBg
  };

  const toggleFullscreen = useCallback(async () => {
    if (!selectedGameInterfaceRef.current) return;
    try {
      if (document.fullscreenElement === selectedGameInterfaceRef.current) {
        await document.exitFullscreen();
      } else if (!document.fullscreenElement) {
        await selectedGameInterfaceRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(document.fullscreenElement === selectedGameInterfaceRef.current);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const detectInterfaceMode = () => {
      const userAgent = navigator.userAgent || '';
      const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
      const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
      const hasFinePointer = window.matchMedia?.('(pointer: fine)').matches;
      const isNarrowScreen = window.matchMedia?.('(max-width: 767px)').matches;
      const nextMode = isMobileAgent || (hasCoarsePointer && !hasFinePointer) || (hasCoarsePointer && isNarrowScreen) ? 'phone' : 'pc';
      setInterfaceMode(nextMode);
      document.documentElement.dataset.interfaceMode = nextMode;
    };

    detectInterfaceMode();
    window.addEventListener('resize', detectInterfaceMode);
    window.addEventListener('orientationchange', detectInterfaceMode);
    return () => {
      window.removeEventListener('resize', detectInterfaceMode);
      window.removeEventListener('orientationchange', detectInterfaceMode);
    };
  }, []);

  function navigateToTab(tabId) {
    setShowEntryTransition(false);
    setEntryTransitionClosing(false);
    if (tabId === 'design') {
      setCustomizerOpen(true);
      return;
    }
    setActiveTab(tabId);
    if (tabId === 'home') {
      setActiveHomeSection('overview');
    }
    if (tabId === 'unwind') {
      setUnwindViewMode('grid');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (!showEntryTransition) {
      setEntryTransitionClosing(false);
      return undefined;
    }

    const closeTimer = window.setTimeout(() => {
      setEntryTransitionClosing(true);
    }, 520);
    const hideTimer = window.setTimeout(() => {
      setShowEntryTransition(false);
      setEntryTransitionClosing(false);
    }, 860);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [showEntryTransition]);

  function openHomeSection(sectionId = 'overview') {
    const nextSection = homeSectionMap[sectionId] || 'overview';
    setActiveTab('home');
    setActiveHomeSection(nextSection);
    setShowEntryTransition(false);
    setEntryTransitionClosing(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hash = nextSection === 'overview' ? 'home' : nextSection;
      window.history.replaceState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plannerBoard));
  }, [plannerBoard, user]);

  useEffect(() => {
    plannerBoardRef.current = plannerBoard;
  }, [plannerBoard]);

  useEffect(() => {
    importantDatesRef.current = importantDates;
  }, [importantDates]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has('tab') && !currentUrl.searchParams.has('date')) return;
    currentUrl.searchParams.delete('tab');
    currentUrl.searchParams.delete('date');
    window.history.replaceState({}, '', currentUrl.toString());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      setWebPushStatus('This browser does not support service workers for richer push handling.');
      return undefined;
    }
    if (isSandboxPreviewHost(window.location.hostname)) {
      setWebPushStatus('Preview mode skips service worker setup, so richer push delivery stays off here.');
      return undefined;
    }
    let cancelled = false;

    const registerReminderWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}reminder-sw.js`);
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        await navigator.serviceWorker.ready;
        if (!cancelled) {
          setServiceWorkerReady(true);
          setWebPushStatus((current) => (current === 'Push setup not started.' ? 'Service worker is ready for richer reminder delivery.' : current));
        }
      } catch (error) {
        console.error('Reminder service worker registration failed', error);
        if (!cancelled) {
          setWebPushStatus('Service worker registration failed, so richer push delivery is not available yet.');
        }
      }
    };

    void registerReminderWorker();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || notificationPermission !== 'granted') return undefined;
    let unsubscribe = () => {};

    const connectForegroundPush = async () => {
      const messaging = await getMessagingIfSupported();
      if (!messaging) {
        setWebPushStatus('Notifications are allowed, but this browser does not support Firebase web messaging.');
        return;
      }
      unsubscribe = onMessage(messaging, (payload) => {
        const reminderPayload = payload?.data || {};
        const notificationTitle = payload?.notification?.title || reminderPayload.title || 'Lofi Memory reminder';
        const notificationBody = payload?.notification?.body || reminderPayload.body || 'You have an important reminder waiting.';
        void showImportantReminderNotification({
          title: notificationTitle,
          body: notificationBody,
          dateKey: reminderPayload.dateKey || todayISO(),
          reminderType: reminderPayload.reminderType || 'push',
          note: reminderPayload.note || notificationBody,
          time: reminderPayload.time || ''
        });
      });
    };

    void connectForegroundPush();
    return () => unsubscribe();
  }, [notificationPermission]);

  useEffect(() => {
    if (!user || notificationPermission !== 'granted' || !serviceWorkerReady) {
      if (!user) {
        setWebPushTokenReady(false);
      }
      return undefined;
    }
    let cancelled = false;

    const registerWebPushToken = async () => {
      try {
        const messaging = await getMessagingIfSupported();
        if (!messaging) {
          if (!cancelled) {
            setWebPushTokenReady(false);
            setWebPushStatus('Notifications are allowed, but Firebase web messaging is not supported in this browser.');
          }
          return;
        }
        const registration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, { serviceWorkerRegistration: registration });
        if (!token) {
          if (!cancelled) {
            setWebPushTokenReady(false);
            setWebPushStatus('Push delivery needs a configured Firebase web push certificate before fully closed-browser alerts can be sent.');
          }
          return;
        }
        await setDoc(doc(db, 'users', user.uid, 'meta', CLOUD_PUSH_NOTIFICATIONS_DOC_ID), {
          token,
          permission: notificationPermission,
          serviceWorkerReady: true,
          status: 'connected',
          updatedAt: new Date().toISOString()
        });
        if (!cancelled) {
          setWebPushTokenReady(true);
          setWebPushStatus('Real push delivery is connected for this browser. Background messages can now target this journal session.');
        }
      } catch (error) {
        console.error('Web push token registration failed', error);
        await setDoc(doc(db, 'users', user.uid, 'meta', CLOUD_PUSH_NOTIFICATIONS_DOC_ID), {
          permission: notificationPermission,
          serviceWorkerReady,
          status: 'needs_configuration',
          error: error?.message || 'Unknown push setup error',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
        if (!cancelled) {
          setWebPushTokenReady(false);
          setWebPushStatus('Push infrastructure is wired up, but Firebase web push still needs final project configuration before closed-browser delivery will work everywhere.');
        }
      }
    };

    void registerWebPushToken();
    return () => {
      cancelled = true;
    };
  }, [notificationPermission, serviceWorkerReady, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      setPlannerCloudReady(false);
      setImportantDatesCloudReady(false);
      setCloudStatus(currentUser ? 'Cloud sync on' : 'Local mode');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authLoading || user) return;
    setEntries(getInitialEntries());
    setPlannerBoard(getInitialPlannerBoard());
    setImportantDates(getInitialImportantDates());
    setCloudStatus('Local mode');
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return undefined;
    const entriesQuery = query(collection(db, 'users', user.uid, 'entries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      entriesQuery,
      (snapshot) => {
        setEntries(snapshot.docs.map((entryDoc) => {
          const data = entryDoc.data();
          return {
            id: entryDoc.id,
            ...data,
            entryType: data?.entryType === 'journal' ? 'journal' : 'diary'
          };
        }));
        setCloudStatus('Cloud sync on');
      },
      (error) => {
        console.error('Cloud diary sync failed', error);
        setCloudStatus('Cloud sync needs setup');
      }
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    const plannerDocRef = doc(db, 'users', user.uid, 'meta', CLOUD_PLANNER_DOC_ID);
    const unsubscribe = onSnapshot(
      plannerDocRef,
      async (snapshot) => {
        try {
          if (snapshot.exists()) {
            setPlannerBoard(normalizePlannerBoard(snapshot.data()));
          } else {
            const localPlanner = normalizePlannerBoard(plannerBoardRef.current);
            if (localPlanner.text || localPlanner.todos.length) {
              await setDoc(plannerDocRef, { ...localPlanner, updatedAt: new Date().toISOString() });
            }
          }
          setPlannerCloudReady(true);
        } catch (error) {
          console.error('Planner snapshot hydration failed', error);
          setPlannerCloudReady(true);
        }
      },
      (error) => {
        console.error('Planner sync failed', error);
        setPlannerCloudReady(true);
      }
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user || !plannerCloudReady) return;
    const plannerDocRef = doc(db, 'users', user.uid, 'meta', CLOUD_PLANNER_DOC_ID);
    setDoc(plannerDocRef, { ...normalizePlannerBoard(plannerBoard), updatedAt: new Date().toISOString() }).catch((error) => {
      console.error('Could not save planner board', error);
    });
  }, [plannerBoard, plannerCloudReady, user]);

  useEffect(() => {
    if (!user) return undefined;
    const importantDatesDocRef = doc(db, 'users', user.uid, 'meta', CLOUD_IMPORTANT_DATES_DOC_ID);
    const unsubscribe = onSnapshot(
      importantDatesDocRef,
      async (snapshot) => {
        try {
          if (snapshot.exists()) {
            setImportantDates(normalizeImportantDatesRecord(snapshot.data()?.items || snapshot.data()));
          } else {
            const localImportantDates = normalizeImportantDatesRecord(importantDatesRef.current);
            if (Object.keys(localImportantDates).length) {
              await setDoc(importantDatesDocRef, { items: localImportantDates, updatedAt: new Date().toISOString() });
            }
          }
          setImportantDatesCloudReady(true);
        } catch (error) {
          console.error('Important dates snapshot hydration failed', error);
          setImportantDatesCloudReady(true);
        }
      },
      (error) => {
        console.error('Important dates sync failed', error);
        setImportantDatesCloudReady(true);
      }
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user || !importantDatesCloudReady) return;
    const importantDatesDocRef = doc(db, 'users', user.uid, 'meta', CLOUD_IMPORTANT_DATES_DOC_ID);
    setDoc(importantDatesDocRef, { items: normalizeImportantDatesRecord(importantDates), updatedAt: new Date().toISOString() }).catch((error) => {
      console.error('Could not save important dates', error);
    });
  }, [importantDates, importantDatesCloudReady, user]);

  useEffect(() => {
    localStorage.setItem(SEO_STUDIO_API_KEY_STORAGE_KEY, seoStudioApiKey);
  }, [seoStudioApiKey]);

  useEffect(() => {
    localStorage.setItem(SEO_STUDIO_PROMPT_STORAGE_KEY, seoStudioPrompt);
  }, [seoStudioPrompt]);

  useEffect(() => {
    localStorage.setItem(SEO_STUDIO_REPORT_STORAGE_KEY, seoStudioReport);
  }, [seoStudioReport]);

  useEffect(() => {
    localStorage.setItem(SEO_STUDIO_LAST_RUN_STORAGE_KEY, seoStudioLastRun);
  }, [seoStudioLastRun]);

  useEffect(() => {
    localStorage.setItem(ADMIN_VIEW_MODE_STORAGE_KEY, adminViewMode);
  }, [adminViewMode]);

  useEffect(() => {
    localStorage.setItem(WEB_PUSH_STATUS_STORAGE_KEY, webPushStatus);
  }, [webPushStatus]);

  useEffect(() => {
    if (notificationPermission !== 'granted') return;
    if (!user) {
      setWebPushTokenReady(false);
      setWebPushStatus((current) => (current === 'Real push delivery is connected for this browser. Background messages can now target this journal session.' ? current : 'Allow notifications, then sign in to connect true push delivery to your synced journal.'));
    }
  }, [notificationPermission, user]);

  useEffect(() => {
    if (notificationPermission !== 'granted') return;
    setNotificationStatusMessage((current) => {
      if (serviceWorkerReady) {
        return 'Service worker-backed reminders are on. Alerts can surface more like an app, and tapping one will reopen the saved date.';
      }
      if (!current) {
        return 'Browser reminders are on. We will notify for important days today and tomorrow while the journal is open.';
      }
      return current;
    });
  }, [notificationPermission, serviceWorkerReady]);

  useEffect(() => {
    if (!showAdminTools && activeHomeSection === 'seo-studio') {
      setActiveHomeSection('overview');
    }
  }, [activeHomeSection, showAdminTools]);

  useEffect(() => {
    if (!isMasterAdmin) {
      setShowSeoStudioKey(false);
      setSeoStudioCopied(false);
      setSeoStudioModelUsed('');
      setAdminViewMode('master');
    }
  }, [isMasterAdmin]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_WEATHER_STORAGE_KEY, JSON.stringify(customWeathers));
  }, [customWeathers]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_QUOTES_STORAGE_KEY, JSON.stringify(customQuotes));
  }, [customQuotes]);

  useEffect(() => {
    localStorage.setItem(QUOTE_STYLE_STORAGE_KEY, JSON.stringify(quoteStyle));
  }, [quoteStyle]);

  useEffect(() => {
    localStorage.setItem(JOURNAL_STYLE_STORAGE_KEY, JSON.stringify(journalStyle));
  }, [journalStyle]);

  useEffect(() => {
    localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(companion));
  }, [companion]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem(IMPORTANT_DATES_STORAGE_KEY, JSON.stringify(importantDates));
  }, [importantDates, user]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return undefined;
    const checkImportantDateReminders = async () => {
      if (window.Notification.permission !== 'granted') {
        setNotificationPermission(window.Notification.permission);
        return;
      }
      setNotificationPermission('granted');
      const todayKey = todayISO();
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrowKey = tomorrowDate.toISOString().slice(0, 10);
      const nextLog = (() => {
        try {
          const saved = JSON.parse(localStorage.getItem(IMPORTANT_DATES_REMINDER_LOG_KEY) || '{}');
          return typeof saved === 'object' && saved ? saved : {};
        } catch {
          return {};
        }
      })();
      let logChanged = false;
      for (const [dateKey, item] of Object.entries(importantDates)) {
        if (!item?.note || item.remindersEnabled === false) continue;
        let reminderType = '';
        if (dateKey === todayKey) reminderType = 'today';
        if (dateKey === tomorrowKey) reminderType = 'tomorrow';
        if (!reminderType) continue;
        const reminderKey = `${dateKey}:${reminderType}:${item.note}:${item.time || ''}`;
        if (nextLog[reminderKey]) continue;
        const title = reminderType === 'today' ? 'Important event today' : 'Important event tomorrow';
        const timeLabel = item.time ? ` at ${formatReminderTime(item.time)}` : '';
        const body = `${item.note}${timeLabel}${item.details ? `. ${item.details}` : ''}${reminderType === 'tomorrow' ? '. Tomorrow is worth planning for.' : '. It is on your schedule today.'}`;
        await showImportantReminderNotification({
          title,
          body,
          dateKey,
          reminderType,
          note: item.note,
          time: item.time || ''
        });
        nextLog[reminderKey] = new Date().toISOString();
        logChanged = true;
      }
      if (logChanged) {
        const prunedLog = Object.fromEntries(
          Object.entries(nextLog).filter(([key]) => {
            const [loggedDate] = key.split(':');
            return loggedDate >= todayKey;
          })
        );
        localStorage.setItem(IMPORTANT_DATES_REMINDER_LOG_KEY, JSON.stringify(prunedLog));
      }
    };
    void checkImportantDateReminders();
    const interval = window.setInterval(() => {
      void checkImportantDateReminders();
    }, 60000);
    return () => window.clearInterval(interval);
  }, [importantDates]);

  useEffect(() => {
    return enableCompanionResize(companionMediaRef);
  }, [companionSelected, companion.size, companion.x, companion.y, companionIsVideo, companionIsUploadedMedia]);

  useEffect(() => {
    const media = companionMediaRef.current;
    const container = media?.closest('.totoro-container');
    const containerRect = container?.getBoundingClientRect();
    if (!containerRect) return;
    const next = clampCompanionPosition(
      companion.size,
      companion.x || 0,
      companion.y || 0,
      containerRect.width,
      containerRect.height,
      companionIsVideo,
      companionIsUploadedMedia
    );
    if (next.x !== (companion.x || 0) || next.y !== (companion.y || 0)) {
      setCompanion((current) => ({ ...current, x: next.x, y: next.y }));
    }
  }, [companion.size, companion.x, companion.y, companionIsVideo, companionIsUploadedMedia]);

  useEffect(() => {
    const handleWindowMouseDown = (event) => {
      if (companionMediaRef.current && !companionMediaRef.current.contains(event.target)) {
        setCompanionSelected(false);
      }
    };
    window.addEventListener('mousedown', handleWindowMouseDown);
    return () => window.removeEventListener('mousedown', handleWindowMouseDown);
  }, []);

  useEffect(() => {
    return enableImageResize(entryBodyRef, setBody);
  }, []);

  useEffect(() => {
    if (!entryBodyRef.current) return;
    const safeBody = sanitizeJournalHtml(body);
    const currentHtml = entryBodyRef.current.innerHTML.trim();
    if (safeBody !== body) setBody(safeBody);
    if (!currentHtml || currentHtml === '<br>') entryBodyRef.current.innerHTML = safeBody;
  }, [body]);

  useEffect(() => {
    if (isEditingEntry) {
      return enableImageResize(editBodyRef, setEditBody);
    }
    return undefined;
  }, [isEditingEntry]);

  useEffect(() => {
    if (petMood === 'happy' || petMood === 'snack' || petMood === 'yawn') return undefined;
    const moveInterval = window.setInterval(() => {
      setPetPosition((current) => {
        const nextX = Math.max(6, Math.min(88, current.x + (Math.random() * 8 - 4) * petDirection));
        let nextDirection = petDirection;
        if (nextX <= 8 || nextX >= 86) {
          nextDirection = -petDirection;
          setPetDirection(nextDirection);
        }
        const nextY = Math.max(18, Math.min(68, current.y + (Math.random() * 7 - 3.5)));
        if (Math.random() > 0.82) {
          setPetMood('yawn');
          setPetBubble('mrrrp');
          window.setTimeout(() => {
            setPetMood('walking');
            setPetBubble('');
          }, 1200);
        } else if (Math.random() > 0.72) {
          setPetMood('running');
          window.setTimeout(() => setPetMood('walking'), 900);
        }
        return { x: nextX, y: nextY };
      });
    }, 1800);
    return () => window.clearInterval(moveInterval);
  }, [petDirection, petMood]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    localStorage.setItem(DESIGN_STORAGE_KEY, selectedDesign);
    localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, customColor);
    localStorage.setItem(CUSTOM_CD_IMAGE_STORAGE_KEY, customCdImage);
    localStorage.setItem(QUOTE_BG_STORAGE_KEY, quoteBg);
    localStorage.setItem(WALLPAPER_STORAGE_KEY, wallpaperImage);
  }, [selectedTheme, selectedDesign, customColor, customCdImage, quoteBg, wallpaperImage]);

  useEffect(() => {
    localStorage.setItem(COMFORT_MODE_STORAGE_KEY, String(comfortMode));
  }, [comfortMode]);

  const streak = useMemo(() => {
    const dates = new Set(entries.map((entry) => entry.createdAt.slice(0, 10)));
    let count = 0;
    const cursor = new Date(todayISO());
    while (dates.has(cursor.toISOString().slice(0, 10))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [entries]);

  const averageMood = useMemo(() => {
    if (!entries.length) return '—';
    const legacyMoodMap = { 'Grounded': 'Happy', 'Soft': 'Calm', 'Okay': 'Neutral', 'Heavy': 'Sad', 'Stormy': 'Anxious' };
    const score = entries.reduce((sum, entry) => {
      const effectiveMoodLabel = legacyMoodMap[entry.mood] || entry.mood;
      const mood = weatherOptions.find((item) => item.label === effectiveMoodLabel) || weatherOptions.find(m => m.label === entry.mood) || moods[2];
      return sum + mood.value;
    }, 0) / entries.length;
    if (score >= 5.5) return 'Happy';
    if (score >= 4.5) return 'Calm';
    if (score >= 3.5) return 'Neutral';
    if (score >= 2.5) return 'Sad';
    if (score >= 1.5) return 'Anxious';
    return 'Angry';
  }, [entries, weatherOptions]);

  const weeklySummary = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentEntries = entries.filter((entry) => new Date(entry.createdAt) >= sevenDaysAgo);
    if (!recentEntries.length) {
      return 'No pressure to have a streak. One gentle check-in is enough to begin.';
    }
    const counts = recentEntries.reduce((acc, entry) => ({ ...acc, [entry.mood]: (acc[entry.mood] || 0) + 1 }), {});
    const commonMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Calm';
    return `You checked in ${recentEntries.length} time${recentEntries.length === 1 ? '' : 's'} this week. Your most common mood was ${commonMood}.`;
  }, [entries]);

  const seoStudioContext = useMemo(() => ([
    'Brand: Lofi Memory',
    'Canonical: https://lofimemory.vercel.app/',
    'Core positioning: a chill website for listening to lofi music, playing relaxing games such as cozy Solitaire and Minesweeper-style logic games, relaxing online, chill vibes, website to relax, clear your mind, private journal, notes, reminders, and calm online space.',
    'Hero title: Lofi Memory — A relaxing place to play games and listen to music.',
    'Hero summary: Lofi Memory helps visitors listen to lofi music, play relaxing games like Solitaire and cozy block stacking, keep a private online diary, and enjoy a peaceful music room.',
    'Hero support line: The main objective is a calm lofi website for listening to music, relaxing, playing cozy games, and clearing your mind.',
    'Current guide paths: /blog.html, /sitemap.html, /about.html, /contact.html, /article-benefits-of-private-online-diary.html, /article-brain-dumping-sleep.html, /article-daily-word-puzzles-relax.html, /article-digital-journal-distractions.html, /article-how-to-start-journaling-habit.html, /article-journaling-prompts-self-discovery.html, /article-memory-games-cognitive-relief.html, /article-protect-privacy-journaling-online.html, /article-psychology-of-journaling.html, /article-word-guessing-games-busy-mind.html.',
    'Write view framing: A page for your diary. Write today\'s diary page in your own words.',
    'Privacy cues: optional PIN lock, local-first journaling, Google sign-in for sync, entries saved privately per user.',
    `Live product signals: ${entries.length} total entries in this session, ${streak} day streak, average mood ${averageMood}, cloud status ${cloudStatus}.`,
    `Weekly summary: ${weeklySummary}`,
    'Important constraints: suggestions should stay calm, premium, human, non-spammy, and should never disrupt the normal journaling flow for visitors.',
    'Desired output: prioritize high-impact improvements, natural keyword coverage, internal linking ideas, FAQ/schema ideas, and safe homepage or guide-page refinements.'
  ].join('\n')), [averageMood, cloudStatus, entries.length, streak, weeklySummary]);

  const entriesByDate = useMemo(() => entries.reduce((acc, entry) => {
    const key = entry.createdAt.slice(0, 10);
    return { ...acc, [key]: [...(acc[key] || []), entry] };
  }, {}), [entries]);
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const selectedDateEntries = entriesByDate[selectedCalendarDate] || [];
  const selectedDateDiaryEntries = selectedDateEntries.filter((entry) => (entry.entryType || 'diary') === 'diary');
  const selectedDateJournalEntries = selectedDateEntries.filter((entry) => (entry.entryType || 'diary') === 'journal');
  const archiveEntries = useMemo(() => entries.filter((entry) => memoriesCategoryFilter === 'all' || (entry.entryType || 'diary') === memoriesCategoryFilter), [entries, memoriesCategoryFilter]);
  const archiveDiaryEntries = archiveEntries.filter((entry) => (entry.entryType || 'diary') === 'diary');
  const archiveJournalEntries = archiveEntries.filter((entry) => (entry.entryType || 'diary') === 'journal');
  const selectedImportantDate = importantDates[selectedCalendarDate] || null;
  const selectedCalendarForecast = calendarForecastByDate[selectedCalendarDate] || null;
  const selectedCalendarForecastVisuals = getForecastVisuals(selectedCalendarForecast);

  const loadCalendarForecast = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setCalendarForecastPermission('unsupported');
      setCalendarForecastStatus('Location-based weather is not available in this browser.');
      return;
    }

    setCalendarForecastPermission('loading');
    setCalendarForecastStatus('Checking your location for a local forecast...');

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,cloud_cover_mean&timezone=auto&forecast_days=8`;
        const reverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}&language=en&format=json`;
        const [forecastResponse, reverseResponse] = await Promise.all([
          fetch(forecastUrl),
          fetch(reverseUrl).catch(() => null)
        ]);

        if (!forecastResponse.ok) {
          throw new Error('Forecast request failed');
        }

        const forecastPayload = await forecastResponse.json();
        const reversePayload = reverseResponse?.ok ? await reverseResponse.json() : null;
        const resolvedPlace = reversePayload?.results?.[0];
        const resolvedName = resolvedPlace?.city || resolvedPlace?.town || resolvedPlace?.village || resolvedPlace?.county || 'Near you';

        let forecastByDate = buildForecastByDate(forecastPayload.daily);
        if (isSingaporeForecastLocation(coords)) {
          const googleRef = buildGoogleWeatherReferenceForecast(todayISO());
          forecastByDate = { ...forecastByDate, ...googleRef };
        }

        setCalendarForecastByDate(forecastByDate);
        setCalendarForecastLocation(resolvedName);
        setCalendarForecastPermission('granted');
        setCalendarForecastStatus(`Forecast ready for ${resolvedName}.`);
      } catch {
        setCalendarForecastPermission('error');
        setCalendarForecastStatus('We could not load the local forecast right now. Try again in a moment.');
      }
    }, (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setCalendarForecastPermission('denied');
        setCalendarForecastStatus('Location access is off, so the calendar forecast is waiting for permission.');
        return;
      }

      setCalendarForecastPermission('error');
      setCalendarForecastStatus('We could not read your location just now. Try again when the signal feels steadier.');
    }, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 1000 * 60 * 30
    });
  }, []);

  useEffect(() => {
    if (activeTab !== 'memories' || calendarForecastPermission !== 'idle') {
      return;
    }

    if (Object.keys(calendarForecastByDate).length > 0) {
      return;
    }

    loadCalendarForecast();
  }, [activeTab, calendarForecastByDate, calendarForecastPermission, loadCalendarForecast]);
  const importantDateCount = useMemo(() => Object.keys(importantDates).length, [importantDates]);
  const upcomingImportantDates = useMemo(() => Object.entries(importantDates)
    .map(([dateKey, item]) => ({
      dateKey,
      note: item?.note || '',
      details: item?.details || '',
      time: item?.time || '',
      remindersEnabled: item?.remindersEnabled !== false,
      createdAt: item?.createdAt || '',
      date: getReminderDate(dateKey, item?.time || ''),
      relativeLabel: getRelativeReminderLabel(dateKey)
    }))
    .filter((item) => item.note && item.date.getTime() >= getReminderDate(todayISO()).getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime()), [importantDates]);
  const upcomingReminderPreview = upcomingImportantDates.slice(0, 4);
  const upcomingReminderCount = upcomingImportantDates.length;
  const nextUpcomingReminder = upcomingImportantDates[0] || null;
  const plannerStorageLabel = user ? (plannerCloudReady ? 'Synced with your account' : 'Syncing notes to your account') : 'Auto-saved on this device';
  const reminderStorageLabel = user ? (importantDatesCloudReady ? 'Synced with your account' : 'Syncing reminders to your account') : 'Stored on this device';
  const reminderDeliveryLabel = webPushTokenReady ? 'True push connected' : serviceWorkerReady ? 'Push-ready worker' : 'Browser alerts only';
  const reminderBehaviorLabel = webPushTokenReady ? 'Can target closed-browser messages' : serviceWorkerReady ? 'Tap opens the saved date' : 'Best while the journal stays open';

  const rewardLevel = useMemo(() => {
    if (entries.length >= 30) return { title: 'Moon Keeper', emoji: '🌙', next: 'Your quiet archive is glowing.' };
    if (entries.length >= 14) return { title: 'Kindness', emoji: '🌷', next: `${30 - entries.length} more pages until Moon Keeper.` };
    if (entries.length >= 7) return { title: 'Weekly Spark', emoji: '✨', next: `${14 - entries.length} more pages until Kindness.` };
    if (entries.length >= 3) return { title: 'Seedling', emoji: '🌱', next: `${7 - entries.length} more pages until Weekly Spark.` };
    return { title: 'Starter', emoji: '☁️', next: `${Math.max(3 - entries.length, 1)} more pages until Seedling.` };
  }, [entries.length]);

  const draftText = useMemo(() => getPlainTextFromHtml(body), [body]);
  const draftWordCount = useMemo(() => {
    const trimmed = draftText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [draftText]);
  const plannerTodoCount = plannerBoard.todos.length;
  const completedPlannerTodoCount = plannerBoard.todos.filter((todo) => todo.status === 'done').length;
  const inProgressPlannerTodoCount = plannerBoard.todos.filter((todo) => todo.status === 'doing').length;
  const openPlannerTodoCount = plannerBoard.todos.filter((todo) => todo.status !== 'done').length;
  const overduePlannerTodoCount = plannerBoard.todos.filter((todo) => isPlannerTodoOverdue(todo)).length;
  const filteredPlannerTodos = useMemo(() => plannerBoard.todos.filter((todo) => {
    if (plannerTodoFilter === 'open') return todo.status !== 'done';
    if (plannerTodoFilter === 'doing') return todo.status === 'doing';
    if (plannerTodoFilter === 'done') return todo.status === 'done';
    if (plannerTodoFilter === 'high') return todo.priority === 'high';
    return true;
  }), [plannerBoard.todos, plannerTodoFilter]);
  const plannerNoteWordCount = useMemo(() => {
    const trimmed = plannerBoard.text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [plannerBoard.text]);
  const plannerNoteLineCount = useMemo(() => plannerBoard.text.split('\n').filter((line) => line.trim()).length, [plannerBoard.text]);
  const plannerNoteSearchCount = useMemo(() => {
    const query = plannerNoteSearch.trim().toLowerCase();
    if (!query) return 0;
    return plannerBoard.text.toLowerCase().split(query).length - 1;
  }, [plannerBoard.text, plannerNoteSearch]);
  const plannerQuickTemplates = [
    '## Today\n- ',
    '## Ideas dump\n- ',
    '## Shopping / errands\n- ',
    '## Study / work\n- ',
    `## ${new Date().toLocaleDateString()}\n- `
  ];
  const RADIO_DIAL_START = 225;
  const RADIO_DIAL_SWEEP = 270;
  const RADIO_DIAL_END = (RADIO_DIAL_START + RADIO_DIAL_SWEEP) % 360;
  const isRadioDialFeedbackVisible = isRadioDialDragging || showRadioDialFeedback;
  const radioDialSweepDegrees = (radioVolume / 100) * RADIO_DIAL_SWEEP;
  const radioDialDegrees = RADIO_DIAL_START + radioDialSweepDegrees;
  const activeBreatheRoom = useMemo(() => breatheRoomOptions.find((room) => room.id === selectedBreatheRoom) || breatheRoomOptions[0], [selectedBreatheRoom]);
  const entryTransitionWallpaper = wallpaperImage || activeBreatheRoom.wallpaper || lofiMemoryHeaderImage;
  const entryWelcomeTheme = activeBreatheRoom.id === 'maple'
    ? {
        eyebrow: 'MapleStory Theme',
        heading: 'A dreamy MapleStory corner.',
        copy: 'Warm nostalgia, soft glow, and a cozy little world waiting for you.',
        shellClass: 'border-[#ffd7b2]/28 bg-[linear-gradient(145deg,rgba(52,33,24,0.8),rgba(93,64,46,0.58))]',
        accentClass: 'bg-[linear-gradient(90deg,#ffd6b0_0%,#e2aa78_42%,#9e765e_100%)]',
        dotClass: 'bg-[#ffd5ae]',
        orbClass: 'bg-[#ffd7bc]/20'
      }
    : activeBreatheRoom.id === 'rain'
      ? {
          eyebrow: 'Rain Window',
          heading: 'A softer rainy little hideaway.',
          copy: 'Slow breaths, gentle ambience, and a calm page to settle into.',
          shellClass: 'border-[#cde2eb]/24 bg-[linear-gradient(145deg,rgba(24,36,46,0.78),rgba(48,69,82,0.56))]',
          accentClass: 'bg-[linear-gradient(90deg,#d8eef6_0%,#90bfd0_45%,#5d8390_100%)]',
          dotClass: 'bg-[#d8eef6]',
          orbClass: 'bg-[#a8d4e1]/18'
        }
      : activeBreatheRoom.id === 'fire'
        ? {
            eyebrow: 'Fireplace Nook',
            heading: 'A warm nook for slower evenings.',
            copy: 'Soft crackle, amber light, and a cozy space to unwind for a bit.',
            shellClass: 'border-[#f2c6a1]/24 bg-[linear-gradient(145deg,rgba(52,29,20,0.8),rgba(88,54,35,0.58))]',
            accentClass: 'bg-[linear-gradient(90deg,#ffd4a3_0%,#e89a63_40%,#9f5e43_100%)]',
            dotClass: 'bg-[#ffd6af]',
            orbClass: 'bg-[#f1b989]/18'
          }
        : {
            eyebrow: 'Lofi Desk',
            heading: 'Settle into your cozy corner.',
            copy: 'Music, games, journaling, and memories — all in one gentle place.',
            shellClass: 'border-white/18 bg-[linear-gradient(145deg,rgba(34,25,18,0.76),rgba(67,49,34,0.52))]',
            accentClass: 'bg-[linear-gradient(90deg,#f7d0a7_0%,#d9a87c_38%,#a98467_100%)]',
            dotClass: 'bg-[#f8d6b3]',
            orbClass: 'bg-[#f8d7b8]/16'
          };

  const scheduleRadioDialFeedbackHide = (delay = 850) => {
    if (radioDialFeedbackTimeoutRef.current) {
      clearTimeout(radioDialFeedbackTimeoutRef.current);
    }

    if (delay <= 0) {
      setShowRadioDialFeedback(false);
      radioDialFeedbackTimeoutRef.current = null;
      return;
    }

    radioDialFeedbackTimeoutRef.current = window.setTimeout(() => {
      setShowRadioDialFeedback(false);
      radioDialFeedbackTimeoutRef.current = null;
    }, delay);
  };

  const revealRadioDialFeedback = (delay = 850) => {
    setShowRadioDialFeedback(true);
    scheduleRadioDialFeedbackHide(delay);
  };

  const getShortestAngleDistance = (from, to) => {
    const diff = Math.abs(from - to) % 360;
    return diff > 180 ? 360 - diff : diff;
  };

  const updateRadioVolumeFromPointer = (event) => {
    const dial = radioDialRef.current;
    if (!dial) return;

    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const angle = Math.atan2(dy, dx) + Math.PI / 2;
    const normalizedAngle = ((angle < 0 ? angle + Math.PI * 2 : angle) * 180) / Math.PI;
    const shiftedAngle = (normalizedAngle - RADIO_DIAL_START + 360) % 360;

    if (shiftedAngle <= RADIO_DIAL_SWEEP) {
      setRadioVolume(Math.round((shiftedAngle / RADIO_DIAL_SWEEP) * 100));
      return;
    }

    const distanceToStart = getShortestAngleDistance(normalizedAngle, RADIO_DIAL_START);
    const distanceToEnd = getShortestAngleDistance(normalizedAngle, RADIO_DIAL_END);
    setRadioVolume(distanceToStart <= distanceToEnd ? 0 : 100);
  };

  const handleRadioDialThumbPointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    radioDialPointerIdRef.current = event.pointerId;
    if (radioDialFeedbackTimeoutRef.current) {
      clearTimeout(radioDialFeedbackTimeoutRef.current);
      radioDialFeedbackTimeoutRef.current = null;
    }
    setShowRadioDialFeedback(true);
    setIsRadioDialDragging(true);
  };

  useEffect(() => {
    return () => {
      if (radioDialFeedbackTimeoutRef.current) {
        clearTimeout(radioDialFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRadioDialDragging) return undefined;

    const handlePointerMove = (event) => {
      if (radioDialPointerIdRef.current !== null && event.pointerId !== radioDialPointerIdRef.current) return;
      updateRadioVolumeFromPointer(event);
    };

    const stopDragging = (event) => {
      if (radioDialPointerIdRef.current !== null && event.pointerId !== radioDialPointerIdRef.current) return;
      radioDialPointerIdRef.current = null;
      setIsRadioDialDragging(false);
      revealRadioDialFeedback();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [isRadioDialDragging]);

  useEffect(() => {
    if (!isRadioPlaying) {
      setRadioStatusMessage('Lofi radio paused');
      if (radioPlayerRef.current?.pauseVideo) {
        try {
          radioPlayerRef.current.pauseVideo();
        } catch {}
      }
      return;
    }

    let cancelled = false;

    const loadYouTubeApi = () => new Promise((resolve) => {
      if (window.YT?.Player) {
        resolve(window.YT);
        return;
      }

      const existingScript = document.querySelector('script[data-lofi-youtube-api="true"]');
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve(window.YT);
      };

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.lofiYoutubeApi = 'true';
        document.body.appendChild(script);
      }
    });

    loadYouTubeApi().then((YT) => {
      if (cancelled || !radioPlayerContainerRef.current) return;

      if (!radioPlayerRef.current) {
        radioPlayerRef.current = new YT.Player(radioPlayerContainerRef.current, {
          height: '1',
          width: '1',
          videoId: 'rFZHOHl-L8A',
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            playsinline: 1,
            loop: 1,
            playlist: 'rFZHOHl-L8A'
          },
          events: {
            onReady: (event) => {
              setRadioStatusMessage(`Starting ${radioNowPlayingRef.current}`);
              try {
                event.target.setVolume(radioVolume);
                if (radioUnlockedRef.current) {
                  event.target.unMute?.();
                } else {
                  event.target.mute?.();
                }
                event.target.playVideo();
                setRadioNeedsInteraction(!radioUnlockedRef.current);
                setRadioStatusMessage(radioUnlockedRef.current ? `${radioNowPlayingRef.current} playing` : `${radioNowPlayingRef.current} live — tap once for sound`);
              } catch {
                setRadioNeedsInteraction(true);
                setRadioStatusMessage('Tap once for sound');
              }
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                try {
                  event.target.seekTo(0);
                  event.target.playVideo();
                  setRadioStatusMessage(`${radioNowPlayingRef.current} looping`);
                } catch {}
                return;
              }

              if (event.data === YT.PlayerState.PLAYING) {
                setRadioNeedsInteraction(!radioUnlockedRef.current);
                setRadioStatusMessage(radioUnlockedRef.current ? `${radioNowPlayingRef.current} playing` : `${radioNowPlayingRef.current} live — tap once for sound`);
              }
            },
            onAutoplayBlocked: () => {
              setRadioNeedsInteraction(true);
              setRadioStatusMessage(`Tap once to turn on ${radioNowPlayingRef.current}`);
              try {
                radioPlayerRef.current?.mute?.();
                radioPlayerRef.current?.playVideo?.();
              } catch {}
            }
          }
        });
        return;
      }

      try {
        if (radioUnlockedRef.current) {
          radioPlayerRef.current.unMute?.();
        } else {
          radioPlayerRef.current.mute?.();
        }
        radioPlayerRef.current.setVolume?.(radioVolume);
        radioPlayerRef.current.playVideo?.();
        setRadioNeedsInteraction(!radioUnlockedRef.current);
        setRadioStatusMessage(radioUnlockedRef.current ? `${radioNowPlayingRef.current} playing` : `${radioNowPlayingRef.current} live — tap once for sound`);
      } catch {
        setRadioNeedsInteraction(true);
        setRadioStatusMessage('Tap once for sound');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isRadioPlaying, radioVolume]);

  useEffect(() => {
    if (!isRadioPlaying) {
      return undefined;
    }

    const unlockRadio = () => {
      radioUnlockedRef.current = true;
      setRadioNeedsInteraction(false);
      if (!radioPlayerRef.current) {
        setRadioStatusMessage(`${radioNowPlayingRef.current} waking up`);
        return;
      }

      try {
        radioPlayerRef.current.unMute?.();
        radioPlayerRef.current.setVolume?.(radioVolume);
        radioPlayerRef.current.playVideo?.();
        setRadioStatusMessage(`${radioNowPlayingRef.current} playing`);
      } catch {}
    };

    window.addEventListener('pointerdown', unlockRadio, { once: true });
    window.addEventListener('touchstart', unlockRadio, { once: true });
    window.addEventListener('keydown', unlockRadio, { once: true });
    window.addEventListener('focus', unlockRadio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockRadio);
      window.removeEventListener('touchstart', unlockRadio);
      window.removeEventListener('keydown', unlockRadio);
      window.removeEventListener('focus', unlockRadio);
    };
  }, [isRadioPlaying, radioVolume]);

  useEffect(() => {
    if (radioPlayerRef.current?.setVolume) {
      try {
        radioPlayerRef.current.setVolume(radioVolume);
      } catch {}
    }
  }, [radioVolume]);
  const weeklyGoal = 5;
  const weeklyCheckIns = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    return entries.filter((entry) => new Date(entry.createdAt) >= sevenDaysAgo).length;
  }, [entries]);
  const entriesToNextReward = useMemo(() => {
    if (entries.length >= 30) return 0;
    if (entries.length >= 14) return 30 - entries.length;
    if (entries.length >= 7) return 14 - entries.length;
    if (entries.length >= 3) return 7 - entries.length;
    return Math.max(3 - entries.length, 0);
  }, [entries.length]);
  const journalQuest = useMemo(() => ([
    { label: 'Notice how today feels', done: Boolean(selectedMood) },
    { label: 'Give today\'s page a simple title', done: Boolean(title.trim() || draftText) },
    { label: 'Keep one honest detail', done: draftText.length >= 40 }
  ]), [draftText, selectedMood, title]);
  const completedQuestCount = journalQuest.filter((step) => step.done).length;
  const journalNudge = useMemo(() => {
    if (streak >= 7) return 'You have made this space feel familiar now. Let your diary stay warm and steady, never pressured.';
    if (weeklyCheckIns >= weeklyGoal) return 'You have already given yourself enough attention this week. Anything extra can simply be a small diary note for yourself.';
    if (selectedMood === 'Angry') return 'Anger belongs here too. Try naming what felt unfair, crossed a line, or asked for more care than you had to give.';
    if (selectedMood === 'Anxious' || selectedMood === 'Sad') return 'Let this page stay soft. A short diary entry can help you release a feeling without needing to explain everything.';
    if (draftText.length >= 40) return 'There is already something worth keeping here. Add one more detail only if it feels right.';
    return 'You do not need to write a lot. A title, one line, or one honest sentence is already enough for today\'s diary page.';
  }, [draftText.length, selectedMood, streak, weeklyCheckIns]);
  const latestEntry = entries[0] || null;
  const latestEntrySnippet = useMemo(() => {
    if (!latestEntry) return 'Your first entry can be one honest line. Start with the part that feels easiest to say.';
    const plainText = getPlainTextFromHtml(latestEntry.body || '');
    const source = plainText || latestEntry.title || 'A quiet page is waiting for you.';
    return source.length > 120 ? `${source.slice(0, 117).trim()}…` : source;
  }, [latestEntry]);
  const returnRitual = useMemo(() => {
    if (!latestEntry) {
      return {
        eyebrow: 'Welcome ritual',
        title: 'Your first page is ready.',
        text: 'Choose an atmosphere, name the moment, and let one honest line land.'
      };
    }
    if (streak >= 7) {
      return {
        eyebrow: 'Welcome back',
        title: `${streak} soft days in a row`,
        text: latestEntrySnippet
      };
    }
    return {
      eyebrow: `Last kept on ${formatDate(latestEntry.createdAt)}`,
      title: latestEntry.title || 'A recent reflection',
      text: latestEntrySnippet
    };
  }, [latestEntry, latestEntrySnippet, streak]);
  const hasImageMemory = useMemo(() => entries.some((entry) => /<img/i.test(entry.body || '')), [entries]);
  const achievementBadges = useMemo(() => ([
    {
      id: 'first-entry',
      emoji: '🌱',
      title: 'First Light',
      unlocked: entries.length >= 1,
      hint: entries.length >= 1 ? 'Your journal has begun.' : 'Save your first reflection.'
    },
    {
      id: 'streak',
      emoji: '🔥',
      title: 'Soft Streak',
      unlocked: streak >= 3,
      hint: streak >= 3 ? `${streak} days in a row.` : `${Math.max(3 - streak, 1)} more day${Math.max(3 - streak, 1) === 1 ? '' : 's'} to unlock.`
    },
    {
      id: 'weekly',
      emoji: '🌷',
      title: 'Weekly Bloom',
      unlocked: weeklyCheckIns >= weeklyGoal,
      hint: weeklyCheckIns >= weeklyGoal ? 'You filled this week with gentle check-ins.' : `${Math.max(weeklyGoal - weeklyCheckIns, 1)} more check-in${Math.max(weeklyGoal - weeklyCheckIns, 1) === 1 ? '' : 's'} this week.`
    },
    {
      id: 'memory',
      emoji: '📚',
      title: 'Memory Keeper',
      unlocked: entries.length >= 10,
      hint: entries.length >= 10 ? 'A fuller archive is taking shape.' : `${Math.max(10 - entries.length, 1)} more entries to build your archive.`
    },
    {
      id: 'image',
      emoji: '🖼️',
      title: 'Snapshot Saver',
      unlocked: hasImageMemory,
      hint: hasImageMemory ? 'You saved a visual memory.' : 'Add one photo to unlock this badge.'
    },
    {
      id: 'custom-mood',
      emoji: '💫',
      title: 'Mood Maker',
      unlocked: customWeathers.length > 0,
      hint: customWeathers.length > 0 ? 'Your personal mood palette is live.' : 'Create one custom mood to unlock.'
    }
  ]), [customWeathers.length, entries, hasImageMemory, streak, weeklyCheckIns]);
  const unlockedAchievementCount = achievementBadges.filter((badge) => badge.unlocked).length;
  const nextAchievement = achievementBadges.find((badge) => !badge.unlocked) || achievementBadges[achievementBadges.length - 1];

  async function runSeoStudioReview() {
    if (!isMasterAdmin) {
      setSeoStudioError('Sign in with the master email to open the admin SEO studio.');
      return;
    }
    if (!seoStudioApiKey.trim()) {
      setSeoStudioError('Add a Gemini API key first. It stays only in this browser.');
      return;
    }

    setSeoStudioLoading(true);
    setSeoStudioError('');
    setSeoStudioCopied(false);
    setSeoStudioModelUsed('');

    try {
      const prompt = [
        'You are helping improve Lofi Memory, a calm private online diary website.',
        'Return a concise markdown report with these sections:',
        '1. Quick verdict',
        '2. Highest-impact next actions',
        '3. Homepage copy improvements',
        '4. Meta/schema/internal-link ideas',
        '5. New guide page opportunities',
        '6. What not to change too often',
        'Keep the advice practical, calm in tone, and non-disruptive to users.',
        '',
        `Owner request: ${seoStudioPrompt.trim() || DEFAULT_SEO_STUDIO_PROMPT}`,
        '',
        'Website context:',
        seoStudioContext
      ].join('\n');

      const modelCandidates = [
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro-latest'
      ];

      let lastErrorMessage = 'The AI review could not be completed.';
      let reportText = '';

      for (const modelName of modelCandidates) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(seoStudioApiKey.trim())}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              topP: 0.9,
              maxOutputTokens: 1400
            }
          })
        });

        const data = await response.json();
        if (!response.ok) {
          lastErrorMessage = data?.error?.message || `The AI request failed for ${modelName}.`;
          continue;
        }

        reportText = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim();
        if (reportText) {
          setSeoStudioModelUsed(modelName);
          break;
        }

        lastErrorMessage = `The AI returned an empty report for ${modelName}.`;
      }

      if (!reportText) {
        throw new Error(lastErrorMessage);
      }

      setSeoStudioReport(reportText);
      setSeoStudioLastRun(new Date().toLocaleString());
    } catch (error) {
      console.error('SEO studio review failed', error);
      setSeoStudioError(error.message || 'The AI review could not be completed.');
    } finally {
      setSeoStudioLoading(false);
    }
  }

  async function copySeoStudioReport() {
    if (!seoStudioReport.trim()) return;
    try {
      await navigator.clipboard.writeText(seoStudioReport);
      setSeoStudioCopied(true);
      window.setTimeout(() => setSeoStudioCopied(false), 2400);
    } catch (error) {
      console.error('Could not copy SEO report', error);
      setSeoStudioError('Could not copy the SEO report from this browser.');
    }
  }

  function clearSeoStudioReport() {
    setSeoStudioReport('');
    setSeoStudioLastRun('');
    setSeoStudioError('');
    setSeoStudioCopied(false);
    setSeoStudioModelUsed('');
  }

  async function signInWithGoogle() {
    try {
      setCloudStatus('Opening Google sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      if (entries.length) {
        await Promise.all(
          entries.map((entry) => setDoc(doc(db, 'users', result.user.uid, 'entries', entry.id), entry, { merge: true }))
        );
      }
      setCloudStatus('Cloud sync on');
    } catch (error) {
      console.error('Google sign-in failed', error);
      setCloudStatus('Sign-in was cancelled or blocked');
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      setEntries(getInitialEntries());
      setCloudStatus('Local mode');
    } catch (error) {
      console.error('Sign out failed', error);
      setCloudStatus('Could not sign out');
    }
  }

  async function saveEntry(event) {
    event.preventDefault();
    const safeBody = sanitizeJournalHtml(body);
    const safeBodyText = getPlainTextFromHtml(safeBody);
    if (!safeBodyText && !title.trim()) return;
    const entry = {
      id: crypto.randomUUID(),
      title: title.trim() || activePrompt,
      body: safeBody,
      mood: selectedMood,
      prompt: activePrompt,
      entryType: writingCategory,
      createdAt: new Date().toISOString()
    };
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'entries', entry.id), entry);
        setCloudStatus('Saved to cloud');
      } catch (error) {
        console.error('Could not save cloud entry', error);
        setCloudStatus('Cloud save failed');
      }
    } else {
      setEntries((currentEntries) => [entry, ...currentEntries]);
    }
    setSaveReward(rewardMessages[Math.floor(Math.random() * rewardMessages.length)]);
    window.setTimeout(() => setSaveReward(''), 4200);
    setTitle('');
    setBody('');
    if (entryBodyRef.current) entryBodyRef.current.innerHTML = '';
    setActivePrompt(prompts[(prompts.indexOf(activePrompt) + 1) % prompts.length]);
    setSelectedMood('Calm');
  }

  function addPlannerTodo(event) {
    event.preventDefault();
    const trimmed = plannerTodoDraft.trim();
    if (!trimmed) return;
    setPlannerBoard((current) => ({
      ...current,
      todos: [normalizePlannerTodo({
        id: crypto.randomUUID(),
        text: trimmed,
        status: 'todo',
        priority: plannerTodoPriorityDraft,
        dueDate: plannerTodoDueDateDraft,
        recurrence: plannerTodoRecurrenceDraft
      }), ...current.todos]
    }));
    setPlannerTodoDraft('');
    setPlannerTodoPriorityDraft('medium');
    setPlannerTodoDueDateDraft('');
    setPlannerTodoRecurrenceDraft('none');
  }

  function cyclePlannerTodoStatus(id) {
    setPlannerBoard((current) => ({
      ...current,
      todos: current.todos.flatMap((todo) => {
        if (todo.id !== id) return [todo];
        const nextStatus = todo.status === 'todo' ? 'doing' : todo.status === 'doing' ? 'done' : 'todo';
        const updatedTodo = normalizePlannerTodo({ ...todo, status: nextStatus });
        if (nextStatus !== 'done' || todo.recurrence === 'none') return [updatedTodo];
        const nextDueDate = getNextPlannerDueDate(todo.dueDate || todayISO(), todo.recurrence);
        return [updatedTodo, normalizePlannerTodo({
          ...todo,
          id: crypto.randomUUID(),
          status: 'todo',
          done: false,
          dueDate: nextDueDate
        })];
      })
    }));
  }

  function cyclePlannerTodoPriority(id) {
    setPlannerBoard((current) => ({
      ...current,
      todos: current.todos.map((todo) => {
        if (todo.id !== id) return todo;
        const nextPriority = todo.priority === 'low' ? 'medium' : todo.priority === 'medium' ? 'high' : 'low';
        return normalizePlannerTodo({ ...todo, priority: nextPriority });
      })
    }));
  }

  function startEditingPlannerTodo(todo) {
    setEditingPlannerTodoId(todo.id);
    setEditingPlannerTodoText(todo.text);
    setEditingPlannerTodoPriority(todo.priority);
    setEditingPlannerTodoDueDate(todo.dueDate || '');
    setEditingPlannerTodoRecurrence(todo.recurrence || 'none');
  }

  function cancelEditingPlannerTodo() {
    setEditingPlannerTodoId(null);
    setEditingPlannerTodoText('');
    setEditingPlannerTodoPriority('medium');
    setEditingPlannerTodoDueDate('');
    setEditingPlannerTodoRecurrence('none');
  }

  function savePlannerTodoEdit(id) {
    const trimmed = editingPlannerTodoText.trim();
    if (!trimmed) return;
    setPlannerBoard((current) => ({
      ...current,
      todos: current.todos.map((todo) => todo.id === id
        ? normalizePlannerTodo({
          ...todo,
          text: trimmed,
          priority: editingPlannerTodoPriority,
          dueDate: editingPlannerTodoDueDate,
          recurrence: editingPlannerTodoRecurrence
        })
        : todo)
    }));
    cancelEditingPlannerTodo();
  }

  function reorderPlannerTodo(activeId, targetId) {
    if (!activeId || !targetId || activeId === targetId) return;
    setPlannerBoard((current) => {
      const todos = [...current.todos];
      const activeIndex = todos.findIndex((todo) => todo.id === activeId);
      const targetIndex = todos.findIndex((todo) => todo.id === targetId);
      if (activeIndex < 0 || targetIndex < 0) return current;
      const [movedTodo] = todos.splice(activeIndex, 1);
      todos.splice(targetIndex, 0, movedTodo);
      return { ...current, todos };
    });
  }

  function movePlannerTodo(id, direction) {
    setPlannerBoard((current) => {
      const todos = [...current.todos];
      const currentIndex = todos.findIndex((todo) => todo.id === id);
      const nextIndex = currentIndex + direction;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= todos.length) return current;
      const [movedTodo] = todos.splice(currentIndex, 1);
      todos.splice(nextIndex, 0, movedTodo);
      return { ...current, todos };
    });
  }

  function clearCompletedPlannerTodos() {
    setPlannerBoard((current) => ({
      ...current,
      todos: current.todos.filter((todo) => todo.status !== 'done')
    }));
  }

  function deletePlannerTodo(id) {
    if (editingPlannerTodoId === id) cancelEditingPlannerTodo();
    setPlannerBoard((current) => ({
      ...current,
      todos: current.todos.filter((todo) => todo.id !== id)
    }));
  }

  async function deleteEntry(id) {
    setEntries(entries.filter((entry) => entry.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
      setIsEditingEntry(false);
    }
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'entries', id));
        setCloudStatus('Deleted from cloud');
      } catch (error) {
        console.error('Could not delete cloud entry', error);
        setCloudStatus('Cloud delete failed');
      }
    }
  }

  function startEditingEntry() {
    if (!selectedEntry) return;
    setEditTitle(selectedEntry.title);
    setEditBody(sanitizeJournalHtml(selectedEntry.body || ''));
    setEditMood(selectedEntry.mood);
    setIsEditingEntry(true);
    window.setTimeout(() => {
      if (editBodyRef.current) {
        editBodyRef.current.innerHTML = sanitizeJournalHtml(selectedEntry.body || '');
      }
    }, 0);
  }

  async function saveEditedEntry() {
    if (!selectedEntry) return;
    const editor = editBodyRef.current;
    const finalBody = sanitizeJournalHtml(editor?.innerHTML ?? editBody);
    const updated = {
      ...selectedEntry,
      title: editTitle.trim() || 'Untitled moment',
      body: finalBody,
      mood: editMood,
      entryType: selectedEntry.entryType || 'diary'
    };
    setEntries((currentEntries) => currentEntries.map((entry) => entry.id === selectedEntry.id ? updated : entry));
    setSelectedEntry(updated);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'entries', selectedEntry.id), updated);
        setCloudStatus('Updated in cloud');
      } catch (error) {
        console.error('Could not update cloud entry', error);
        setCloudStatus('Cloud update failed');
      }
    }
    setIsEditingEntry(false);
  }

  function handleWeatherImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCustomWeatherImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  function handleCustomCdImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rawImage = String(reader.result || '');
      if (!rawImage || file.type === 'image/gif') {
        setCustomCdImage(rawImage);
        return;
      }
      const image = new Image();
      image.onload = () => {
        const maxSide = 720;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          setCustomCdImage(rawImage);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setCustomCdImage(canvas.toDataURL('image/jpeg', 0.88));
      };
      image.onerror = () => setCustomCdImage(rawImage);
      image.src = rawImage;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function removeCustomCdImage() {
    setCustomCdImage('');
  }

  function handleWallpaperImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rawImage = String(reader.result || '');
      if (!rawImage || file.type === 'image/gif') {
        setWallpaperImage(rawImage);
        return;
      }
      const image = new Image();
      image.onload = () => {
        const maxSide = 1800;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          setWallpaperImage(rawImage);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setWallpaperImage(canvas.toDataURL('image/jpeg', 0.86));
      };
      image.onerror = () => setWallpaperImage(rawImage);
      image.src = rawImage;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function removeWallpaperImage() {
    setWallpaperImage('');
  }

  function insertTextAtCursor(text) {
    const editor = entryBodyRef.current;
    if (!editor) {
      setBody((current) => current + text);
      return;
    }
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      editor.append(document.createTextNode(text));
    } else {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setBody(editor.innerHTML);
  }

  function insertTextInEditor(editor, text) {
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      editor.append(document.createTextNode(text));
    } else {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function applyEditorCommand(editorRef, updateBody, command) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) return;
    document.execCommand(command);
    updateBody(editor.innerHTML);
  }

  function toggleBulletList(editorRef, updateBody) {
    applyEditorCommand(editorRef, updateBody, 'insertUnorderedList');
  }

  function toggleBoldText(editorRef, updateBody) {
    applyEditorCommand(editorRef, updateBody, 'bold');
  }

  function toggleUnderlineText(editorRef, updateBody) {
    applyEditorCommand(editorRef, updateBody, 'underline');
  }

  function insertImageInEditor(editor, src) {
    if (!editor) return;
    editor.focus();
    const img = document.createElement('img');
    img.src = src;
    img.className = 'journal-inline-img';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '1rem auto';
    img.style.borderRadius = '1rem';
    img.style.position = 'relative';
    img.style.transform = 'translate(0px, 0px)';
    img.draggable = false;
    img.alt = 'Journal photo';
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editor.appendChild(img);
    }
    const br = document.createElement('br');
    img.after(br);
  }

  function insertQuickEmoji(emoji) {
    insertTextAtCursor(`${emoji} `);
  }

  function insertEditQuickEmoji(emoji) {
    insertTextInEditor(editBodyRef.current, `${emoji} `);
    setEditBody(editBodyRef.current?.innerHTML || editBody);
  }

  function handleEntryImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const editor = entryBodyRef.current;
      insertImageInEditor(editor, String(reader.result || ''));
      setBody(editor?.innerHTML || body);
    };
    reader.readAsDataURL(file);
  }

  function handleEditEntryImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const editor = editBodyRef.current;
      insertImageInEditor(editor, String(reader.result || ''));
      setEditBody(editor?.innerHTML || editBody);
    };
    reader.readAsDataURL(file);
  }

  function renderJournalContent(content) {
    return <div className="prose-journal" dangerouslySetInnerHTML={{ __html: sanitizeJournalHtml(content) }} />;
  }

  function enableImageResize(editorRef, updateBody) {
    const editor = editorRef.current;
    if (!editor) return () => {};

    let selectedImg = null;
    let activeMode = null;
    let resizeHandle = null;
    let animationFrame = null;
    let lastClientX = 0;
    let lastClientY = 0;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    let startTranslateX = 0;
    let startTranslateY = 0;

    const imageBoundsPadding = 12;
    const overlayHost = document.body;

    const selectionOverlay = document.createElement('div');
    selectionOverlay.className = 'journal-media-overlay is-hidden';
    selectionOverlay.setAttribute('contenteditable', 'false');
    selectionOverlay.innerHTML = `
      <span class="companion-selection-border"></span>
      <span class="companion-handle companion-handle-tl" data-journal-resize-handle="tl"></span>
      <span class="companion-handle companion-handle-tm" data-journal-resize-handle="tm"></span>
      <span class="companion-handle companion-handle-tr" data-journal-resize-handle="tr"></span>
      <span class="companion-handle companion-handle-ml" data-journal-resize-handle="ml"></span>
      <span class="companion-handle companion-handle-mr" data-journal-resize-handle="mr"></span>
      <span class="companion-handle companion-handle-bl" data-journal-resize-handle="bl"></span>
      <span class="companion-handle companion-handle-bm" data-journal-resize-handle="bm"></span>
      <span class="companion-handle companion-handle-br" data-journal-resize-handle="br"></span>
    `;
    overlayHost?.appendChild(selectionOverlay);

    const parseTranslate = (img) => {
      const match = /translate(?:3d)?\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px(?:,\s*0(?:px)?)?\)/.exec(img.style.transform || '');
      return {
        x: match ? Number(match[1]) : 0,
        y: match ? Number(match[2]) : 0
      };
    };

    const updateSelectionOverlay = () => {
      if (!selectedImg || !selectedImg.isConnected || !overlayHost) {
        selectionOverlay.classList.add('is-hidden');
        return;
      }

      const imgRect = selectedImg.getBoundingClientRect();
      selectionOverlay.style.left = `${imgRect.left}px`;
      selectionOverlay.style.top = `${imgRect.top}px`;
      selectionOverlay.style.width = `${imgRect.width}px`;
      selectionOverlay.style.height = `${imgRect.height}px`;
      selectionOverlay.classList.remove('is-hidden');
    };

    const clampImageTranslate = (img, nextX, nextY) => {
      const editorRect = editor.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const chromePadding = img.classList.contains('selected-media') || activeMode ? imageBoundsPadding : 0;
      const maxX = Math.max(0, (editorRect.width - imgRect.width - chromePadding * 2) / 2);
      const maxY = Math.max(0, (editorRect.height - imgRect.height - chromePadding * 2) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, nextX)),
        y: Math.max(-maxY, Math.min(maxY, nextY))
      };
    };

    const getMaxImageWidth = (translateX, translateY, aspectRatio) => {
      const editorRect = editor.getBoundingClientRect();
      const allowedWidth = Math.max(100, editorRect.width - Math.abs(translateX) * 2 - imageBoundsPadding * 2);
      const allowedHeight = Math.max(100 / aspectRatio, editorRect.height - Math.abs(translateY) * 2 - imageBoundsPadding * 2);
      return Math.max(100, Math.min(allowedWidth, allowedHeight * aspectRatio));
    };

    const serializeEditor = () => {
      const clone = editor.cloneNode(true);
      clone.querySelectorAll('img').forEach((img) => img.classList.remove('selected-media'));
      return clone.innerHTML;
    };

    const clearSelection = () => {
      if (selectedImg) {
        selectedImg.classList.remove('selected-media');
        selectedImg = null;
      }
      selectionOverlay.classList.add('is-hidden');
    };

    const startInteraction = (mode, event, handleName = null) => {
      if (!selectedImg) return;
      activeMode = mode;
      resizeHandle = handleName
        ? {
            left: handleName.includes('l'),
            right: handleName.includes('r'),
            top: handleName.includes('t'),
            bottom: handleName.includes('b')
          }
        : null;
      startW = selectedImg.offsetWidth;
      startH = selectedImg.offsetHeight;
      const translate = parseTranslate(selectedImg);
      startTranslateX = translate.x;
      startTranslateY = translate.y;
      startX = event.clientX;
      startY = event.clientY;
      event.preventDefault();
      event.stopPropagation();
    };

    const handleMouseDown = (event) => {
      const handleTarget = event.target.closest('[data-journal-resize-handle]');
      if (handleTarget && selectedImg) {
        startInteraction('resize', event, handleTarget.getAttribute('data-journal-resize-handle'));
        return;
      }

      if (event.target.closest('.journal-media-overlay') && selectedImg) {
        startInteraction('move', event);
        return;
      }

      const clickedImage = event.target.closest('img');
      if (clickedImage && editor.contains(clickedImage)) {
        if (selectedImg !== clickedImage) {
          clearSelection();
          selectedImg = clickedImage;
          selectedImg.classList.add('selected-media');
          updateSelectionOverlay();
          event.preventDefault();
          return;
        }

        startInteraction('move', event);
        return;
      }

      clearSelection();
    };

    const handleMouseMove = (event) => {
      if (!selectedImg || !activeMode) return;
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        if (!selectedImg || !activeMode) return;
        const dx = lastClientX - startX;
        const dy = lastClientY - startY;

        if (activeMode === 'move') {
          const next = clampImageTranslate(selectedImg, startTranslateX + dx, startTranslateY + dy);
          selectedImg.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
          updateSelectionOverlay();
          return;
        }

        const aspectRatio = startW / startH || 1;
        const horizontalDelta = resizeHandle?.left ? -dx : resizeHandle?.right ? dx : 0;
        const verticalDelta = resizeHandle?.top ? -dy : resizeHandle?.bottom ? dy : 0;
        const hasHorizontalHandle = Boolean(resizeHandle?.left || resizeHandle?.right);
        const hasVerticalHandle = Boolean(resizeHandle?.top || resizeHandle?.bottom);
        let dominantDelta = 0;

        if (hasHorizontalHandle && hasVerticalHandle) {
          dominantDelta = Math.abs(horizontalDelta) > Math.abs(verticalDelta) ? horizontalDelta : verticalDelta;
        } else if (hasHorizontalHandle) {
          dominantDelta = horizontalDelta;
        } else {
          dominantDelta = verticalDelta;
        }

        const proposedWidth = Math.max(100, startW + dominantDelta);
        const maxWidth = getMaxImageWidth(startTranslateX, startTranslateY, aspectRatio);
        const nextWidth = Math.min(proposedWidth, maxWidth);
        const nextHeight = nextWidth / aspectRatio;
        selectedImg.style.width = `${nextWidth}px`;
        selectedImg.style.height = `${nextHeight}px`;
        const boundedTranslate = clampImageTranslate(selectedImg, startTranslateX, startTranslateY);
        selectedImg.style.transform = `translate3d(${boundedTranslate.x}px, ${boundedTranslate.y}px, 0)`;
        updateSelectionOverlay();
      });
    };

    const handleMouseUp = () => {
      if (selectedImg && activeMode) {
        const translate = parseTranslate(selectedImg);
        const boundedTranslate = clampImageTranslate(selectedImg, translate.x, translate.y);
        selectedImg.style.transform = `translate3d(${boundedTranslate.x}px, ${boundedTranslate.y}px, 0)`;
        updateSelectionOverlay();
        updateBody(serializeEditor());
      }
      activeMode = null;
      resizeHandle = null;
    };

    editor.addEventListener('mousedown', handleMouseDown);
    selectionOverlay.addEventListener('mousedown', handleMouseDown);
    editor.addEventListener('scroll', updateSelectionOverlay);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', updateSelectionOverlay);
    window.addEventListener('scroll', updateSelectionOverlay, true);

    return () => {
      clearSelection();
      editor.removeEventListener('mousedown', handleMouseDown);
      selectionOverlay.removeEventListener('mousedown', handleMouseDown);
      editor.removeEventListener('scroll', updateSelectionOverlay);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', updateSelectionOverlay);
      window.removeEventListener('scroll', updateSelectionOverlay, true);
      selectionOverlay.remove();
    };
  }

  function enableCompanionResize(mediaRef) {
    const media = mediaRef.current;
    if (!media) return () => {};

    let mode = null;
    let resizeHandle = null;
    let startX = 0;
    let startY = 0;
    let startSize = 0;
    let startPosX = 0;
    let startPosY = 0;
    let currentSize = companion.size || 80;
    let currentPosX = companion.x || 0;
    let currentPosY = companion.y || 0;
    let animationFrame = null;
    let lastClientX = 0;
    let lastClientY = 0;

    const getFrameDimensions = (size) => getCompanionFrameDimensions(size, companionIsVideo, companionIsUploadedMedia);

    const selectionPadding = 16;

    const clampPosition = (size, nextX, nextY) => {
      const container = media.closest('.totoro-container');
      const containerRect = container?.getBoundingClientRect();
      const frame = getFrameDimensions(size);
      const chromePadding = companionSelected || mode ? selectionPadding : 0;
      if (!containerRect) return { x: nextX, y: nextY };
      const maxX = Math.max(0, (containerRect.width - frame.width - chromePadding * 2) / 2);
      const maxY = Math.max(0, (containerRect.height - frame.height - chromePadding * 2) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, nextX)),
        y: Math.max(-maxY, Math.min(maxY, nextY))
      };
    };

    const buildResizeState = (size, handleName) => {
      const frameBefore = getFrameDimensions(startSize);
      const frameAfter = getFrameDimensions(size);
      const anchorLeft = handleName?.includes('l');
      const anchorRight = handleName?.includes('r');
      const anchorTop = handleName?.includes('t');
      const anchorBottom = handleName?.includes('b');
      const horizontalShift = anchorLeft ? -(frameAfter.width - frameBefore.width) / 2 : anchorRight ? (frameAfter.width - frameBefore.width) / 2 : 0;
      const verticalShift = anchorTop ? -(frameAfter.height - frameBefore.height) / 2 : anchorBottom ? (frameAfter.height - frameBefore.height) / 2 : 0;

      return {
        size,
        frameAfter,
        x: startPosX + horizontalShift,
        y: startPosY + verticalShift
      };
    };

    const fitsResizeBounds = (state) => {
      const container = media.closest('.totoro-container');
      const containerRect = container?.getBoundingClientRect();
      if (!containerRect) return true;
      const halfWidth = containerRect.width / 2;
      const halfHeight = containerRect.height / 2;

      return (
        state.x - state.frameAfter.width / 2 - selectionPadding >= -halfWidth &&
        state.x + state.frameAfter.width / 2 + selectionPadding <= halfWidth &&
        state.y - state.frameAfter.height / 2 - selectionPadding >= -halfHeight &&
        state.y + state.frameAfter.height / 2 + selectionPadding <= halfHeight
      );
    };

    const resolveResizeState = (proposedSize, handleName) => {
      const candidate = buildResizeState(proposedSize, handleName);
      if (fitsResizeBounds(candidate) || proposedSize <= startSize) {
        return candidate;
      }

      let low = startSize;
      let high = proposedSize;
      let best = buildResizeState(startSize, handleName);

      for (let index = 0; index < 18; index += 1) {
        const mid = (low + high) / 2;
        const next = buildResizeState(mid, handleName);
        if (fitsResizeBounds(next)) {
          best = next;
          low = mid;
        } else {
          high = mid;
        }
      }

      return best;
    };

    const applyCompanionPreview = (size, x, y) => {
      currentSize = size;
      currentPosX = x;
      currentPosY = y;
      const frame = getFrameDimensions(size);
      media.style.width = `${frame.width}px`;
      media.style.height = `${frame.height}px`;
      media.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handleMouseDown = (event) => {
      if (!media.contains(event.target)) return;

      if (!companionSelected) {
        setCompanionSelected(true);
        event.preventDefault();
        return;
      }

      const handle = event.target.closest('[data-resize-handle]');
      startX = event.clientX;
      startY = event.clientY;
      startSize = companion.size || 80;
      startPosX = companion.x || 0;
      startPosY = companion.y || 0;
      currentSize = startSize;
      currentPosX = startPosX;
      currentPosY = startPosY;

      if (handle) {
        mode = 'resize';
        resizeHandle = handle.getAttribute('data-resize-handle');
      } else {
        mode = 'move';
      }

      media.classList.add('is-transforming');
      event.preventDefault();
      event.stopPropagation();
    };

    const handleMouseMove = (event) => {
      if (!mode) return;
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        if (!mode) return;
        const dx = lastClientX - startX;
        const dy = lastClientY - startY;

        if (mode === 'move') {
          const next = clampPosition(startSize, startPosX + dx, startPosY + dy);
          applyCompanionPreview(startSize, next.x, next.y);
          return;
        }

        let sizeDelta = 0;
        if (resizeHandle === 'ml') sizeDelta = -dx;
        else if (resizeHandle === 'mr') sizeDelta = dx;
        else if (resizeHandle === 'tm') sizeDelta = -dy;
        else if (resizeHandle === 'bm') sizeDelta = dy;
        else {
          const handleXSign = resizeHandle?.includes('l') ? -1 : 1;
          const handleYSign = resizeHandle?.includes('t') ? -1 : 1;
          const sizeDeltaX = handleXSign * dx;
          const sizeDeltaY = handleYSign * dy;
          sizeDelta = Math.abs(sizeDeltaX) > Math.abs(sizeDeltaY) ? sizeDeltaX : sizeDeltaY;
        }

        const proposedSize = Math.max(48, Math.min(420, startSize + sizeDelta));
        const resizeState = resolveResizeState(proposedSize, resizeHandle);
        const next = clampPosition(resizeState.size, resizeState.x, resizeState.y);
        applyCompanionPreview(resizeState.size, next.x, next.y);
      });
    };

    const handleMouseUp = () => {
      if (!mode) return;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      media.classList.remove('is-transforming');
      setCompanion((current) => ({ ...current, size: currentSize, x: currentPosX, y: currentPosY }));
      mode = null;
      resizeHandle = null;
    };

    media.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      media.classList.remove('is-transforming');
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      media.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }

  function addCustomWeather() {
    const cleanName = customWeatherName.trim();
    if (!cleanName) return;
    const customWeather = {
      id: crypto.randomUUID(),
      label: cleanName,
      emoji: customWeatherEmoji.trim() || '🌙',
      image: customWeatherImage,
      value: 3,
      hex: quoteBg || '#739f62'
    };
    setCustomWeathers([...customWeathers, customWeather]);
    setSelectedMood(cleanName);
    setCustomWeatherName('');
    setCustomWeatherEmoji('🌙');
    setCustomWeatherImage('');
  }

  function handlePetSceneMove(event) {
    if (petMood === 'snack' || petMood === 'happy') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const distance = Math.hypot(x - petPosition.x, y - petPosition.y);
    if (distance < 18) {
      petTheDog();
    }
  }

  function petTheDog() {
    setPetHappiness((current) => Math.min(100, current + 10));
    setPetMood('happy');
    setPetBubble('prrr');
    window.setTimeout(() => {
      setPetMood('walking');
      setPetBubble('');
    }, 1300);
  }

  function feedTheDog() {
    setPetHappiness((current) => Math.min(100, current + 18));
    setPetTreats((current) => current + 1);
    setPetMood('snack');
    setPetBubble('nom nom');
    window.setTimeout(() => {
      setPetMood('walking');
      setPetBubble('');
    }, 1500);
  }

  function addCustomQuote() {
    const quote = customQuoteDraft.trim();
    if (!quote) return;
    setCustomQuotes([...customQuotes, quote]);
    setQuoteIndex(quotes.length + customQuotes.length);
    setCustomQuoteDraft('');
  }

  function deleteCustomQuote(quoteToDelete) {
    setCustomQuotes(customQuotes.filter((quote) => quote !== quoteToDelete));
    setQuoteIndex(0);
  }

  function openImportantDateEditor(dateKey = selectedCalendarDate) {
    setSelectedCalendarDate(dateKey);
    const existing = importantDates[dateKey];
    setImportanceDraft(existing?.note || '');
    setImportanceDetailsDraft(existing?.details || '');
    setImportanceTimeDraft(existing?.time || '');
    setImportanceReminderEnabled(existing ? existing.remindersEnabled !== false : true);
    setImportanceModalOpen(true);
  }

  function deleteImportantDate(dateKey) {
    const { [dateKey]: _, ...rest } = importantDates;
    setImportantDates(rest);
    setImportanceModalOpen(false);
    setImportanceDraft('');
    setImportanceDetailsDraft('');
    setImportanceTimeDraft('');
    setImportanceReminderEnabled(true);
  }

  async function requestNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationStatusMessage('This browser does not support notifications.');
      setWebPushStatus('This browser does not support notification permission, so push reminders are unavailable.');
      setNotificationPermission('unsupported');
      return;
    }
    const permission = await window.Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      setNotificationStatusMessage(serviceWorkerReady
        ? 'Service worker-backed reminders are on. Alerts can surface more like an app, and tapping one will reopen the saved date.'
        : 'Browser reminders are on. We will notify for important days today and tomorrow while the journal is open.');
    } else if (permission === 'denied') {
      setNotificationStatusMessage('Notifications are blocked right now. You can re-enable them in your browser settings.');
      setWebPushStatus('Push reminders are blocked until browser notification permission is re-enabled.');
    } else {
      setNotificationStatusMessage('Notification permission was dismissed.');
      setWebPushStatus('Push setup paused because notification permission was dismissed.');
    }
  }

  function saveImportantDate() {
    const trimmedTitle = importanceDraft.trim();
    const trimmedDetails = importanceDetailsDraft.trim();
    const reminderTitle = trimmedTitle || trimmedDetails.split('\n').find(Boolean)?.trim().slice(0, 80) || '';
    if (!reminderTitle) {
      setImportanceModalOpen(false);
      return;
    }
    setImportantDates({
      ...importantDates,
      [selectedCalendarDate]: {
        note: reminderTitle,
        details: trimmedDetails,
        time: importanceTimeDraft,
        remindersEnabled: importanceReminderEnabled,
        createdAt: new Date().toISOString()
      }
    });
    setImportanceModalOpen(false);
    setImportanceDraft('');
    setImportanceDetailsDraft('');
    setImportanceTimeDraft('');
    setImportanceReminderEnabled(true);
  }

  function addStarterLine(label) {
    const starter = `<p><strong>${label}</strong></p><p><br></p>`;
    const currentHtml = entryBodyRef.current?.innerHTML || body || '';
    const nextHtml = currentHtml && currentHtml !== '<br>' ? `${currentHtml}${currentHtml.endsWith('>') ? '' : '<br>'}<p><br></p>${starter}` : starter;
    if (entryBodyRef.current) {
      entryBodyRef.current.innerHTML = nextHtml;
      entryBodyRef.current.focus();
    }
    setBody(nextHtml);
  }

  function startWritingFromInvitation(invitation) {
    const starter = `<p><strong>${invitation.opener}</strong></p><p><br></p>`;
    if (!title.trim()) setTitle(invitation.title);
    setSelectedMood(invitation.mood);
    setBody(starter);
    navigateToTab('write');
    window.setTimeout(() => {
      if (entryBodyRef.current) {
        entryBodyRef.current.innerHTML = starter;
        entryBodyRef.current.focus();
      }
    }, 50);
  }

  function deleteCustomWeather(label) {
    setCustomWeathers(customWeathers.filter((weather) => weather.label !== label));
    if (selectedMood === label) setSelectedMood('Calm');
  }

  function applyJournalAtmosphere(preset) {
    setSelectedTheme(preset.themeId);
    setSelectedDesign(preset.designId);
    setQuoteBg(preset.quoteBg);
    setJournalStyle((current) => ({ ...current, fontId: preset.journalFontId }));
    setQuoteStyle((current) => ({ ...current, fontId: preset.quoteFontId }));
    setCompanion((current) => ({ ...current, animation: preset.companionAnimation }));
  }

  function createPin(pin) {
    localStorage.setItem(PIN_KEY, pin);
    setHasPin(true);
    setLocked(false);
  }

  function changePin(currentPin, newPin) {
    const savedPin = getSavedPin();
    if (!currentPin.trim()) {
      return { ok: false, message: 'Enter your current PIN first.' };
    }
    if (currentPin.trim() !== savedPin) {
      return { ok: false, message: 'That current PIN does not match.' };
    }
    if (!newPin.trim()) {
      return { ok: false, message: 'Enter a new PIN to save.' };
    }
    localStorage.setItem(PIN_KEY, newPin.trim());
    setHasPin(true);
    return { ok: true, message: 'Your journal lock PIN has been updated.' };
  }

  function removePin(currentPin) {
    const savedPin = getSavedPin();
    if (!currentPin.trim()) {
      return { ok: false, message: 'Enter your current PIN before removing the lock.' };
    }
    if (currentPin.trim() !== savedPin) {
      return { ok: false, message: 'That current PIN does not match.' };
    }
    localStorage.removeItem(PIN_KEY);
    setHasPin(false);
    setLocked(false);
    setPinSettingsOpen(false);
    return { ok: true, message: 'The journal lock has been removed.' };
  }


  const [breathePhase, setBreathePhase] = useState(0);
  const [focusTimer, setFocusTimer] = useState(0);
  const [focusActive, setFocusActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathePhase(p => (p + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval = null;
    if (focusActive && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer(t => t - 1);
      }, 1000);
    } else if (focusTimer === 0 && focusActive) {
      setFocusActive(false);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusTimer]);

  const startFocusSession = (minutes) => {
    setFocusTimer(minutes * 60);
    setFocusActive(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const applyBreatheRoom = (id) => {
    const room = breatheRoomOptions.find((r) => r.id === id);
    if (!room) return;
    radioNowPlayingRef.current = room.title;
    setSelectedBreatheRoom(id);
    setRadioVolume(room.volume);
    setBreatheRoomStatus(room.status);

    if (radioPlayerRef.current?.loadVideoById) {
      radioUnlockedRef.current = true;
      radioPlayerRef.current.loadVideoById({
        videoId: room.videoId,
        startSeconds: room.startSeconds || 0,
        suggestedQuality: 'small'
      });
      radioPlayerRef.current.unMute?.();
      radioPlayerRef.current.setVolume?.(room.volume);
      radioPlayerRef.current.playVideo?.();
      setIsRadioPlaying(true);
      setRadioNeedsInteraction(false);
      setRadioStatusMessage(`${room.title} selected — audio is playing`);
    } else {
      setRadioStatusMessage('Connecting to radio player...');
    }
  };

  if (locked) {
    return (
      <Suspense fallback={<CozyPanelFallback label="Opening private journal..." />} >
        <PrivacyGate hasPin={hasPin} onCreatePin={createPin} onUnlock={() => setLocked(false)} />
      </Suspense>
    );
  }

  return (
    <main data-interface-mode={interfaceMode} data-device-type={interfaceMode} className={`personalized-site lofi-vibe interface-${interfaceMode} ${isPhoneInterface ? 'phone-interface pb-28' : 'pc-interface pb-10 lg:pb-0'} ${wallpaperImage ? 'wallpaper-active' : ''} design-${selectedDesign} ${comfortMode ? 'comfort-mode' : ''} isolate min-h-screen overflow-hidden bg-sand-50 text-ink`} style={themeStyle}>
      {isGameTransitioning && (
        <Suspense fallback={null}>
          <GameSplash game={transitioningGameConfig} />
        </Suspense>
      )}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#fffaf2]">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.35] blur-[1px] transition-opacity duration-1000" aria-hidden="true" />
        {wallpaperImage && <div className="lofi-user-wallpaper absolute inset-0 z-10" style={{ backgroundImage: `url(${wallpaperImage})` }} />}
        <div className="lofi-ambient-grid absolute inset-0 z-20 opacity-30" />
        <div className="absolute left-[-2rem] top-0 z-30 h-[28rem] w-[28rem] rounded-full bg-[#efe4d7]/60 blur-3xl" />
        <div className="absolute right-[-3rem] top-44 z-30 h-[26rem] w-[26rem] rounded-full bg-[#f8efe5]/70 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/3 z-30 h-[22rem] w-[22rem] rounded-full bg-[#f2e8dc]/65 blur-3xl" />
        <div className="lofi-record-glow absolute -right-20 top-[22rem] z-30 hidden h-72 w-72 rounded-full lg:block opacity-70" />
        <div className="lofi-moon-glow absolute left-[6%] top-[34rem] z-30 hidden h-28 w-28 rounded-full md:block opacity-60" />
      </div>


      {showEntryTransition && (
        <div className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-[520ms] ease-out ${entryTransitionClosing ? 'opacity-0' : 'opacity-100'}`}>
          <img src={entryTransitionWallpaper} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,14,10,0.26)_0%,rgba(28,20,15,0.48)_38%,rgba(40,29,22,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.16),transparent_0_18rem),radial-gradient(circle_at_82%_22%,rgba(255,224,187,0.12),transparent_0_16rem)]" />
          <div className={`absolute -left-8 top-8 h-40 w-40 rounded-full blur-3xl ${entryWelcomeTheme.orbClass}`} />
          <div className="absolute bottom-[-2rem] right-[-1rem] h-48 w-48 rounded-full bg-black/12 blur-3xl" />

          <div className={`relative z-10 flex h-full items-center justify-center px-5 transition-all duration-[620ms] ease-out ${entryTransitionClosing ? 'translate-y-2 scale-[1.01] opacity-0' : 'translate-y-0 scale-100 opacity-100'}`}>
            <div className={`w-full max-w-lg rounded-[2.5rem] border p-5 text-center text-white shadow-[0_24px_60px_rgba(0,0,0,0.26)] sm:p-7 ${entryWelcomeTheme.shellClass}`}>
              <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-[#f7e6d2] shadow-sm">
                <span className={`h-2 w-2 rounded-full ${entryWelcomeTheme.dotClass}`} />
                Lofi Memory
              </div>

              <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/16 bg-black/18 shadow-[0_14px_34px_rgba(0,0,0,0.18)] sm:h-24 sm:w-24">
                  <div className="absolute inset-[9px] rounded-full border border-white/10 bg-[radial-gradient(circle,#3b2d22_0%,#17110d_72%)]" />
                  <img src={customCdImage || activeTheme.image || radioVinylIcon} alt="" className="relative h-14 w-14 rounded-full object-cover opacity-95 sm:h-16 sm:w-16" aria-hidden="true" />
                </div>
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/18 bg-[#4f3f32]/80 p-2 text-2xl font-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.16)] sm:h-24 sm:w-24">
                  LM
                </div>
              </div>

              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.38em] text-[#f0d5b6]">{entryWelcomeTheme.eyebrow}</p>
              <h1 className="mt-3 font-display text-[2rem] font-bold tracking-tight text-white sm:text-[2.8rem]">{entryWelcomeTheme.heading}</h1>
              <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 tracking-[0.06em] text-[#f6e7d7]/84">{entryWelcomeTheme.copy}</p>

              <div className="mx-auto mt-6 w-full max-w-xs">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
                  <div className={`h-full rounded-full shadow-[0_0_16px_rgba(247,208,167,0.3)] ${entryWelcomeTheme.accentClass}`} style={{ width: '100%', animation: 'gameSplashProgress 0.95s ease-out infinite' }} />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {[0, 1, 2].map((dot) => (
                    <span key={`entry-dot-${dot}`} className={`h-2 w-2 rounded-full ${entryWelcomeTheme.dotClass}`} style={{ animation: 'pulse 1.15s ease-in-out infinite', animationDelay: `${dot * 0.14}s`, opacity: 0.68 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-300 ${showEntryTransition ? 'pointer-events-none select-none opacity-0' : 'opacity-100'}`}>
      <nav className="sticky top-0 z-20 px-3 pt-3 sm:px-5 sm:pt-5 xl:px-10">
        <div className="site-nav-shell lofi-picture-border lofi-border-memory relative mx-auto max-w-[1280px] overflow-hidden rounded-[2rem] sm:rounded-[3.2rem] border border-[#8b5e3c]/25 p-3 sm:p-4 shadow-soft lg:p-5">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/68 via-black/38 to-black/18" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.15),transparent_25rem)]" />
          <div className="relative z-10 flex flex-col gap-2.5 lg:gap-3 xl:flex-row xl:items-center xl:justify-between">
            <a className="flex items-center gap-2.5 sm:gap-3.5" href="#home" onClick={() => openHomeSection('home')}>
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-[1rem] sm:rounded-[1.35rem] border border-white/30 bg-[#4f3f32] p-1 sm:p-1.5 text-sm sm:text-base font-black text-white shadow-sm backdrop-blur-md overflow-hidden">
                LM
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-white lofi-sharp-text leading-tight">Lofi Memory</p>
                {isPhoneInterface ? null : (
                  <p className="lofi-sharp-text-soft text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white/95">Relaxing games & notes</p>
                )}
              </div>
            </a>
            <div className="hidden flex-wrap items-center gap-2 rounded-full border border-white/20 bg-black/20 p-1.5 shadow-sm backdrop-blur-md lg:flex">
              {[
                { id: 'unwind', label: 'Games' },
                { id: 'focus', label: 'Focus' },
                { id: 'write', label: 'Diary' },
                { id: 'notes', label: 'Notes' },
                { id: 'breathe', label: 'Music' },
                { id: 'memories', label: 'Dates' }
              ].map((tab) => (
                <button
                  key={`desktop-nav-${tab.id}`}
                  className={`rounded-full px-3.5 py-2 text-sm font-extrabold transition lofi-sharp-chip ${activeTab === tab.id ? 'bg-white text-[#4a3a2d] shadow-sm' : 'bg-white/8 text-white/95 hover:bg-white/16'}`}
                  onClick={() => navigateToTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={`site-nav-actions flex w-full flex-wrap items-center gap-2 lg:justify-end xl:w-auto xl:max-w-[34rem] xl:flex-none ${isPcInterface ? 'xl:flex-nowrap' : ''}`}>
              {user ? (
                <div className="header-account-pill flex min-w-[160px] sm:min-w-[210px] flex-1 items-center justify-between gap-2 sm:gap-3 rounded-full border border-white/25 bg-white/15 px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm backdrop-blur-md xl:flex-none">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white lofi-sharp-text">{user.displayName || user.email}</p>
                    {isPhoneInterface ? null : <p className="lofi-sharp-text-soft text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">{cloudStatus}</p>}
                  </div>
                  <div className={`flex shrink-0 items-center justify-center rounded-2xl shadow-sm ${isPhoneInterface ? 'h-8 w-auto gap-1.5 px-2.5 bg-white/18 text-white' : 'h-9 w-9 bg-white/20 text-white'}`}>
                    <ShieldCheck size={15} />
                    {isPhoneInterface ? <span className="text-[10px] font-black uppercase tracking-[0.16em]">Sync</span> : null}
                  </div>
                </div>
              ) : (
                <button className="header-account-pill flex min-w-[148px] sm:min-w-[196px] flex-1 items-center justify-between gap-2 sm:gap-3 rounded-full border border-white/35 bg-white/20 px-3 py-2 sm:px-4 sm:py-2.5 text-left shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/28 xl:flex-none" onClick={signInWithGoogle} disabled={authLoading} type="button">
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold text-white lofi-sharp-text">{authLoading ? '...' : isPhoneInterface ? 'Sign in to sync' : 'Sign in'}</p>
                    {isPhoneInterface ? null : <p className="lofi-sharp-text-soft text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">Cloud sync</p>}
                  </div>
                  <div className={`flex shrink-0 items-center justify-center rounded-xl sm:rounded-2xl shadow-sm ${isPhoneInterface ? 'h-8 w-8 bg-white/18 text-white' : 'h-7 w-7 sm:h-9 sm:w-9 bg-white text-[#4a3a2d]'}`}>
                    <ShieldCheck size={14} />
                  </div>
                </button>
              )}
              <div className="header-quick-actions flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/20 p-1 sm:p-1.5 shadow-sm backdrop-blur-md xl:flex-nowrap">
                {user && (
                  <button className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-sm font-bold text-white lofi-sharp-chip transition hover:-translate-y-0.5 hover:bg-white/20" onClick={handleSignOut} type="button">
                    Sign out
                  </button>
                )}
                {isMasterAdmin && (
                  <div className="flex overflow-hidden rounded-full border border-white/25 bg-white/10 p-1">
                    <button
                      className={`rounded-full px-3.5 py-2 text-sm font-extrabold transition lofi-sharp-chip ${adminViewMode === 'master' ? 'bg-white text-[#4a3a2d] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
                      onClick={() => setAdminViewMode('master')}
                      type="button"
                    >
                      Master
                    </button>
                    <button
                      className={`rounded-full px-3.5 py-2 text-sm font-extrabold transition lofi-sharp-chip ${adminViewMode === 'user' ? 'bg-white text-[#4a3a2d] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
                      onClick={() => setAdminViewMode('user')}
                      type="button"
                    >
                      User
                    </button>
                  </div>
                )}
                {showAdminTools && (
                  <button className="rounded-full border border-white/40 bg-white px-3.5 py-2 text-sm font-bold text-[#4a3a2d] transition hover:-translate-y-0.5 hover:bg-[#fff9f0]" onClick={() => openHomeSection('seo-studio')} type="button">
                    SEO studio
                  </button>
                )}
                <button className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-sm font-bold lofi-sharp-chip transition hover:-translate-y-0.5 ${comfortMode ? 'border-white bg-white text-[#4a3a2d]' : 'border-white/30 bg-white/10 text-white hover:bg-white/20'}`} onClick={() => setComfortMode(!comfortMode)} type="button">
                  <Cloud size={isPhoneInterface ? 13 : 14} /> {isPhoneInterface ? 'Soft' : 'Comfort'}
                </button>
                <button className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-sm font-bold text-white lofi-sharp-chip transition hover:-translate-y-0.5 hover:bg-white/20" onClick={() => (hasPin ? setPinSettingsOpen(true) : setLocked(true))} type="button">
                  <Lock size={isPhoneInterface ? 13 : 14} /> {isPhoneInterface ? 'Private' : hasPin ? 'Privacy' : 'Lock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      {!isFullscreen && isPhoneInterface ? (
      <div className="mobile-bottom-nav fixed bottom-4 left-4 right-4 z-50">
        <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-full border border-[#8b5e3c]/25 p-1.5 shadow-lift backdrop-blur-2xl transition duration-500 hover:shadow-soft">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/68 via-black/38 to-black/18" />
          <div className="relative z-10 flex items-center gap-1 overflow-x-auto px-1 custom-scrollbar sm:justify-around sm:px-2">
            {[
              { id: 'unwind', label: 'Games', icon: Gamepad2 },
              { id: 'focus', label: 'Focus', icon: Leaf },
              { id: 'home', label: 'Chill', icon: Headphones },
              { id: 'write', label: 'Diary', icon: PenLine },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'breathe', label: 'Music', icon: Wind },
              { id: 'memories', label: 'Archive', icon: CalendarDays }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-full px-2.5 py-2 transition-all duration-300 ${activeTab === tab.id ? 'bg-white/20 text-white shadow-inner scale-105' : 'text-white/70 hover:text-white'}`}
                onClick={() => navigateToTab(tab.id)}
              >
                <tab.icon size={18} />
                <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
            <button
              className={`flex shrink-0 flex-col items-center gap-1 rounded-full px-2.5 py-2 transition-all duration-300 ${activeTab === 'design' ? 'bg-white/20 text-white shadow-inner scale-105' : 'text-white/70 hover:text-white'}`}
              onClick={() => navigateToTab('design')}
            >
              <Palette size={18} />
              <span className="text-[9px] font-black uppercase tracking-wider">Design</span>
            </button>
          </div>
        </div>
      </div>
      ) : null}

      {showMinimalHomeOverview ? (
      <section id="home" className="mx-auto max-w-[1120px] px-3 pb-[4.5rem] pt-4 sm:px-5 sm:pb-14 sm:pt-7 xl:px-6">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#9a806a]">Calm lofi study room</p>
          <h1 className="mx-auto mt-3 max-w-4xl font-display text-3xl font-bold leading-tight tracking-tight text-[#3f3126] sm:text-5xl">
            Relax, focus, journal, and write down your thoughts in one calm browser tab with lofi music, cozy games, notes, reminders, and memories.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-[#6f5948]">
            Lofi Memory is built for students and anyone who wants one soft place to relax, focus, and write: open a calming game, capture your thoughts, keep study notes, save reminders, or settle into a gentle music room.
          </p>
        </div>
          <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[1.1rem] border border-[#8b5e3c]/10 p-1 shadow-sm sm:rounded-[1.25rem] sm:p-1.5">
            <div className="grid gap-2 sm:gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {homeEntryCards.map((card) => (
                <button
                  key={card.id}
                  className="group relative flex min-h-[11.25rem] w-full flex-col justify-end overflow-hidden rounded-[1rem] border border-white/55 bg-white/50 p-0.5 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_10px_24px_rgba(79,62,48,0.07)] sm:min-h-[12.75rem] sm:rounded-[1.2rem] xl:min-h-[13.25rem]"
                  onClick={card.onClick}
                  type="button"
                >
                  <img src={card.preview} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/18 to-white/10" />
                  <div className="relative z-10 m-1.5 rounded-[0.95rem] border border-white/30 bg-[#fff8f1]/94 p-3.5 shadow-sm backdrop-blur-md sm:m-2 sm:rounded-[1.1rem] sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-bold tracking-tight text-[#3f3126] sm:text-xl">{card.title}</p>
                        <p className="mt-0.5 text-[8.5px] font-black uppercase tracking-[0.24em] text-[#7b5d44]/80 sm:text-[9px]">{card.description}</p>
                      </div>
                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm sm:h-9 sm:w-9 sm:rounded-xl ${card.iconTone}`}>
                        <card.icon size={14} />
                      </span>
                    </div>
                    <span className="mt-3 inline-flex rounded-full bg-[#3f3126] px-2 py-1 text-[8.5px] font-black uppercase tracking-[0.18em] text-white sm:mt-3.5 sm:px-2.5 sm:text-[9px]">Open room</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
      </section>
      ) : null}

      {activeTab === 'home' && activeHomeSection === 'overview' && !showMinimalHomeOverview ? (
      <section id="home" className="mx-auto grid max-w-[1280px] gap-6 px-3 pb-24 pt-6 sm:gap-8 sm:px-5 sm:pb-28 sm:pt-10 lg:grid-cols-12 lg:pb-12 xl:gap-12 xl:px-10">
        <div className="lg:col-span-8">
          <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[2.2rem] sm:rounded-[3.2rem] border border-[#8b5e3c]/25 p-5 sm:p-8 shadow-[0_32px_90px_rgba(83,62,44,0.18)] lg:p-10 xl:p-11">
            <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.20),transparent_20rem)]" />
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] sm:mb-7 sm:px-4 sm:py-2 sm:text-sm font-bold text-white shadow-sm backdrop-blur-md lofi-sharp-text-soft">
                <Headphones size={15} /> Relax · focus · journal · minimal writing mode
              </div>
              <h1 className="lofi-sharp-text max-w-3xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">The soft browser space to relax, focus, journal, and write thoughts.</h1>
              <p className="lofi-sharp-text-soft mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/95 sm:mt-5 sm:text-[1.05rem] sm:leading-8">A distraction-free cozy study room in one free tab: listen to lofi music, grow a Focus Tree, write in a private diary, track your mood, and take calm no-download game resets.</p>

              <div className="lofi-now-playing mt-6 sm:mt-7 flex flex-col gap-4 rounded-[1.8rem] sm:rounded-[2.2rem] border border-white/22 bg-[#213128]/55 p-3.5 sm:p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="lofi-mini-record flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#3f342c] shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-white/25 bg-[#f3e7d8]" />
                  </div>
                  <div className="min-w-0">
                    <p className="lofi-sharp-text-soft text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/92">Now playing</p>
                    <p className="lofi-sharp-text mt-0.5 truncate text-sm sm:text-base font-extrabold text-white">Dusk room · rain window · soft study beats</p>
                  </div>
                </div>
                <div className="lofi-equalizer hidden sm:flex" aria-hidden="true"><span /><span /><span /><span /><span /></div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-[#22362e] sm:mt-6 sm:grid-cols-4 sm:text-sm">
                <div className="rounded-full border border-[#dbc7b1] bg-[#fffaf2]/92 px-3 py-1.5 text-center font-bold shadow-sm backdrop-blur">100% browser</div>
                <div className="rounded-full border border-[#dbc7b1] bg-[#fffaf2]/92 px-3 py-1.5 text-center font-bold shadow-sm backdrop-blur">Private online diary</div>
                <div className="rounded-full border border-[#dbc7b1] bg-[#fffaf2]/92 px-3 py-1.5 text-center font-bold shadow-sm backdrop-blur">Focus Tree timer</div>
                <div className="rounded-full border border-[#dbc7b1] bg-[#fffaf2]/92 px-3 py-1.5 text-center font-bold shadow-sm backdrop-blur">Lofi music included</div>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
                <button className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-[13px] sm:text-sm font-extrabold text-[#4f3f32] shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:bg-[#fff9f0]" onClick={() => navigateToTab('write')} type="button">
                  <FileText size={16} /> Open private diary
                </button>
                <button className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border border-white/45 bg-[#4f3f32] px-4 py-2.5 sm:px-5 sm:py-3 text-[13px] sm:text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#3f3026]" onClick={() => navigateToTab('focus')} type="button">
                  <TreePine size={16} /> Start Focus Tree
                </button>
                <button className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border border-white/45 bg-[#4f3f32] px-4 py-2.5 sm:px-5 sm:py-3 text-[13px] sm:text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#3f3026]" onClick={() => setIsRadioPlaying(true)} type="button">
                  <Headphones size={16} /> Start music
                </button>
                <a className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border border-white/45 bg-[#4f3f32] px-4 py-2.5 sm:px-5 sm:py-3 text-[13px] sm:text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#3f3026]" href="#unwind" onClick={() => navigateToTab('unwind')}>
                  <Leaf size={16} /> Calm games
                </a>
              </div>

              <div className="mt-6 grid gap-3 rounded-[1.8rem] border border-white/25 bg-white/12 p-3 text-white shadow-sm backdrop-blur-md sm:grid-cols-3">
                {[
                  { icon: Headphones, title: 'Set the room', copy: 'Start music or pick a wallpaper.' },
                  { icon: TreePine, title: 'Stay present', copy: 'Grow the Focus Tree only while visible.' },
                  { icon: PenLine, title: 'Close gently', copy: 'End with one diary note or reminder.' }
                ].map((step) => (
                  <div key={step.title} className="rounded-[1.2rem] border border-white/20 bg-[#2f3f32]/72 p-3">
                    <div className="flex items-center gap-2 text-sm font-black"><step.icon size={15} /> {step.title}</div>
                    <p className="mt-1 text-xs font-semibold leading-5 text-white/82">{step.copy}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-3 lg:grid-cols-3">
                {hangoutInvitations.map((invitation) => (
                  <button key={invitation.title} className="group lofi-glass rounded-[1.55rem] border p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d9c7b3] hover:shadow-[0_14px_30px_rgba(146,126,106,0.08)]" onClick={() => navigateToTab(invitation.tab)} type="button">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#9a806a]">{invitation.eyebrow}</p>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#efe4d8] text-[#7b6552]">
                        <invitation.icon size={16} />
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-extrabold leading-tight text-[#3d3025] group-hover:text-[#4f3f32]">{invitation.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#7c6957]">{invitation.detail}</p>
                  </button>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-[#22362e]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#dbc7b1] bg-[#fffaf2] px-4 py-2.5 shadow-sm">
                  <ShieldCheck size={16} /> {hasPin ? 'Private when you want it' : 'Add privacy any time'}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#dbc7b1] bg-[#fffaf2] px-4 py-2.5 shadow-sm">
                  <Sparkles size={16} /> {user ? `${entries.length} saved moments · ${cloudStatus}` : `${entries.length} saved moments · Local-first chill space`}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-3 rounded-[1.2rem] border border-white/30 bg-[#1f2f29]/80 p-3.5 text-xs shadow-sm backdrop-blur-md sm:p-4">
                <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#284a3a] shadow-sm">Original articles</span>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/stop-scrolling-and-start-studying.html">Stop scrolling and study</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/lofi-study-room-focus-tree-timer.html">Lofi room & tree</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/blog.html">Blog hub</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/private-journaling-hub.html">Journal hub</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/journaling-games-long-tail-seo.html">100 answers</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/how-does-journaling-help-mental-health.html">Mental health journaling</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/student-focus-kit.html">Student Kit</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/article-psychology-of-journaling.html">Psychology</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/article-protect-privacy-journaling-online.html">Privacy guide</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/article-how-to-start-journaling-habit.html">Writing habit</a>
                <a className="rounded-full border border-white/65 bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#22362e] shadow-sm transition hover:-translate-y-0.5 hover:bg-white" href="/article-benefits-of-private-online-diary.html">Benefits</a>
              </div>

              <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                <StatCard icon={BookOpen} label="Entries" value={entries.length} tone="bg-sage-100 text-sage-800" />
                <StatCard icon={Sunrise} label="Current streak" value={`${streak} day${streak === 1 ? '' : 's'}`} tone="bg-sand-100 text-sand-500" />
                <StatCard icon={HeartHandshake} label="Average mood" value={averageMood} tone="bg-teal-100 text-teal-700" />
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex min-h-[290px] flex-col justify-between rounded-[2.2rem] border border-[#e8dfd5] bg-gradient-to-br from-white/90 to-sage-50/70 p-5 shadow-lift backdrop-blur">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">All-in-one soft corner</p>
                    <h3 className="mt-3 text-2xl font-extrabold leading-tight text-ink">Listen, relax, plan, and write without jumping between tabs.</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-sage-800">Lofi Memory is meant to feel like a calm browser hangout. You can let the lofi stream roll, play a chill game, keep your to-do list nearby, breathe for a minute, or write something down whenever you feel like it.</p>
                  </div>
                  <div className="mt-6 space-y-3.5">
                    <button className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-amber-200/50 bg-white/96 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-sage-50 hover:shadow-lift" onClick={() => setIsRadioPlaying(true)} type="button">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm transition group-hover:scale-105">
                        <Headphones size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">Listen</span>
                        <span className="mt-1 block text-base font-extrabold text-sage-950">Lofi music</span>
                        <span className="mt-2 block text-sm leading-6 text-sage-700">Start the soft radio and let the page settle into a calmer room for relaxing, focus, or writing.</span>
                      </div>
                    </button>
                    <button className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-amber-200/50 bg-white/96 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-sage-50 hover:shadow-lift" onClick={() => navigateToTab('notes')} type="button">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm transition group-hover:scale-105">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-teal-700">Plan</span>
                        <span className="mt-1 block text-base font-extrabold text-sage-950">Notes & to-dos</span>
                        <span className="mt-2 block text-sm leading-6 text-sage-700">Keep errands, reminders, and important bits close in a calmer, easier-to-scan space.</span>
                      </div>
                    </button>
                    <button className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-amber-200/50 bg-white/96 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-sage-50 hover:shadow-lift" onClick={() => navigateToTab('write')} type="button">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 shadow-sm transition group-hover:scale-105">
                        <PenLine size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700">Write</span>
                        <span className="mt-1 block text-base font-extrabold text-sage-950">Private journal</span>
                        <span className="mt-2 block text-sm leading-6 text-sage-700">Write down what is on your mind whenever you want to keep the moment, with more room to breathe.</span>
                      </div>
                    </button>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-sage-700">One place to listen to lofi music, relax, plan your day, and save your thoughts.</p>
                </div>
                <div className={`flex min-h-[290px] flex-col justify-between rounded-[2.2rem] border p-5 shadow-sm backdrop-blur ${selectedMoodGuide.shellClass}`}>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Mood check-in</p>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-sm ${selectedMoodGuide.chipClass}`}>{selectedMood}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-sage-800 shadow-sm">
                        <WeatherGlyph mood={selectedMoodOption} size="text-xl" />
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-ink">{selectedMoodGuide.title}</p>
                        <p className="text-sm font-semibold text-sage-600">{selectedMoodGuide.summary}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2.5 text-xs font-bold text-sage-700">
                    <span className={`rounded-full border px-3.5 py-1.5 shadow-sm ${selectedMoodGuide.chipClass}`}>Mood journal</span>
                    <span className={`rounded-full border px-3.5 py-1.5 shadow-sm ${selectedMoodGuide.chipClass}`}>Private reflection</span>
                    <span className={`rounded-full border px-3.5 py-1.5 shadow-sm ${selectedMoodGuide.chipClass}`}>Easy check-ins</span>
                  </div>
                  <div className={`mt-5 grid gap-3 rounded-2xl px-4 py-4 text-sm text-sage-700 ring-1 ${selectedMoodGuide.panelClass}`}>
                    <div>
                      <p className="font-extrabold text-sage-900">Carried into today’s page</p>
                      <p className="mt-1 leading-6">{selectedMoodGuide.detail}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-700">
                      <Sparkles size={14} /> Gentle pattern-tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-5 lg:col-span-4">
          <div className="rounded-[2.2rem] border border-[#e8dfd5] bg-white/72 p-5 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Start where it helps most</p>
              <span className="rounded-full border border-[#e8dfd5] bg-sage-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-800">Core spaces</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:gap-4">
              {[
                { id: 'unwind', label: 'Games', detail: 'Chill games', icon: Gamepad2, tone: 'bg-violet-100 text-violet-700' },
                { id: 'focus', label: 'Focus Tree', detail: 'Grow while studying', icon: Leaf, tone: 'bg-emerald-100 text-emerald-700' },
                { id: 'write', label: 'Diary', detail: 'Write only when it helps', icon: PenLine, tone: 'bg-sage-100 text-sage-800' },
                { id: 'notes', label: 'Notes', detail: 'Keep important things nearby', icon: FileText, tone: 'bg-teal-100 text-teal-700' },
                { id: 'breathe', label: 'Music Room', detail: 'Wallpaper sounds', icon: Wind, tone: 'bg-blue-100 text-blue-700' },
                { id: 'memories', label: 'Memories', detail: 'Return to saved moments', icon: BookOpen, tone: 'bg-sand-100 text-sand-600' },
                { id: 'design', label: 'Design', detail: 'Customize your space', icon: Palette, tone: 'bg-rose-100 text-rose-700' }
              ].map((tab) => (
                <button key={tab.id} className="group flex items-center gap-3 rounded-2xl border border-[#e8dfd5] bg-white/92 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200/50 hover:bg-white hover:shadow-lift" onClick={() => navigateToTab(tab.id)} type="button">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm transition group-hover:scale-105 ${tab.tone}`}>
                    <tab.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-sage-950">{tab.label}</p>
                    <p className="text-xs text-sage-600">{tab.detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[#e8dfd5] bg-gradient-to-br from-white/84 to-sand-50/70 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-800">Why it feels good to stay here</p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight text-ink">The page feels like a chill place first, so writing can arrive naturally.</h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-sage-800">There is a clear place to begin, soft privacy cues, cozy game breaks, and just enough support to help a first sentence feel easy instead of exposed.</p>
            <div className="mt-6 grid gap-3.5 text-sm font-semibold text-sage-900">
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200/50 bg-white/96 px-4 py-3.5 shadow-sm">
                <Sparkles size={15} className="text-sage-700" />
                <span>Starter lines help you begin without filling the page with noise</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200/50 bg-white/96 px-4 py-3.5 shadow-sm">
                <ShieldCheck size={15} className="text-sage-700" />
                <span>Privacy cues keep the space personal before you write a word</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200/50 bg-white/96 px-4 py-3.5 shadow-sm">
                <BookOpen size={15} className="text-sage-700" />
                <span>Saved pages stay easy to revisit when you want perspective later</span>
              </div>
            </div>
          </div>

          <div className="quote-card quote-card-premium quote-card-compact flex flex-col rounded-3xl border border-amber-200/50 p-6 shadow-soft lg:p-7">
            <Quote className="mb-6 opacity-80" size={30} />
            <p className="quote-main-text font-bold leading-tight" style={{ fontFamily: activeQuoteFont, fontSize: Math.max(activeQuoteSize - 4, 28), color: quoteStyle.textColor, lineHeight: 1.4 }}>“{quoteLibrary[quoteIndex % quoteLibrary.length]}”</p>
            <button className="quote-button mt-6 rounded-full bg-white px-5 py-3 text-sm font-extrabold shadow-lift transition hover:-translate-y-1 hover:bg-sage-50" onClick={() => setQuoteIndex((quoteIndex + 1) % quoteLibrary.length)}>
              Another calming quote
            </button>

            <div className="mt-8 rounded-[1.6rem] bg-white/12 px-5 py-5 text-center ring-1 ring-white/12">
              <div className="mx-auto max-w-xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Quiet reminder</p>
                <p className="mt-3 text-sm leading-7 text-white/95 lofi-sharp-text-soft">You can leave one small honest note today and return tomorrow. The page will still be here when you are ready.</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <p className="text-sm font-semibold tracking-[0.08em] text-white/95 lofi-sharp-chip">{streak > 0 ? `${streak} day${streak === 1 ? '' : 's'} of rhythm` : 'Begin with one gentle page'}</p>
                  <a className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" href="#journal" onClick={() => navigateToTab('write')}>
                    Write now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
      ) : null}

      {activeTab === 'home' && !showMinimalHomeOverview ? (
      <section className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="rounded-[2.5rem] border border-[#e8dfd5]/90 bg-white/96 p-7 shadow-soft backdrop-blur lg:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-display text-4xl font-bold leading-tight text-ink lg:text-5xl">{homeSections.find((s) => s.id === activeHomeSection)?.label || 'Overview'}</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sage-800">{activeHomeSection === 'overview' ? (latestEntry ? `Your last page is still here. ${rewardLevel.next}` : 'Come here to relax, hang out in a chill corner, and start with a game first when you want the easiest, softest reset.') : 'Browse gently. The layout stays simple so each section feels easier to read.'}</p>
                </div>
                <a className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sage-900 px-6 py-4 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800" href="#unwind" onClick={() => navigateToTab('unwind')}>
                  <Leaf size={18} /> Play a chill game
                </a>
              </div>

              <div className="mt-10 grid gap-2.5 rounded-[3rem] border border-[#e8dfd5]/70 bg-sage-50/45 p-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {primaryHomeSections.map((section) => (
                  <button
                    key={section.id}
                    className={`rounded-[1.4rem] px-4 py-4 text-left transition ${activeHomeSection === section.id ? 'bg-white text-sage-950 shadow-sm ring-1 ring-sage-100' : 'text-sage-700 hover:bg-white/75 hover:text-sage-950'}`}
                    onClick={() => openHomeSection(section.id)}
                    type="button"
                  >
                    <div className="flex items-center gap-2 text-sm font-extrabold"><section.icon size={16} /> {section.label}</div>
                  </button>
                ))}
              </div>

              {activeHomeSection === 'overview' && (
              <div className="mt-10 space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-sage-50/50 p-6 text-center ring-1 ring-sage-100/50">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-sage-500">Streak</p>
                    <p className="mt-2 text-3xl font-extrabold text-ink">{streak} day{streak === 1 ? '' : 's'}</p>
                  </div>
                  <div className="rounded-3xl bg-rose-50/50 p-6 text-center ring-1 ring-rose-100/50">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-rose-500">This week</p>
                    <p className="mt-2 text-3xl font-extrabold text-ink">{weeklyCheckIns}/{weeklyGoal}</p>
                  </div>
                  <div className="rounded-3xl bg-sand-50/50 p-6 text-center ring-1 ring-sand-100/50">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-sand-500">Reward</p>
                    <p className="mt-2 text-3xl font-extrabold text-ink">{rewardLevel.emoji}</p>
                  </div>
                </div>
                <div className="rounded-[3rem] border border-[#e8dfd5] bg-gradient-to-r from-sage-50/85 via-white to-sand-50/80 p-5 shadow-inner">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-600">Stay here a while</p>
                      <h3 className="mt-2 text-2xl font-extrabold leading-tight text-ink">Move between games, notes, breathing, and writing without leaving the calm.</h3>
                    </div>
                    <p className="max-w-lg text-sm font-semibold leading-6 text-sage-700">The homepage now gives first-time visitors a clearer route into play, focus, notes, reflection, and helpful reading so the site feels more like a place to hang out than a one-click tool.</p>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {[
                      { label: 'Play a chill game', detail: 'Jump straight into the unwind room when you want something cozy and immediate.', action: () => navigateToTab('unwind'), icon: Sparkles },
                      { label: 'Open the music room', detail: 'Choose rain, fireplace, or lofi wallpaper sounds for a softer reset.', action: () => navigateToTab('breathe'), icon: Wind },
                      { label: 'Write one line', detail: 'Catch one thought with prompts and a visible save action.', action: () => navigateToTab('write'), icon: PenLine },
                      { label: 'Plan important things', detail: 'Keep tasks, recurring habits, and notes away from diary entries.', action: () => navigateToTab('notes'), icon: FileText },
                      { label: 'Read guides', detail: 'Find calm game, prompt, privacy, and habit guides grouped by need.', action: () => openHomeSection('guides'), icon: Compass }
                    ].map((item) => (
                      <button key={item.label} className="group rounded-[1.5rem] border border-white/85 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-200/50 hover:bg-white hover:shadow-lift" onClick={item.action} type="button">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 transition group-hover:bg-sage-900 group-hover:text-white"><item.icon size={17} /></div>
                        <h4 className="mt-3 text-base font-extrabold text-ink">{item.label}</h4>
                        <p className="mt-2 text-sm leading-6 text-sage-700">{item.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2.2rem] border border-[#e8dfd5]/80 bg-white/85 p-5 shadow-sm">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-600">Popular calm searches</p>
                      <h3 className="mt-2 text-xl font-extrabold text-ink">Quick links for lofi music, chill vibes, relaxing routines, and cozy games.</h3>
                    </div>
                    <button className="text-sm font-extrabold text-sage-800 underline decoration-sage-300 underline-offset-4" onClick={() => openHomeSection('guides')} type="button">View all guide collections</button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {(showAllSearches ? seoPopularSearches : seoPopularSearches.slice(0, 12)).map((item) => (
                      <a className="rounded-full border border-amber-200/50 bg-sage-50/70 px-4 py-2 text-sm font-bold text-sage-800 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href={item.href} key={item.href}>{item.label}</a>
                    ))}
                    {!showAllSearches && seoPopularSearches.length > 12 && (
                      <button 
                        onClick={() => setShowAllSearches(true)}
                        className="rounded-full border border-amber-200/50 border-dashed bg-white/50 px-4 py-2 text-sm font-bold text-sage-600 transition hover:bg-white hover:text-sage-900"
                        type="button"
                      >
                        + {seoPopularSearches.length - 12} more
                      </button>
                    )}
                  </div>
                  <div className="mt-5 grid gap-3 lg:grid-cols-3">
                    {seoKeywordClusters.map((cluster) => (
                      <div key={cluster.title} className="rounded-[1.4rem] border border-sage-100 bg-white/70 p-4">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sage-600">{cluster.title}</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">{cluster.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          <aside className="lg:w-[320px] xl:w-[360px] lg:sticky lg:top-28">
            <div className="rounded-[2.5rem] border border-[#e8dfd5] bg-white/70 p-6 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-4 border-b border-[#e8dfd5] pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 shadow-sm">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-ink">Today’s diary reminder</p>
                  <p className="text-xs font-semibold text-sage-600">{selectedMood} mood</p>
                </div>
              </div>
              
              <div className="py-6">
                <p className="text-lg font-bold leading-relaxed text-ink italic opacity-90">“Start with the smallest honest version.”</p>
                <p className="mt-4 text-sm leading-7 text-sage-800">Write the detail, feeling, or unfinished thought that is easiest to name first. A short diary page is still enough to hold the day.</p>
              </div>

              <div className="grid gap-2 border-t border-[#e8dfd5] pt-5">
                <button className="flex items-center justify-between rounded-2xl bg-white/80 px-5 py-4 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white" onClick={() => navigateToTab('notes')} type="button">
                  <span className="inline-flex items-center gap-2"><FileText size={16} /> Notes</span>
                  <span className="opacity-50">{openPlannerTodoCount}</span>
                </button>
                <button className="flex items-center justify-between rounded-2xl bg-white/80 px-5 py-4 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white" onClick={() => navigateToTab('memories')} type="button">
                  <span className="inline-flex items-center gap-2"><BookOpen size={16} /> Memories</span>
                  <span className="opacity-50">{entries.length}</span>
                </button>
                <button className="flex items-center justify-between rounded-2xl bg-white/80 px-5 py-4 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white" onClick={() => navigateToTab('insights')} type="button">
                  <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> Insights</span>
                  <span className="opacity-50">{weeklyCheckIns}/{weeklyGoal}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
      ) : null}

{customizerOpen && (
        <CozyPanelErrorBoundary
          resetKey={`panel-design-${customizerOpen}`}
          title="The design studio had trouble opening."
          description="Try the panel again. Your current cozy setup is still safe."
        >
          <Suspense fallback={<CozyPanelFallback label="Opening design studio..." />}>
              <ThemeStudio
                customColor={customColor}
                customWeatherEmoji={customWeatherEmoji}
                customWeatherImage={customWeatherImage}
                customCdImage={customCdImage}
                customWeatherName={customWeatherName}
                customWeathers={customWeathers}
                isOpen={customizerOpen}
                journalStyle={journalStyle}
                onAtmosphereApply={applyJournalAtmosphere}
                onAddCustomWeather={addCustomWeather}
                onClose={() => setCustomizerOpen(false)}
                onCustomColorChange={setCustomColor}
                onCustomCdImageRemove={removeCustomCdImage}
                onCustomCdImageUpload={handleCustomCdImageUpload}
                onCustomWeatherEmojiChange={setCustomWeatherEmoji}
                onCustomWeatherImageUpload={handleWeatherImageUpload}
                onCustomWeatherNameChange={setCustomWeatherName}
                onDeleteCustomWeather={deleteCustomWeather}
                onDesignChange={setSelectedDesign}
                onQuoteBgChange={setQuoteBg}
                onThemeChange={setSelectedTheme}
                onWallpaperImageUpload={handleWallpaperImageUpload}
                onWallpaperRemove={removeWallpaperImage}
                quoteBg={quoteBg}
                quoteStyle={quoteStyle}
                selectedDesign={selectedDesign}
                selectedTheme={selectedTheme}
                wallpaperImage={wallpaperImage}
              />
          </Suspense>
        </CozyPanelErrorBoundary>
      )}

{pinSettingsOpen && (
        <Suspense fallback={null}>
              <PinSettingsDialog
                isOpen={pinSettingsOpen}
                onChangePin={changePin}
                onClose={() => setPinSettingsOpen(false)}
                onRemovePin={removePin}
              />
        </Suspense>
      )}

      <section id="journal" className="relative z-10 mx-auto -mt-1 max-w-[1280px] px-5 py-9 pb-28 sm:px-7 lg:-mt-4 lg:pb-10 xl:px-10">
        <div className="lofi-picture-border lofi-border-watercolor mb-6 overflow-hidden rounded-[3rem] border border-white/85 bg-gradient-to-r from-white/88 via-sage-50/78 to-sand-50/75 p-3 shadow-soft backdrop-blur xl:p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage-600">Choose your chill space</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">Everything you need for a softer online reset and a little place to chill is waiting here.</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">Jump into games, notes, breathing, saved moments, or thoughts whenever they fit your mood — not because the page tells you to write first.</p>
            </div>
            <div className="grid gap-2 rounded-[1.5rem] bg-white/70 p-2 shadow-inner sm:grid-cols-3 lg:grid-cols-6">
              {[
                { id: 'unwind', label: 'Games', detail: 'Chill games', icon: Gamepad2 },
                { id: 'write', label: 'Diary', detail: draftWordCount ? `${draftWordCount} words in progress` : 'Write when it helps', icon: PenLine },
                { id: 'notes', label: 'Notes', detail: plannerTodoCount ? `${openPlannerTodoCount} still open` : 'Keep important things', icon: FileText },
                { id: 'breathe', label: 'Music Room', detail: 'Wallpaper sounds', icon: Wind },
                { id: 'memories', label: 'Memories', detail: `${entries.length} saved`, icon: BookOpen },
                { id: 'design', label: 'Design', detail: 'Customize space', icon: Palette }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`rounded-[1.2rem] px-4 py-3 text-left transition ${activeTab === tab.id ? 'bg-white text-sage-950 shadow-sm ring-1 ring-white' : 'text-sage-500 hover:bg-white/75 hover:text-sage-800'}`}
                  onClick={() => navigateToTab(tab.id)}
                  type="button"
                >
                  <div className="flex items-center gap-2 text-sm font-extrabold"><tab.icon size={15} /> {tab.label}</div>
                  <p className="mt-1 text-xs font-semibold">{tab.detail}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'write' && (
          <LazyTabPanel
            label="Opening your quiet page..."
            resetKey={`panel-${activeTab}`}
            title="Your diary needs one more breath."
            description="The writing space ran into a loading hiccup. Try this panel again, or switch tabs once and come back."
          >
            <WriteTab
          activeJournalFont={activeJournalFont}
          activeJournalSize={activeJournalSize}
          activePrompt={activePrompt}
          addStarterLine={addStarterLine}
          companion={companion}
          companionIsUploadedMedia={companionIsUploadedMedia}
          completedQuestCount={completedQuestCount}
          draftWordCount={draftWordCount}
          entries={entries}
          entriesToNextReward={entriesToNextReward}
          entryBodyRef={entryBodyRef}
          entryTypeMeta={entryTypeMeta}
          formatDate={formatDate}
          handleEntryImageUpload={handleEntryImageUpload}
          importantDateCount={importantDateCount}
          insertQuickEmoji={insertQuickEmoji}
          journalFontOptions={journalFontOptions}
          journalNudge={journalNudge}
          journalQuest={journalQuest}
          journalSizeOptions={journalSizeOptions}
          journalStyle={journalStyle}
          latestEntry={latestEntry}
          moodStarterPrompts={moodStarterPrompts}
          navigateToTab={navigateToTab}
          nextAchievement={nextAchievement}
          openPlannerTodoCount={openPlannerTodoCount}
          prompts={prompts}
          quickEmojis={quickEmojis}
          returnRitual={returnRitual}
          rewardLevel={rewardLevel}
          sanitizeJournalHtml={sanitizeJournalHtml}
          saveEntry={saveEntry}
          saveReward={saveReward}
          selectedMood={selectedMood}
          selectedMoodOption={selectedMoodOption}
          setActivePrompt={setActivePrompt}
          setBody={setBody}
          setJournalStyle={setJournalStyle}
          setSelectedMood={setSelectedMood}
          setTitle={setTitle}
          setWritingCategory={setWritingCategory}
          streak={streak}
          title={title}
          body={body}
          toggleBoldText={toggleBoldText}
          toggleBulletList={toggleBulletList}
          toggleUnderlineText={toggleUnderlineText}
          unlockedAchievementCount={unlockedAchievementCount}
          weatherOptions={weatherOptions}
          weeklyCheckIns={weeklyCheckIns}
          weeklyGoal={weeklyGoal}
          writingCategory={writingCategory}
            />
          </LazyTabPanel>
        )}

        {activeTab === 'unwind' && (

          <LazyTabPanel label="Loading the game room..." resetKey={`panel-${activeTab}`}>


            <UnwindTab
          difficultyOptions={difficultyOptions}
          gameVisualTheme={gameVisualTheme}
          isFullscreen={isFullscreen}
          returnToGameLibrary={returnToGameLibrary}
          selectedDifficultyConfig={selectedDifficultyConfig}
          selectedGameDifficulty={selectedGameDifficulty}
          selectedGameInterfaceRef={selectedGameInterfaceRef}
          selectedUnwindGame={selectedUnwindGame}
          selectedUnwindGameConfig={selectedUnwindGameConfig}
          setGameVisualTheme={setGameVisualTheme}
          setSelectedGameDifficulty={setSelectedGameDifficulty}
          toggleFullscreen={toggleFullscreen}
          unwindGames={unwindGames}
          unwindViewMode={unwindViewMode}
            />
          </LazyTabPanel>
        )}

        {activeTab === 'focus' && (
          <CozyPanelErrorBoundary
            resetKey={`panel-${activeTab}`}
            title="The Focus Tree needs one more try."
            description="Try this panel again. If it still feels stuck, switch tabs once and come back."
          >
            <Suspense fallback={
            <div className="flex min-h-[320px] items-center justify-center text-[#6f5948]">
              <div className="text-center">
                <TreePine className="mx-auto mb-3 h-7 w-7 animate-pulse text-[#8e7159]" />
                <p className="text-sm font-bold">Preparing your Focus Tree...</p>
              </div>
            </div>
          }>
            <FocusTreeRoom />
          </Suspense>
          </CozyPanelErrorBoundary>
        )}

        {activeTab === 'breathe' && (
          <LazyTabPanel label="Loading the music room..." resetKey={`panel-${activeTab}`}>
            <BreatheTab
          activeBreatheRoom={activeBreatheRoom}
          applyBreatheRoom={applyBreatheRoom}
          breathePhase={breathePhase}
          breatheRoomOptions={breatheRoomOptions}
          breatheRoomStatus={breatheRoomStatus}
          focusActive={focusActive}
          focusTimer={focusTimer}
          formatTime={formatTime}
          selectedBreatheRoom={selectedBreatheRoom}
          setFocusActive={setFocusActive}
          startFocusSession={startFocusSession}
            />
          </LazyTabPanel>
        )}

        {activeTab === 'notes' && (
          <LazyTabPanel label="Loading notes..." resetKey={`panel-${activeTab}`}>
            <NotesTab
          addPlannerTodo={addPlannerTodo}
          cancelEditingPlannerTodo={cancelEditingPlannerTodo}
          clearCompletedPlannerTodos={clearCompletedPlannerTodos}
          completedPlannerTodoCount={completedPlannerTodoCount}
          cyclePlannerTodoPriority={cyclePlannerTodoPriority}
          cyclePlannerTodoStatus={cyclePlannerTodoStatus}
          deletePlannerTodo={deletePlannerTodo}
          draggedPlannerTodoId={draggedPlannerTodoId}
          editingPlannerTodoDueDate={editingPlannerTodoDueDate}
          editingPlannerTodoId={editingPlannerTodoId}
          editingPlannerTodoPriority={editingPlannerTodoPriority}
          editingPlannerTodoRecurrence={editingPlannerTodoRecurrence}
          editingPlannerTodoText={editingPlannerTodoText}
          filteredPlannerTodos={filteredPlannerTodos}
          formatDate={formatDate}
          formatReminderTime={formatReminderTime}
          formatShortDate={formatShortDate}
          getPlannerPriorityLabel={getPlannerPriorityLabel}
          getPlannerRecurrenceLabel={getPlannerRecurrenceLabel}
          getPlannerStatusLabel={getPlannerStatusLabel}
          inProgressPlannerTodoCount={inProgressPlannerTodoCount}
          isPlannerTodoOverdue={isPlannerTodoOverdue}
          movePlannerTodo={movePlannerTodo}
          navigateToTab={navigateToTab}
          openPlannerTodoCount={openPlannerTodoCount}
          overduePlannerTodoCount={overduePlannerTodoCount}
          plannerBoard={plannerBoard}
          plannerNoteLineCount={plannerNoteLineCount}
          plannerNoteSearch={plannerNoteSearch}
          plannerNoteSearchCount={plannerNoteSearchCount}
          plannerNoteWordCount={plannerNoteWordCount}
          plannerQuickTemplates={plannerQuickTemplates}
          plannerStorageLabel={plannerStorageLabel}
          plannerTodoCount={plannerTodoCount}
          plannerTodoDraft={plannerTodoDraft}
          plannerTodoDueDateDraft={plannerTodoDueDateDraft}
          plannerTodoFilter={plannerTodoFilter}
          plannerTodoPriorityDraft={plannerTodoPriorityDraft}
          plannerTodoRecurrenceDraft={plannerTodoRecurrenceDraft}
          reminderStorageLabel={reminderStorageLabel}
          reorderPlannerTodo={reorderPlannerTodo}
          savePlannerTodoEdit={savePlannerTodoEdit}
          setDraggedPlannerTodoId={setDraggedPlannerTodoId}
          setEditingPlannerTodoDueDate={setEditingPlannerTodoDueDate}
          setEditingPlannerTodoPriority={setEditingPlannerTodoPriority}
          setEditingPlannerTodoRecurrence={setEditingPlannerTodoRecurrence}
          setEditingPlannerTodoText={setEditingPlannerTodoText}
          setPlannerBoard={setPlannerBoard}
          setPlannerNoteSearch={setPlannerNoteSearch}
          setPlannerTodoDraft={setPlannerTodoDraft}
          setPlannerTodoDueDateDraft={setPlannerTodoDueDateDraft}
          setPlannerTodoFilter={setPlannerTodoFilter}
          setPlannerTodoPriorityDraft={setPlannerTodoPriorityDraft}
          setPlannerTodoRecurrenceDraft={setPlannerTodoRecurrenceDraft}
          setSelectedCalendarDate={setSelectedCalendarDate}
          startEditingPlannerTodo={startEditingPlannerTodo}
          todayISO={todayISO}
          upcomingReminderCount={upcomingReminderCount}
          upcomingReminderPreview={upcomingReminderPreview}
            />
          </LazyTabPanel>
        )}

        {activeTab === 'insights' && (
          <LazyTabPanel label="Loading insights..." resetKey={`panel-${activeTab}`}>
            <InsightsTab
          achievementBadges={achievementBadges}
          entries={entries}
          entriesToNextReward={entriesToNextReward}
          navigateToTab={navigateToTab}
          returnRitual={returnRitual}
          rewardLevel={rewardLevel}
          unlockedAchievementCount={unlockedAchievementCount}
          weatherOptions={weatherOptions}
          weeklyCheckIns={weeklyCheckIns}
          weeklyGoal={weeklyGoal}
          weeklySummary={weeklySummary}
            />
          </LazyTabPanel>
        )}

        {activeTab === 'memories' && (
          <LazyTabPanel label="Loading memories..." resetKey={`panel-${activeTab}`}>
            <MemoriesTab
          archiveEntries={archiveEntries}
          calendarDays={calendarDays}
          calendarForecastByDate={calendarForecastByDate}
          calendarForecastLocation={calendarForecastLocation}
          calendarForecastPermission={calendarForecastPermission}
          calendarForecastStatus={calendarForecastStatus}
          calendarMonth={calendarMonth}
          deleteEntry={deleteEntry}
          deleteImportantDate={deleteImportantDate}
          entries={entries}
          entriesByDate={entriesByDate}
          entryTypeMeta={entryTypeMeta}
          formatDate={formatDate}
          formatForecastTemperature={formatForecastTemperature}
          formatMonthLabel={formatMonthLabel}
          formatReminderTime={formatReminderTime}
          getForecastVisuals={getForecastVisuals}
          getPlainTextFromHtml={getPlainTextFromHtml}
          importanceDetailsDraft={importanceDetailsDraft}
          importanceDraft={importanceDraft}
          importanceModalOpen={importanceModalOpen}
          importanceReminderEnabled={importanceReminderEnabled}
          importanceTimeDraft={importanceTimeDraft}
          importantDateCount={importantDateCount}
          importantDates={importantDates}
          loadCalendarForecast={loadCalendarForecast}
          memoriesCategoryFilter={memoriesCategoryFilter}
          memoriesView={memoriesView}
          notificationPermission={notificationPermission}
          notificationStatusMessage={notificationStatusMessage}
          openImportantDateEditor={openImportantDateEditor}
          requestNotificationPermission={requestNotificationPermission}
          saveImportantDate={saveImportantDate}
          selectedCalendarDate={selectedCalendarDate}
          selectedCalendarForecast={selectedCalendarForecast}
          selectedCalendarForecastVisuals={selectedCalendarForecastVisuals}
          selectedDateDiaryEntries={selectedDateDiaryEntries}
          selectedDateJournalEntries={selectedDateJournalEntries}
          selectedImportantDate={selectedImportantDate}
          setCalendarMonth={setCalendarMonth}
          setImportanceDetailsDraft={setImportanceDetailsDraft}
          setImportanceDraft={setImportanceDraft}
          setImportanceModalOpen={setImportanceModalOpen}
          setImportanceReminderEnabled={setImportanceReminderEnabled}
          setImportanceTimeDraft={setImportanceTimeDraft}
          setMemoriesCategoryFilter={setMemoriesCategoryFilter}
          setMemoriesView={setMemoriesView}
          setSelectedCalendarDate={setSelectedCalendarDate}
          setSelectedEntry={setSelectedEntry}
          shiftMonthKey={shiftMonthKey}
          todayISO={todayISO}
          upcomingReminderCount={upcomingReminderCount}
          upcomingReminderPreview={upcomingReminderPreview}
          weatherOptions={weatherOptions}
            />
          </LazyTabPanel>
        )}
      </section>

{activeTab === 'home' && (
          <LazyTabPanel
            label="Loading home section..."
            resetKey={`panel-${activeTab}-${activeHomeSection}`}
            title="The home panel paused for a moment."
            description="Try this panel again. Your diary, notes, and focus spaces are still there."
          >
            <HomeDesignPanel
          MASTER_ADMIN_EMAIL={MASTER_ADMIN_EMAIL}
          activeHomeSection={activeHomeSection}
          activeQuoteFont={activeQuoteFont}
          activeQuoteSize={activeQuoteSize}
          adminViewMode={adminViewMode}
          clearSeoStudioReport={clearSeoStudioReport}
          copySeoStudioReport={copySeoStudioReport}
          navigateToTab={navigateToTab}
          openHomeSection={openHomeSection}
          quoteIndex={quoteIndex}
          quoteLibrary={quoteLibrary}
          quoteStyle={quoteStyle}
          resources={resources}
          runSeoStudioReview={runSeoStudioReview}
          seoFaqs={seoFaqs}
          seoGuideGroups={seoGuideGroups}
          seoLandingBlocks={seoLandingBlocks}
          seoPopularSearches={seoPopularSearches}
          seoStudioApiKey={seoStudioApiKey}
          seoStudioCopied={seoStudioCopied}
          seoStudioError={seoStudioError}
          seoStudioLastRun={seoStudioLastRun}
          seoStudioLoading={seoStudioLoading}
          seoStudioModelUsed={seoStudioModelUsed}
          seoStudioPrompt={seoStudioPrompt}
          seoStudioReport={seoStudioReport}
          setAdminViewMode={setAdminViewMode}
          setCustomizerOpen={setCustomizerOpen}
          setQuoteIndex={setQuoteIndex}
          setSeoStudioApiKey={setSeoStudioApiKey}
          setSeoStudioPrompt={setSeoStudioPrompt}
          setShowSeoStudioKey={setShowSeoStudioKey}
          showAdminTools={showAdminTools}
          showMinimalHomeOverview={showMinimalHomeOverview}
          showSeoStudioKey={showSeoStudioKey}
          tips={tips}
          user={user}
          wellnessArticles={wellnessArticles}
            />
          </LazyTabPanel>
        )}

      
      <style>{`
        @keyframes lofiVinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes lofiGlowPulse {
          0%, 100% { opacity: 0.45; transform: scale(0.98); }
          50% { opacity: 0.9; transform: scale(1.04); }
        }
      `}</style>

      {/* Floating Lofi Radio Player */}
      <div className={`fixed z-50 ${isPhoneInterface ? (cookieConsentAccepted ? 'bottom-[7.25rem] left-4' : 'bottom-[13rem] left-4') : (cookieConsentAccepted ? 'bottom-12 left-4 sm:left-5 lg:bottom-16 xl:left-[max(1rem,calc((100vw-1280px)/2-4.25rem))]' : 'bottom-32 left-4 sm:bottom-28 sm:left-5 lg:bottom-32 xl:left-[max(1rem,calc((100vw-1280px)/2-4.25rem))]')}`}>

        <div ref={radioPlayerContainerRef} className="pointer-events-none absolute h-1 w-1 opacity-0" aria-hidden="true" />
        <div className="group relative h-[3.6rem] w-[3.6rem] sm:h-[3.9rem] sm:w-[3.9rem] lg:h-[4.05rem] lg:w-[4.05rem]">
          <div
            ref={radioDialRef}
            aria-label="Adjust lofi radio volume"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={radioVolume}
            className={`absolute inset-0 rounded-full p-[3px] transition duration-300 ${isRadioDialDragging ? 'scale-[1.03]' : ''} ${isRadioDialFeedbackVisible ? 'pointer-events-auto opacity-100 scale-100 shadow-soft' : 'pointer-events-none opacity-0 scale-90'} group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100`}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                setRadioVolume((current) => Math.min(current + 5, 100));
                revealRadioDialFeedback();
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                setRadioVolume((current) => Math.max(current - 5, 0));
                revealRadioDialFeedback();
              }
            }}
            role="slider"
            style={{
              background: `conic-gradient(from ${RADIO_DIAL_START - 90}deg, ${isRadioDialFeedbackVisible ? 'rgba(92, 131, 78, 0.95)' : 'rgba(194, 206, 189, 0.9)'} 0deg, ${isRadioDialFeedbackVisible ? 'rgba(92, 131, 78, 0.95)' : 'rgba(194, 206, 189, 0.9)'} ${radioDialSweepDegrees}deg, rgba(194, 206, 189, 0.95) ${radioDialSweepDegrees}deg, rgba(194, 206, 189, 0.95) ${RADIO_DIAL_SWEEP}deg, rgba(255, 255, 255, 0.18) ${RADIO_DIAL_SWEEP}deg, rgba(255, 255, 255, 0.18) 360deg)`
            }}
            tabIndex={0}
            title="Drag the knob to adjust the lofi radio volume"
          >
            <div className={`relative h-full w-full rounded-full border backdrop-blur-xl transition duration-300 ${isRadioPlaying ? 'border-[#e8dfd5] bg-white/76' : 'border-amber-200/50 bg-white/62'}`}>
              <div className="pointer-events-none absolute inset-[4px] rounded-full border border-[#e8dfd5]/70" />
              <div className="absolute inset-[3px] rounded-full" style={{ transform: `rotate(${radioDialDegrees}deg)` }}>
                <div
                  className={`absolute left-1/2 top-0 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${isRadioDialDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onPointerDown={handleRadioDialThumbPointerDown}
                  style={{ touchAction: 'none' }}
                >
                  <span className={`h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm transition ${isRadioPlaying ? 'bg-sage-700' : 'bg-sage-400'} ${isRadioDialFeedbackVisible ? 'opacity-100' : 'opacity-70'}`} />
                </div>
              </div>
            </div>
          </div>
          <button
            aria-label={isRadioPlaying ? 'Pause lofi radio' : 'Play lofi radio'}
            onClick={() => {
              if (isRadioPlaying) {
                setIsRadioPlaying(false);
                return;
              }

              setIsRadioPlaying(true);
              radioUnlockedRef.current = true;
              if (radioPlayerRef.current) {
                try {
                  radioPlayerRef.current.unMute?.();
                  radioPlayerRef.current.setVolume?.(radioVolume);
                  radioPlayerRef.current.playVideo?.();
                  setRadioNeedsInteraction(false);
                  setRadioStatusMessage('Lofi radio playing');
                } catch {}
              }
            }}
            className={`absolute inset-[0.74rem] z-20 flex items-center justify-center overflow-hidden rounded-full transition duration-300 hover:-translate-y-1 ${
              isRadioPlaying
                ? 'bg-sage-200/90 ring-1 ring-white/60 shadow-[0_8px_22px_rgba(72,111,66,0.18)] hover:bg-sage-200'
                : 'bg-sage-100/90 shadow-[0_8px_18px_rgba(72,111,66,0.12)] hover:bg-sage-100'
            }`}
            title={radioNeedsInteraction ? 'Tap once for sound' : radioStatusMessage}
            type="button"
          >
            {isRadioPlaying && (
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ animation: 'lofiGlowPulse 2.4s ease-in-out infinite', background: 'radial-gradient(circle, rgba(139, 181, 124, 0.34) 0%, rgba(139, 181, 124, 0.16) 42%, rgba(139, 181, 124, 0) 72%)' }}
              />
            )}
            <span
              className="relative flex h-full w-full items-center justify-center rounded-full"
              style={{ animation: isRadioPlaying ? 'lofiVinylSpin 6.8s linear infinite' : 'none' }}
            >
              <img
                alt="Lofi radio vinyl icon"
                className={`h-full w-full rounded-full object-cover transition duration-300 ${isRadioPlaying ? 'opacity-100 saturate-110' : 'opacity-90 saturate-75'}`}
                src={customCdImage || activeTheme.image || radioVinylIcon}
              />
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.42),transparent_28%),radial-gradient(circle_at_70%_72%,rgba(0,0,0,0.18),transparent_34%)]" />
              <span className="pointer-events-none absolute flex h-4 w-4 items-center justify-center rounded-full border border-amber-200/50 bg-sage-950/85 shadow-[0_0_0_3px_rgba(255,255,255,0.35)]">
                <span className="h-2 w-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff7d6,#d5b67f_58%,#6f4f2a)] shadow-[0_0_8px_rgba(255,244,212,0.45)]" />
              </span>
            </span>
          </button>
          {radioNeedsInteraction && (
            <div className="pointer-events-none absolute -top-14 left-1/2 w-max max-w-[11.5rem] -translate-x-1/2 rounded-2xl border border-[#d9c7b3] bg-[#fffaf0] px-3.5 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#22362e] shadow-[0_12px_26px_rgba(72,55,40,0.16)] backdrop-blur-xl">
              Turn on sound
            </div>
          )}
          <div className={`pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/75 bg-white/88 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sage-600 shadow-sm backdrop-blur-xl transition duration-300 ${isRadioDialFeedbackVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            {radioVolume}%
          </div>
        </div>
      </div>

      {!cookieConsentAccepted && (
        <div className="pointer-events-none fixed bottom-24 right-3 z-40 flex justify-end sm:bottom-6 sm:right-6">
          <div className="pointer-events-auto w-[min(22rem,calc(100vw-1.5rem))] rounded-[1.4rem] border border-amber-200/50/90 bg-white/94 p-4 shadow-soft backdrop-blur-xl">
            <p className="text-sm font-medium leading-relaxed text-sage-800">
              We use cookies and browser storage to keep Lofi Memory smooth and support ads. <span className="font-extrabold text-sage-900">We do not have access to your private diary entries; they are stored securely for you alone.</span> By staying here, you agree to our <a href="/privacy.html" className="font-bold text-sage-900 underline decoration-sage-300 hover:decoration-sage-500">Privacy Policy</a>, <a href="/terms.html" className="font-bold text-sage-900 underline decoration-sage-300 hover:decoration-sage-500">Terms</a>, and <a href="/cookie-policy.html" className="font-bold text-sage-900 underline decoration-sage-300 hover:decoration-sage-500">Cookie Policy</a>.
            </p>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  localStorage.setItem('quiet-journal-cookie-consent', 'true');
                  setCookieConsentAccepted(true);
                }}
                className="shrink-0 rounded-full bg-sage-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-sage-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-lg rounded-[1.7rem] border lofi-glass p-1.5 shadow-soft backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-8 gap-1">
        {[
          { id: 'unwind', label: 'Games', icon: Gamepad2 },
          { id: 'focus', label: 'Focus', icon: Leaf },
          { id: 'home', label: 'Chill', icon: Headphones },
          { id: 'write', label: 'Diary', icon: PenLine },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'breathe', label: 'Music', icon: Wind },
          { id: 'memories', label: 'Memory', icon: CalendarDays },
          { id: 'design', label: 'Design', icon: Palette }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const isWrite = tab.id === 'write';
          return (
          <button
            key={tab.id}
            className={`flex min-w-0 flex-col items-center gap-1.5 rounded-[1.2rem] px-1 py-2 transition ${isActive ? 'bg-white text-sage-950 shadow-sm ring-1 ring-sage-100' : isWrite ? 'text-sage-900' : 'text-sage-600 hover:bg-white/70 hover:text-sage-800'}`}
            onClick={() => {
              if (tab.id === 'design') {
                setCustomizerOpen(true);
              } else if (tab.id === 'home') {
                openHomeSection('home');
              } else {
                navigateToTab(tab.id);
              }
            }}
            type="button"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-2xl transition ${isActive ? 'bg-sage-900 text-white shadow-sm' : isWrite ? 'bg-sage-900 text-white shadow-sm' : 'bg-sage-50 text-sage-700'}`}>
              <tab.icon size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{tab.label}</span>
            <span className={`h-1 w-5 rounded-full transition ${isActive ? 'bg-sage-700 opacity-100' : 'opacity-0'}`}></span>
          </button>
          );
        })}
        </div>
      </div>

      {Boolean(selectedEntry) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm" onClick={() => { if (!isEditingEntry) setSelectedEntry(null); }}>
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-soft lg:p-9" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                {isEditingEntry ? (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {weatherOptions.map((mood) => (
                      <button
                        className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${editMood === mood.label ? 'bg-sage-900 text-white' : 'bg-sage-100 text-sage-800 hover:bg-sage-200'}`}
                        key={mood.label}
                        onClick={() => setEditMood(mood.label)}
                        type="button"
                      >
                        <WeatherGlyph mood={mood} size="text-base" /> {mood.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-bold uppercase tracking-widest text-sage-600 flex flex-wrap items-center gap-2"><span>{selectedEntry.mood} · {formatDate(selectedEntry.createdAt)}</span><span className="rounded-full border border-sage-200 bg-sage-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-sage-900">{entryTypeMeta[selectedEntry.entryType || 'diary'].shortLabel}</span></div>
                )}
                {isEditingEntry ? (
                  <input
                    className="w-full rounded-2xl border border-[#e8dfd5] bg-sage-50/80 px-4 py-3 text-2xl font-extrabold text-ink outline-none focus:border-sage-400"
                    onChange={(event) => setEditTitle(event.target.value)}
                    value={editTitle}
                  />
                ) : (
                  <h3 className="mt-2 text-3xl font-extrabold text-ink">{selectedEntry.title}</h3>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!isEditingEntry ? (
                  <>
                    <button className="rounded-full bg-sage-100 px-4 py-2 text-sm font-extrabold text-sage-900 transition hover:bg-sage-200" onClick={startEditingEntry} type="button">Edit</button>
                    <button className="rounded-full bg-rose-100 px-4 py-2 text-sm font-extrabold text-rose-900 transition hover:bg-rose-200" onClick={() => { if(window.confirm('Delete this entry?')) deleteEntry(selectedEntry.id); }} type="button">Delete</button>
                  </>
                ) : (
                  <>
                    <button className="rounded-full bg-sage-100 px-4 py-2 text-sm font-extrabold text-sage-900 transition hover:bg-sage-200" onClick={() => setIsEditingEntry(false)} type="button">Cancel</button>
                    <button className="rounded-full bg-sage-900 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-sage-800" onClick={saveEditedEntry} type="button">Save</button>
                  </>
                )}
                <button className="rounded-full bg-sage-100 px-4 py-2 text-sm font-extrabold text-sage-900 transition hover:bg-sage-200" onClick={() => { setSelectedEntry(null); setIsEditingEntry(false); }} type="button">Close</button>
              </div>
            </div>
            {Boolean(selectedEntry?.prompt) && !isEditingEntry && (
              <div className="mb-5 rounded-2xl bg-sage-50 p-4 text-sm font-bold leading-7 text-sage-900">
                Reflection prompt: {selectedEntry.prompt}
              </div>
            )}
            {isEditingEntry ? (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[1.4rem] border border-amber-100/80 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
                  <button className="rounded-full bg-white px-3.5 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:bg-sage-50" onClick={() => toggleBoldText(editBodyRef, setEditBody)} title="Bold selected text" type="button">Bold</button>
                  <button className="rounded-full bg-white px-3.5 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:bg-sage-50" onClick={() => toggleUnderlineText(editBodyRef, setEditBody)} title="Underline selected text" type="button">Underline</button>
                  <button className="rounded-full bg-white px-3.5 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:bg-sage-50" onClick={() => toggleBulletList(editBodyRef, setEditBody)} title="Bullet points" type="button">List</button>
                  {quickEmojis.slice(0, 6).map((emoji) => (
                    <button key={emoji} className="rounded-full bg-white px-2.5 py-1 text-base shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={() => insertEditQuickEmoji(emoji)} type="button">
                      {emoji}
                    </button>
                  ))}
                  <label className="ml-auto flex cursor-pointer items-center gap-2 rounded-full bg-sage-800 px-3.5 py-2 text-xs font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-sage-700">
                    <ImagePlus size={14} /> Photo
                    <input accept="image/*" className="hidden" onChange={handleEditEntryImageUpload} type="file" />
                  </label>
                </div>
                <div className="journal-editor-shell rounded-[3rem] p-3 md:p-4">
                  <div className="journal-editor-ribbon">quiet diary</div>
                  <div className="journal-editor-meta mb-3 flex flex-wrap items-center justify-end gap-2 px-3 text-xs font-bold uppercase tracking-[0.24em] text-sage-500">
                    <span>{editMood} mood · revisit gently</span>
                  </div>
                  <div
                    ref={editBodyRef}
                    className="journal-editor journal-editor-soft min-h-72 w-full overflow-auto rounded-[2.2rem] px-6 py-6 outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    style={{ fontFamily: activeJournalFont, fontSize: activeJournalSize, lineHeight: 1.95, color: '#24312e', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    onInput={(e) => setEditBody(sanitizeJournalHtml(e.currentTarget.innerHTML))}
                    data-placeholder=""
                  />
                </div>
              </>
            ) : (
              <div className="text-lg leading-8 text-sage-900">{renderJournalContent(selectedEntry.body || 'No body text was saved for this entry.')}</div>
            )}
          </div>
        </div>
      )}

      <button
        className={`fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-sage-900 text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800 ${isPhoneInterface ? (cookieConsentAccepted ? 'bottom-[7.25rem] right-4' : 'bottom-[13rem] right-4') : (cookieConsentAccepted ? 'bottom-6 right-6' : 'bottom-6 left-6')}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        type="button"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
      </div>
    </main>
  );
}

export default App;
// rebuilt refactor pass
