import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const outputPath = path.join(publicDir, '1000-journaling-games-music-questions.html');

const pageUrl = 'https://lofimemory.vercel.app/1000-journaling-games-music-questions.html';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 64);

const journalingAngles = [
  ['journaling', 'makes thoughts easier to see instead of carry', 'clarity, self-awareness, memory, and steadier choices'],
  ['reflective journaling', 'turns vague pressure into words, patterns, and small next steps', 'mental organization, emotional naming, and practical planning'],
  ['writing thoughts down', 'moves inner noise onto a page where it can be sorted', 'relief, perspective, and better follow-through'],
  ['journaling for self-awareness', 'shows what repeats in your moods, reactions, and decisions', 'honesty, pattern recognition, and kinder self-correction'],
  ['journaling for personal growth', 'turns daily experience into feedback you can use', 'reflection, consistency, and intentional change'],
  ['journaling for mental clarity', 'separates facts, feelings, assumptions, and next actions', 'clearer thinking and less mental clutter'],
  ['private journaling', 'creates a safer-feeling space for unedited reflection', 'privacy, honesty, and emotional room'],
  ['daily journaling', 'builds a record of small shifts that are easy to miss', 'routine, memory, and long-term perspective'],
  ['journaling for decision making', 'lets you compare options without rushing the feeling', 'tradeoffs, values, and calmer choices'],
  ['journaling for confidence', 'records progress and small wins you may forget', 'self-trust, evidence, and steadier motivation']
];

const stressAngles = [
  ['journaling for stress', 'gives stress a container so it does not stay shapeless', 'naming stress, sorting urgency, and choosing one next step'],
  ['journaling for overthinking', 'slows thought loops enough to separate fact from fear', 'mental distance and a calmer response'],
  ['journaling when overwhelmed', 'unloads the crowded mind before problem solving begins', 'relief, prioritization, and lower pressure'],
  ['journaling for anxiety-style thoughts', 'helps write the worry without treating it as the whole truth', 'gentle grounding and perspective'],
  ['journaling after a hard day', 'lets the day be acknowledged before you carry it into rest', 'emotional closure and self-kindness'],
  ['journaling for anger', 'creates a pause between the reaction and what you do with it', 'safer expression and clearer boundaries'],
  ['journaling for sadness', 'gives difficult feelings language and context', 'care, tenderness, and less isolation'],
  ['journaling for burnout', 'shows where energy is leaking and what support is missing', 'limits, recovery, and sustainable routines'],
  ['journaling for emotional reset', 'moves from feeling everything at once to naming one thing at a time', 'regulation, clarity, and gentle action'],
  ['journaling before sleep', 'parks unfinished thoughts outside your head for the night', 'less carryover and a quieter bedtime']
];

const diaryAngles = [
  ['diary and journal differences', 'a diary records what happened while a journal explores what it meant', 'memory plus reflection'],
  ['diary writing', 'preserves the timeline of your life and study routines', 'continuity, recall, and gratitude'],
  ['journal prompts for beginners', 'remove the pressure of inventing a perfect first sentence', 'low-friction starts and honest writing'],
  ['private online diary', 'keeps personal writing searchable and close without opening a noisy feed', 'access, privacy awareness, and returnability'],
  ['what to write in a diary', 'starts with the day, the people, the mood, and what you want to remember', 'simple records that later become meaning'],
  ['what to write in a journal', 'starts with what feels important, confusing, heavy, or worth understanding', 'self-reflection and clarity'],
  ['paper vs online journal', 'depends on whether tactile slowness or searchable convenience helps you return', 'consistency over format perfection'],
  ['mood tracker journal', 'connects feelings with sleep, study, stress, and habits', 'patterns you can actually notice'],
  ['journal habit', 'works best when the entry is small enough to repeat', 'returnability, not perfection'],
  ['one sentence journal', 'makes reflection possible even on low-energy days', 'a tiny but honest check-in']
];

const studentAngles = [
  ['journaling for students', 'clears distracting thoughts before and after study blocks', 'focus, memory, and emotional decompression'],
  ['study journal benefits', 'turns effort into notes about what worked and what still feels unclear', 'better review and less wasted effort'],
  ['journaling before studying', 'chooses one target and names the distraction before it takes over', 'cleaner starts and stronger attention'],
  ['journaling after studying', 'helps recall what clicked and what needs another pass', 'memory, closure, and next-step planning'],
  ['journaling for exam stress', 'separates actual preparation from panic noise', 'calmer planning and realistic study actions'],
  ['journal prompts for school stress', 'make pressure specific enough to handle', 'tasks, feelings, and support needs'],
  ['journaling for procrastination', 'names the resistance underneath delay', 'one first action and less avoidance'],
  ['student focus routine', 'uses a tiny writing checkpoint to enter and exit work', 'structure, confidence, and consistency'],
  ['journaling for college students', 'holds identity, deadlines, independence, and social pressure in one place', 'perspective and emotional organization'],
  ['reflection journal for learning', 'asks what changed in your understanding', 'deeper processing and better retention']
];

const habitAngles = [
  ['best time to journal', 'depends on whether you need morning direction or evening release', 'timing that supports your real life'],
  ['morning journaling benefits', 'sets intention before the day becomes noisy', 'priority, steadiness, and focus'],
  ['night journaling benefits', 'helps close mental tabs before rest', 'closure, reflection, and calmer sleep routines'],
  ['weekly journaling benefits', 'reveals patterns without requiring daily pressure', 'sustainable reflection and perspective'],
  ['how often should you journal', 'often works best at three to five small entries a week', 'consistency without guilt'],
  ['brain dump journaling', 'captures every loose thought before organizing anything', 'relief before analysis'],
  ['gratitude journaling', 'trains attention toward what supported you', 'balance and memory of small good moments'],
  ['guided journaling', 'uses clear prompts when a blank page feels too open', 'structure and low friction'],
  ['journaling when tired', 'should be short, plain, and kind', 'honesty without effort overload'],
  ['how to keep journaling', 'requires a routine that feels useful rather than impressive', 'small cues and realistic entries']
];

const gameAngles = [
  ['playing games intentionally', 'can provide a short shift in attention and mood when chosen intentionally', 'recovery, play, and light challenge'],
  ['relaxing games', 'offer gentle structure without high pressure', 'calmer breaks and mental reset'],
  ['puzzle games', 'give the mind one solvable pattern to hold', 'focus, patience, and satisfying closure'],
  ['memory games', 'exercise recall in a playful low-stakes format', 'attention, familiarity, and small wins'],
  ['word games', 'combine language, pattern recognition, and quick feedback', 'mental freshness and tidy challenge'],
  ['cozy games', 'create a soft environment for decompression', 'comfort, agency, and lower stimulation'],
  ['browser games', 'start quickly without downloads or setup friction', 'contained breaks and easy exits'],
  ['study break games', 'can work when they have clear endings and low emotional stakes', 'renewed attention without losing the day'],
  ['games for tired brains', 'reduce effort by using familiar rules and gentle repetition', 'restorative novelty'],
  ['games before journaling', 'settle restless attention before deeper reflection', 'a bridge from distraction to writing']
];

const nostalgiaAngles = [
  ['playing nostalgic games', 'bring familiar rules and emotional warmth into the break', 'comfort, memory, and lower decision fatigue'],
  ['why nostalgic games feel good', 'connect the present moment to older feelings of play and safety', 'identity, memory, and ease'],
  ['retro games', 'use simple mechanics that are easy to understand quickly', 'clarity, repetition, and satisfying limits'],
  ['nostalgic games for stress', 'can soften the day by returning you to something familiar', 'emotional comfort and a predictable reset'],
  ['classic games for breaks', 'work because the rules are already known', 'low setup and faster recovery'],
  ['nostalgic puzzle games', 'combine memory with a simple challenge', 'gentle engagement and comfort'],
  ['nostalgic games and focus', 'help shift out of mental noise without requiring a new learning curve', 'transition, ease, and small wins'],
  ['cozy nostalgic games', 'feel personal because the mood matters as much as the score', 'warmth and decompression'],
  ['old-school browser games', 'offer quick play with a familiar rhythm', 'low friction and controlled novelty'],
  ['nostalgia in study breaks', 'can make breaks feel emotionally restorative instead of empty', 'mood repair and motivation']
];

const musicAngles = [
  ['listening to music', 'can shape the atmosphere around a task or break', 'mood, rhythm, and attention cues'],
  ['music while studying', 'works best when it supports the task instead of competing with it', 'steady pacing and fewer intrusive distractions'],
  ['music for focus', 'creates a predictable sound environment', 'reduced friction and smoother starts'],
  ['music for relaxation', 'helps the body and attention step down from intensity', 'transition, calm, and emotional pacing'],
  ['instrumental music', 'avoids lyrical competition when you are reading or writing', 'background support and mental space'],
  ['soft music for stress', 'can make a room feel safer and less sharp', 'lower stimulation and comfort'],
  ['music and journaling', 'sets an emotional tone that makes writing easier to begin', 'mood access and flow'],
  ['music and memory', 'often attaches feelings to moments and routines', 'recall, atmosphere, and personal meaning'],
  ['music during breaks', 'marks the break as intentional rather than accidental scrolling', 'boundaries and reset'],
  ['calm playlists', 'reduce the effort of choosing what to hear next', 'consistency and lower decision fatigue']
];

const lofiAngles = [
  ['listening to lofi beats', 'combine gentle rhythm with low-pressure atmosphere', 'focus, calm, and study-friendly continuity'],
  ['lofi music for studying', 'works because it is steady, familiar, and less demanding than many playlists', 'attention support and softer ambience'],
  ['lofi beats for focus', 'give the session a background pulse without becoming the main event', 'rhythm and fewer distractions'],
  ['lofi for stress relief', 'can make a stressful task feel more approachable', 'emotional softening and a calmer start'],
  ['lofi while journaling', 'creates a gentle container for reflective writing', 'mood, privacy, and flow'],
  ['lofi study room benefits', 'turns studying into an environment rather than only a task', 'ritual, focus, and comfort'],
  ['lofi beats and productivity', 'support consistency by making work feel easier to enter', 'cueing, pacing, and lower resistance'],
  ['lofi music at night', 'can help shift from busy input to a quieter routine', 'wind-down and mental closure'],
  ['lofi with games', 'makes a quick game break feel more intentional and less noisy', 'softer play and reset'],
  ['lofi background music', 'fills silence gently without overwhelming attention', 'steady ambience and calm presence']
];

const productAngles = [
  ['lofi music and journaling app', 'keeps the reset and reflection in the same calm place', 'less switching and more continuity'],
  ['private journal with games', 'lets a short game settle the mind before writing', 'playful reset and honest reflection'],
  ['focus timer with journal', 'connects work blocks to a written reflection', 'accountability and memory'],
  ['notes reminders and journal', 'separates tasks from feelings while keeping both nearby', 'organization and self-awareness'],
  ['cozy study room benefits', 'makes focus feel supported rather than forced', 'environment, rhythm, and lower resistance'],
  ['using Lofi Memory', 'combines music, writing, games, notes, reminders, and memories', 'a complete gentle reset loop'],
  ['calm browser app benefits', 'reduces setup friction by keeping tools in one tab', 'simple access and fewer distractions'],
  ['digital calm routine', 'uses small cues to move from noise to intention', 'music, writing, and contained breaks'],
  ['study break journal routine', 'turns a break into recovery plus reflection', 'rest and next-step clarity'],
  ['memory calendar benefits', 'helps saved entries become a personal timeline', 'recall, reflection, and continuity']
];

const categories = [
  ['journaling-benefits', 'Journaling benefits and self-awareness', journalingAngles],
  ['stress-overthinking', 'Stress, overthinking, and emotional relief', stressAngles],
  ['diary-journal-prompts', 'Diary, journal, privacy, and prompts', diaryAngles],
  ['students-focus', 'Students, focus, study, and learning', studentAngles],
  ['habits-sleep-routines', 'Habits, sleep, morning, and night routines', habitAngles],
  ['game-benefits', 'Benefits of playing games and study breaks', gameAngles],
  ['nostalgic-games', 'Nostalgic games, comfort, and memory', nostalgiaAngles],
  ['music-benefits', 'Benefits of listening to music', musicAngles],
  ['lofi-beats', 'Benefits of lofi beats and calm music', lofiAngles],
  ['lofi-memory-workflows', 'Lofi Memory workflows and combined routines', productAngles]
];

const audiences = [
  'students', 'busy adults', 'overthinkers', 'beginners', 'people who feel stressed', 'night owls', 'remote workers', 'creative people', 'people rebuilding a routine', 'anyone who wants a calmer day'
];
const situations = [
  'before studying', 'after a hard day', 'during a short break', 'when the mind feels crowded', 'while building a habit', 'before sleep', 'after scrolling too long', 'when focus feels fragile', 'during exam season', 'when emotions feel messy'
];
const questionForms = [
  (topic, audience, situation) => `What are the benefits of ${topic} for ${audience}?`,
  (topic, audience, situation) => `How can ${topic} help ${audience} ${situation}?`,
  (topic, audience, situation) => `Is ${topic} useful for ${audience}?`,
  (topic, audience, situation) => `Why try ${topic} ${situation}?`,
  (topic, audience, situation) => `What makes ${topic} worth trying?`,
  (topic, audience, situation) => `What problem can ${topic} help with ${situation}?`,
  (topic, audience, situation) => `How should ${audience} use ${topic} ${situation}?`,
  (topic, audience, situation) => `What is the simple value of ${topic}?`,
  (topic, audience, situation) => `How does ${topic} fit into a calmer routine?`,
  (topic, audience, situation) => `When does ${topic} work best for ${audience}?`
];

function buildAnswer(topic, mechanism, benefits, audience, situation, categoryName, index) {
  const base = `${sentenceCase(topic)} can help ${audience} ${situation} because it ${mechanism}. In practice, the benefit is not instant perfection; it is ${benefits} that makes the next moment feel more workable.`;
  const detail = categoryName.includes('Stress')
    ? 'For stress-related topics, keep the routine gentle: name what feels heavy, separate what is urgent from what is emotional, and choose one support step. If stress feels unsafe, extreme, or unmanageable, journaling can support reflection but should not replace trusted help or professional care.'
    : categoryName.includes('games') || categoryName.includes('Nostalgic')
      ? 'The healthiest version has a clear stopping point. Use the game as a contained reset, then return to studying, journaling, rest, or one next action before the break becomes another long loop.'
      : categoryName.includes('music') || categoryName.includes('lofi')
        ? 'It works best when the sound stays in the background. Choose a volume and style that supports the task instead of competing with reading, writing, or the quiet you need.'
        : 'A useful routine stays small enough to repeat. One honest line, one short reflection, or one clear next step often creates more value than a long entry that feels too hard to return to.';
  const product = index % 4 === 0
    ? ' In Lofi Memory, this can become a simple loop: start the room, play lofi if helpful, write a short note or journal entry, and save the small insight for later.'
    : '';
  return `${base} ${detail}${product}`;
}

function sentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const questions = [];
for (const [categoryId, categoryName, angles] of categories) {
  for (let i = 0; i < 100; i += 1) {
    const [topic, mechanism, benefits] = angles[i % angles.length];
    const audience = audiences[Math.floor(i / 10) % audiences.length];
    const situation = situations[i % situations.length];
    const form = questionForms[(i + Math.floor(i / 10)) % questionForms.length];
    const number = questions.length + 1;
    const question = form(topic, audience, situation);
    questions.push({
      number,
      categoryId,
      categoryName,
      question,
      answer: buildAnswer(topic, mechanism, benefits, audience, situation, categoryName, number),
      anchor: `${number}-${slugify(question)}`
    });
  }
}

const toc = categories.map(([id, name], index) => `<a href="#${id}">${index + 1}. ${escapeHtml(name)}</a>`).join('\n');
const categorySections = categories.map(([id, name]) => {
  const items = questions.filter((item) => item.categoryId === id).map((item) => `
            <article class="qa" id="${item.anchor}">
              <div class="num">${item.number}</div>
              <div>
                <h3>${escapeHtml(item.question)}</h3>
                <p>${escapeHtml(item.answer)}</p>
              </div>
            </article>`).join('\n');
  return `
      <section class="section" id="${id}">
        <div class="section-shell card">
          <span class="eyebrow">${escapeHtml(name)}</span>
          <h2>${escapeHtml(name)}</h2>
          <p class="section-note">One hundred detailed answers for this audience cluster, written to be practical, calm, and safe for readers who want more than a one-line response.</p>
          <div class="qa-grid">${items}
          </div>
        </div>
      </section>`;
}).join('\n');

const faqJson = questions.slice(0, 40).map((item) => ({
  '@type': 'Question',
  name: item.question,
  acceptedAnswer: { '@type': 'Answer', text: item.answer }
}));

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>1000 Journaling, Games, Music and Lofi Questions Answered | Lofi Memory</title>
    <meta name="description" content="A 1000-question answer library about journaling benefits, stress relief, diary writing, study focus, cozy games, nostalgic games, music, and lofi beats." />
    <meta name="keywords" content="benefits of journaling, can journaling help with stress, benefits of playing games, nostalgic games benefits, benefits of listening to music, benefits of lofi beats, journaling questions answered" />
    <meta name="robots" content="index, follow, max-snippet:-1" />
    <link rel="canonical" href="${pageUrl}" />
    <style>
      :root{color-scheme:light;--bg:#f7f4ec;--ink:#21312b;--muted:#587064;--sage:#284a3a;--soft:#e5efe3;--cream:#fffaf2;--line:rgba(40,74,58,.14);--card:rgba(255,255,255,.93);--shadow:0 18px 50px rgba(47,70,58,.09)}
      *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:radial-gradient(circle at top left,rgba(222,239,214,.82),transparent 34%),radial-gradient(circle at top right,rgba(255,245,224,.9),transparent 30%),linear-gradient(180deg,#f7f4ec,#f2efe6);line-height:1.72}a{color:var(--sage);font-weight:800}.shell{width:min(1180px,calc(100% - 32px));margin:0 auto}.topbar{padding:18px 0}.topbar-inner{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:center}.brand{font-weight:900;text-decoration:none;color:var(--sage)}.nav,.toc{display:flex;gap:10px;flex-wrap:wrap}.chip,.button,.toc a{border-radius:999px;text-decoration:none;font-weight:800}.chip,.toc a{padding:9px 13px;border:1px solid var(--line);background:#fff;color:var(--muted);font-size:14px}.hero{padding:30px 0 16px}.hero-grid{display:grid;grid-template-columns:1.35fr .9fr;gap:18px}.card,.qa,.stat{border:1px solid var(--line);background:var(--card);border-radius:30px;box-shadow:var(--shadow)}.hero-copy,.hero-side,.section-shell{padding:30px}.eyebrow{display:inline-flex;border-radius:999px;background:var(--soft);color:var(--sage);padding:8px 14px;font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}h1{font-family:Georgia,serif;font-size:clamp(2.25rem,5vw,4.35rem);line-height:1;letter-spacing:-.045em;margin:18px 0}h2{font-size:clamp(1.45rem,3vw,2rem);line-height:1.15;margin:12px 0}h3{margin:0 0 10px;font-size:1.05rem;color:var(--sage)}p{color:var(--muted)}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.button{display:inline-flex;padding:13px 18px}.button-primary{background:var(--sage);color:#fff}.button-secondary{background:#fff;border:1px solid var(--line)}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.stat{padding:18px;background:#fff}.stat strong{display:block;color:var(--sage);font-size:2rem}.section{padding:14px 0}.section-note{margin-top:0}.qa-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:12px}.qa{display:grid;grid-template-columns:auto 1fr;gap:14px;padding:18px;background:#fff}.num{width:34px;height:34px;border-radius:999px;display:grid;place-items:center;background:var(--sage);color:#fff;font-size:12px;font-weight:900}.qa p{margin:0}.trust{padding:24px}.footer{padding:24px 0 46px;text-align:center;color:var(--muted)}.footer nav{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-bottom:12px}@media(max-width:900px){.hero-grid,.qa-grid,.stats{grid-template-columns:1fr}.hero-copy,.hero-side,.section-shell{padding:23px}.qa{grid-template-columns:1fr}.num{width:auto;padding:6px 10px}}
    </style>
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: '1000 Journaling, Games, Music and Lofi Questions Answered', description: 'A 1000-question Lofi Memory answer library for journaling, stress, games, nostalgia, music, and lofi beats.', author: { '@type': 'Organization', name: 'Lofi Memory' }, publisher: { '@type': 'Organization', name: 'Lofi Memory' }, mainEntityOfPage: pageUrl })}</script>
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJson })}</script>
  </head>
  <body>
    <header class="topbar"><div class="shell topbar-inner"><a class="brand" href="/">Lofi Memory</a><nav class="nav"><a class="chip" href="/blog.html">Blog</a><a class="chip" href="/journaling-games-long-tail-seo.html">100-answer hub</a><a class="chip" href="/private-journaling-hub.html">Journal hub</a></nav></div></header>
    <main class="shell">
      <section class="hero"><div class="hero-grid"><article class="card hero-copy"><span class="eyebrow">Expanded answer library</span><h1>1000 journaling, games, music, and lofi questions answered.</h1><p>This page expands the Lofi Memory blog for more audiences: people asking about the benefits of journaling, whether journaling can help with stress, why games can be restorative, why nostalgic games feel comforting, how music affects focus, and why lofi beats are useful for calm study routines.</p><div class="actions"><a class="button button-primary" href="/?tab=write">Open Lofi Memory</a><a class="button button-secondary" href="#journaling-benefits">Start with journaling</a><a class="button button-secondary" href="#lofi-beats">Jump to lofi beats</a></div></article><aside class="card hero-side"><h2>What is inside</h2><p>Ten audience clusters, one hundred questions each, and more detailed answers than the shorter blog hub. The tone stays practical and careful: helpful for everyday reflection, not medical advice.</p><div class="stats"><div class="stat"><strong>1000</strong><span>answers</span></div><div class="stat"><strong>10</strong><span>topics</span></div><div class="stat"><strong>1</strong><span>calm library</span></div></div></aside></div></section>
      <section class="section"><div class="section-shell card"><h2>Browse by topic</h2><div class="toc">${toc}</div></div></section>
${categorySections}
      <section class="section"><div class="card trust"><span class="eyebrow">Trust and transparency</span><h2>Use this as a practical guide, not a medical promise.</h2><p>Lofi Memory is an independent browser project for private journaling, calm study breaks, lofi music, and low-pressure games. Journaling, music, and games can support everyday reflection and decompression, but they are not a replacement for professional help when someone feels unsafe, in crisis, or unable to cope.</p><p><a href="/about.html">About</a> · <a href="/editorial-policy.html">Editorial Policy</a> · <a href="/content-quality-policy.html">Content Quality</a> · <a href="/privacy.html">Privacy</a> · <a href="/advertising-policy.html">Advertising Policy</a> · <a href="/contact.html">Contact</a></p><p>Last reviewed: October 2026.</p></div></section>
    </main>
    <footer class="shell footer"><nav><a href="/">Home</a><a href="/blog.html">Blog</a><a href="/private-journaling-hub.html">Private Journaling Hub</a><a href="/sitemap.html">Sitemap</a><a href="/contact.html">Contact</a></nav><p>&copy; 2026 Lofi Memory</p></footer>
  </body>
</html>
`;

await fs.writeFile(outputPath, html, 'utf8');
console.log(`[generate-1000-answer-library] Wrote ${questions.length} answers to ${outputPath}`);
