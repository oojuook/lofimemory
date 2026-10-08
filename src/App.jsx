import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import radioVinylIcon from './assets/lofi-radio-vinyl.png';
import headerLogoIcon from './assets/lofi-header-logo.png';
import minesweeperIconImage from './assets/minesweeper-icon.png';
import solitaireIconImage from './assets/solitaire-icon.png';
import solitairePreviewImage from './assets/solitaire-preview.png';
import sudokuIconImage from './assets/sudoku-icon.png';
import wordleIconImage from './assets/wordle-icon.png';
import dinoDashPreviewImage from './assets/dino-dash-preview.png';
import dinoDashIconImage from './assets/dino-dash-icon.png';
import rainWallpaperImage from './assets/rain-wallpaper.png';
import fireWallpaperImage from './assets/fire-wallpaper.png';
import lofiRoomWallpaperImage from './assets/lofi-room-wallpaper.png';
import lotusMatchPreviewImage from './assets/lotus-match-preview.png';
import gamesSectionPreviewImage from './assets/games-section-preview.png';
import diarySectionPreviewImage from './assets/diary-section-preview.png';
import notesSectionPreviewImage from './assets/notes-section-preview.png';
import musicSectionPreviewImage from './assets/music-section-preview.png';
import memoriesSectionPreviewImage from './assets/memories-section-preview.png';
import designSectionPreviewImage from './assets/design-section-preview.png';
import gameSolitairePreview from './assets/game-solitaire-preview.png';
import gameMindSweeperPreview from './assets/game-mind-sweeper-preview.png';
import gameDriftingSeedPreview from './assets/game-drifting-seed-preview.png';
import gameLilypadPreview from './assets/game-lilypad-preview.png';
import gameJigsawPreview from './assets/game-jigsaw-preview.png';
import gameLotusPreview from './assets/game-lotus-preview.png';
import gameTilesPreview from './assets/game-tiles-preview.png';
import gameTetrisPreview from './assets/game-tetris-preview.png';
import gameSlidePreview from './assets/game-slide-preview.png';
import gameSudokuPreview from './assets/game-sudoku-preview.png';
import gameWordlePreview from './assets/game-wordle-preview.png';
import gameWordsPreview from './assets/game-words-preview.png';
import gameTypingPreview from './assets/game-typing-preview.png';
import gameCluesPreview from './assets/game-clues-preview.png';
import gameSnakePreview from './assets/game-snake-preview.png';
import gameDinoPreview from './assets/game-dino-preview.png';
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
  Paintbrush,
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
  Type,
  Waves,
  Wind,
  Zap,
  Flame,
} from 'lucide-react';
import ZenGame from './ZenGame';
import StreamSurfer from './StreamSurfer';
import LotusMatch from './LotusMatch';
import DinosaurDash from './DinosaurDash';
import MindSweeper from './MindSweeper';
import QuietTiles from './QuietTiles';
import QuietTetris from './QuietTetris';
import QuietSlide from './QuietSlide';
import QuietWords from './QuietWords';
import TypingSpeedTest from './TypingSpeedTest';
import QuietClues from './QuietClues';
import QuietWordle from './QuietWordle';
import QuietSudoku from './QuietSudoku';
import QuietSnake from './QuietSnake';
import Solitaire from './Solitaire';
import LofiJigsaw from './LofiJigsaw';
import { auth, db, getMessagingIfSupported, googleProvider } from './firebase';

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
  { title: 'Why daily word puzzles make relaxing breaks easier', read: 'Article • 4 min read', body: 'See why daily word puzzles feel so satisfying during short breaks and how a calm Wordle-style game can fit naturally into a relaxing online routine.', href: '/article-daily-word-puzzles-relax.html' },

  { title: 'Why word guessing games feel good when your mind is busy', read: 'Article • 4 min read', body: 'Understand why guess-the-word games feel grounding when your mind is overloaded and how a calm Wordle-style round can become a simple reset.', href: '/article-word-guessing-games-busy-mind.html' },

  { title: 'How gentle memory games provide cognitive relief before writing', read: 'Article • 4 min read', body: 'Understand why playing a simple memory match game can help organize your thoughts and reduce brain fog before journaling.', href: '/article-memory-games-cognitive-relief.html' },

  { title: 'Why mindless gaming helps relieve stress before journaling', read: 'Article • 4 min read', body: 'Discover how simple, repetitive browser games act as a palate cleanser for your brain, reducing anxiety before you start writing.', href: '/article-why-gaming-helps-anxiety.html' },

  {
    title: 'Why brain dumping at night helps you sleep',
    read: 'Article • 4 min read',
    body: 'Discover how emptying your mind into a private journal before bed reduces anxiety and improves sleep quality.',
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
    body: 'Explore the psychological benefits of expressive writing and why putting emotions into words helps us heal.',
    href: '/article-psychology-of-journaling.html'
  },
  {
    title: 'How to protect your privacy when journaling online',
    read: 'Article • 4 min read',
    body: 'A guide to understanding digital privacy, secure diaries, and keeping your personal thoughts completely safe.',
    href: '/article-protect-privacy-journaling-online.html'
  },

  {
    title: 'How to start a journaling habit for anxiety',
    read: 'Article • 7 min read',
    body: 'Writing down your thoughts can be a powerful tool for managing anxiety. However, starting a journaling habit often feels overwhelming. This comprehensive guide will help you build a journaling routine that feels gentle, sustainable, and truly helpful for your mental health.',
    href: '/article-how-to-start-journaling-habit.html'
  },
  {
    title: 'The unexpected benefits of a private online diary',
    read: 'Article • 6 min read',
    body: 'For centuries, people have kept written records of their lives. Today, transitioning that practice to a private online diary offers profound psychological benefits. From enhanced emotional regulation to unparalleled convenience, digital journaling is a modern tool for mindfulness.',
    href: '/article-benefits-of-private-online-diary.html'
  },
  {
    title: 'Why daily reflection is essential for mental health',
    read: 'Article • 6 min read',
    body: 'We live in a culture that prioritizes forward momentum. In this relentless pace, taking time for daily reflection is not just a luxury; it is a fundamental requirement for maintaining long-term mental health and building deep self-awareness.',
    href: '/article-daily-reflection-mental-health.html'
  },
  {
    title: 'Journaling prompts for deep self-discovery',
    read: 'Article • 5 min read',
    body: 'Staring at a blank page can be intimidating. When you want to journal but don\'t know where to start, these carefully curated journaling prompts act as a gentle guide, leading you toward profound self-discovery and emotional clarity without the pressure.',
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
    body: 'A private online diary is easier to revisit, search, and keep close through daily life, while a paper journal can feel tactile and slower. The better choice is the one you will genuinely return to. For many people, privacy controls, mood tracking, and easier access make a digital diary feel more sustainable.'
  },
  {
    title: 'How to keep a diary privately online',
    read: 'Helpful guide',
    body: 'If you want to keep a diary privately online, choose one calm space, use a consistent login, add a lock when it helps, and keep your entries easy to begin. Privacy is not just technical. It also comes from trusting the place where you write.'
  }
];

const seoLandingBlocks = [
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
    title: 'About Lofi Memory',
    text: 'Learn what the product includes, why the experience is intentionally calm, and how journaling, music, and games fit together.',
    href: '/about.html'
  },
  {
    title: 'Protect privacy when journaling online',
    text: 'Read a practical article on trust signals, storage expectations, and how to choose a calmer place to write online.',
    href: '/article-protect-privacy-journaling-online.html'
  },
  {
    title: 'Why journaling helps',
    text: 'Understand the psychology of journaling and why writing things down can make thoughts easier to process and revisit.',
    href: '/article-psychology-of-journaling.html'
  },
  {
    title: 'How to start a journaling habit',
    text: 'Use a simple article on building a realistic writing rhythm that feels gentle enough to keep during busy weeks.',
    href: '/article-how-to-start-journaling-habit.html'
  },
  {
    title: 'Games before writing',
    text: 'See why a short memory or cozy puzzle break can help your attention settle before you start reflecting.',
    href: '/article-memory-games-cognitive-relief.html'
  },
  {
    title: 'Brain dumping for sleep',
    text: 'Read how a short end-of-day writing habit can lower mental clutter and make nighttime feel calmer.',
    href: '/article-brain-dumping-sleep.html'
  }
];

const seoFaqs = [
  {
    question: 'What is Lofi Memory?',
    answer: 'Lofi Memory is a calm online space for journaling, breathing, private reflection, and chill browser games when you want to relax for a while.'
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
    answer: 'Lofi Memory gives you a calm browser space to write, unwind, track moods, and jump into a chill game before coming back to your thoughts.'
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
  { label: 'Helpful read', title: 'Daily reflection and mental health', text: 'Read why short, honest check-ins are often easier to sustain than heavier self-improvement systems.', href: '/article-daily-reflection-mental-health.html' },
  { label: 'Helpful read', title: 'Brain dumping before sleep', text: 'See how a short writing habit can reduce bedtime mental clutter and support calmer evenings.', href: '/article-brain-dumping-sleep.html' },
  { label: 'Helpful read', title: 'How a digital journal can reduce distractions', text: 'Explore why the right online setup can feel simpler, not noisier, when your goal is focus.', href: '/article-digital-journal-distractions.html' },
  { label: 'Helpful read', title: 'Journaling prompts for self-discovery', text: 'Use gentler prompts that help you begin without turning the page into a performance.', href: '/article-journaling-prompts-self-discovery.html' },
  { label: 'Helpful read', title: 'Memory games before writing', text: 'Read why a short puzzle break can help your attention settle before reflection.', href: '/article-memory-games-cognitive-relief.html' },
  { label: 'Helpful read', title: 'Why gaming helps anxiety for some people', text: 'Understand what repetitive, low-stakes play can offer as a small buffer between stress and the next task.', href: '/article-why-gaming-helps-anxiety.html' },
  { label: 'Helpful read', title: 'Daily word puzzles for relaxing breaks', text: 'See why familiar word loops can feel grounding when you want a tidy reset.', href: '/article-daily-word-puzzles-relax.html' },
  { label: 'Helpful read', title: 'Word guessing games when your mind is busy', text: 'Learn how small pattern-recognition wins can provide relief without demanding too much energy.', href: '/article-word-guessing-games-busy-mind.html' },
  { label: 'Helpful read', title: 'Benefits of lofi gaming for focus', text: 'Explore how music, visual softness, and low-pressure play can work together as a gentler online break.', href: '/article-benefits-lofi-gaming-mental-health.html' }
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
    links: seoGuidePages.filter((page) => ['How to protect your privacy when journaling online', 'The psychology of journaling', 'How to start a journaling habit', 'Benefits of a private online diary', 'Daily reflection and mental health', 'Brain dumping before sleep', 'How a digital journal can reduce distractions', 'Journaling prompts for self-discovery'].includes(page.title))
  },
  {
    title: 'Explore calmer game-break reads',
    description: 'Best for visitors who like the music-and-games side of Lofi Memory but still want article-level value before they click around.',
    links: seoGuidePages.filter((page) => ['Memory games before writing', 'Why gaming helps anxiety for some people', 'Daily word puzzles for relaxing breaks', 'Word guessing games when your mind is busy', 'Benefits of lofi gaming for focus'].includes(page.title))
  }
];

const seoPopularSearches = [
  { label: 'Lofi Memory blog', href: '/blog.html' },
  { label: 'About Lofi Memory', href: '/about.html' },
  { label: 'Editorial policy', href: '/editorial-policy.html' },
  { label: 'Privacy policy', href: '/privacy.html' },
  { label: 'How journaling helps', href: '/article-psychology-of-journaling.html' },
  { label: 'Protect privacy when journaling online', href: '/article-protect-privacy-journaling-online.html' },
  { label: 'How to start a journaling habit', href: '/article-how-to-start-journaling-habit.html' },
  { label: 'Benefits of a private online diary', href: '/article-benefits-of-private-online-diary.html' },
  { label: 'Daily reflection and mental health', href: '/article-daily-reflection-mental-health.html' },
  { label: 'Brain dumping before sleep', href: '/article-brain-dumping-sleep.html' },
  { label: 'Memory games before writing', href: '/article-memory-games-cognitive-relief.html' },
  { label: 'Why gaming helps anxiety', href: '/article-why-gaming-helps-anxiety.html' },
  { label: 'Word puzzles for relaxing breaks', href: '/article-daily-word-puzzles-relax.html' },
  { label: 'Word guessing games and busy minds', href: '/article-word-guessing-games-busy-mind.html' },
  { label: 'Benefits of lofi gaming for focus', href: '/article-benefits-lofi-gaming-mental-health.html' }
];

const THEME_STORAGE_KEY = 'quiet-journal-theme-v1';
const DESIGN_STORAGE_KEY = 'quiet-journal-design-v1';
const CUSTOM_COLOR_STORAGE_KEY = 'quiet-journal-custom-color-v1';
const QUOTE_BG_STORAGE_KEY = 'quiet-journal-quote-bg-v1';
const COMFORT_MODE_STORAGE_KEY = 'quiet-journal-comfort-mode-v1';
const WALLPAPER_STORAGE_KEY = 'quiet-journal-wallpaper-v1';

const colorThemes = [
  { id: 'sage', name: 'Sage Calm', accent: '#587f49', soft: '#edf4e8', glow: '#bfd8b0' },
  { id: 'lavender', name: 'Lavender Rest', accent: '#7c6aa6', soft: '#f0ecfb', glow: '#c9bce8' },
  { id: 'ocean', name: 'Ocean Breath', accent: '#387f8f', soft: '#e7f5f7', glow: '#a8d8df' },
  { id: 'sunrise', name: 'Warm Sunrise', accent: '#b97843', soft: '#fff0df', glow: '#edc194' },
  { id: 'rose', name: 'Rose Kindness', accent: '#a96b76', soft: '#fbebee', glow: '#e8bbc3' }
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
    title: 'Rain Window',
    sound: 'Rain ambience',
    description: 'A blue-green wallpaper with soft rain for slower breathing and calm focus.',
    icon: CloudRain,
    status: 'Rain wallpaper selected — soft rain ambience is ready.',
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
    title: 'Fireplace Nook',
    sound: 'Wood burning',
    description: 'A warm hearth wallpaper with gentle crackle for a cozy writing reset.',
    icon: Flame,
    status: 'Fireplace wallpaper selected — wood-burning ambience is ready.',
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
  const allowedTabs = new Set(['home', 'write', 'notes', 'memories', 'breathe', 'insights', 'design']);
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
  return <ImageGameIcon {...props} alt="Wordle icon" src={wordleIconImage} />;
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

function GameSplash({ game, isClosing = false }) {
  const Icon = game?.icon || Gamepad2;
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#fffaf2] transition-all duration-[800ms] ease-in-out ${isClosing ? 'scale-110 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
      <div className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")' }}></div>
      <div className="relative text-center">
        <div className={`mx-auto mb-10 flex h-32 w-34 items-center justify-center rounded-[3rem] bg-gradient-to-br shadow-soft ${game?.tone || 'from-sage-100 to-white'}`}>
          <Icon size={56} className="animate-pulse" />
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.45em] text-sage-500">Launching your space</p>
        <h2 className="mt-4 font-display text-6xl font-bold tracking-tight text-sage-950">{game?.title}</h2>
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-sage-100">
            <div className="h-full bg-sage-600 transition-all duration-[1200ms] ease-out w-full" style={{ animation: 'gameSplashProgress 1.4s ease-in-out infinite' }} />
          </div>
          <p className="text-xs font-semibold italic text-sage-400">Arriving softly...</p>
        </div>
      </div>
    </div>
  );
}

function GamePreview({ gameId }) {
  const shellClass = 'mt-4 overflow-hidden rounded-[1.35rem] border border-sage-100 bg-sage-50/80 p-3 shadow-inner';

  if (gameId === 'drifting-leaf') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-emerald-100 via-lime-50 to-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3a5a48 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
          <div className="flex items-center gap-5 text-2xl text-emerald-700 relative animate-bounce" style={{ animationDuration: '3.5s' }}>
            <span>🍃</span><span className="opacity-40 text-sm">•</span><span>🌰</span>
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'stream-surfer') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 gap-2 rounded-[1rem] bg-gradient-to-b from-sky-100 to-cyan-50 p-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/40 animate-pulse"></div>
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="relative rounded-full bg-white/40 border border-white/20 h-4">
              {lane === 1 && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🐸</span>}
              {lane !== 1 && <span className={`absolute ${lane === 0 ? 'right-6' : 'left-8'} top-1/2 -translate-y-1/2 text-sm opacity-60`}>🪷</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameId === 'lofi-jigsaw') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 grid-cols-4 gap-1 rounded-[1rem] bg-sage-100 p-2 overflow-hidden relative">
          {[0, 1, 2, 3, 4, '', 5, 6, 7, 8, 9, 10].map((tile, i) => {
            const row = tile === '' ? 1 : Math.floor(tile / 4);
            const col = tile === '' ? 1 : tile % 4;
            return (
              <div
                key={i}
                className={`rounded-md border ${tile === '' ? 'border-dashed border-sage-200 bg-white/30' : 'border-white/70 bg-cover shadow-sm'} flex items-center justify-center text-[8px] font-black text-white transition-transform duration-1000 ease-in-out`}
                style={tile === '' ? {} : {
                  backgroundImage: 'url(/lofi-jigsaw-wallpaper.png)',
                  backgroundSize: '400% 300%',
                  backgroundPosition: `${col * 33.33}% ${row * 50}%`,
                  animation: tile === 4 ? 'jigsawTileNudge 3s infinite ease-in-out' : (tile === 5 ? 'jigsawTileNudge 3s infinite ease-in-out reverse' : undefined)
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (gameId === 'lotus-match') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 overflow-hidden rounded-[1rem] bg-rose-100">
          <img src={lotusMatchPreviewImage} alt="Lotus Match preview" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {['A♠', 'K♥', 'Q♦'].map((card) => (
              <span key={card} className="flex h-8 w-6 items-center justify-center rounded-md border border-white/70 bg-white/86 text-[10px] font-black text-rose-800 shadow-sm">{card}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-tiles') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 grid-cols-4 gap-1.5 rounded-[1rem] bg-gradient-to-br from-violet-100 to-slate-50 p-2">
          {[2, 4, 8, 16, '', 32, '', 64].map((val, i) => (
            <div key={i} className={`flex h-full items-center justify-center rounded-lg ${val ? 'bg-white shadow-sm text-violet-700 font-bold' : 'bg-white/30'} text-[9px]`}>
              {val}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-tetris') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 rounded-[1rem] bg-gradient-to-br from-indigo-100 to-sky-50 p-2 overflow-hidden">
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-4 h-4 bg-indigo-400 rounded-sm"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-sm shadow-sm"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-sm"></div>
          </div>
          <div className="absolute top-2 right-6 w-4 h-8 bg-sky-400 rounded-sm animate-bounce" style={{ animationDuration: '2.5s' }}></div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-slide') {
    return (
      <div className={shellClass}>
        <div className="grid h-20 grid-cols-3 gap-1 rounded-[1rem] bg-gradient-to-br from-amber-100 to-stone-50 p-1.5 shadow-inner">
          {[1, 2, 3, 4, '', 5, 6, 7, 8].map((v, i) => (
            <div key={i} className={`flex h-full items-center justify-center rounded-md ${v ? 'bg-white shadow-sm text-amber-700 font-bold' : 'bg-transparent'} text-[10px]`}>
              {v}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-words') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-fuchsia-100 to-rose-50 p-2 relative overflow-hidden">
          <div className="flex gap-2">
             <div className="w-12 h-14 bg-white rounded-lg shadow-sm border border-fuchsia-100 rotate-[-4deg] flex items-center justify-center text-xl font-display text-fuchsia-800">A</div>
             <div className="w-12 h-14 bg-white rounded-lg shadow-sm border border-fuchsia-100 rotate-[3deg] flex items-center justify-center text-xl font-display text-fuchsia-800">B</div>
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'typing-speed-test') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 flex-col justify-center gap-2 rounded-[1rem] bg-gradient-to-br from-sky-100 to-indigo-50 p-3 overflow-hidden">
          <div className="h-1.5 w-full bg-white/70 rounded-full"></div>
          <div className="h-1.5 w-[85%] bg-white/70 rounded-full"></div>
          <div className="h-1.5 w-[65%] bg-sky-500 rounded-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-indigo-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-clues') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-amber-100 to-rose-50 p-2">
           <div className="w-full bg-white/90 p-2 rounded border border-amber-200 shadow-sm space-y-1.5">
             <div className="h-1 w-full bg-amber-100 rounded-full opacity-60"></div>
             <div className="h-1 w-3/4 bg-amber-100 rounded-full opacity-60"></div>
             <div className="flex gap-1 pt-1">
               <div className="w-4 h-4 border border-amber-300 rounded-sm flex items-center justify-center text-[8px] font-bold text-amber-700 bg-amber-50">1</div>
               <div className="w-4 h-4 border border-amber-200 rounded-sm bg-amber-50/30"></div>
               <div className="w-4 h-4 border border-amber-200 rounded-sm bg-amber-50/30"></div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-wordle') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-gradient-to-br from-teal-100 to-sky-50 p-2">
          <div className="flex gap-1">
            {['C', 'O', 'Z', 'Y'].map((l, i) => (
              <div key={i} className={`w-7 h-7 rounded border flex items-center justify-center text-[11px] font-bold ${i < 2 ? 'bg-teal-500 border-teal-600 text-white shadow-sm' : 'bg-white border-teal-200 text-teal-700'}`}>{l}</div>
            ))}
          </div>
          <div className="flex gap-1 opacity-40">
            {[0, 1, 2, 3].map((i) => <div key={i} className="w-7 h-7 rounded border border-teal-100 bg-white"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-sudoku') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-cyan-100 to-blue-50 p-2">
           <div className="grid grid-cols-3 grid-rows-3 gap-0.5 border border-cyan-200 p-0.5 bg-white rounded shadow-sm">
             {[1,'',3,'',5,'',7,'',9].map((v, i) => (
               <div key={i} className="w-4 h-4 flex items-center justify-center text-[9px] text-cyan-800 font-bold border border-cyan-50">{v}</div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (gameId === 'mind-sweeper') {
    return (
      <div className={shellClass}>
        <div className="flex h-20 items-center justify-center rounded-[1rem] bg-gradient-to-br from-lime-100 to-emerald-50 p-2">
           <div className="grid grid-cols-4 gap-1 bg-white/70 p-1.5 rounded-lg border border-lime-200 shadow-sm">
             {[0,1,2,3,4,5,6,7].map((i) => (
               <div key={i} className={`w-4 h-4 rounded-sm border ${i === 2 ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-lime-100 shadow-tiny'} flex items-center justify-center text-[8px] font-bold`}>
                 {i === 2 ? '🚩' : (i === 5 ? '1' : '')}
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (gameId === 'quiet-snake') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 rounded-[1rem] bg-gradient-to-br from-emerald-100 to-lime-50 p-2 overflow-hidden">
          <div className="absolute top-4 left-6 flex flex-col gap-0.5 rotate-[15deg]">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-sm"></div>
            <div className="w-3 h-3 bg-emerald-300 rounded-sm"></div>
          </div>
          <div className="absolute bottom-6 right-10 w-3 h-3 bg-rose-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
        </div>
      </div>
    );
  }

  if (gameId === 'solitaire') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 overflow-hidden rounded-[1rem] bg-gradient-to-br from-emerald-800 to-teal-900 shadow-inner">
          <img alt="Solitaire preview" className="h-full w-full object-cover" src={solitairePreviewImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 via-transparent to-white/10" />
        </div>
      </div>
    );
  }

  if (gameId === 'dinosaur-dash') {
    return (
      <div className={shellClass}>
        <div className="relative h-20 overflow-hidden rounded-[1rem] bg-gradient-to-br from-orange-100 to-yellow-50 shadow-inner">
          <img alt="Dinosaur Dash preview" className="h-full w-full object-cover" src={dinoDashPreviewImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-950/10 via-transparent to-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div className="relative h-20 rounded-[1rem] bg-gradient-to-b from-stone-100 to-amber-50 p-3 flex items-center justify-center">
        <Gamepad2 className="text-stone-300" size={34} />
      </div>
    </div>
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
    return saved ? JSON.parse(saved) : [];
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

function getPlainTextFromHtml(html = '') {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
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

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="group rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-white/95 to-white/75 p-5 text-center shadow-lift backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="flex flex-col items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${tone}`}>
          <Icon size={21} />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sage-800">{label}</p>
      </div>
      <p className="mt-4 break-words text-2xl font-extrabold leading-tight tracking-tight text-ink">{value}</p>
    </div>
  );
}

function WeatherGlyph({ mood, size = 'text-3xl' }) {
  if (mood?.image) {
    return <img alt={mood.label} className="inline-block h-9 w-9 rounded-2xl object-cover shadow-sm" src={mood.image} />;
  }
  return <span className={`inline-block ${size}`} aria-label={mood?.label}>{mood?.emoji || '🌙'}</span>;
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-9 max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-sage-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-5xl font-bold leading-tight text-sage-950">{title}</h2>
      {text && <p className="mt-4 text-lg leading-8 text-sage-800">{text}</p>}
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <article className="customizable-card rounded-3xl border border-white/70 bg-white/75 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/90">
      <div className="theme-icon mb-5 flex h-12 w-12 items-center justify-center rounded-3xl bg-sage-100 text-sage-800">
        <Icon size={22} />
      </div>
      <h3 className="text-2xl font-extrabold text-ink">{title}</h3>
      <div className="mt-3 leading-7 text-sage-800">{children}</div>
    </article>
  );
}


function ThemeStudio({
  selectedTheme,
  selectedDesign,
  customColor,
  quoteBg,
  journalStyle,
  quoteStyle,
  customWeatherName,
  customWeatherEmoji,
  customWeatherImage,
  customWeathers,
  wallpaperImage,
  isOpen,
  onClose,
  onThemeChange,
  onDesignChange,
  onCustomColorChange,
  onQuoteBgChange,
  onAtmosphereApply,
  onCustomWeatherNameChange,
  onCustomWeatherEmojiChange,
  onCustomWeatherImageUpload,
  onWallpaperImageUpload,
  onWallpaperRemove,
  onAddCustomWeather,
  onDeleteCustomWeather
}) {
  return (
    <div className={`customizer-shell fixed inset-y-0 right-0 z-30 flex transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`fixed inset-0 bg-ink/20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside id="design" className={`relative h-full w-screen max-w-5xl overflow-y-auto bg-white/95 shadow-soft backdrop-blur-xl transition duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="grid min-h-full lg:grid-cols-12">
          <div className="theme-panel p-7 text-white lg:col-span-4 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <Palette className="text-white/90" size={34} />
              <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30" onClick={onClose} type="button">Done</button>
            </div>
            <p className="mt-7 text-sm font-bold uppercase tracking-widest text-white/80">Customize your space</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight">Choose the look that feels right today.</h2>
            <p className="mt-4 leading-7 text-white/85">Visitors can personalize colors and style. Their choice is saved only in their own browser, and this drawer can stay tucked away.</p>
          </div>
          <div className="space-y-7 p-7 lg:col-span-8 lg:p-8">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><Paintbrush size={16} /> Color theme</div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {colorThemes.map((theme) => (
                  <button
                    className={`custom-option rounded-3xl border p-4 text-left transition hover:-translate-y-1 ${selectedTheme === theme.id ? 'is-selected border-sage-500 bg-sage-50 shadow-lift' : 'border-sage-100 bg-white'}`}
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                    }}
                    type="button"
                  >
                    <span className="mb-3 block h-9 w-full rounded-2xl" style={{ background: `linear-gradient(135deg, ${theme.soft}, ${theme.accent})` }} />
                    <span className="block text-sm font-extrabold text-ink">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <label className="custom-option rounded-3xl border border-sage-100 bg-white p-5 shadow-sm lg:col-span-1">
                <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-sage-700">Custom color</span>
                <input
                  aria-label="Choose a custom accent color"
                  className="h-12 w-full cursor-pointer rounded-2xl border border-sage-100 bg-white p-1"
                  onChange={(event) => {
                    onCustomColorChange(event.target.value);
                    onThemeChange('custom');
                  }}
                  type="color"
                  value={customColor}
                />
                <span className="mt-3 block text-sm font-semibold text-sage-700">Pick any accent color.</span>
              </label>
              <div className="grid gap-3 lg:col-span-2">
                {designStyles.map((style) => (
                  <button
                    className={`custom-option flex items-center justify-between rounded-3xl border bg-white p-4 text-left transition hover:-translate-y-1 ${selectedDesign === style.id ? 'is-selected border-sage-500 shadow-lift' : 'border-sage-100'}`}
                    key={style.id}
                    onClick={() => {
                      onDesignChange(style.id);
                    }}
                    type="button"
                  >
                    <span>
                      <span className="block font-extrabold text-ink">{style.name}</span>
                      <span className="text-sm text-sage-700">{style.description}</span>
                    </span>
                    <span className="theme-dot h-8 w-8 rounded-full" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><ImagePlus size={16} /> Wallpaper</div>
              <p className="text-sm leading-6 text-sage-700">Import your own calm wallpaper. It stays soft behind the app with a blur overlay so the page still feels minimal and easy to read.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-sage-300 bg-sage-50/80 px-4 py-4 text-sm font-bold text-sage-800 transition hover:bg-sage-100">
                  <ImagePlus size={18} /> Import wallpaper
                  <input accept="image/*" className="hidden" onChange={onWallpaperImageUpload} type="file" />
                </label>
                <button className="rounded-2xl border border-sage-200 bg-white px-4 py-4 text-sm font-extrabold text-sage-700 transition hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={!wallpaperImage} onClick={onWallpaperRemove} type="button">
                  Remove wallpaper
                </button>
              </div>
              {wallpaperImage && (
                <div className="mt-4 overflow-hidden rounded-3xl border border-sage-100 bg-sage-50 p-3">
                  <div className="h-36 rounded-2xl bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${wallpaperImage})` }} />
                  <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">Wallpaper applied. The app automatically keeps it muted so it does not clutter the interface.</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><Sparkles size={16} /> Atmosphere presets</div>
              <p className="text-sm leading-6 text-sage-700">Pick a ready-made mood and let the design drawer handle the look for you instead of crowding the writing area.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {journalAtmospherePresets.map((preset) => {
                  const isPresetActive = selectedTheme === preset.themeId && selectedDesign === preset.designId && journalStyle.fontId === preset.journalFontId && quoteStyle.fontId === preset.quoteFontId;
                  return (
                    <button
                      className={`rounded-[1.4rem] border p-4 text-left transition hover:-translate-y-0.5 ${isPresetActive ? 'border-sage-500 bg-sage-50 shadow-lift' : 'border-sage-100 bg-white hover:bg-sage-50'}`}
                      key={preset.id}
                      onClick={() => onAtmosphereApply(preset)}
                      type="button"
                    >
                      <span className="text-sm font-extrabold text-ink">{preset.name}</span>
                      <span className="mt-2 block text-sm leading-6 text-sage-700">{preset.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><Quote size={16} /> Quote card color</div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {quoteCardColors.map((color) => (
                  <button
                    className={`custom-option rounded-2xl border p-3 text-left transition hover:-translate-y-1 ${quoteBg.toLowerCase() === color.value.toLowerCase() ? 'is-selected border-sage-500 shadow-lift' : 'border-sage-100'}`}
                    key={color.value}
                    onClick={() => {
                      onQuoteBgChange(color.value);
                    }}
                    type="button"
                  >
                    <span className="mb-2 block h-10 rounded-xl" style={{ background: color.value }} />
                    <span className="text-sm font-extrabold text-ink">{color.name}</span>
                  </button>
                ))}
              </div>
              <label className="mt-4 block rounded-2xl bg-sage-50 p-4">
                <span className="mb-3 block text-sm font-bold text-sage-800">Or pick any quote card color</span>
                <input className="h-11 w-full cursor-pointer rounded-xl border border-sage-100 bg-white p-1" onChange={(event) => onQuoteBgChange(event.target.value)} type="color" value={quoteBg} />
              </label>
            </div>

            <div className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><ImagePlus size={16} /> Custom emotion</div>
              <p className="text-sm leading-6 text-sage-700">Keep personal moods in the design drawer instead of the writing page. They still appear in your mood picker after you save them.</p>
              <div className="mt-5 grid gap-3 md:grid-cols-5">
                <input
                  className="rounded-2xl border border-sage-100 bg-sage-50/80 px-4 py-3 font-semibold outline-none transition focus:border-sage-400 focus:bg-white"
                  onChange={(event) => onCustomWeatherNameChange(event.target.value)}
                  placeholder="Name"
                  value={customWeatherName}
                />
                <input
                  className="rounded-2xl border border-sage-100 bg-sage-50/80 px-4 py-3 font-semibold outline-none transition focus:border-sage-400 focus:bg-white"
                  maxLength={4}
                  onChange={(event) => onCustomWeatherEmojiChange(event.target.value)}
                  placeholder="Emoji"
                  value={customWeatherEmoji}
                />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-sage-300 bg-sage-50/80 px-4 py-3 text-sm font-bold text-sage-800 transition hover:bg-sage-100 md:col-span-2">
                  <ImagePlus size={18} /> Upload image
                  <input accept="image/*" className="hidden" onChange={onCustomWeatherImageUpload} type="file" />
                </label>
                <button className="rounded-2xl bg-sage-800 px-4 py-3 font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-700" onClick={onAddCustomWeather} type="button">
                  Add emotion
                </button>
              </div>
              {customWeatherImage && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sage-50 p-3 text-sm font-semibold text-sage-800">
                  <img alt="Custom weather preview" className="h-12 w-12 rounded-2xl object-cover" src={customWeatherImage} />
                  Image ready — add a name, then save it as a custom emotion.
                </div>
              )}
              {customWeathers.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-500">Saved custom moods</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customWeathers.map((weather) => (
                      <div key={weather.id} className="inline-flex items-center gap-2 rounded-full border border-sage-100 bg-sage-50 px-3 py-2 text-sm font-semibold text-sage-700">
                        {weather.image ? <img alt={weather.label} className="h-6 w-6 rounded-full object-cover" src={weather.image} /> : <span>{weather.emoji}</span>}
                        <span>{weather.label}</span>
                        <button className="text-sage-400 transition hover:text-rose-500" onClick={() => onDeleteCustomWeather(weather.label)} type="button">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MoodChart({ entries, weatherOptions }) {
  const recent = useMemo(() => entries.slice(0, 7).reverse(), [entries]);
  const legacyMoodMap = {
    'Grounded': 'Happy',
    'Soft': 'Calm',
    'Okay': 'Neutral',
    'Heavy': 'Sad',
    'Stormy': 'Anxious'
  };

  if (!recent.length) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-3xl border border-dashed border-sage-200 bg-sage-50/70 p-8 text-center text-sage-700">
        Your mood garden is waiting for its first check-in.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-sage-50 px-3 pb-3 pt-6 shadow-inner sm:p-5">
      <div className="flex h-40 items-end gap-1.5 px-0.5 sm:h-64 sm:gap-3 sm:px-2">
        {recent.map((entry) => {
          const effectiveMoodLabel = legacyMoodMap[entry.mood] || entry.mood;
          const mood = weatherOptions.find((item) => item.label === effectiveMoodLabel) || weatherOptions.find(m => m.label === entry.mood) || weatherOptions[2] || moods[2];
          const heightClass = ['h-9 sm:h-12', 'h-12 sm:h-16', 'h-16 sm:h-24', 'h-24 sm:h-32', 'h-32 sm:h-44', 'h-36 sm:h-52'][mood.value - 1] || 'h-20 sm:h-28';
          const entryDate = new Date(entry.createdAt);
          return (
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:gap-3" key={entry.id}>
              <div className="flex h-32 w-full items-end justify-center overflow-hidden rounded-2xl bg-white/50 p-1 shadow-inner backdrop-blur-sm sm:h-52 sm:p-1.5">
                <div className={`w-full rounded-xl ${mood.color || ''} ${heightClass} shadow-md transition-all hover:scale-105 hover:shadow-lg`} style={mood.color ? undefined : { background: mood.hex || '#739f62' }} />
              </div>
              <WeatherGlyph mood={mood} size="text-base sm:text-xl" />
              <div className="flex flex-col items-center gap-0.5 text-center">
                <span className="text-[9px] font-bold uppercase tracking-tight text-sage-400 sm:text-[10px]">{entryDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[10px] font-extrabold text-sage-700 sm:text-xs">{entryDate.toLocaleDateString('en', { weekday: 'short' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrivacyGate({ hasPin, onUnlock, onCreatePin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (!pin.trim()) return;
    if (!hasPin) {
      onCreatePin(pin.trim());
      return;
    }
    const saved = getSavedPin();
    if (pin.trim() === saved) onUnlock();
    else setError('That PIN did not match. Try again gently.');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-sand-50 text-ink">
      <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-sage-200/60 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-sand-200/70 blur-3xl" />
      <section className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="grid overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-soft backdrop-blur md:grid-cols-2">
          <div className="flex flex-col justify-between bg-gradient-to-br from-sage-100 via-mist to-sand-100 p-10">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-sage-800 shadow-lift">
                <ShieldCheck size={18} /> Private by default
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight text-sage-900">Lofi Memory</h1>
              <p className="mt-5 text-lg leading-8 text-sage-800">A calm space for private diary writing, daily reflection, and gentle mood check-ins you can keep returning to.</p>
            </div>
            <div className="mt-12 flex items-center gap-3 rounded-3xl bg-white/65 p-4 text-sm text-sage-800">
              <Lock size={19} /> Entries stay in this browser using local storage.
            </div>
          </div>
          <form className="p-10" onSubmit={submit}>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-3xl bg-sage-100 text-sage-700">
              <Lock size={25} />
            </div>
            <h2 className="text-3xl font-extrabold text-ink">{hasPin ? 'Welcome back' : 'Create your soft lock'}</h2>
            <p className="mt-3 leading-7 text-sage-700">{hasPin ? 'Enter your private PIN to open your journal.' : 'Set a simple PIN for this browser. It is a light privacy step for your personal writing space.'}</p>
            <div className="relative mt-8">
              <input
                className="w-full rounded-2xl border border-sage-200 bg-white px-5 py-4 pr-16 text-lg font-semibold tracking-widest outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
                maxLength={12}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Your PIN"
                type={showPin ? 'text' : 'password'}
                value={pin}
              />
              <button
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl p-2 text-sage-600 transition hover:bg-sage-50 hover:text-sage-900"
                onClick={() => setShowPin((current) => !current)}
                type="button"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
            <button className="mt-6 w-full rounded-2xl bg-ink px-5 py-4 font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800" type="submit">
              {hasPin ? 'Unlock journal' : 'Begin gently'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function PinSettingsDialog({ isOpen, onClose, onChangePin, onRemovePin }) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCurrentPin('');
      setNewPin('');
      setShowCurrentPin(false);
      setShowNewPin(false);
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChangePin = (event) => {
    event.preventDefault();
    const result = onChangePin(currentPin, newPin);
    if (result.ok) {
      setSuccess(result.message);
      setError('');
      setCurrentPin('');
      setNewPin('');
      return;
    }
    setError(result.message);
    setSuccess('');
  };

  const handleRemovePin = () => {
    const result = onRemovePin(currentPin);
    if (result.ok) {
      setSuccess('');
      setError('');
      onClose();
      return;
    }
    setError(result.message);
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/25 px-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/95 p-8 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Privacy</p>
            <h3 className="mt-2 text-3xl font-extrabold text-ink">Manage your lock PIN</h3>
            <p className="mt-3 max-w-xl leading-7 text-sage-700">Change the current PIN for this browser or remove the lock completely if you no longer want the journal gated.</p>
          </div>
          <button className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={onClose} type="button">
            Done
          </button>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={handleChangePin}>
          <label className="block text-sm font-bold text-sage-800">
            Current PIN
            <div className="relative mt-2">
              <input
                className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 pr-14 text-base outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
                maxLength={12}
                onChange={(event) => setCurrentPin(event.target.value)}
                placeholder="Enter current PIN"
                type={showCurrentPin ? 'text' : 'password'}
                value={currentPin}
              />
              <button
                aria-label={showCurrentPin ? 'Hide current PIN' : 'Show current PIN'}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl p-2 text-sage-600 transition hover:bg-sage-50 hover:text-sage-900"
                onClick={() => setShowCurrentPin((current) => !current)}
                type="button"
              >
                {showCurrentPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="block text-sm font-bold text-sage-800">
            New PIN
            <div className="relative mt-2">
              <input
                className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 pr-14 text-base outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
                maxLength={12}
                onChange={(event) => setNewPin(event.target.value)}
                placeholder="Choose a new PIN"
                type={showNewPin ? 'text' : 'password'}
                value={newPin}
              />
              <button
                aria-label={showNewPin ? 'Hide new PIN' : 'Show new PIN'}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl p-2 text-sage-600 transition hover:bg-sage-50 hover:text-sage-900"
                onClick={() => setShowNewPin((current) => !current)}
                type="button"
              >
                {showNewPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
          {success && <p className="text-sm font-semibold text-sage-700">{success}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button className="rounded-2xl bg-ink px-5 py-3 font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-sage-800" type="submit">
              Update PIN
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-5 py-3 font-bold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100" onClick={handleRemovePin} type="button">
              <Trash2 size={18} /> Remove lock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const initialActiveTab = getInitialActiveTab();
  const initialCalendarDate = getInitialSelectedCalendarDate();
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [activeHomeSection, setActiveHomeSection] = useState(getInitialHomeSection);
  const [showEntryTransition, setShowEntryTransition] = useState(initialActiveTab === 'home');
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
  const [selectedUnwindGame, setSelectedUnwindGame] = useState('drifting-leaf');
  const [unwindViewMode, setUnwindViewMode] = useState('grid');
  const [isGameTransitioning, setIsGameTransitioning] = useState(false);
  const [activeTransitionGameId, setActiveTransitionGameId] = useState(null);
  const [memoriesView, setMemoriesView] = useState('calendar');
  const [gameVisualTheme, setGameVisualTheme] = useState('lofi');
  const showMinimalHomeOverview = activeTab === 'home' && activeHomeSection === 'overview';
  const homeEntryCards = [
    { id: 'unwind', title: 'Games', description: 'Chill games', icon: Gamepad2, iconTone: 'bg-[#d8dbff] text-violet-700', onClick: () => navigateToTab('unwind'), preview: gamesSectionPreviewImage },
    { id: 'write', title: 'Diary', description: 'Write only when it helps', icon: PenLine, iconTone: 'bg-[#dbead9] text-sage-700', onClick: () => navigateToTab('write'), preview: diarySectionPreviewImage },
    { id: 'notes', title: 'Notes', description: 'Keep important things nearby', icon: FileText, iconTone: 'bg-[#d8f0ec] text-teal-700', onClick: () => navigateToTab('notes'), preview: notesSectionPreviewImage },
    { id: 'breathe', title: 'Music Room', description: 'Sounds & Wallpapers', icon: Wind, iconTone: 'bg-[#dbe8f8] text-sky-700', onClick: () => navigateToTab('breathe'), preview: musicSectionPreviewImage },
    { id: 'memories', title: 'Memories', description: 'Save dates and local weather', icon: CalendarDays, iconTone: 'bg-[#efe6d8] text-sand-700', onClick: () => navigateToTab('memories'), preview: memoriesSectionPreviewImage },
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
      component: <Solitaire difficulty={selectedGameDifficulty} />
    },
    {
      id: 'mind-sweeper',
      title: 'Mind Sweeper',
      detail: 'Soft Minesweeper logic',
      description: 'A cozy Minesweeper-style board for a relaxing logic break when you want to chill, focus, and clear your head tile by tile.',
      icon: MinesweeperImageIcon,
      tone: 'from-lime-100 to-emerald-50 text-emerald-700',
      preview: gameMindSweeperPreview,
      playingSpace: 'max-w-[980px]',
      component: <MindSweeper difficulty={selectedGameDifficulty} />
    },
    {
      id: 'drifting-leaf',
      title: 'Drifting Seed',
      detail: 'Soft endless glide',
      description: 'A slow, floaty game for clearing your head before you write.',
      icon: SeedIcon,
      tone: 'from-emerald-100 to-sage-50 text-emerald-700',
      preview: gameDriftingSeedPreview,
      playingSpace: 'max-w-[900px]',
      component: <ZenGame difficulty={selectedGameDifficulty} />
    },
    {
      id: 'stream-surfer',
      title: 'Lilypad Hopper',
      detail: 'Gentle pond dodging',
      description: 'Hop through a calm lily-pad run when you want a little movement without the noise.',
      icon: FrogIcon,
      tone: 'from-sky-100 to-cyan-50 text-sky-700',
      preview: gameLilypadPreview,
      playingSpace: 'max-w-[1120px]',
      component: <StreamSurfer difficulty={selectedGameDifficulty} />
    },
    {
      id: 'lofi-jigsaw',
      title: 'Lofi Jigsaw Puzzle',
      detail: 'Cozy picture puzzle',
      description: 'Slide a soft lofi scene back together for a relaxing puzzle break before journaling.',
      icon: ImagePlus,
      tone: 'from-emerald-100 via-amber-50 to-rose-50 text-emerald-700',
      preview: gameJigsawPreview,
      playingSpace: 'max-w-[1080px]',
      component: <LofiJigsaw difficulty={selectedGameDifficulty} />
    },
    {
      id: 'lotus-match',
      title: 'Lotus Match',
      detail: 'Quiet memory reset',
      description: 'Flip calm cards and settle in before journaling or just hanging out for a bit.',
      icon: Heart,
      tone: 'from-rose-100 to-orange-50 text-rose-700',
      preview: gameLotusPreview,
      playingSpace: 'max-w-[1020px]',
      component: <LotusMatch difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-tiles',
      title: 'Tiles',
      detail: 'Cozy 2048-style merge',
      description: 'Slide matching numbers together for the kind of calm puzzle loop people love in relaxing tile games.',
      icon: Grid2x2,
      tone: 'from-violet-100 to-slate-50 text-violet-700',
      preview: gameTilesPreview,
      playingSpace: 'max-w-[820px]',
      component: <QuietTiles difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-tetris',
      title: 'Tetris',
      detail: 'Calm block stacking',
      description: 'Stack colorful blocks, clear tidy rows, and watch the pace increase by level like classic Tetris while keeping the cozy lofi mood.',
      icon: TetrisIcon,
      tone: 'from-indigo-100 to-sky-50 text-indigo-700',
      preview: gameTetrisPreview,
      playingSpace: 'max-w-[1120px]',
      component: <QuietTetris difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-slide',
      title: 'Slide',
      detail: 'Cozy sliding puzzle',
      description: 'Move tiles into place for the kind of familiar low-pressure sliding puzzle people love as a quick reset.',
      icon: Puzzle,
      tone: 'from-amber-100 to-stone-50 text-amber-700',
      preview: gameSlidePreview,
      playingSpace: 'max-w-[860px]',
      component: <QuietSlide difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-sudoku',
      title: 'Sudoku',
      detail: 'Soft sudoku logic',
      description: 'Settle into a cozy Sudoku board with gentle checking, reveal help, and a familiar number puzzle rhythm.',
      icon: SudokuImageIcon,
      tone: 'from-cyan-100 to-blue-50 text-cyan-700',
      preview: gameSudokuPreview,
      playingSpace: 'max-w-[980px]',
      component: <QuietSudoku difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-wordle',
      title: 'Wordle',
      detail: 'Soft Wordle-style puzzle',
      description: 'Guess a cozy word in a gentle Wordle-style round when you want something familiar, tidy, and easy to replay.',
      icon: WordleImageIcon,
      tone: 'from-teal-100 to-sky-50 text-teal-700',
      preview: gameWordlePreview,
      playingSpace: 'max-w-[780px]',
      component: <QuietWordle difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-words',
      title: 'Words',
      detail: 'Calm word scramble',
      description: 'Unscramble soft words for a familiar word-game loop that keeps the focus light and relaxing.',
      icon: Type,
      tone: 'from-fuchsia-100 to-rose-50 text-fuchsia-700',
      preview: gameWordsPreview,
      playingSpace: 'max-w-[860px]',
      component: <QuietWords difficulty={selectedGameDifficulty} />
    },
    {
      id: 'typing-speed-test',
      title: 'Typing Speed Test',
      detail: 'Gentle typing flow',
      description: 'Practice typing with calm prompts and find your own comfortable rhythm.',
      icon: Keyboard,
      tone: 'from-sky-100 to-indigo-50 text-sky-700',
      preview: gameTypingPreview,
      playingSpace: 'max-w-[960px]',
      component: <TypingSpeedTest difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-clues',
      title: 'Clues',
      detail: 'Mini crossword-style clues',
      description: 'Solve one soft clue at a time for a beginner-friendly crossword mood without the stress of a full puzzle grid.',
      icon: Map,
      tone: 'from-amber-100 to-rose-50 text-amber-700',
      preview: gameCluesPreview,
      playingSpace: 'max-w-[820px]',
      component: <QuietClues difficulty={selectedGameDifficulty} />
    },
    {
      id: 'quiet-snake',
      title: 'Snake',
      detail: 'Classic arcade loop',
      description: 'A cozy snake run with clear turns, quick rounds, and a gentle retro feel.',
      icon: SnakeIcon,
      tone: 'from-emerald-100 to-lime-50 text-emerald-700',
      preview: gameSnakePreview,
      playingSpace: 'max-w-[1040px]',
      component: <QuietSnake difficulty={selectedGameDifficulty} />
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
      component: <DinosaurDash difficulty={selectedGameDifficulty} />
    }
  ];
  const selectedUnwindGameConfig = unwindGames.find((game) => game.id === selectedUnwindGame) || unwindGames[0];
  const transitioningGameConfig = unwindGames.find((game) => game.id === activeTransitionGameId) || null;
  const selectedDifficultyConfig = difficultyOptions.find((difficulty) => difficulty.id === selectedGameDifficulty) || difficultyOptions[1];

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

  

  const returnToGameLibrary = () => {
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
      shellClass: 'border-sage-100 bg-white/88',
      panelClass: 'bg-sage-50/85 ring-sage-100/80',
      chipClass: 'border-sage-100 bg-white/95 text-sage-700'
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
    '--shape-radius': activeDesign.radius,
    '--theme-texture': activeDesign.texture,
    '--quote-bg': quoteBg
  };

  const toggleFullscreen = useCallback(async () => {
    if (!selectedGameInterfaceRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await selectedGameInterfaceRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
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
    }, 1650);
    const hideTimer = window.setTimeout(() => {
      setShowEntryTransition(false);
      setEntryTransitionClosing(false);
    }, 2450);

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
        setEntries(snapshot.docs.map((entryDoc) => ({ id: entryDoc.id, ...entryDoc.data() })));
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
    if (activeTab !== 'write' || !entryBodyRef.current || !body) return;
    const currentHtml = entryBodyRef.current.innerHTML.trim();
    if (!currentHtml || currentHtml === '<br>') entryBodyRef.current.innerHTML = body;
  }, [activeTab, body]);

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
    localStorage.setItem(QUOTE_BG_STORAGE_KEY, quoteBg);
    localStorage.setItem(WALLPAPER_STORAGE_KEY, wallpaperImage);
  }, [selectedTheme, selectedDesign, customColor, quoteBg, wallpaperImage]);

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
    'Hero summary: Lofi Memory helps visitors listen to lofi music, play relaxing games like Solitaire and Tetris, keep a private online diary, and enjoy a peaceful music room.',
    'Hero support line: The main objective is a calm lofi website for listening to music, relaxing, playing cozy games, and clearing your mind.',
    'Current guide paths: /lofi-music-website.html, /listen-to-lofi-music-online.html, /chill-music-and-games.html, /lofi-radio-online.html, /relaxing-music-online.html, /chill-music-online.html, /lofi-study-music.html, /website-to-relax.html, /chill-place-online.html, /things-to-do-to-relax.html, /relaxing-study-break.html, /studying-with-lofi.html, /online-journal.html, /private-online-diary.html, /daily-journal-app.html, /relaxing-browser-games.html, /games-to-relax.html, /solitaire-online.html, /minesweeper-online.html, /browser-tetris-game.html.',
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
              setRadioStatusMessage('Starting lofi radio');
              try {
                event.target.setVolume(radioVolume);
                if (radioUnlockedRef.current) {
                  event.target.unMute?.();
                } else {
                  event.target.mute?.();
                }
                event.target.playVideo();
                setRadioNeedsInteraction(!radioUnlockedRef.current);
                setRadioStatusMessage(radioUnlockedRef.current ? 'Lofi radio playing' : 'Lofi radio live — tap once for sound');
              } catch {
                setRadioNeedsInteraction(true);
                setRadioStatusMessage('Tap once for sound');
              }
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                setRadioNeedsInteraction(!radioUnlockedRef.current);
                setRadioStatusMessage(radioUnlockedRef.current ? 'Lofi radio playing' : 'Lofi radio live — tap once for sound');
              }
            },
            onAutoplayBlocked: () => {
              setRadioNeedsInteraction(true);
              setRadioStatusMessage('Tap once to turn on the lofi radio');
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
        setRadioStatusMessage(radioUnlockedRef.current ? 'Lofi radio playing' : 'Lofi radio live — tap once for sound');
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
        setRadioStatusMessage('Lofi radio waking up');
        return;
      }

      try {
        radioPlayerRef.current.unMute?.();
        radioPlayerRef.current.setVolume?.(radioVolume);
        radioPlayerRef.current.playVideo?.();
        setRadioStatusMessage('Lofi radio playing');
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
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro-latest',
        'gemini-3.8-flash'
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
    if (!body.trim() && !title.trim()) return;
    const entry = {
      id: crypto.randomUUID(),
      title: title.trim() || activePrompt,
      body: body.trim(),
      mood: selectedMood,
      prompt: activePrompt,
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
    setEditBody(selectedEntry.body || '');
    setEditMood(selectedEntry.mood);
    setIsEditingEntry(true);
    window.setTimeout(() => {
      if (editBodyRef.current) {
        editBodyRef.current.innerHTML = selectedEntry.body || '';
      }
    }, 0);
  }

  async function saveEditedEntry() {
    if (!selectedEntry) return;
    const editor = editBodyRef.current;
    const finalBody = editor?.innerHTML ?? editBody;
    const updated = {
      ...selectedEntry,
      title: editTitle.trim() || 'Untitled moment',
      body: finalBody,
      mood: editMood
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
    return <div className="prose-journal" dangerouslySetInnerHTML={{ __html: String(content || '') }} />;
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
    setSelectedBreatheRoom(id);
    setRadioVolume(room.volume);
    setBreatheRoomStatus(room.status);

    if (radioPlayerRef.current?.loadVideoById) {
      radioUnlockedRef.current = true;
      radioPlayerRef.current.loadVideoById({
        videoId: room.videoId,
        startSeconds: 0,
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
    return <PrivacyGate hasPin={hasPin} onCreatePin={createPin} onUnlock={() => setLocked(false)} />;
  }

  return (
    <main className={`personalized-site lofi-vibe ${wallpaperImage ? 'wallpaper-active' : ''} design-${selectedDesign} ${comfortMode ? 'comfort-mode' : ''} isolate min-h-screen overflow-hidden bg-sand-50 pb-24 text-ink lg:pb-0`} style={themeStyle}>
      {isGameTransitioning && <GameSplash game={transitioningGameConfig} />}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {wallpaperImage && <div className="lofi-user-wallpaper absolute inset-0" style={{ backgroundImage: `url(${wallpaperImage})` }} />}
        <div className="lofi-ambient-grid absolute inset-0" />
        <div className="absolute left-[-2rem] top-0 h-[28rem] w-[28rem] rounded-full bg-[#efe4d7]/80 blur-3xl" />
        <div className="absolute right-[-3rem] top-44 h-[26rem] w-[26rem] rounded-full bg-[#f8efe5]/85 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/3 h-[22rem] w-[22rem] rounded-full bg-[#f2e8dc]/78 blur-3xl" />
        <div className="lofi-record-glow absolute -right-20 top-[22rem] hidden h-72 w-72 rounded-full lg:block" />
        <div className="lofi-moon-glow absolute left-[6%] top-[34rem] hidden h-28 w-28 rounded-full md:block" />
      </div>


      {showEntryTransition && (
        <div className={`fixed inset-0 z-40 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_30%),linear-gradient(180deg,rgba(248,243,235,0.98)_0%,rgba(242,234,224,0.97)_100%)] backdrop-blur-[10px] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${entryTransitionClosing ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`px-6 text-center transition-all duration-[1050ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${entryTransitionClosing ? 'translate-y-3 scale-[1.02] opacity-0' : 'translate-y-0 scale-100 opacity-100'}`}>
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/90 bg-white/88 p-2 shadow-[0_18px_50px_rgba(158,136,114,0.12)] ring-8 ring-white/30">
              <img src={headerLogoIcon} alt="Lofi Memory logo" className="h-full w-full rounded-full object-cover" />
            </div>
            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.42em] text-[#8d7763]">Lofi Memory</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#3d3025] sm:text-5xl">Clear your mind.</h1>
            <p className="mt-3 text-sm font-semibold tracking-[0.08em] text-[#8c7967]">A calm little pause before you relax.</p>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-500 ${showEntryTransition ? 'pointer-events-none select-none opacity-0' : 'opacity-100'}`}>
      <nav className="sticky top-0 z-20 px-5 pt-5 sm:px-7 xl:px-10">
        <div className="site-nav-shell lofi-glass mx-auto max-w-[1280px] rounded-[2.2rem] border p-4 shadow-soft backdrop-blur-xl lg:p-5">
          <div className="flex flex-col gap-2.5 lg:gap-3 xl:flex-row xl:items-center xl:justify-between">
            <a className="flex items-center gap-3.5" href="#home" onClick={() => openHomeSection('home')}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] border border-white/80 bg-white/88 p-1.5 shadow-[0_12px_34px_rgba(117,127,119,0.14)] ring-1 ring-sage-100 overflow-hidden">
                <img src={headerLogoIcon} alt="Lofi Memory Logo" className="h-full w-full rounded-[1rem] object-cover" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-sage-900">Lofi Memory</p>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage-700">Chill music, lofi games & journal</p>
              </div>
            </a>
            <div className="site-nav-links hidden flex-1 items-center justify-center gap-7 xl:gap-9">
              {[
                { id: 'unwind', label: 'Games', icon: Gamepad2 },
                { id: 'home', label: 'Chill', icon: Headphones },
                { id: 'write', label: 'Diary', icon: PenLine },
                { id: 'notes', label: 'Notes', icon: FileText },
                { id: 'breathe', label: 'Music Room', icon: Wind },
                { id: 'memories', label: 'Memories', icon: CalendarDays },
                { id: 'design', label: 'Design', icon: Palette }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest transition ${activeTab === tab.id ? 'text-sage-950' : 'text-sage-700 hover:text-sage-900'}`}
                  onClick={() => navigateToTab(tab.id)}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="site-nav-actions flex w-full flex-wrap items-center gap-2 lg:justify-end xl:w-auto xl:max-w-[34rem] xl:flex-none xl:flex-nowrap">
              {user ? (
                <div className="flex min-w-[210px] flex-1 items-center justify-between gap-3 rounded-full border border-sage-200 bg-white/92 px-4 py-2.5 shadow-lift xl:flex-none">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-sage-950">{user.displayName || user.email}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage-600">{cloudStatus}</p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 shadow-sm">
                    <ShieldCheck size={15} />
                  </div>
                </div>
              ) : (
                <button className="flex min-w-[208px] flex-1 items-center justify-between gap-3 rounded-full border border-sage-200 bg-white/92 px-4 py-2.5 text-left shadow-lift transition hover:-translate-y-0.5 hover:bg-white xl:flex-none" onClick={signInWithGoogle} disabled={authLoading} type="button">
                  <div>
                    <p className="text-sm font-extrabold text-sage-950">{authLoading ? 'Checking login...' : 'Sign in with Google'}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sage-600">Sync across devices</p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sage-900 text-white shadow-sm">
                    <ShieldCheck size={15} />
                  </div>
                </button>
              )}
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-sage-100 bg-white/82 p-1.5 shadow-sm xl:flex-nowrap">
                {user && (
                  <button className="rounded-full border border-sage-200 bg-white/90 px-3.5 py-2 text-sm font-bold text-sage-800 transition hover:-translate-y-0.5 hover:bg-white" onClick={handleSignOut} type="button">
                    Sign out
                  </button>
                )}
                {isMasterAdmin && (
                  <div className="flex overflow-hidden rounded-full border border-sage-200 bg-white/90 p-1">
                    <button
                      className={`rounded-full px-3.5 py-2 text-sm font-extrabold transition ${adminViewMode === 'master' ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-700 hover:bg-sage-50'}`}
                      onClick={() => setAdminViewMode('master')}
                      type="button"
                    >
                      Master
                    </button>
                    <button
                      className={`rounded-full px-3.5 py-2 text-sm font-extrabold transition ${adminViewMode === 'user' ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-700 hover:bg-sage-50'}`}
                      onClick={() => setAdminViewMode('user')}
                      type="button"
                    >
                      User
                    </button>
                  </div>
                )}
                {showAdminTools && (
                  <button className="rounded-full border border-sage-800 bg-sage-900 px-3.5 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sage-800" onClick={() => openHomeSection('seo-studio')} type="button">
                    SEO studio
                  </button>
                )}
                <button className={`rounded-full border px-3.5 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${comfortMode ? 'border-sage-800 bg-sage-900 text-white' : 'border-sage-200 bg-white/90 text-sage-800 hover:bg-white'}`} onClick={() => setComfortMode(!comfortMode)} type="button">
                  Comfort
                </button>
                <button className="rounded-full border border-sage-200 bg-white/90 px-3.5 py-2 text-sm font-bold text-sage-800 transition hover:-translate-y-0.5 hover:bg-white" onClick={() => (hasPin ? setPinSettingsOpen(true) : setLocked(true))} type="button">
                  {hasPin ? 'Privacy' : 'Set lock'}
                </button>
              </div>
            </div>
          </div>
          <div className="site-nav-links mt-2 hidden flex-wrap items-center justify-center gap-2 rounded-[1.5rem] border border-sage-100 bg-white/88 p-1.5 2xl:flex">
            <a className="rounded-full border border-sage-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-sage-950 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="#unwind" onClick={() => navigateToTab('unwind')}>Games</a>
            <a className="rounded-full border border-sage-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-sage-950 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="#home" onClick={() => navigateToTab('home')}>Chill</a>
            <button className="rounded-full border border-sage-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-sage-950 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" onClick={() => setCustomizerOpen(true)} type="button">Design</button>
            <a className="rounded-full border border-sage-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-sage-950 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="#memories" onClick={() => navigateToTab('memories')}>Memories</a>
            <a className="rounded-full border border-sage-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-sage-950 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="#breathe" onClick={() => navigateToTab('breathe')}>Music</a>
            <a className="rounded-full border border-sage-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-sage-950 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="#diary" onClick={() => navigateToTab('write')}>Diary</a>
          </div>
        </div>
      </nav>

      {showMinimalHomeOverview && (
      <section id="home" className="mx-auto max-w-[1040px] px-5 pb-20 pt-10 sm:px-7 xl:px-10">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#9a806a]">Choose your chill space</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#7f6a58]">Pick a space.</p>
        </div>
        <div className="lofi-glass rounded-[2rem] border p-3 shadow-soft backdrop-blur-xl sm:p-4">
          <div className="grid gap-3 md:grid-cols-2">
            {homeEntryCards.map((card) => (
              <button
                key={card.id}
                className="group lofi-glass relative flex min-h-[11rem] w-full flex-col items-start justify-start overflow-hidden rounded-[1.75rem] border px-5 py-5 text-left shadow-[0_10px_26px_rgba(146,126,106,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#d8c6b2] hover:shadow-[0_16px_34px_rgba(146,126,106,0.1)]"
                onClick={card.onClick}
                type="button"
              >
                <img src={card.preview} alt={`${card.title} preview`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/5 to-transparent" />
                <div className="relative z-10 p-2">
                  <p className="text-lg font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{card.title}</p>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeTab === 'home' && activeHomeSection === 'overview' && !showMinimalHomeOverview && (
      <section id="home" className="mx-auto grid max-w-[1280px] gap-8 px-5 pb-28 pt-10 sm:px-7 lg:grid-cols-12 lg:pb-12 xl:gap-12 xl:px-10">
        <div className="lg:col-span-8">
          <div className="lofi-glass relative overflow-hidden rounded-[2.35rem] border p-8 shadow-soft backdrop-blur-xl lg:p-10 xl:p-11">
            <div className="pointer-events-none absolute -left-10 top-12 h-28 w-28 rounded-full bg-[#efe4d8]/55 blur-3xl"></div>
            <div className="pointer-events-none absolute right-4 top-4 h-32 w-32 rounded-full bg-[#f7eee3]/65 blur-3xl"></div>
            <div className="relative">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/90 px-4 py-2 text-sm font-bold text-[#4a3a2d] shadow-sm">
                <Headphones size={16} /> Lofi music & chill vibes
              </div>
              <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.96] tracking-tight text-[#3d3025] md:text-6xl">Lofi Memory — a relaxing place to play games and listen to music.</h1>
              <p className="mt-5 max-w-3xl text-[1.18rem] font-semibold leading-8 text-[#5d4c3e]">Listen to lofi music, play relaxing browser games, chill, keep a private online diary, and enjoy a cozy music room in one soft online space.</p>

              <div className="lofi-now-playing lofi-glass mt-7 flex flex-col gap-4 rounded-[1.65rem] border p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="lofi-mini-record flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#d8c5af] bg-[#3f342c] shadow-[0_14px_28px_rgba(80,61,47,0.14)]">
                    <div className="h-5 w-5 rounded-full border border-[#d8c5af] bg-[#f3e7d8]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#9a806a]">Now playing</p>
                    <p className="mt-1 text-base font-extrabold text-[#3d3025]">Dusk room · rain window · soft study beats</p>
                  </div>
                </div>
                <div className="lofi-equalizer" aria-hidden="true"><span /><span /><span /><span /><span /></div>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-[#4f3f32] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(97,74,56,0.16)] transition hover:-translate-y-1 hover:bg-[#433528]" onClick={() => setIsRadioPlaying(true)} type="button">
                  <Headphones size={17} /> Start lofi music
                </button>
                <a className="inline-flex items-center gap-2 rounded-full border border-[#e2d3c2] bg-white/92 px-5 py-3 text-sm font-extrabold text-[#4f3f32] shadow-sm transition hover:-translate-y-1 hover:border-[#d3bea8] hover:bg-white" href="#unwind" onClick={() => navigateToTab('unwind')}>
                  <Leaf size={17} /> Play relaxing games
                </a>
                <a className="inline-flex items-center gap-2 rounded-full border border-[#e2d3c2] bg-white/92 px-5 py-3 text-sm font-extrabold text-[#4f3f32] shadow-sm transition hover:-translate-y-1 hover:border-[#d3bea8] hover:bg-white" href="#notes" onClick={() => navigateToTab('notes')}>
                  <FileText size={17} /> Open notes & to-dos
                </a>
                <button className="inline-flex items-center gap-2 rounded-full border border-[#e2d3c2] bg-white/92 px-5 py-3 text-sm font-extrabold text-[#4f3f32] shadow-sm transition hover:-translate-y-1 hover:border-[#d3bea8] hover:bg-white" onClick={() => setCustomizerOpen(true)} type="button">
                  <Palette size={17} /> Choose your theme
                </button>
                {hasPin && (
                  <button className="inline-flex items-center gap-2 rounded-full border border-[#e2d3c2] bg-white/92 px-5 py-3 text-sm font-extrabold text-[#4f3f32] shadow-sm transition hover:-translate-y-1 hover:border-[#d3bea8] hover:bg-white" onClick={() => setPinSettingsOpen(true)} type="button">
                    <Shield size={17} /> Privacy settings
                  </button>
                )}
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

              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-sage-900">
                <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/92 px-4 py-2.5 shadow-sm">
                  <ShieldCheck size={16} /> {hasPin ? 'Private when you want it' : 'Add privacy any time'}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/92 px-4 py-2.5 shadow-sm">
                  <Sparkles size={16} /> {user ? `${entries.length} saved moments · ${cloudStatus}` : `${entries.length} saved moments · Local-first chill space`}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-sage-600">Popular guides</span>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/lofi-music-room.html">Lofi music room</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/lofi-music-website.html">Lofi music website</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/listen-to-lofi-music-online.html">Listen to lofi</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/lofi-radio-online.html">Lofi radio</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/relaxing-music-online.html">Relaxing music</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/chill-music-online.html">Chill music</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/chill-music-and-games.html">Music + games</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/lofi-study-music.html">Study music</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/lofi-vibes.html">Lofi vibes</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/chill-vibes.html">Chill vibes</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/website-to-relax.html">Website to relax</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/chill-place-online.html">Chill place online</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/chill-games.html">Chill games</a>
                <a className="rounded-full border border-sage-200 bg-white/92 px-4 py-2 font-bold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href="/relaxing-browser-games.html">Relaxing browser games</a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
                <StatCard icon={BookOpen} label="Entries" value={entries.length} tone="bg-sage-100 text-sage-800" />
                <StatCard icon={Sunrise} label="Current streak" value={`${streak} day${streak === 1 ? '' : 's'}`} tone="bg-sand-100 text-sand-500" />
                <StatCard icon={HeartHandshake} label="Average mood" value={averageMood} tone="bg-teal-100 text-teal-700" />
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex min-h-[290px] flex-col justify-between rounded-[1.8rem] border border-white/80 bg-gradient-to-br from-white/90 to-sage-50/70 p-5 shadow-lift backdrop-blur">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">All-in-one soft corner</p>
                    <h3 className="mt-3 text-2xl font-extrabold leading-tight text-ink">Listen, relax, plan, and write without jumping between tabs.</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-sage-800">Lofi Memory is meant to feel like a calm browser hangout. You can let the lofi stream roll, play a chill game, keep your to-do list nearby, breathe for a minute, or write something down whenever you feel like it.</p>
                  </div>
                  <div className="mt-6 space-y-3.5">
                    <button className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-sage-200 bg-white/96 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-sage-50 hover:shadow-lift" onClick={() => setIsRadioPlaying(true)} type="button">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm transition group-hover:scale-105">
                        <Headphones size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">Listen</span>
                        <span className="mt-1 block text-base font-extrabold text-sage-950">Lofi music</span>
                        <span className="mt-2 block text-sm leading-6 text-sage-700">Start the soft radio and let the page settle into a calmer room for relaxing, focus, or writing.</span>
                      </div>
                    </button>
                    <button className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-sage-200 bg-white/96 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-sage-50 hover:shadow-lift" onClick={() => navigateToTab('notes')} type="button">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm transition group-hover:scale-105">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-teal-700">Plan</span>
                        <span className="mt-1 block text-base font-extrabold text-sage-950">Notes & to-dos</span>
                        <span className="mt-2 block text-sm leading-6 text-sage-700">Keep errands, reminders, and important bits close in a calmer, easier-to-scan space.</span>
                      </div>
                    </button>
                    <button className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-sage-200 bg-white/96 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-sage-50 hover:shadow-lift" onClick={() => navigateToTab('write')} type="button">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 shadow-sm transition group-hover:scale-105">
                        <PenLine size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700">Write</span>
                        <span className="mt-1 block text-base font-extrabold text-sage-950">Thought drop</span>
                        <span className="mt-2 block text-sm leading-6 text-sage-700">Write down whatever is on your mind only when you want to keep it, with more room to breathe.</span>
                      </div>
                    </button>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-sage-700">One place to listen to lofi music, relax, plan your day, and save your thoughts.</p>
                </div>
                <div className={`flex min-h-[290px] flex-col justify-between rounded-[1.8rem] border p-5 shadow-sm backdrop-blur ${selectedMoodGuide.shellClass}`}>
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
          <div className="rounded-[1.9rem] border border-white/80 bg-white/72 p-5 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Start where it helps most</p>
              <span className="rounded-full border border-sage-100 bg-sage-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-800">Core spaces</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:gap-4">
              {[
                { id: 'unwind', label: 'Games', detail: 'Chill games', icon: Gamepad2, tone: 'bg-violet-100 text-violet-700' },
                { id: 'write', label: 'Diary', detail: 'Write only when it helps', icon: PenLine, tone: 'bg-sage-100 text-sage-800' },
                { id: 'notes', label: 'Notes', detail: 'Keep important things nearby', icon: FileText, tone: 'bg-teal-100 text-teal-700' },
                { id: 'breathe', label: 'Music Room', detail: 'Wallpaper sounds', icon: Wind, tone: 'bg-blue-100 text-blue-700' },
                { id: 'memories', label: 'Memories', detail: 'Return to saved moments', icon: BookOpen, tone: 'bg-sand-100 text-sand-600' },
                { id: 'design', label: 'Design', detail: 'Customize your space', icon: Palette, tone: 'bg-rose-100 text-rose-700' }
              ].map((tab) => (
                <button key={tab.id} className="group flex items-center gap-3 rounded-2xl border border-sage-100 bg-white/92 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-white hover:shadow-lift" onClick={() => navigateToTab(tab.id)} type="button">
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

          <div className="rounded-[1.9rem] border border-white/80 bg-gradient-to-br from-white/84 to-sand-50/70 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-800">Why it feels good to stay here</p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight text-ink">The page feels like a chill place first, so writing can arrive naturally.</h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-sage-800">There is a clear place to begin, soft privacy cues, cozy game breaks, and just enough support to help a first sentence feel easy instead of exposed.</p>
            <div className="mt-6 grid gap-3.5 text-sm font-semibold text-sage-900">
              <div className="flex items-center gap-3 rounded-2xl border border-sage-200 bg-white/96 px-4 py-3.5 shadow-sm">
                <Sparkles size={15} className="text-sage-700" />
                <span>Starter lines help you begin without filling the page with noise</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-sage-200 bg-white/96 px-4 py-3.5 shadow-sm">
                <ShieldCheck size={15} className="text-sage-700" />
                <span>Privacy cues keep the space personal before you write a word</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-sage-200 bg-white/96 px-4 py-3.5 shadow-sm">
                <BookOpen size={15} className="text-sage-700" />
                <span>Saved pages stay easy to revisit when you want perspective later</span>
              </div>
            </div>
          </div>

          <div className="quote-card quote-card-premium quote-card-compact flex flex-col rounded-3xl border border-white/70 p-6 shadow-soft lg:p-7">
            <Quote className="mb-6 opacity-80" size={30} />
            <p className="quote-main-text font-bold leading-tight" style={{ fontFamily: activeQuoteFont, fontSize: Math.max(activeQuoteSize - 4, 28), color: quoteStyle.textColor, lineHeight: 1.4 }}>“{quoteLibrary[quoteIndex % quoteLibrary.length]}”</p>
            <button className="quote-button mt-6 rounded-full bg-white px-5 py-3 text-sm font-extrabold shadow-lift transition hover:-translate-y-1 hover:bg-sage-50" onClick={() => setQuoteIndex((quoteIndex + 1) % quoteLibrary.length)}>
              Another calming quote
            </button>

            <div className="mt-8 rounded-[1.6rem] bg-white/12 px-5 py-5 text-center ring-1 ring-white/12">
              <div className="mx-auto max-w-xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/90">Quiet reminder</p>
                <p className="mt-3 text-sm leading-7 text-white/95">You can leave one small honest note today and return tomorrow. The page will still be here when you are ready.</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <p className="text-sm font-semibold tracking-[0.08em] text-white/90">{streak > 0 ? `${streak} day${streak === 1 ? '' : 's'} of rhythm` : 'Begin with one gentle page'}</p>
                  <a className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" href="#journal" onClick={() => navigateToTab('write')}>
                    Write now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
      )}

      {activeTab === 'home' && !showMinimalHomeOverview && (
      <section className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="rounded-[2.5rem] border border-sage-100/90 bg-white/96 p-7 shadow-soft backdrop-blur lg:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-display text-4xl font-bold leading-tight text-ink lg:text-5xl">{homeSections.find((s) => s.id === activeHomeSection)?.label || 'Overview'}</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sage-800">{activeHomeSection === 'overview' ? (latestEntry ? `Your last page is still here. ${rewardLevel.next}` : 'Come here to relax, hang out in a chill corner, and start with a game first when you want the easiest, softest reset.') : 'Browse gently. The layout stays simple so each section feels easier to read.'}</p>
                </div>
                <a className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sage-900 px-6 py-4 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800" href="#unwind" onClick={() => navigateToTab('unwind')}>
                  <Leaf size={18} /> Play a chill game
                </a>
              </div>

              <div className="mt-10 grid gap-2.5 rounded-[2rem] border border-sage-100/70 bg-sage-50/45 p-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-r from-sage-50/85 via-white to-sand-50/80 p-5 shadow-inner">
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
                      <button key={item.label} className="group rounded-[1.5rem] border border-white/85 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-sage-200 hover:bg-white hover:shadow-lift" onClick={item.action} type="button">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 transition group-hover:bg-sage-900 group-hover:text-white"><item.icon size={17} /></div>
                        <h4 className="mt-3 text-base font-extrabold text-ink">{item.label}</h4>
                        <p className="mt-2 text-sm leading-6 text-sage-700">{item.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.8rem] border border-sage-100/80 bg-white/85 p-5 shadow-sm">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-600">Popular calm searches</p>
                      <h3 className="mt-2 text-xl font-extrabold text-ink">Quick links for lofi music, chill vibes, relaxing routines, and cozy games.</h3>
                    </div>
                    <button className="text-sm font-extrabold text-sage-800 underline decoration-sage-300 underline-offset-4" onClick={() => openHomeSection('guides')} type="button">View all guide collections</button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {(showAllSearches ? seoPopularSearches : seoPopularSearches.slice(0, 12)).map((item) => (
                      <a className="rounded-full border border-sage-200 bg-sage-50/70 px-4 py-2 text-sm font-bold text-sage-800 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href={item.href} key={item.href}>{item.label}</a>
                    ))}
                    {!showAllSearches && seoPopularSearches.length > 12 && (
                      <button 
                        onClick={() => setShowAllSearches(true)}
                        className="rounded-full border border-sage-200 border-dashed bg-white/50 px-4 py-2 text-sm font-bold text-sage-600 transition hover:bg-white hover:text-sage-900"
                        type="button"
                      >
                        + {seoPopularSearches.length - 12} more
                      </button>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          <aside className="lg:w-[320px] xl:w-[360px] lg:sticky lg:top-28">
            <div className="rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-4 border-b border-sage-100 pb-5">
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

              <div className="grid gap-2 border-t border-sage-100 pt-5">
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
      )}

      <ThemeStudio
        customColor={customColor}
        customWeatherEmoji={customWeatherEmoji}
        customWeatherImage={customWeatherImage}
        customWeatherName={customWeatherName}
        customWeathers={customWeathers}
        isOpen={customizerOpen}
        journalStyle={journalStyle}
        onAtmosphereApply={applyJournalAtmosphere}
        onAddCustomWeather={addCustomWeather}
        onClose={() => setCustomizerOpen(false)}
        onCustomColorChange={setCustomColor}
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

      <PinSettingsDialog
        isOpen={pinSettingsOpen}
        onChangePin={changePin}
        onClose={() => setPinSettingsOpen(false)}
        onRemovePin={removePin}
      />

      <section id="journal" className="relative z-10 mx-auto -mt-1 max-w-[1280px] px-5 py-9 pb-28 sm:px-7 lg:-mt-4 lg:pb-10 xl:px-10">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/85 bg-gradient-to-r from-white/88 via-sage-50/78 to-sand-50/75 p-3 shadow-soft backdrop-blur xl:p-4">
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
        <form className="rounded-[2rem] border border-sage-100/80 bg-white/94 p-4 shadow-soft backdrop-blur sm:p-6 xl:p-8" onSubmit={saveEntry}>
          <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-sage-100/90 bg-gradient-to-r from-white via-sage-50/35 to-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-sage-600">Your page for today</p>
                <h2 className="mt-2 text-[2rem] font-extrabold leading-tight text-ink sm:text-3xl">Keep it simple. Write what feels true.</h2>
                <p className="mt-2 text-sm leading-7 text-sage-700">This page does not need a polished story. A sentence, a fragment, or a few plain words are already enough.</p>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-sage-100 bg-white/98 px-4 py-2 text-sm font-bold text-sage-700 shadow-sm">
                <CalendarDays size={16} /> {formatDate(new Date().toISOString())}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-sage-600 sm:text-xs">
              <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-sm">{selectedMood} mood</span>
              <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-sm">{draftWordCount} words</span>
              <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-sm">{completedQuestCount}/{journalQuest.length} ritual steps</span>
            </div>
          </div>

          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <label className="block text-sm font-bold text-sage-800" htmlFor="entry-title">Title, if you want one</label>
            <p className="text-sm font-semibold text-sage-500">It can stay short, plain, or even blank.</p>
          </div>
          <input
            className="journal-title-input mb-5 w-full rounded-[1.75rem] px-5 py-4 text-lg font-semibold outline-none"
            id="entry-title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. The part of today I want to keep"
            value={title}
          />

          <div className="mb-4 rounded-[1.6rem] border border-sage-100/90 bg-gradient-to-r from-white via-sage-50/45 to-white p-3.5 shadow-sm backdrop-blur-sm sm:p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-500">Light controls</p>
                  <p className="mt-1 text-sm font-semibold text-sage-600">Keep only what helps, then let the page stay quiet.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[31rem] xl:grid-cols-3">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">
                    Mood
                    <select className="mt-2 w-full rounded-[1.15rem] border border-sage-100 bg-white/95 px-3.5 py-3 text-sm font-semibold text-ink outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70" onChange={(event) => setSelectedMood(event.target.value)} value={selectedMood}>
                      {weatherOptions.map((mood) => (
                        <option key={mood.label} value={mood.label}>{mood.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">
                    Font
                    <select className="mt-2 w-full rounded-[1.15rem] border border-sage-100 bg-white/95 px-3.5 py-3 text-sm font-semibold text-ink outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70" onChange={(event) => setJournalStyle({ ...journalStyle, fontId: event.target.value })} value={journalStyle.fontId}>
                      {journalFontOptions.map((font) => (
                        <option key={font.id} value={font.id}>{font.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">
                    Size
                    <select className="mt-2 w-full rounded-[1.15rem] border border-sage-100 bg-white/95 px-3.5 py-3 text-sm font-semibold text-ink outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70" onChange={(event) => setJournalStyle({ ...journalStyle, sizeId: event.target.value })} value={journalStyle.sizeId}>
                      {journalSizeOptions.map((size) => (
                        <option key={size.id} value={size.id}>{size.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 xl:max-w-[22rem] xl:justify-end">
                <button className="rounded-full border border-sage-100 bg-white px-3.5 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-sage-50" onClick={() => toggleBoldText(entryBodyRef, setBody)} title="Bold selected text" type="button">Bold</button>
                <button className="rounded-full border border-sage-100 bg-white px-3.5 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-sage-50" onClick={() => toggleUnderlineText(entryBodyRef, setBody)} title="Underline selected text" type="button">Underline</button>
                <button className="rounded-full border border-sage-100 bg-white px-3.5 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-sage-50" onClick={() => toggleBulletList(entryBodyRef, setBody)} title="Bullet points" type="button">List</button>
                {quickEmojis.slice(0, 4).map((emoji) => (
                  <button key={emoji} className="rounded-full border border-sage-100 bg-white px-3 py-1.5 text-base shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-sage-50" onClick={() => insertQuickEmoji(emoji)} type="button">
                    {emoji}
                  </button>
                ))}
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-sage-100 bg-white px-3.5 py-2 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-sage-50">
                  <ImagePlus size={14} /> Photo
                  <input accept="image/*" className="hidden" onChange={handleEntryImageUpload} type="file" />
                </label>
                <button className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-800" type="submit">Save page</button>
              </div>
            </div>
          </div>

          <div className="journal-editor-shell mt-2 rounded-[2rem] p-3 md:p-4">
            <div className="journal-editor-ribbon">quiet page</div>
            <div className="journal-editor-meta journal-editor-top mb-3 flex flex-wrap items-center justify-between gap-2 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-sage-500 sm:text-xs sm:tracking-[0.24em]">
              <span>{selectedMood} mood · today</span>
              <span>{draftWordCount === 0 ? 'slow is still writing' : `${draftWordCount} words so far`}</span>
            </div>
            <div
              ref={entryBodyRef}
              className="journal-editor journal-editor-soft min-h-[24rem] w-full overflow-auto rounded-[1.75rem] px-6 py-6 outline-none sm:min-h-[30rem]"
              contentEditable
              suppressContentEditableWarning
              style={{ fontFamily: activeJournalFont, fontSize: activeJournalSize, lineHeight: 1.95, color: '#24312e', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              onInput={(e) => setBody(e.currentTarget.innerHTML)}
              data-placeholder="Start with one true sentence."
            />
            <div className="journal-editor-meta journal-editor-bottom mt-4 flex flex-wrap items-center justify-between gap-2 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-sage-500 sm:text-xs sm:tracking-[0.24em]">
              <span>A few clear lines are enough for today.</span>
              <span>{streak} day{streak === 1 ? '' : 's'} of returning</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="rounded-[1.2rem] border border-sage-100 bg-white/85 px-4 py-3 text-sm font-semibold leading-6 text-sage-700 shadow-sm">
              {journalNudge}
            </div>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800 sm:w-auto" type="submit">
              <Plus size={19} /> Save page
            </button>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/80 bg-gradient-to-r from-sage-50/60 via-white to-sand-50/40 p-4 shadow-inner ring-1 ring-white/70 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><Feather size={16} /> If you want a starting line</div>
                <p className="max-w-2xl font-display text-2xl font-bold leading-relaxed text-sage-950">{activePrompt}</p>
                <p className="mt-3 text-sm font-semibold text-sage-700">Use the prompt if it helps, or leave it and begin exactly where your mind already is.</p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-sage-100 bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-1 hover:border-sage-200 hover:bg-sage-50" onClick={() => setActivePrompt(prompts[(prompts.indexOf(activePrompt) + 1) % prompts.length])} type="button">
                  <Sparkles size={15} /> New prompt
                </button>
              </div>

              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="rounded-3xl bg-white/82 p-4 shadow-sm ring-1 ring-sage-100/70">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-xl shadow-sm">
                      {companionIsUploadedMedia ? <HeartHandshake size={20} className="text-sage-700" /> : <span>{companion.character || '💛'}</span>}
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Diary start</p>
                      <h3 className="mt-2 text-lg font-extrabold leading-tight text-sage-950">Write it the way it happened, felt, or stayed with you.</h3>
                      <p className="mt-2 text-sm leading-7 text-sage-700">Try “Today felt…”, “I keep coming back to…”, or “Right now I need…”.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/82 p-4 shadow-sm ring-1 ring-sage-100/70">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Little markers</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickEmojis.slice(0, 8).map((emoji) => (
                      <button
                        key={emoji}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sage-100 bg-white text-xl shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:shadow-md"
                        onClick={() => addStarterLine(emoji)}
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] font-bold text-sage-600">Tap one if you want a tiny bit of texture on the page.</p>
                </div>

                <div className="rounded-3xl bg-white/82 p-4 shadow-sm ring-1 ring-sage-100/70">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Small ways to begin</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {moodStarterPrompts.map((starter) => (
                      <button key={starter} className="rounded-full border border-sage-100 bg-white px-3.5 py-2 text-sm font-bold text-sage-700 transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-sage-50" onClick={() => addStarterLine(starter)} type="button">
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-sage-100 bg-white/88 p-5 shadow-sm ring-1 ring-sage-100/70">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Kept gently</p>
                      <h3 className="mt-2 text-xl font-extrabold leading-tight text-sage-950">A quiet record is forming.</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-50 text-2xl text-sage-800 shadow-sm">{rewardLevel.emoji}</div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-sage-100 bg-sage-50/60 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">Pages saved</p>
                      <p className="mt-2 text-2xl font-extrabold text-sage-950">{entries.length}</p>
                    </div>
                    <div className="rounded-2xl border border-sage-100 bg-sage-50/60 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">Current rhythm</p>
                      <p className="mt-2 text-2xl font-extrabold text-sage-950">{streak}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-sage-100 bg-sage-50/55 px-4 py-3 text-sm leading-7 text-sage-700">
                    {weeklyCheckIns >= weeklyGoal ? 'This week already has enough gentle attention in it.' : `${weeklyGoal - weeklyCheckIns} more check-in${weeklyGoal - weeklyCheckIns === 1 ? '' : 's'} if you want to fill this week softly.`}
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={() => navigateToTab('memories')} type="button">
                    <BookOpen size={15} /> Visit your memories
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.85fr)] xl:grid-cols-[1.3fr_0.9fr]">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-sage-600">Soft landing</p>
                    <h3 className="mt-2 text-xl font-extrabold text-ink">Three gentle ways in</h3>
                  </div>
                  <div className="rounded-full bg-sage-100 px-3 py-2 text-sm font-extrabold text-sage-800">{completedQuestCount}/3 felt natural</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {journalQuest.map((step) => (
                    <div key={step.label} className={`rounded-full px-4 py-2 text-sm font-bold transition ${step.done ? 'bg-sage-900 text-white shadow-lift' : 'border border-sage-100 bg-sage-50 text-sage-700'}`}>
                      {step.done ? '✓' : '○'} {step.label}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-semibold leading-7 text-sage-800">{journalNudge}</p>
              </div>
              <div className="rounded-3xl border border-sage-100 bg-gradient-to-br from-sand-50 to-white p-5 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-widest text-sand-500">This week so far</p>
                <p className="mt-2 text-3xl font-extrabold text-sage-950">{weeklyCheckIns}/{weeklyGoal}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">{weeklyCheckIns >= weeklyGoal ? 'You already gave yourself enough room this week.' : `${weeklyGoal - weeklyCheckIns} more soft check-in${weeklyGoal - weeklyCheckIns === 1 ? '' : 's'} if you want to fill this week.`}</p>
              </div>
              <div className="rounded-3xl border border-sage-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-widest text-rose-500">Keepsake path</p>
                <p className="mt-2 text-3xl font-extrabold text-sage-950">{rewardLevel.emoji}</p>
                <p className="mt-2 text-base font-extrabold text-sage-900">{entriesToNextReward === 0 ? 'Your next bloom is already here.' : `${entriesToNextReward} more ${entriesToNextReward === 1 ? 'page' : 'pages'} until the next bloom.`}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">A few honest pages slowly turn into a quiet little collection.</p>
              </div>
              <div className="rounded-3xl border border-sage-100 bg-gradient-to-br from-sage-50 to-white p-5 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-widest text-sage-500">{returnRitual.eyebrow}</p>
                <p className="mt-2 text-xl font-extrabold text-sage-950">{returnRitual.title}</p>
                <p className="mt-3 text-sm leading-7 text-sage-700">{returnRitual.text}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-sage-500">{latestEntry ? `${latestEntry.mood} mood kept nearby` : 'A gentle habit can start today'}</p>
              </div>
              <div className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm lg:col-span-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-sage-600">Keepsake shelf</p>
                    <h3 className="mt-2 text-xl font-extrabold text-ink">{unlockedAchievementCount}/{achievementBadges.length} keepsakes collected</h3>
                    <p className="mt-2 text-sm leading-6 text-sage-700">Little keepsakes make the page feel alive without turning your writing into homework.</p>
                  </div>
                  <div className="rounded-full bg-sage-100 px-4 py-2 text-sm font-extrabold text-sage-800">Next: {nextAchievement.emoji} {nextAchievement.title}</div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {achievementBadges.map((badge) => (
                    <div key={badge.id} className={`rounded-[1.5rem] border p-4 transition ${badge.unlocked ? 'border-sage-200 bg-sage-50 shadow-sm' : 'border-sage-100 bg-white'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${badge.unlocked ? 'bg-white shadow-sm' : 'bg-sage-50 opacity-70'}`}>{badge.emoji}</div>
                        <div>
                          <p className="text-base font-extrabold text-ink">{badge.title}</p>
                          <p className="mt-1 text-sm leading-6 text-sage-700">{badge.hint}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className={`group relative overflow-hidden rounded-[2rem] border p-6 shadow-lift backdrop-blur transition duration-300 hover:shadow-soft ${selectedMoodGuide.shellClass}`}>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sage-50/50 blur-2xl group-hover:bg-sage-100/60"></div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Atmosphere</p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white text-3xl shadow-soft transition group-hover:scale-110">
                    <WeatherGlyph mood={selectedMoodOption} size="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-ink">{selectedMoodGuide.title}</p>
                    <p className="text-sm font-semibold text-sage-700">{selectedMoodGuide.summary}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-sage-700">{latestEntry ? `Continuing "${latestEntry.title}".` : selectedMoodGuide.detail}</p>
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-soft backdrop-blur-xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-rose-600">Journey progress</p>
                <div className="mt-5 flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-rose-50 text-3xl shadow-sm ring-4 ring-rose-50/50">{nextAchievement.emoji}</div>
                  <div>
                    <p className="text-lg font-extrabold text-ink">{nextAchievement.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-sage-700">{nextAchievement.hint}</p>
                  </div>
                </div>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-rose-100/50">
                  <div className="h-full bg-rose-400 transition-all duration-700" style={{ width: `${(unlockedAchievementCount / achievementBadges.length) * 100}%` }}></div>
                </div>
                <p className="mt-4 text-[13px] font-bold text-rose-800">{rewardLevel.next}</p>
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Soft actions</p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-50 text-sage-600 shadow-inner">
                    <Compass size={14} />
                  </div>
                </div>
                <div className="grid gap-3">
                  {[
                    { label: 'Name the feeling', icon: Feather, onClick: () => addStarterLine('Today feels'), color: 'text-sage-700' },
                    { label: 'Open notes', icon: FileText, onClick: () => navigateToTab('notes'), count: openPlannerTodoCount, color: 'text-teal-700' },
                    { label: 'View check-ins', icon: CalendarDays, onClick: () => navigateToTab('insights'), count: importantDateCount, color: 'text-rose-700' }
                  ].map((btn) => (
                    <button key={btn.label} className="group flex items-center justify-between rounded-2xl bg-sage-50/50 px-5 py-3.5 text-left text-sm font-extrabold text-sage-800 ring-1 ring-sage-100/50 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft hover:ring-white" onClick={btn.onClick} type="button">
                      <span className={`inline-flex items-center gap-3 ${btn.color}`}><btn.icon size={17} /> {btn.label}</span>
                      {btn.count !== undefined && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] shadow-inner">{btn.count}</span>}
                    </button>
                  ))}
                </div>
                <p className="mt-5 border-t border-sage-100 pt-5 text-sm leading-relaxed text-sage-700 italic">&ldquo;You do not need to finish the whole story today.&rdquo;</p>
              </div>
            </aside>
          </div>
          {saveReward && (
            <div className="reward-toast mt-5 rounded-3xl border border-sage-100 bg-sage-900 p-5 font-extrabold leading-7 text-white shadow-soft">
              {saveReward}
            </div>
          )}
        </form>
        )}

                        {activeTab === 'unwind' && (
          <div id="game-library" className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6 lg:py-14 fade-in">
            {unwindViewMode === 'detail' && (
              <div ref={selectedGameInterfaceRef} className="game-detail-reveal mb-16 scroll-mt-24">
                <button className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/88 px-4 py-2 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-x-0.5 hover:bg-white" onClick={returnToGameLibrary} type="button">
                  <span aria-hidden="true">←</span> Back to games
                </button>
                <div className="lofi-glass rounded-[2.2rem] border p-3 shadow-soft backdrop-blur sm:p-4 lg:p-5">
                  <div className="rounded-[1.7rem] border border-sage-100 bg-sage-50/55 p-4 shadow-sm">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Now playing</p>
                        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-sage-950">{selectedUnwindGameConfig.title}</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-sage-700">{selectedUnwindGameConfig.description}</p>
                      </div>
                      <div className="flex w-full flex-col gap-2 xl:max-w-[32rem] xl:items-end">
                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          <div className="flex h-11 items-center gap-1 rounded-2xl border border-sage-200 bg-white p-1 shadow-sm">
                            {[
                              { id: 'original', label: 'Original', icon: Sparkles },
                              { id: 'lofi', label: 'Lofi', icon: Moon }
                            ].map((t) => (
                              <button
                                key={t.id}
                                onClick={() => setGameVisualTheme(t.id)}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-widest transition ${gameVisualTheme === t.id ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-500 hover:bg-sage-50'}`}
                                type="button"
                              >
                                <t.icon size={13} /> {t.label}
                              </button>
                            ))}
                          </div>
                          <button onClick={toggleFullscreen} className="flex h-11 items-center gap-2 rounded-2xl border border-sage-200 bg-white px-5 text-sm font-bold text-sage-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" type="button">
                            {isFullscreen ? <ArrowUp size={16} className="rotate-180" /> : <ArrowUp size={16} />}
                            {isFullscreen ? 'Exit full' : 'Full screen'}
                          </button>
                          <button onClick={returnToGameLibrary} className="flex h-11 items-center gap-2 rounded-2xl border border-sage-200 bg-white px-5 text-sm font-bold text-sage-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" type="button">
                            <Gamepad2 size={16} />
                            Back to games
                          </button>
                        </div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sage-600">Difficulty in-game</p>
                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          {difficultyOptions.map((difficulty) => (
                            <button
                              key={difficulty.id}
                              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${selectedGameDifficulty === difficulty.id ? 'bg-sage-900 text-white shadow-sm' : 'border border-sage-200 bg-white text-sage-800 hover:bg-sage-50'}`}
                              onClick={() => setSelectedGameDifficulty(difficulty.id)}
                              type="button"
                            >
                              {difficulty.label}
                              <span className={`ml-2 text-[10px] uppercase tracking-[0.18em] ${selectedGameDifficulty === difficulty.id ? 'text-white/75' : 'text-sage-500'}`}>{difficulty.detail}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs font-semibold text-sage-600">Current setting: {selectedDifficultyConfig.label} — {selectedDifficultyConfig.detail}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`mx-auto mt-5 w-full ${isFullscreen ? 'max-w-none' : (selectedUnwindGameConfig.playingSpace || 'max-w-[980px]')}`}>
                    {gameVisualTheme === 'lofi' ? (
                      <div className="relative overflow-hidden rounded-[2.4rem] border border-white/70 p-4 shadow-[0_24px_80px_rgba(83,62,44,0.18)] sm:p-6">
                        <img src={selectedUnwindGameConfig.preview} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 blur-[1px] scale-105" aria-hidden="true" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#fff7ec]/82 via-[#f4e2cf]/68 to-[#d9c6ff]/48" />
                        <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-white/35 blur-3xl" />
                        <div className="lofi-game-skin relative z-10 rounded-[2rem] border border-white/80 bg-white/72 p-3 shadow-soft backdrop-blur-md sm:p-5">
                          {selectedUnwindGameConfig.component}
                        </div>
                      </div>
                    ) : selectedUnwindGameConfig.component}
                  </div>
                </div>
              </div>
            )}

            <div className={unwindViewMode === 'detail' ? 'mt-24 opacity-80 pt-16 border-t border-sage-100 site-ui-fade-in' : 'game-library-enter'}>
              {unwindViewMode === 'detail' && (
                <div className="mb-10 text-center">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-sage-950">Discover more games</h2>
                  <p className="mt-2 text-sage-600">Pick another one whenever you are ready.</p>
                </div>
              )}
              <div className="mb-10 text-center">
                {unwindViewMode === 'grid' && (
                  <>
                    <p className="mb-2 text-sm font-bold uppercase tracking-widest text-sage-600">Games & Play</p>
                    <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-sage-950">Pick a relaxing game</h1>
                    <p className="mx-auto max-w-2xl text-base text-sage-700">Start with cozy Solitaire or Mind Sweeper, then explore more relaxing browser games while the lofi music keeps the page calm.</p>
                  </>
                )}
              </div>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {unwindGames.map((game) => (
                  <button
                    key={game.id}
                    className={`group relative flex min-h-[14rem] flex-col items-start justify-start overflow-hidden rounded-[2rem] border px-5 py-5 text-left transition duration-300 hover:-translate-y-1 ${selectedUnwindGame === game.id ? 'border-sage-400 ring-2 ring-sage-100' : 'border-white/70 bg-white/78'}`}
                    onClick={() => selectUnwindGame(game.id)}
                    type="button"
                  >
                    <img src={game.preview} alt={`${game.title} preview`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/48 via-black/10 to-transparent" />
                    <div className="relative z-10 p-1">
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">{game.detail}</p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{game.title}</h2>
                    </div>
                    <div className="absolute bottom-5 left-5 z-10 text-[10px] font-black uppercase tracking-widest text-white/90 opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition group-hover:opacity-100">
                      Open game →
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-[1.8rem] border border-white/80 bg-white/82 p-5 shadow-sm backdrop-blur">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Quick start picks</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-sage-950">Start with the easiest game for your mood.</h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-sage-700">These are the friendliest entry points if you want something that feels simple right away.</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {[
                    { id: 'solitaire', label: 'Solitaire • classic' },
                    { id: 'mind-sweeper', label: 'Mind Sweeper • logic' },
                    { id: 'lofi-jigsaw', label: 'Lofi Jigsaw • cozy puzzle' },
                    { id: 'quiet-wordle', label: 'Wordle • guess the word' },
                    { id: 'quiet-tiles', label: 'Tiles • tap and merge' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      className="rounded-full border border-sage-200 bg-sage-50/80 px-4 py-2 text-sm font-extrabold text-sage-800 transition hover:bg-white"
                      onClick={() => selectUnwindGame(item.id)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[1.8rem] border border-sage-100 bg-sage-50/55 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-sage-600" size={20} />
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Featured relaxing games</p>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold text-sage-950">Solitaire and Mind Sweeper are ready first.</h2>
                  <p className="mt-2 text-sm leading-7 text-sage-700">Start with a familiar card game or a calm Minesweeper-style logic board, then keep the lofi music running while you unwind.</p>
                </div>
                <div className="rounded-[1.8rem] border border-sage-100 bg-white/78 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-3">
                    <PenLine className="text-sage-600" size={20} />
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Chill game journal</p>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold text-sage-950">Play, then write one soft reflection.</h2>
                  <p className="mt-2 text-sm leading-7 text-sage-700">A calm game can become a journaling prompt: what felt relaxing, what color or sound stayed with you, and what thought became easier to let go.</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.9rem] border border-white/80 bg-white/84 p-5 shadow-sm backdrop-blur lg:p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Stay in the vibe</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-sage-950">Finish a round, then keep hanging out here.</h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-sage-700">Lofi Memory works best when you can bounce from one calm thing to another — a game, a breath, a quick note, or one sentence of journaling — without needing to leave the same soft space.</p>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: 'Play Solitaire', detail: 'Open the classic card reset first when you want a familiar relaxing game with lofi music nearby.', action: () => selectUnwindGame('solitaire'), icon: Sparkles },
                    { label: 'Try Mind Sweeper', detail: 'Clear calm logic tiles when you want a Minesweeper-style focus break.', action: () => selectUnwindGame('mind-sweeper'), icon: Grid2x2 },
                    { label: 'Breathe for a minute', detail: 'Open the breathing screen for a softer reset between rounds.', action: () => navigateToTab('breathe'), icon: Wind },
                    { label: 'Write one line', detail: 'Catch a thought before it disappears, then come back to the games later.', action: () => navigateToTab('write'), icon: PenLine }
                  ].map((item) => (
                    <button key={item.label} className="group rounded-[1.45rem] border border-white/85 bg-sage-50/55 p-4 text-left transition hover:-translate-y-1 hover:border-sage-200 hover:bg-white hover:shadow-lift" onClick={item.action} type="button">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sage-800 shadow-sm transition group-hover:bg-sage-900 group-hover:text-white"><item.icon size={17} /></div>
                      <h3 className="mt-3 text-base font-extrabold text-sage-950">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-sage-700">{item.detail}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <article className="rounded-[1.9rem] border border-white/80 bg-white/84 p-5 shadow-sm backdrop-blur lg:p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Game-first comfort</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-sage-950">The games are meant to be the easiest place to begin.</h2>
                  <p className="mt-3 text-sm leading-7 text-sage-700">If you just want something familiar, start with <span className="font-extrabold text-sage-900">Solitaire</span> for a classic card reset or <span className="font-extrabold text-sage-900">Mind Sweeper</span> for calm Minesweeper-style logic. Prefer other cozy puzzles? <span className="font-extrabold text-sage-900">Lofi Jigsaw</span>, <span className="font-extrabold text-sage-900">Sudoku</span>, <span className="font-extrabold text-sage-900">Wordle</span>, and <span className="font-extrabold text-sage-900">Tiles</span> are easy relaxing games to play while the lofi music stays on.</p>
                </article>
                <article className="rounded-[1.9rem] border border-white/80 bg-white/84 p-5 shadow-sm backdrop-blur lg:p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Right now</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-sage-950">{selectedUnwindGameConfig.title} • {selectedDifficultyConfig.label}</h2>
                  <p className="mt-3 text-sm leading-7 text-sage-700">{selectedUnwindGameConfig.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-sage-200 bg-sage-50/80 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-700">Switch anytime</span>
                    <span className="rounded-full border border-sage-200 bg-sage-50/80 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-700">Best in short sessions</span>
                    <span className="rounded-full border border-sage-200 bg-sage-50/80 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-700">Made for quick resets</span>
                  </div>
                </article>
              </div>
              <div className="mt-6 grid gap-4 xl:grid-cols-3">
                {chillResearchHighlights.map((item) => (
                  <article key={item.title} className="rounded-[1.8rem] border border-white/80 bg-white/82 p-5 shadow-sm backdrop-blur">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-600">Chill research</p>
                    <h2 className="mt-3 text-lg font-extrabold text-sage-950">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-sage-700">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'breathe' && (
          <div className="mx-auto max-w-5xl px-6 py-10 lg:py-16 fade-in">
            <div className="text-center">
              <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-sage-950">Music Room</h1>
              <p className="mb-14 text-lg text-sage-700">Choose a wallpaper to change the ambient sound and mood.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {breatheRoomOptions.map((option) => {
                const isSelected = selectedBreatheRoom === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => applyBreatheRoom(option.id)}
                    className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border p-1 transition-all duration-500 hover:-translate-y-1.5 ${
                      isSelected ? `bg-white ${option.ringTone} ring-4 ring-offset-4 ring-offset-sage-50` : 'border-white/60 bg-white/40 hover:bg-white/60'
                    }`}
                  >
                    <div className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[2.2rem] bg-gradient-to-br ${option.gradient} shadow-inner`}>
                       {option.wallpaper ? <img src={option.wallpaper} alt={`${option.title} wallpaper`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-white/10" />
                       <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: 'white' }} />
                       <div className={`relative z-10 flex flex-col items-center gap-4 transition-transform duration-700 ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                         <span className="text-4xl drop-shadow">{option.decoration}</span>
                       </div>
                       {isSelected ? (
                         <div className="absolute bottom-4 flex gap-1">
                           {[
                             { id: 'first', delay: 0 },
                             { id: 'second', delay: 0.15 },
                             { id: 'third', delay: 0.3 }
                           ].map((dot) => (
                             <div key={dot.id} className={`h-1.5 w-1.5 rounded-full ${option.textTone} animate-bounce`} style={{ animationDelay: `${dot.delay}s` }} />
                           ))}
                         </div>
                       ) : null}
                    </div>
                    <div className="p-6 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xl font-bold ${option.textTone}`}>{option.title}</h3>
                        {isSelected ? <span className={`text-[10px] font-black uppercase tracking-widest ${option.textTone} opacity-60`}>Active</span> : null}
                      </div>
                      <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${option.textTone} opacity-50`}>{option.sound}</p>
                      <p className="mt-4 text-sm leading-relaxed text-sage-600">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-16 flex flex-col items-center justify-center">
              <div className={`relative flex h-72 w-72 items-center justify-center transition-all duration-700`}>
                <div className={`absolute inset-0 rounded-[4rem] border border-white/60 bg-white/40 shadow-soft backdrop-blur-md transition-all duration-[4000ms] ease-in-out ${
                  breathePhase === 0 ? 'scale-105 opacity-60' : 
                  breathePhase === 1 ? 'scale-105 opacity-90' : 
                  breathePhase === 2 ? 'scale-90 opacity-40' : 
                  'scale-90 opacity-70'
                }`} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="font-display text-3xl font-bold tracking-wide text-sage-900 transition-opacity duration-1000">
                    {['Inhale', 'Hold', 'Exhale', 'Hold'][breathePhase]}
                  </div>
                  <p className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${activeBreatheRoom.textTone}`}>{selectedBreatheRoom} mode</p>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-[3rem] border border-white/80 bg-white/60 p-10 shadow-soft backdrop-blur-md transition hover:bg-white/80">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold text-sage-950 tracking-tight">Focus Timer</h3>
                  <p className="mt-3 text-sage-600 leading-relaxed">Set a gentle timer to keep yourself completely focused on your thoughts without distractions.</p>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  {focusActive ? (
                    <div className="flex flex-col items-center">
                      <div className="font-display text-7xl font-extrabold tabular-nums tracking-tighter text-sage-800">
                        {formatTime(focusTimer)}
                      </div>
                      <button onClick={() => setFocusActive(false)} className="mt-6 rounded-full border border-sage-200 bg-white px-8 py-3 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50">
                        Pause timer
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-4">
                      {[5, 10, 15].map((mins) => (
                        <button key={mins} onClick={() => startFocusSession(mins)} className="flex h-16 w-32 items-center justify-center rounded-2xl bg-sage-900 text-lg font-bold text-white shadow-sm transition hover:-translate-y-1 hover:bg-sage-800">
                          {mins}m
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="mt-12 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-sage-400">
              {breatheRoomStatus}
            </p>
          </div>
        )}

        {activeTab === 'notes' && (
        <div className="mt-6 grid gap-6 pb-28 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:pb-0">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-soft backdrop-blur xl:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage-600 sm:text-sm sm:tracking-widest">Important things</p>
                <h2 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">One cleaner page for reminders, practical notes, and the things you cannot afford to forget.</h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-sage-700">Keep your diary reflective, and let this page hold the useful side of life: plans, deadlines, reminders, and little admin details.</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-sage-50 text-sage-700 shadow-sm ring-1 ring-sage-100">
                <FileText size={20} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                { label: 'Open tasks', value: openPlannerTodoCount },
                { label: 'In progress', value: inProgressPlannerTodoCount },
                { label: 'Completed', value: completedPlannerTodoCount },
                { label: 'Overdue', value: overduePlannerTodoCount }
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.4rem] border border-sage-100 bg-sage-50/55 px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-sage-950">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-sage-100/80 bg-sage-50/45 p-5 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-500">Important notes</p>
                  <p className="mt-1 text-sm font-semibold text-sage-600">Keep deadlines, reminders, shopping needs, travel details, or anything else you want in one calmer place.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-700">
                  <span className="rounded-full border border-sage-100 bg-white px-3 py-1">{plannerNoteWordCount} words</span>
                  <span className="rounded-full border border-sage-100 bg-white px-3 py-1">{plannerNoteLineCount} lines</span>
                  <span className="rounded-full border border-sage-100 bg-white px-3 py-1">{plannerStorageLabel}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {plannerQuickTemplates.map((template) => (
                    <button
                      key={template}
                      className="rounded-full border border-sage-100 bg-white px-3 py-2 text-xs font-extrabold text-sage-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-100"
                      onClick={() => setPlannerBoard((current) => ({ ...current, text: current.text.trim() ? `${current.text.trim()}\n\n${template}` : template }))}
                      type="button"
                    >
                      {template.split('\n')[0].replace('## ', '')}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-sage-100 bg-white px-3 py-2 shadow-sm">
                  <input
                    className="w-40 bg-transparent text-sm font-semibold text-sage-800 outline-none placeholder:text-sage-400"
                    onChange={(event) => setPlannerNoteSearch(event.target.value)}
                    placeholder="Find in notes"
                    value={plannerNoteSearch}
                  />
                  {plannerNoteSearch.trim() && (
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sage-500">{plannerNoteSearchCount} hits</span>
                  )}
                </div>
              </div>
              <textarea
                className="mt-4 min-h-[22rem] w-full rounded-[1.5rem] border border-sage-100 bg-white px-5 py-4 text-sm leading-7 text-sage-900 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
                onChange={(event) => setPlannerBoard((current) => ({ ...current, text: event.target.value }))}
                placeholder="Keep important things here: dates, calls, shopping needs, ideas, and practical details you want nearby."
                value={plannerBoard.text}
              />
              <p className="mt-3 text-xs font-semibold text-sage-500">Tip: use the quick chips above to drop in neat little sections instead of staring at a blank notes page.</p>
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-[1.9rem] border border-white/80 bg-white/78 p-5 shadow-soft backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Task board</p>
                  <p className="mt-1 text-sm font-semibold text-sage-600">Small, clear tasks with priority, status, and optional due dates so the page stays useful without feeling noisy.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-700">
                  <button className={`rounded-full border px-3 py-1 transition ${plannerTodoFilter === 'all' ? 'border-sage-900 bg-sage-900 text-white' : 'border-sage-100 bg-white text-sage-700 hover:bg-sage-50'}`} onClick={() => setPlannerTodoFilter('all')} type="button">All {plannerTodoCount}</button>
                  <button className={`rounded-full border px-3 py-1 transition ${plannerTodoFilter === 'open' ? 'border-sage-900 bg-sage-900 text-white' : 'border-sage-100 bg-white text-sage-700 hover:bg-sage-50'}`} onClick={() => setPlannerTodoFilter('open')} type="button">Open {openPlannerTodoCount}</button>
                  <button className={`rounded-full border px-3 py-1 transition ${plannerTodoFilter === 'doing' ? 'border-sage-900 bg-sage-900 text-white' : 'border-sage-100 bg-white text-sage-700 hover:bg-sage-50'}`} onClick={() => setPlannerTodoFilter('doing')} type="button">Doing {inProgressPlannerTodoCount}</button>
                  <button className={`rounded-full border px-3 py-1 transition ${plannerTodoFilter === 'done' ? 'border-sage-900 bg-sage-900 text-white' : 'border-sage-100 bg-white text-sage-700 hover:bg-sage-50'}`} onClick={() => setPlannerTodoFilter('done')} type="button">Done {completedPlannerTodoCount}</button>
                  <button className={`rounded-full border px-3 py-1 transition ${plannerTodoFilter === 'high' ? 'border-sage-900 bg-sage-900 text-white' : 'border-sage-100 bg-white text-sage-700 hover:bg-sage-50'}`} onClick={() => setPlannerTodoFilter('high')} type="button">High {plannerBoard.todos.filter((todo) => todo.priority === 'high').length}</button>
                  <span className="rounded-full border border-sage-100 bg-white px-3 py-1">{plannerStorageLabel}</span>
                </div>
              </div>

              <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={addPlannerTodo}>
                <input
                  className="flex-1 rounded-[1.15rem] border border-sage-100 bg-white px-4 py-3 text-sm font-semibold text-sage-900 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70 sm:col-span-2"
                  onChange={(event) => setPlannerTodoDraft(event.target.value)}
                  placeholder="Add a task"
                  value={plannerTodoDraft}
                />
                <select
                  className="rounded-[1.15rem] border border-sage-100 bg-white px-4 py-3 text-sm font-semibold text-sage-800 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
                  onChange={(event) => setPlannerTodoPriorityDraft(event.target.value)}
                  value={plannerTodoPriorityDraft}
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
                <input
                  className="rounded-[1.15rem] border border-sage-100 bg-white px-4 py-3 text-sm font-semibold text-sage-800 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
                  min={todayISO()}
                  onChange={(event) => setPlannerTodoDueDateDraft(event.target.value)}
                  type="date"
                  value={plannerTodoDueDateDraft}
                />
                <select
                  className="rounded-[1.15rem] border border-sage-100 bg-white px-4 py-3 text-sm font-semibold text-sage-800 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
                  onChange={(event) => setPlannerTodoRecurrenceDraft(event.target.value)}
                  value={plannerTodoRecurrenceDraft}
                >
                  <option value="none">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <button className="inline-flex items-center justify-center rounded-[1.15rem] bg-sage-900 px-4 py-3 text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-sage-800 sm:col-span-2" type="submit">
                  <Plus size={18} />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-500">
                <span>{filteredPlannerTodos.length} shown · {overduePlannerTodoCount} overdue</span>
                {completedPlannerTodoCount > 0 && (
                  <button className="rounded-full border border-sage-100 bg-white px-3 py-2 text-sage-700 transition hover:bg-sage-50" onClick={clearCompletedPlannerTodos} type="button">
                    Clear done tasks
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {filteredPlannerTodos.length ? filteredPlannerTodos.map((todo) => {
                  const statusTone = todo.status === 'done'
                    ? 'border-sage-700 bg-sage-700 text-white'
                    : todo.status === 'doing'
                      ? 'border-teal-200 bg-teal-50 text-teal-700'
                      : 'border-sage-200 bg-white text-sage-500 hover:border-sage-300 hover:text-sage-600';
                  const priorityTone = todo.priority === 'high'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : todo.priority === 'low'
                      ? 'border-sage-100 bg-sage-50 text-sage-600'
                      : 'border-amber-200 bg-amber-50 text-amber-700';
                  const isEditingTodo = editingPlannerTodoId === todo.id;
                  return (
                    <div
                      key={todo.id}
                      className={`rounded-[1.4rem] border bg-white px-4 py-3 shadow-sm transition ${draggedPlannerTodoId === todo.id ? 'border-teal-200 opacity-60' : 'border-sage-100'}`}
                      draggable={!isEditingTodo}
                      onDragEnd={() => setDraggedPlannerTodoId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDragStart={() => setDraggedPlannerTodoId(todo.id)}
                      onDrop={(event) => { event.preventDefault(); reorderPlannerTodo(draggedPlannerTodoId, todo.id); setDraggedPlannerTodoId(null); }}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          className={`mt-0.5 flex min-h-[2.4rem] min-w-[2.4rem] shrink-0 items-center justify-center rounded-full border px-2 text-[10px] font-extrabold uppercase tracking-[0.14em] transition ${statusTone}`}
                          onClick={() => cyclePlannerTodoStatus(todo.id)}
                          type="button"
                        >
                          {todo.status === 'done' ? 'Done' : todo.status === 'doing' ? 'Doing' : 'To do'}
                        </button>
                        <div className="min-w-0 flex-1">
                          {isEditingTodo ? (
                            <div className="space-y-3">
                              <input
                                className="w-full rounded-2xl border border-sage-100 bg-sage-50/60 px-4 py-3 text-sm font-semibold text-sage-900 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
                                onChange={(event) => setEditingPlannerTodoText(event.target.value)}
                                value={editingPlannerTodoText}
                              />
                              <div className="grid gap-2 sm:grid-cols-3">
                                <select className="rounded-2xl border border-sage-100 bg-white px-3 py-2 text-xs font-bold text-sage-700 outline-none" onChange={(event) => setEditingPlannerTodoPriority(event.target.value)} value={editingPlannerTodoPriority}>
                                  <option value="low">Low priority</option>
                                  <option value="medium">Medium priority</option>
                                  <option value="high">High priority</option>
                                </select>
                                <input className="rounded-2xl border border-sage-100 bg-white px-3 py-2 text-xs font-bold text-sage-700 outline-none" min={todayISO()} onChange={(event) => setEditingPlannerTodoDueDate(event.target.value)} type="date" value={editingPlannerTodoDueDate} />
                                <select className="rounded-2xl border border-sage-100 bg-white px-3 py-2 text-xs font-bold text-sage-700 outline-none" onChange={(event) => setEditingPlannerTodoRecurrence(event.target.value)} value={editingPlannerTodoRecurrence}>
                                  <option value="none">One-time</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </select>
                              </div>
                              <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em]">
                                <button className="rounded-full bg-sage-900 px-3 py-2 text-white transition hover:bg-sage-800" onClick={() => savePlannerTodoEdit(todo.id)} type="button">Save edit</button>
                                <button className="rounded-full border border-sage-100 bg-white px-3 py-2 text-sage-600 transition hover:bg-sage-50" onClick={cancelEditingPlannerTodo} type="button">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className={`text-sm font-semibold leading-6 ${todo.status === 'done' ? 'text-sage-400 line-through' : 'text-sage-800'}`}>{todo.text}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                                  <span className={`rounded-full border px-2.5 py-1 ${todo.status === 'done' ? 'border-sage-200 bg-white text-sage-500' : 'border-sage-100 bg-white text-sage-600'}`}>{getPlannerStatusLabel(todo.status)}</span>
                                  <button className={`rounded-full border px-2.5 py-1 transition ${priorityTone}`} onClick={() => cyclePlannerTodoPriority(todo.id)} type="button">
                                    {getPlannerPriorityLabel(todo.priority)} priority
                                  </button>
                                  {todo.dueDate ? <span className={`rounded-full border px-2.5 py-1 ${isPlannerTodoOverdue(todo) ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sage-100 bg-white text-sage-600'}`}>{isPlannerTodoOverdue(todo) ? 'Overdue' : 'Due'} {formatShortDate(todo.dueDate)}</span> : null}
                                  <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-teal-700">{getPlannerRecurrenceLabel(todo.recurrence)}</span>
                                </div>
                              </div>
                              <div className="flex shrink-0 flex-col gap-2 text-sage-400">
                                <button className="rounded-full border border-sage-100 bg-white p-1.5 transition hover:text-sage-700" onClick={() => startEditingPlannerTodo(todo)} type="button" aria-label="Edit task">
                                  <PenLine size={15} />
                                </button>
                                <button className="rounded-full border border-sage-100 bg-white p-1.5 transition hover:text-sage-700" onClick={() => movePlannerTodo(todo.id, -1)} type="button" aria-label="Move task up">
                                  <ArrowUp size={15} />
                                </button>
                                <button className="rounded-full border border-sage-100 bg-white p-1.5 text-xs font-black transition hover:text-sage-700" onClick={() => movePlannerTodo(todo.id, 1)} type="button" aria-label="Move task down">
                                  ↓
                                </button>
                                <button className="rounded-full border border-sage-100 bg-white p-1.5 transition hover:text-rose-500" onClick={() => deletePlannerTodo(todo.id)} type="button" aria-label="Delete task">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="rounded-[1.4rem] border border-dashed border-sage-200 bg-sage-50/45 px-4 py-5 text-sm font-semibold leading-6 text-sage-500">
                    No tasks match this view yet. Try another filter or add a new task with a priority, due date, or recurring rhythm.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-white/80 bg-white/78 p-5 shadow-soft backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Upcoming reminders</p>
                  <p className="mt-1 text-sm font-semibold text-sage-600">A calm shortlist of the dates that are coming up next.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-700">
                  <span className="rounded-full border border-sage-100 bg-sage-50 px-3 py-1">{upcomingReminderCount} upcoming</span>
                  <span className="rounded-full border border-sage-100 bg-white px-3 py-1">{reminderStorageLabel}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {upcomingReminderPreview.length ? upcomingReminderPreview.map((item) => (
                  <button className="w-full rounded-[1.4rem] border border-sage-100 bg-sage-50/45 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm" key={item.dateKey} onClick={() => { setSelectedCalendarDate(item.dateKey); navigateToTab('memories'); }} type="button">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold leading-6 text-sage-900">{item.note}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-sage-500">{formatDate(item.dateKey)}{item.time ? ` · ${formatReminderTime(item.time)}` : ''}</p>
                      </div>
                      <span className="rounded-full border border-sage-100 bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-700">{item.relativeLabel}</span>
                    </div>
                  </button>
                )) : (
                  <div className="rounded-[1.4rem] border border-dashed border-sage-200 bg-sage-50/45 px-4 py-5 text-sm font-semibold leading-6 text-sage-500">
                    No upcoming reminders yet. Mark an important date in the calendar and it will show up here.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-white/80 bg-white/78 p-5 shadow-soft backdrop-blur-xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Keep it simple</p>
              <div className="mt-4 space-y-3 text-sm font-semibold leading-7 text-sage-700">
                <p>Use this page for practical life details, not emotional journaling.</p>
                <p>Keep the to-do list short enough that it still feels calm to open.</p>
                <p>Move back to writing when you want reflection instead of admin.</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-full bg-sage-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-800" onClick={() => navigateToTab('write')} type="button">
                  <PenLine size={15} /> Go back to writing
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={() => navigateToTab('insights')} type="button">
                  <CalendarDays size={15} /> Open calendar
                </button>
              </div>
            </div>
          </aside>
        </div>
        )}

        {activeTab === 'insights' && (
        <div className="mt-6 grid gap-6 pb-28 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:pb-0">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white/88 via-sage-50/68 to-sand-50/72 p-4 shadow-soft backdrop-blur sm:p-6 xl:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage-600 sm:text-sm sm:tracking-widest">Reflection pattern</p>
                <h2 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">Your recent journal check-ins</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-sage-700">See the week in a calmer way: mood shifts, small streaks, and the gentle rhythm you are building by returning.</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-white text-sage-700 shadow-sm">
                <Moon size={20} />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-700">
              <span className="rounded-full border border-white/90 bg-white/88 px-3 py-2 shadow-sm">{weeklyCheckIns}/{weeklyGoal} check-ins this week</span>
              <span className="rounded-full border border-white/90 bg-white/88 px-3 py-2 shadow-sm">{entries.length} pages in your archive</span>
              <span className="rounded-full border border-white/90 bg-white/88 px-3 py-2 shadow-sm">{unlockedAchievementCount}/{achievementBadges.length} keepsakes lit</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sand-500 sm:text-sm sm:tracking-widest">This week so far</p>
            <p className="mt-3 text-4xl font-extrabold text-sage-950">{weeklyCheckIns}/{weeklyGoal}</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-sage-700">{weeklyCheckIns >= weeklyGoal ? 'You already gave yourself enough room this week.' : `${weeklyGoal - weeklyCheckIns} more soft check-ins if you want to fill this week.`}</p>
            <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-sage-100">
              <div className="h-full rounded-full bg-gradient-to-r from-sage-500 to-teal-500 transition-all duration-700" style={{ width: `${Math.min((weeklyCheckIns / weeklyGoal) * 100, 100)}%` }}></div>
            </div>
            <div className="mt-6 rounded-[1.75rem] bg-gradient-to-br from-rose-50 to-white p-5 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-500 sm:text-sm sm:tracking-widest">Keepsake path</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">{rewardLevel.emoji}</div>
                <div>
                  <p className="text-lg font-extrabold text-sage-950">{rewardLevel.title}</p>
                  <p className="text-sm font-semibold leading-6 text-sage-700">{entriesToNextReward === 0 ? 'Your next bloom is here.' : `${entriesToNextReward} pages until the next bloom.`}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-soft backdrop-blur xl:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage-600 sm:text-sm sm:tracking-widest">Mood garden</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">A softer chart view so the patterns stay readable on both mobile and desktop.</p>
              </div>
              <div className="rounded-full bg-sage-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-800">Weekly summary</div>
            </div>
            <div className="mt-5">
              <MoodChart entries={entries} weatherOptions={weatherOptions} />
            </div>
            <div className="mt-5 rounded-[1.75rem] bg-white p-5 text-sm font-bold leading-7 text-sage-900 shadow-inner">
              {weeklySummary}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-soft backdrop-blur xl:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 sm:text-sm sm:tracking-widest">{returnRitual.eyebrow}</p>
              <p className="mt-2 text-2xl font-extrabold leading-tight text-sage-950">{returnRitual.title}</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-sage-700">{returnRitual.text}</p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-sage-800" onClick={() => navigateToTab('write')} type="button">
                <PenLine size={16} /> Return to writing
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-soft backdrop-blur xl:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage-600">Keepsake shelf</p>
                <div className="rounded-full bg-sage-100 px-3 py-1 text-[10px] font-extrabold text-sage-800">{unlockedAchievementCount}/{achievementBadges.length}</div>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {achievementBadges.map((badge) => (
                  <div key={badge.id} className={`flex aspect-square items-center justify-center rounded-2xl text-xl shadow-sm transition-all ${badge.unlocked ? 'bg-white grayscale-0' : 'bg-sage-50/50 opacity-40 grayscale'}`} title={`${badge.title}: ${badge.hint}`}>
                    {badge.emoji}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold leading-7 text-sage-700">Every return adds another little sign that this space is becoming yours.</p>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'memories' && (
        <div className="mt-6 grid gap-6 pb-24 lg:pb-0">

          <div className="flex flex-wrap items-center justify-center gap-2 rounded-[1.6rem] border border-white/80 bg-white/78 p-2 shadow-sm backdrop-blur">
            <button className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition ${memoriesView === 'calendar' ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-700 hover:bg-sage-50'}`} onClick={() => setMemoriesView('calendar')} type="button">Calendar</button>
            <button className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition ${memoriesView === 'archive' ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-700 hover:bg-sage-50'}`} onClick={() => setMemoriesView('archive')} type="button">Positivity archive</button>
          </div>

          {memoriesView === 'calendar' && (
          <div className="rounded-[2rem] border border-white/80 bg-white/84 p-4 shadow-soft backdrop-blur sm:p-5 lg:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage-600">Journal calendar</p>
                <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Memories</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-sage-700">
                <span className="rounded-full border border-sage-100 bg-sage-50 px-3 py-2">{importantDateCount} saved</span>
                <span className="rounded-full border border-sage-100 bg-sage-50 px-3 py-2">{upcomingReminderCount} reminders</span>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(19rem,29rem)_minmax(0,1fr)] xl:items-start">
              <div className="rounded-[1.6rem] border border-sage-100 bg-sage-50/72 p-3 shadow-inner sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-2 rounded-[1.2rem] bg-white px-2 py-2 shadow-sm">
                  <button className="rounded-full bg-sage-50 px-3 py-2 text-sm font-extrabold text-sage-800 transition hover:bg-sage-100" onClick={() => setCalendarMonth(shiftMonthKey(calendarMonth, -1))} type="button">‹</button>
                  <p className="text-center text-sm font-extrabold text-sage-950 sm:text-base">{formatMonthLabel(calendarMonth)}</p>
                  <button className="rounded-full bg-sage-50 px-3 py-2 text-sm font-extrabold text-sage-800 transition hover:bg-sage-100" onClick={() => setCalendarMonth(shiftMonthKey(calendarMonth, 1))} type="button">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-sage-500">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day}>{day}</div>)}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEntries = day ? entriesByDate[day.dateKey] || [] : [];
                    const hasImportantDate = day ? Boolean(importantDates[day.dateKey]) : false;
                    const dayForecast = day ? calendarForecastByDate[day.dateKey] : null;
                    const dayForecastVisuals = getForecastVisuals(dayForecast);
                    const isSelected = day?.dateKey === selectedCalendarDate;
                    const isToday = day?.dateKey === todayISO();
                    return day ? (
                      <button
                        className={`relative flex h-11 items-center justify-center rounded-xl border text-xs font-extrabold transition hover:-translate-y-0.5 sm:h-12 sm:text-sm ${isSelected ? 'border-sage-800 bg-sage-900 text-white shadow-lift' : isToday ? 'border-sage-300 bg-white text-sage-900' : 'border-sage-100 bg-white/92 text-sage-800 hover:bg-white'}`}
                        key={day.dateKey}
                        onClick={() => {
                          setSelectedCalendarDate(day.dateKey);
                          openImportantDateEditor(day.dateKey);
                        }}
                        type="button"
                      >
                        <span>{day.day}</span>
                        {hasImportantDate && <span className={`absolute right-1.5 top-1 text-[10px] ${isSelected ? 'text-sand-100' : 'text-rose-500'}`}>✦</span>}
                        {dayForecast && <span className="absolute bottom-1 right-1 text-[10px] leading-none" title={dayForecastVisuals.label}>{dayForecastVisuals.emoji}</span>}
                        {dayEntries.length > 0 && <span className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? 'bg-white' : 'bg-sage-700'}`} />}
                      </button>
                    ) : <div key={`blank-${index}`} />;
                  })}
                </div>
                <button className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-sage-100 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-sage-700 shadow-sm transition hover:bg-sage-50" onClick={() => { const today = todayISO(); setCalendarMonth(today.slice(0, 7)); setSelectedCalendarDate(today); openImportantDateEditor(today); }} type="button">
                  Jump to today
                </button>
              </div>

              <div className="rounded-[1.75rem] border border-sage-100 bg-white/94 p-4 shadow-inner sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-sage-600">Selected date</p>
                    <h3 className="mt-1 text-2xl font-extrabold text-ink">{formatDate(selectedCalendarDate)}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-sage-600">Click any date, then write a note or reminder here.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-full bg-sage-900 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-sage-800" onClick={() => openImportantDateEditor(selectedCalendarDate)} type="button">
                      {selectedImportantDate ? 'Edit note' : 'Write note'}
                    </button>
                    {selectedImportantDate && (
                      <button className="rounded-full bg-rose-100 px-4 py-2.5 text-sm font-extrabold text-rose-700 transition hover:bg-rose-200" onClick={() => deleteImportantDate(selectedCalendarDate)} type="button">
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-sage-100 bg-gradient-to-br from-sage-50/90 to-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                        {selectedCalendarForecast ? selectedCalendarForecastVisuals.emoji : '📍'}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sage-600">Local weather</p>
                        {selectedCalendarForecast ? (
                          <p className="mt-1 text-sm font-extrabold text-sage-950">
                            {selectedCalendarForecastVisuals.label} · {formatForecastTemperature(selectedCalendarForecast.maxTemp)} / {formatForecastTemperature(selectedCalendarForecast.minTemp)}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm font-semibold leading-6 text-sage-700">{calendarForecastStatus}</p>
                        )}
                        {selectedCalendarForecast && <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-sage-500">{calendarForecastLocation || 'Your location'} · {selectedCalendarDate}</p>}
                      </div>
                    </div>
                    {calendarForecastPermission !== 'loading' && (
                      <button className="rounded-full border border-sage-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sage-700 transition hover:bg-sage-50" onClick={loadCalendarForecast} type="button">
                        {calendarForecastPermission === 'granted' ? 'Refresh' : 'Use location'}
                      </button>
                    )}
                    {calendarForecastPermission === 'loading' && <span className="rounded-full border border-sage-100 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sage-600">Loading</span>}
                  </div>
                  {selectedCalendarForecast && <p className="mt-3 text-xs font-semibold leading-5 text-sage-600">Forecast uses your browser location and is available for nearby upcoming dates.</p>}
                </div>

                {selectedImportantDate && (
                  <div className="mt-4 rounded-2xl border border-sage-100 bg-sage-50/76 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sage-600">Saved note or reminder</p>
                        <p className="mt-2 text-base font-extrabold leading-6 text-sage-950">{selectedImportantDate.note}</p>
                        {selectedImportantDate.details && <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-sage-700">{selectedImportantDate.details}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sage-700">
                        {selectedImportantDate.time && <span className="rounded-full border border-sage-100 bg-white px-3 py-1.5">{formatReminderTime(selectedImportantDate.time)}</span>}
                        <span className="rounded-full border border-sage-100 bg-white px-3 py-1.5">{selectedImportantDate.remindersEnabled ? 'Reminder on' : 'Note only'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {importanceModalOpen && (
                  <div className="mt-4 rounded-[1.6rem] border border-sage-200 bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sage-700">Add to this date</p>
                    <div className="mt-4 grid gap-3">
                      <label className="block">
                        <span className="text-sm font-extrabold text-sage-900">Title</span>
                        <input
                          className="mt-2 w-full rounded-2xl border border-sage-200 bg-sage-50/70 px-4 py-3 text-sm font-semibold text-sage-900 outline-none transition focus:border-sage-300 focus:bg-white"
                          maxLength={80}
                          onChange={(event) => setImportanceDraft(event.target.value)}
                          placeholder="Exam, birthday, deadline..."
                          value={importanceDraft}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-extrabold text-sage-900">Notes</span>
                        <textarea
                          className="mt-2 min-h-[150px] w-full rounded-2xl border border-sage-200 bg-sage-50/70 px-4 py-3 text-sm font-semibold leading-6 text-sage-900 outline-none transition focus:border-sage-300 focus:bg-white"
                          maxLength={320}
                          onChange={(event) => setImportanceDetailsDraft(event.target.value)}
                          placeholder="Write what you want to remember on this date."
                          value={importanceDetailsDraft}
                        />
                      </label>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)]">
                      <label className="block">
                        <span className="text-sm font-extrabold text-sage-900">Time</span>
                        <input
                          className="mt-2 w-full rounded-2xl border border-sage-200 bg-sage-50/70 px-4 py-3 text-sm font-semibold text-sage-900 outline-none transition focus:border-sage-300 focus:bg-white"
                          onChange={(event) => setImportanceTimeDraft(event.target.value)}
                          type="time"
                          value={importanceTimeDraft}
                        />
                      </label>
                      <label className="flex items-center gap-3 rounded-2xl border border-sage-100 bg-sage-50/70 px-4 py-3 text-sm font-semibold leading-6 text-sage-800">
                        <input checked={importanceReminderEnabled} className="h-4 w-4 rounded border-sage-300 text-sage-700 focus:ring-sage-300" onChange={(event) => setImportanceReminderEnabled(event.target.checked)} type="checkbox" />
                        Remind me if browser notifications are allowed
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-sage-800" onClick={saveImportantDate} type="button">Save</button>
                      <button className="rounded-full border border-sage-200 bg-white px-5 py-3 text-sm font-extrabold text-sage-700 transition hover:bg-sage-50" onClick={() => setImportanceModalOpen(false)} type="button">Cancel</button>
                      <button className={`rounded-full border px-5 py-3 text-sm font-extrabold transition ${notificationPermission === 'granted' ? 'border-sage-200 bg-white text-sage-700 hover:bg-sage-50' : 'border-sage-900 bg-white text-sage-900 hover:bg-sage-50'}`} onClick={requestNotificationPermission} type="button">
                        {notificationPermission === 'granted' ? 'Notifications on' : 'Allow notifications'}
                      </button>
                    </div>
                    {notificationStatusMessage && <p className="mt-3 rounded-2xl bg-sage-50 px-4 py-3 text-sm font-semibold leading-6 text-sage-700">{notificationStatusMessage}</p>}
                  </div>
                )}

                {selectedDateEntries.length ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sage-600">Journal entries on this day</p>
                    {selectedDateEntries.map((entry) => (
                      <button className="w-full rounded-2xl border border-sage-100 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:bg-sage-50 hover:shadow-sm" key={entry.id} onClick={() => setSelectedEntry(entry)} type="button">
                        <p className="font-extrabold text-sage-950">{entry.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-sage-700">{getPlainTextFromHtml(entry.body || entry.prompt || '') || 'Photo entry'}</p>
                      </button>
                    ))}
                  </div>
                ) : <p className="mt-4 rounded-2xl border border-dashed border-sage-200 bg-sage-50/50 px-4 py-4 text-sm font-semibold leading-6 text-sage-500">No diary entry for this date yet.</p>}

                {upcomingReminderPreview.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-sage-100 bg-white p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sage-600">Upcoming</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {upcomingReminderPreview.slice(0, 3).map((item) => (
                        <button className={`rounded-full border px-3 py-2 text-xs font-extrabold transition hover:bg-sage-50 ${item.dateKey === selectedCalendarDate ? 'border-sage-300 bg-sage-50 text-sage-900' : 'border-sage-100 bg-white text-sage-700'}`} key={item.dateKey} onClick={() => { setSelectedCalendarDate(item.dateKey); openImportantDateEditor(item.dateKey); }} type="button">
                          {formatDate(item.dateKey)} · {item.note}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {memoriesView === 'archive' && (
          <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white/90 via-white/84 to-sand-50/72 p-4 shadow-soft backdrop-blur sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-sage-700" size={18} />
                <div>
                  <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Your positivity archive</h2>
                  <p className="mt-1 text-sm font-semibold leading-7 text-sage-700">Open any page to read the full memory, with a calmer layout that uses the whole panel more gracefully.</p>
                </div>
              </div>
              <div className="rounded-full bg-sage-100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-700 sm:text-[11px]">
                {entries.length} saved
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-0 min-h-[24rem] sm:min-h-[32rem] sm:pr-2 xl:min-h-0">
              {!entries.length && <p className="rounded-3xl bg-white p-5 font-semibold leading-7 text-sage-900 shadow-inner">No entries yet. Start with one sentence if that is all you have today.</p>}
              {entries.map((entry) => {
                const effectiveMoodLabel = { 'Grounded': 'Happy', 'Soft': 'Calm', 'Okay': 'Neutral', 'Heavy': 'Sad', 'Stormy': 'Anxious' }[entry.mood] || entry.mood;
                const mood = weatherOptions.find((item) => item.label === effectiveMoodLabel) || weatherOptions.find(m => m.label === entry.mood) || moods[2];
                return (
                  <article
                    className="group w-full cursor-pointer rounded-3xl border border-sage-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lift sm:p-5"
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-600">
                        <span className="inline-flex items-center gap-2 rounded-full bg-sage-50 px-3 py-1.5 text-sage-700"><WeatherGlyph mood={mood} size="text-base" /> {entry.mood}</span>
                        <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-sage-100">{formatDate(entry.createdAt)}</span>
                      </div>
                      <h3 className="text-xl font-extrabold leading-tight text-ink">{entry.title}</h3>
                      <p className="mt-3 whitespace-pre-line break-words leading-7 text-sage-800">
                        {(() => {
                          const tempDiv = document.createElement('div');
                          tempDiv.innerHTML = entry.body || entry.prompt || '';
                          const images = tempDiv.querySelectorAll('img');
                          let preview = tempDiv.textContent || tempDiv.innerText || '';
                          if (images.length > 0) preview = '📷 ' + preview;
                          preview = preview.trim();
                          return preview.length > 180 ? `${preview.slice(0, 180).trim()}…` : preview;
                        })()}
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-4 border-t border-sage-50 pt-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-500">
                          <span className="rounded-full bg-sage-50 px-3 py-1">Open full page</span>
                          {entry.prompt && <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Prompt kept</span>}
                          {entry.image && <span className="rounded-full bg-sand-50 px-3 py-1 text-sand-700">Photo saved</span>}
                        </div>
                        <button className="shrink-0 rounded-full p-2 text-sage-300 opacity-60 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); deleteEntry(entry.id); }} type="button" aria-label="Delete entry">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
        </div>
        )}
      </section>

      {activeTab === 'home' && (
      <>
      {activeHomeSection === 'overview' && !showMinimalHomeOverview && (
      <section className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-4">
        <div className="quote-card quote-card-premium rounded-3xl border border-white/70 p-8 shadow-soft">
          <Quote className="mb-8 opacity-80" size={34} />
          <p className="quote-main-text font-bold leading-tight" style={{ fontFamily: activeQuoteFont, fontSize: activeQuoteSize, color: quoteStyle.textColor, lineHeight: 1.45 }}>“{quoteLibrary[quoteIndex % quoteLibrary.length]}”</p>
          <button className="quote-button mt-8 rounded-full bg-white px-5 py-3 text-sm font-extrabold shadow-lift transition hover:-translate-y-1 hover:bg-sage-50" onClick={() => setQuoteIndex((quoteIndex + 1) % quoteLibrary.length)}>
            Another calming quote
          </button>
        </div>
      </section>
      )}

      {activeHomeSection === 'about' && (
      <section id="about" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <SectionHeader
          eyebrow="About Lofi Memory"
          title="A private online diary designed to feel calm, personal, and easy to return to."
          text="Lofi Memory is a private online diary built to make journaling feel light, repeatable, and emotionally safe — a softer place to notice your thoughts, moods, and everyday life."
        />
        <div className="grid gap-5 md:grid-cols-3">
          <InfoCard icon={Lock} title="Private by design">
            Your entries are saved to your Google-linked account when you sign in, or only in your browser when you do not. Other visitors opening the site will see their own journal, not yours.
          </InfoCard>
          <InfoCard icon={Leaf} title="Calm, minimal rhythm">
            The interface uses soft colors, spacious cards, and tiny prompts so the experience feels more like exhaling than checking off a task.
          </InfoCard>
          <InfoCard icon={Compass} title="Built for daily understanding">
            Mood tracking and prompts help you notice patterns over time, without turning emotions into a scorecard.
          </InfoCard>
          <InfoCard icon={ImagePlus} title="Custom emotions">
            Create custom moods with your own words, emoji, or uploaded images so your check-ins feel personal and expressive.
          </InfoCard>
          <InfoCard icon={Palette} title="A look that fits you">
            Choose color themes, card styles, and quote-card colors. Each visitor can make the space feel like their own.
          </InfoCard>
          <InfoCard icon={HeartHandshake} title="Positive self-awareness">
            The site offers journaling guidance and reflection tools for everyday self-understanding, small wins, and clearer personal direction.
          </InfoCard>
        </div>
      </section>
      )}

      {activeHomeSection === 'guides' && (
      <section id="seo-landing" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-10">
        <SectionHeader
          eyebrow="Chill guides & calm routines"
          title="Find the kind of game, reset, or journaling support that fits what you need today."
          text="Some people want a private diary, some want an online journal, and some are simply looking for cozy browser games or easy ways to relax after a long day. These pages help readers find the calmest place to begin."
        />
        <div className="mb-6 rounded-[1.8rem] border border-white/80 bg-white/82 p-5 shadow-lift backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Most searched topics</p>
              <h3 className="mt-2 text-2xl font-extrabold text-ink">Jump straight to the guide that matches the search intent.</h3>
            </div>
            <p className="max-w-xl text-sm leading-7 text-sage-800">These quick links strengthen internal linking for SEO and make the guide area easier to scan for visitors who already know what they want.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {seoPopularSearches.map((item) => (
              <a className="rounded-full border border-sage-200 bg-sage-50/70 px-4 py-2 text-sm font-bold text-sage-800 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href={item.href} key={item.href}>{item.label}</a>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {seoLandingBlocks.slice(0, 8).map((item) => (
            <article className="customizable-card rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/95" key={item.title}>
              <div className="rounded-full bg-sage-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sage-800">Reader guide</div>
              <h3 className="mt-4 text-2xl font-extrabold leading-tight text-ink">{item.title}</h3>
              <p className="mt-4 leading-8 text-sage-800">{item.text}</p>
              <a className="mt-5 inline-flex text-sm font-bold text-sage-900 underline decoration-sage-300 underline-offset-4" href={item.href}>Open guide</a>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-white/75 bg-white/80 p-6 shadow-lift backdrop-blur lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-sage-700">Keep exploring</p>
              <h3 className="mt-3 text-3xl font-extrabold text-ink">Read the guide that matches the way you want to listen, relax, play, or journal.</h3>
              <p className="mt-3 max-w-3xl leading-8 text-sage-800">Whether you want lofi music, a chill place online, relaxing games with music, a softer study break, privacy, mood check-ins, or evening reflection, these pages give visitors something useful to read before they begin.</p>
            </div>
            <a className="inline-flex items-center justify-center rounded-full bg-sage-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sage-800" href="/listen-to-lofi-music-online.html">
              Browse guides
            </a>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {seoGuideGroups.map((group) => (
              <article className="rounded-[1.8rem] border border-sage-100/80 bg-sand-50/70 p-5 shadow-sm" key={group.title}>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Guide collection</p>
                <h4 className="mt-3 text-2xl font-extrabold leading-tight text-ink">{group.title}</h4>
                <p className="mt-3 text-sm leading-7 text-sage-800">{group.description}</p>
                <div className="mt-5 grid gap-2">
                  {group.links.map((page) => (
                    <a className="group flex items-start justify-between gap-3 rounded-2xl border border-white/80 bg-white/82 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sage-200 hover:bg-white" href={page.href} key={page.href}>
                      <span>
                        <span className="block text-sm font-extrabold text-sage-950 group-hover:text-sage-800">{page.title}</span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-sage-600">{page.text}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sage-700">Read</span>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/95 to-sand-50/85 p-6 shadow-lift backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Quiet reader space</p>
              <h4 className="mt-3 text-2xl font-extrabold leading-tight text-ink">A stable place for future recommendations, without interrupting the journal.</h4>
              <p className="mt-3 max-w-2xl leading-8 text-sage-800">This area sits outside the main writing flow, so future recommendations can live here without covering prompts, shifting the editor, or making the journaling experience feel crowded on mobile or desktop.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a className="inline-flex items-center justify-center rounded-full bg-sage-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sage-800" href="/private-online-diary.html">Open private diary guide</a>
                <a className="inline-flex items-center justify-center rounded-full border border-sage-200 bg-white px-5 py-3 text-sm font-bold text-sage-900 transition hover:-translate-y-0.5 hover:border-sage-300" href="/journal-prompts.html">Browse prompts</a>
              </div>
            </div>
            <div className="rounded-3xl border border-sage-100/80 bg-white/85 p-6 shadow-lift backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Why this reader area stays separate</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-sage-800">
                <li>• Future recommendations can live here without interrupting the writing screen.</li>
                <li>• Your diary, memories, and prompts stay stable instead of shifting around.</li>
                <li>• Mobile visitors get a clean block to explore, rather than overlays or crowded panels.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}

      {activeHomeSection === 'resources' && (
      <section id="resources" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <SectionHeader
          eyebrow="Positive reflection tools"
          title="Small practices that make journaling easier."
          text="Use these when you want a softer entry, a little gratitude, or a calmer way to close the day."
        />
        <div className="mb-6 grid gap-5 md:grid-cols-2">
          <InfoCard icon={ShieldCheck} title="A clear mind moment">
            Pause before you write: take one slow breath, notice your current state, and choose one word that describes what you want more of today.
          </InfoCard>
          <InfoCard icon={Mail} title="Share the good when you want">
            If a journal entry helps you understand yourself, you can choose to share a positive insight with someone you trust — only if it feels right.
          </InfoCard>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {resources.map((resource) => (
            <InfoCard icon={HeartHandshake} title={resource.title} key={resource.title}>
              {resource.text}
            </InfoCard>
          ))}
        </div>
      </section>
      )}

      {activeHomeSection === 'articles' && (
      <section id="articles" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <SectionHeader
          eyebrow="Wellness Library"
          title="Articles and reflections for a gentler journaling practice."
          text="These guides and short reflections help visitors begin private journaling with more clarity, kindness, and curiosity."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {wellnessArticles.map((article, index) => (
            article.href ? (
              <a href={article.href} className="customizable-card rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/95 text-left block" key={article.title}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-sage-900 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white">{article.read.split('•')[0]}</span>
                  <span className="text-sm font-bold text-sage-600">{article.read.split('•')[1] || ''}</span>
                </div>
                <h3 className="text-2xl font-extrabold leading-tight text-ink">{article.title}</h3>
                <p className="mt-4 leading-8 text-sage-800">{article.body}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-sage-900">
                  Read full article &rarr;
                </div>
              </a>
            ) : (
              <article className="customizable-card rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/95" key={article.title}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sage-800">Note</span>
                  <span className="text-sm font-bold text-sage-600">{article.read}</span>
                </div>
                <h3 className="text-2xl font-extrabold leading-tight text-ink">{article.title}</h3>
                <p className="mt-4 leading-8 text-sage-800">{article.body}</p>
              </article>
            )
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/blog.html" className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/70 px-6 py-3 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white backdrop-blur">
            Visit the full Blog & Wellness Library &rarr;
          </a>
        </div>
      </section>
      )}

      {activeHomeSection === 'faq' && (
      <section id="faq" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <SectionHeader
          eyebrow="Journal FAQ"
          title="Common questions about using a private online diary and mood journal."
          text="This FAQ answers the things people usually want to know before they begin journaling here."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {seoFaqs.map((item) => (
            <article className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lift backdrop-blur" key={item.question}>
              <h3 className="text-xl font-extrabold text-ink">{item.question}</h3>
              <p className="mt-3 leading-7 text-sage-800">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
      )}

      {activeHomeSection === 'tips' && (
      <section id="tips" className="mx-auto grid max-w-[1280px] gap-8 px-5 py-14 sm:px-7 xl:px-10 lg:grid-cols-12">
        <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-sand-100 to-sage-100 p-8 shadow-soft lg:col-span-5 lg:p-10">
          <Newspaper className="mb-7 text-sage-700" size={36} />
          <p className="text-sm font-bold uppercase tracking-widest text-sage-700">Journaling tips</p>
          <h2 className="mt-3 font-display text-5xl font-bold leading-tight text-sage-950">A softer way to start writing.</h2>
          <p className="mt-5 leading-8 text-sage-800">Think of journaling as a conversation with yourself. The goal is not to be profound; it is to be present.</p>
        </div>
        <div className="grid gap-4 lg:col-span-7">
          {tips.map((tip, index) => (
            <div className="flex items-start gap-4 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-lift backdrop-blur" key={tip}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-700 font-bold text-white">{index + 1}</div>
              <p className="pt-2 text-lg font-semibold leading-7 text-sage-900">{tip}</p>
            </div>
          ))}
        </div>
      </section>
      )}

      {activeHomeSection === 'privacy' && (
      <section id="privacy" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <SectionHeader
          eyebrow="Privacy Policy"
          title="Your reflections belong to you."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard icon={Shield} title="What is stored">
            Journal entries are saved to your Google-linked cloud account when you sign in. If you use the site without signing in, entries, mood choices, custom emotion labels/images, and your optional PIN stay in this browser using local storage.
          </InfoCard>
          <InfoCard icon={Lock} title="What visitors can see">
            Other people who open the website do not see your entries. Their browser creates a separate journal space, and signed-in entries are separated by Google account.
          </InfoCard>
          <InfoCard icon={ShieldCheck} title="Google sign-in">
            Google sign-in is used so your journal can follow you across devices. Your email is used to identify your account and sync your entries.
          </InfoCard>
          <InfoCard icon={FileText} title="Advertising and Google AdSense">
            This site may use Google AdSense to show ads. Google and its partners may use cookies or similar technologies to serve and measure ads based on visits to this and other websites. Visitors can manage ad personalization through Google Ads Settings.
          </InfoCard>
          <InfoCard icon={Mail} title="Contact for privacy questions">
            For privacy questions, feedback, or requests, contact the site owner at atastymealy@gmail.com.
          </InfoCard>
        </div>
      </section>
      )}

      {activeHomeSection === 'terms' && (
      <section id="terms" className="mx-auto grid max-w-[1280px] gap-8 px-5 py-14 sm:px-7 xl:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl border border-white/70 bg-white/75 p-8 shadow-soft backdrop-blur">
            <Scale className="mb-7 text-sage-700" size={36} />
            <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Helpful notes</p>
            <h2 className="mt-3 font-display text-5xl font-bold leading-tight text-sage-950">A simple space for personal writing.</h2>
          </div>
        </div>
        <div className="space-y-5 lg:col-span-7">
          <InfoCard icon={HeartHandshake} title="For personal reflection">
            Lofi Memory is made for private journaling, positivity, and everyday self-understanding. Use it as a space to notice your thoughts and what matters to you.
          </InfoCard>
          <InfoCard icon={Sunrise} title="Choose your own pace">
            There is no perfect streak and no pressure to write a lot. A tiny note, a good thing, or one honest sentence is enough.
          </InfoCard>
          <InfoCard icon={PenLine} title="Write what feels useful">
            You can use prompts, skip prompts, write a long entry, or keep it short. The journal is here to help you understand your current state and what you want next.
          </InfoCard>
          <InfoCard icon={Shield} title="Content ownership">
            Your writing remains yours. Signed-in entries are stored under your Google-linked account, while signed-out entries stay in your browser storage.
          </InfoCard>
          <InfoCard icon={FileText} title="Advertising disclosure">
            The site may show third-party ads to support free access. Ad providers may set cookies or use similar technologies according to their own policies.
          </InfoCard>
          <InfoCard icon={Mail} title="Questions about these terms">
            Contact atastymealy@gmail.com if you have questions about the site, privacy, or these terms.
          </InfoCard>
        </div>
      </section>
      )}

      {activeHomeSection === 'contact' && (
      <>
      <section id="contact" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-sage-900 text-white shadow-soft">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <Mail className="mb-7 text-sage-100" size={36} />
              <p className="text-sm font-bold uppercase tracking-widest text-sage-200">Contact</p>
              <h2 className="mt-3 font-display text-5xl font-bold leading-tight">Questions, feedback, or partnership ideas?</h2>
              <p className="mt-5 leading-8 text-sage-100">Send questions, feedback, collaboration ideas, or privacy requests to the site owner. This helps visitors, advertisers, and review teams understand who runs the site.</p>
            </div>
            <div className="bg-white/10 p-8 lg:p-10">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-white/95 p-6 text-ink shadow-lift">
                  <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Site owner email</p>
                  <a className="mt-3 block break-words text-2xl font-extrabold text-sage-900 underline decoration-sage-300 underline-offset-4" href="mailto:atastymealy@gmail.com">
                    atastymealy@gmail.com
                  </a>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/8 p-6 text-white shadow-inner backdrop-blur">
                  <p className="text-sm font-bold uppercase tracking-widest text-sage-100">A gentle place to begin</p>
                  <h3 className="mt-3 text-2xl font-extrabold leading-tight text-white">Made for people who want somewhere calm to start a diary.</h3>
                  <p className="mt-3 leading-7 text-sage-50/90">Lofi Memory is for people who want a softer first step into diary writing — whether you are starting for the first time, starting again, or simply trying to understand your days more clearly.</p>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-sage-50/90">
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">Diary writing can support wellbeing by helping you process emotions instead of carrying everything in your head.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">It can improve mental clarity, help you notice patterns in your moods, and create a steadier routine during stressful periods.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">Over time, even short entries can strengthen self-awareness, gratitude, and a calmer relationship with your inner life.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-8">
        <div className="rounded-3xl border border-dashed border-sage-300 bg-white/60 p-8 text-center shadow-lift backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Support this project</p>
          <h2 className="mt-3 text-2xl font-extrabold text-ink">Help keep Lofi Memory free and peaceful</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-sage-700">This space may be supported by gentle, non-intrusive advertising after approval. Ads will stay outside the private writing area so journaling remains calm.</p>
        </div>
      </section>
      </>
      )}

      {activeHomeSection === 'seo-studio' && showAdminTools && (
      <section id="seo-studio" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
        <SectionHeader
          eyebrow="Admin-only AI SEO Studio"
          title="Review and draft SEO improvements without changing the public experience."
          text="This panel is only visible when the master email is signed in. It lets you run an AI SEO review from inside the website, keep the API key in your own browser, and work on ideas without exposing admin tools to normal visitors."
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Master access</p>
                <h3 className="mt-2 text-2xl font-extrabold text-ink">Signed in as {user?.email}</h3>
                <p className="mt-3 leading-7 text-sage-700">Normal visitors never see this section. The public journaling flow stays exactly the same unless you later choose to apply changes manually.</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-900 text-white shadow-sm">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-sage-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-sage-600">Preview mode</p>
              <div className="mt-3 flex overflow-hidden rounded-full border border-sage-200 bg-sage-50 p-1">
                <button
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold transition ${adminViewMode === 'master' ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-700 hover:bg-white'}`}
                  onClick={() => setAdminViewMode('master')}
                  type="button"
                >
                  Master view
                </button>
                <button
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold transition ${adminViewMode === 'user' ? 'bg-sage-900 text-white shadow-sm' : 'text-sage-700 hover:bg-white'}`}
                  onClick={() => setAdminViewMode('user')}
                  type="button"
                >
                  User view
                </button>
              </div>
              <p className="mt-3 text-sm leading-7 text-sage-700">Switch to user view any time to hide admin tools and preview the calmer public experience while staying signed in.</p>
            </div>

            <div className="mt-6 grid gap-3 text-sm leading-7 text-sage-700">
              <div className="rounded-2xl border border-sage-100 bg-sage-50/80 px-4 py-4">
                <p className="font-extrabold text-sage-900">What this first version can do</p>
                <p className="mt-2">Run an AI SEO review of the current diary site, suggest safer homepage and guide-page improvements, and draft ideas you can later implement without disrupting users.</p>
              </div>
              <div className="rounded-2xl border border-sage-100 bg-white px-4 py-4">
                <p className="font-extrabold text-sage-900">What it does not auto-publish yet</p>
                <p className="mt-2">This version does not silently rewrite the live site on its own. It gives you admin-only guidance and drafts first, which is safer for SEO and much better for preserving tone.</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-sage-100 bg-gradient-to-br from-sage-900 via-sage-800 to-sage-700 p-5 text-white shadow-soft">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/80">Suggested routine</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-white/90">
                <div>1. Run a fresh AI review when you want new SEO ideas.</div>
                <div>2. Pick only a few high-impact suggestions at a time.</div>
                <div>3. Keep the writing experience calm and avoid constant churn.</div>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-white/80">Master email: {MASTER_ADMIN_EMAIL}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Run AI review</p>
                <h3 className="mt-2 text-2xl font-extrabold text-ink">SEO drafts that stay inside your admin view</h3>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {seoStudioModelUsed && <span className="rounded-full border border-sage-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-sage-700">Model · {seoStudioModelUsed}</span>}
                {seoStudioLastRun && <span className="rounded-full border border-sage-200 bg-sage-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-sage-800">Last run · {seoStudioLastRun}</span>}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-sage-900">
                Gemini API key
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm font-semibold text-sage-900 outline-none transition focus:border-sage-400"
                    onChange={(event) => setSeoStudioApiKey(event.target.value)}
                    placeholder="Paste your Gemini API key"
                    type={showSeoStudioKey ? 'text' : 'password'}
                    value={seoStudioApiKey}
                  />
                  <button className="rounded-2xl border border-sage-200 bg-white px-4 text-sage-800 shadow-sm transition hover:bg-sage-50" onClick={() => setShowSeoStudioKey(!showSeoStudioKey)} type="button">
                    {showSeoStudioKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <span className="text-xs font-semibold text-sage-600">Stored only in this browser for the master email view. Use a browser-restricted key if possible.</span>
              </label>

              <label className="grid gap-2 text-sm font-bold text-sage-900">
                What should the AI focus on?
                <textarea
                  className="min-h-[128px] rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm leading-7 text-sage-900 outline-none transition focus:border-sage-400"
                  onChange={(event) => setSeoStudioPrompt(event.target.value)}
                  placeholder="Ask for homepage suggestions, new guide ideas, schema improvements, or calmer SEO fixes."
                  value={seoStudioPrompt}
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-sage-900 px-5 py-3 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={seoStudioLoading} onClick={runSeoStudioReview} type="button">
                  <Sparkles size={16} /> {seoStudioLoading ? 'Running review...' : 'Run AI SEO review'}
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-5 py-3 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-1 hover:border-sage-300 hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={!seoStudioReport.trim()} onClick={copySeoStudioReport} type="button">
                  <FileText size={16} /> {seoStudioCopied ? 'Copied' : 'Copy report'}
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-5 py-3 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-1 hover:border-sage-300 hover:bg-sage-50" onClick={clearSeoStudioReport} type="button">
                  Clear
                </button>
              </div>

              {seoStudioError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold leading-7 text-rose-700">
                  {seoStudioError}
                </div>
              )}

              <div className="rounded-[1.75rem] border border-sage-100 bg-sand-50/80 p-4 shadow-inner">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-sage-600">AI report</p>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-sage-500">Admin draft only</span>
                </div>
                <div className="mt-4 max-h-[28rem] overflow-auto rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-sage-100">
                  {seoStudioReport ? (
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-sage-800">{seoStudioReport}</pre>
                  ) : (
                    <p className="text-sm leading-7 text-sage-600">Run the AI SEO review to generate a fresh draft. It will use the current Lofi Memory positioning, homepage framing, guide-page cluster, and privacy-first diary context.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      <footer className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 pb-10 pt-6">
        <div className="lofi-glass rounded-3xl border p-6 text-center text-sm leading-7 text-sage-700 shadow-lift backdrop-blur">
          <div className="mb-3 flex flex-wrap justify-center gap-4 font-bold text-sage-800">
            <a href="#home" onClick={() => openHomeSection('home')}>Home</a>
            <button onClick={() => setCustomizerOpen(true)} type="button">Design</button>
            <a href="#about" onClick={() => openHomeSection('about')}>About</a>
            <a href="#resources" onClick={() => openHomeSection('resources')}>Resources</a>
            <a href="#articles" onClick={() => openHomeSection('articles')}>Articles</a>
            <a href="#tips" onClick={() => openHomeSection('tips')}>Tips</a>
            <a href="/blog.html">Blog</a>
            <a href="/about.html">About</a>
            <a href="/editorial-policy.html">Editorial Policy</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/advertising-policy.html">Advertising</a>
            <a href="/terms.html">Terms</a>
            <a href="/cookie-policy.html">Cookies</a>
            <a href="/disclaimer.html">Disclaimer</a>
            <a href="#diary" onClick={() => navigateToTab('write')}>Diary</a>
          </div>
          Lofi Memory is a soft browser space to listen to lofi music, relax, journal, breathe, and play chill games whenever you want a calmer moment online.
        </div>
      </footer>
      </>
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
      <div className={`fixed z-50 ${cookieConsentAccepted ? 'bottom-12 left-4 sm:left-5 lg:bottom-16 xl:left-[max(1rem,calc((100vw-1280px)/2-4.25rem))]' : 'bottom-32 left-4 sm:bottom-28 sm:left-5 lg:bottom-32 xl:left-[max(1rem,calc((100vw-1280px)/2-4.25rem))]'}`}>

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
            <div className={`relative h-full w-full rounded-full border backdrop-blur-xl transition duration-300 ${isRadioPlaying ? 'border-white/80 bg-white/76' : 'border-white/70 bg-white/62'}`}>
              <div className="pointer-events-none absolute inset-[4px] rounded-full border border-sage-100/70" />
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
                src={radioVinylIcon}
              />
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.42),transparent_28%),radial-gradient(circle_at_70%_72%,rgba(0,0,0,0.18),transparent_34%)]" />
              <span className="pointer-events-none absolute flex h-4 w-4 items-center justify-center rounded-full border border-white/70 bg-sage-950/85 shadow-[0_0_0_3px_rgba(255,255,255,0.35)]">
                <span className="h-2 w-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff7d6,#d5b67f_58%,#6f4f2a)] shadow-[0_0_8px_rgba(255,244,212,0.45)]" />
              </span>
            </span>
          </button>
          {radioNeedsInteraction && (
            <div className="pointer-events-none absolute -top-10 left-0 w-max max-w-[10rem] rounded-2xl border border-white/80 bg-white/92 px-3 py-1.5 text-center text-[10px] font-extrabold uppercase tracking-[0.14em] text-sage-700 shadow-sm backdrop-blur-xl">
              Tap once for sound
            </div>
          )}
          <div className={`pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/75 bg-white/88 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sage-600 shadow-sm backdrop-blur-xl transition duration-300 ${isRadioDialFeedbackVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            {radioVolume}%
          </div>
        </div>
      </div>

      {!cookieConsentAccepted && (
        <div className="pointer-events-none fixed bottom-24 right-3 z-40 flex justify-end sm:bottom-6 sm:right-6">
          <div className="pointer-events-auto w-[min(22rem,calc(100vw-1.5rem))] rounded-[1.4rem] border border-sage-200/90 bg-white/94 p-4 shadow-soft backdrop-blur-xl">
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
        <div className="grid grid-cols-7 gap-1">
        {[
          { id: 'unwind', label: 'Games', icon: Gamepad2 },
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
                  <div className="text-sm font-bold uppercase tracking-widest text-sage-600">{selectedEntry.mood} · {formatDate(selectedEntry.createdAt)}</div>
                )}
                {isEditingEntry ? (
                  <input
                    className="w-full rounded-2xl border border-sage-100 bg-sage-50/80 px-4 py-3 text-2xl font-extrabold text-ink outline-none focus:border-sage-400"
                    onChange={(event) => setEditTitle(event.target.value)}
                    value={editTitle}
                  />
                ) : (
                  <h3 className="mt-2 text-3xl font-extrabold text-ink">{selectedEntry.title}</h3>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!isEditingEntry ? (
                  <button className="rounded-full bg-sage-100 px-4 py-2 text-sm font-extrabold text-sage-900 transition hover:bg-sage-200" onClick={startEditingEntry} type="button">Edit</button>
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
                <div className="journal-editor-shell rounded-[2rem] p-3 md:p-4">
                  <div className="journal-editor-ribbon">quiet diary</div>
                  <div className="journal-editor-meta mb-3 flex flex-wrap items-center justify-end gap-2 px-3 text-xs font-bold uppercase tracking-[0.24em] text-sage-500">
                    <span>{editMood} mood · revisit gently</span>
                  </div>
                  <div
                    ref={editBodyRef}
                    className="journal-editor journal-editor-soft min-h-72 w-full overflow-auto rounded-[1.75rem] px-6 py-6 outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    style={{ fontFamily: activeJournalFont, fontSize: activeJournalSize, lineHeight: 1.95, color: '#24312e', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    onInput={(e) => setEditBody(e.currentTarget.innerHTML)}
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
        className={`fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-sage-900 text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800 ${cookieConsentAccepted ? 'bottom-6 right-6' : 'bottom-44 right-4 sm:bottom-36 sm:right-6'}`}
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
