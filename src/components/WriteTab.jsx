import React from 'react';
import { BookOpen, CalendarDays, Compass, Feather, FileText, HeartHandshake, ImagePlus, Plus, Sparkles } from 'lucide-react';
import diarySectionPreviewImage from '../assets/optimized/diary-section-preview.webp';
import lofiMemoryHeaderImage from '../assets/optimized/lofi-memory-header.webp';
import { WeatherGlyph } from './SmallComponents.jsx';

export default function WriteTab(props) {
  const {
    achievementBadges,
    activeJournalFont,
    activeJournalSize,
    activePrompt,
    addStarterLine,
    companion,
    companionIsUploadedMedia,
    completedQuestCount,
    draftWordCount,
    entries,
    entriesToNextReward,
    entryBodyRef,
    entryTypeMeta,
    formatDate,
    handleEntryImageUpload,
    importantDateCount,
    insertQuickEmoji,
    journalFontOptions,
    journalNudge,
    journalQuest,
    journalSizeOptions,
    journalStyle,
    latestEntry,
    moodStarterPrompts,
    navigateToTab,
    nextAchievement,
    openPlannerTodoCount,
    prompts,
    quickEmojis,
    returnRitual,
    rewardLevel,
    sanitizeJournalHtml,
    saveEntry,
    saveReward,
    selectedMood,
    selectedMoodGuide,
    selectedMoodOption,
    setActivePrompt,
    setBody,
    setJournalStyle,
    setSelectedMood,
    setTitle,
    setWritingCategory,
    streak,
    toggleBoldText,
    toggleBulletList,
    toggleUnderlineText,
    unlockedAchievementCount,
    weatherOptions,
    weeklyCheckIns,
    weeklyGoal,
    writingCategory
  } = props;

  return (
    <>
      {saveReward && (
        <div className="fixed top-12 left-1/2 z-[9999] w-max max-w-[90vw] -translate-x-1/2 rounded-full border border-sage-800/20 bg-sage-900 px-6 py-4 text-center text-sm font-extrabold text-white shadow-2xl transition-all" role="alert" aria-live="assertive">
          {saveReward}
        </div>
      )}
    <form className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-4 shadow-soft sm:p-6 xl:p-8" onSubmit={saveEntry}>
      <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/25 to-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.06),transparent_35rem)]" />
      <div className="relative z-10">
        <div className="lofi-picture-border lofi-border-memory relative mb-6 overflow-hidden rounded-[2.2rem] border border-[#8b5e3c]/25 p-8 shadow-sm lg:p-10">
          <img src={diarySectionPreviewImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-black/5" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.15),transparent_25rem)]" />
          <div className="relative z-10">
            <h1 className="font-display text-5xl font-bold tracking-tight text-white lofi-sharp-text">Diary</h1>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-white/95 lofi-sharp-text-soft">Private Journal</p>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-base font-bold text-white lofi-sharp-text-soft">Keep it simple. Write what feels true. A sentence, a fragment, or a few plain words are already enough.</p>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-bold text-white lofi-sharp-chip shadow-sm backdrop-blur-md">
                <CalendarDays size={16} /> {formatDate(new Date().toISOString())}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/90 lofi-sharp-text-soft sm:text-xs">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-sm">{entryTypeMeta[writingCategory].shortLabel}</span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-sm">{selectedMood} mood</span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-sm">{draftWordCount} words</span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-sm">{completedQuestCount}/{journalQuest.length} ritual steps</span>
            </div>
          </div>
        </div>
         <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <label className="block text-sm font-bold text-white lofi-sharp-text" htmlFor="entry-title">Title, if you want one</label>
          <p className="text-sm font-semibold text-white/95 lofi-sharp-text-soft">It can stay short, plain, or even blank.</p>
        </div>
        <input
          className="journal-title-input mb-5 w-full rounded-[2.2rem] border border-white/20 bg-black/15 px-5 py-4 text-lg font-bold text-white placeholder-white/50 outline-none backdrop-blur-md transition focus:border-white/40 focus:bg-black/30"
          id="entry-title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. The part of today I want to keep"
          value={title}
        />
         <div className="mb-4 rounded-[1.6rem] border border-white/20 bg-white/10 p-3.5 shadow-sm backdrop-blur-md sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Light controls</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition shadow-sm backdrop-blur-md ${writingCategory === 'diary' ? 'bg-white border-white text-sage-900' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} onClick={() => setWritingCategory('diary')} type="button">Diary Log</button>
                  <button className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition shadow-sm backdrop-blur-md ${writingCategory === 'journal' ? 'bg-white border-white text-sage-900' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} onClick={() => setWritingCategory('journal')} type="button">Journal Reflection</button>
                </div>
                <p className="mt-2.5 text-xs font-bold leading-5 text-white/90 lofi-sharp-text-soft">{entryTypeMeta[writingCategory].helper}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[31rem] xl:grid-cols-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">
                  Mood
                  <select className="mt-2 w-full rounded-[1.15rem] border border-white/30 bg-black/20 px-3.5 py-3 text-sm font-bold text-white outline-none backdrop-blur-sm transition focus:border-white/60 focus:bg-black/30" onChange={(event) => setSelectedMood(event.target.value)} value={selectedMood}>
                    {weatherOptions.map((mood) => (
                      <option className="text-ink" key={mood.label} value={mood.label}>{mood.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">
                  Font
                  <select className="mt-2 w-full rounded-[1.15rem] border border-white/30 bg-black/20 px-3.5 py-3 text-sm font-bold text-white outline-none backdrop-blur-sm transition focus:border-white/60 focus:bg-black/30" onChange={(event) => setJournalStyle({ ...journalStyle, fontId: event.target.value })} value={journalStyle.fontId}>
                    {journalFontOptions.map((font) => (
                      <option className="text-ink" key={font.id} value={font.id}>{font.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">
                  Size
                  <select className="mt-2 w-full rounded-[1.15rem] border border-white/30 bg-black/20 px-3.5 py-3 text-sm font-bold text-white outline-none backdrop-blur-sm transition focus:border-white/60 focus:bg-black/30" onChange={(event) => setJournalStyle({ ...journalStyle, sizeId: event.target.value })} value={journalStyle.sizeId}>
                    {journalSizeOptions.map((size) => (
                      <option className="text-ink" key={size.id} value={size.id}>{size.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 xl:max-w-[22rem] xl:justify-end">
              <button className="rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25" onClick={() => toggleBoldText(entryBodyRef, setBody)} title="Bold selected text" type="button">Bold</button>
              <button className="rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25" onClick={() => toggleUnderlineText(entryBodyRef, setBody)} title="Underline selected text" type="button">Underline</button>
              <button className="rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25" onClick={() => toggleBulletList(entryBodyRef, setBody)} title="Bullet points" type="button">List</button>
              {quickEmojis.slice(0, 4).map((emoji) => (
                <button key={emoji} className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-base shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25" onClick={() => insertQuickEmoji(emoji)} type="button">
                  {emoji}
                </button>
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-sm font-black text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25">
                <ImagePlus size={14} /> Photo
                <input accept="image/*" className="hidden" onChange={handleEntryImageUpload} type="file" />
              </label>
              <button className="rounded-full border border-white/30 bg-white px-4 py-2 text-sm font-black text-[#3d3025] shadow-sm transition hover:-translate-y-0.5 hover:bg-white/90" type="submit">Save page</button>
            </div>
          </div>
        </div>
         <div className="journal-editor-shell mt-2 rounded-[3rem] p-3 md:p-4 backdrop-blur-md bg-white/5 border border-white/10">
          <div className="journal-editor-ribbon bg-black/30 text-white/90 border border-white/20">quiet page</div>
          <div className="journal-editor-meta journal-editor-top mb-3 flex flex-wrap items-center justify-between gap-2 px-3 text-[11px] font-black uppercase tracking-[0.22em] text-white/85 lofi-sharp-text-soft sm:text-xs sm:tracking-[0.24em]">
          <span>{selectedMood} mood · today</span>
          <span>{draftWordCount === 0 ? 'slow is still writing' : `${draftWordCount} words so far`}</span>
        </div>
        <div
          ref={entryBodyRef}
          className="journal-editor journal-editor-soft min-h-[24rem] w-full overflow-auto rounded-[2.2rem] px-6 py-6 outline-none sm:min-h-[30rem]"
          contentEditable
          suppressContentEditableWarning
          style={{ fontFamily: activeJournalFont, fontSize: activeJournalSize, lineHeight: 1.95, color: '#24312e', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          onInput={(e) => setBody(sanitizeJournalHtml(e.currentTarget.innerHTML))}
          data-placeholder="Start with one true sentence."
        />
        <div className="journal-editor-meta journal-editor-bottom mt-4 flex flex-wrap items-center justify-between gap-2 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-sage-500 sm:text-xs sm:tracking-[0.24em]">
          <span>A few clear lines are enough for today.</span>
          <span>{streak} day{streak === 1 ? '' : 's'} of returning</span>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-[1.2rem] border border-[#e8dfd5] bg-white/85 px-4 py-3 text-sm font-semibold leading-6 text-sage-700 shadow-sm">
          {journalNudge}
        </div>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white shadow-lift transition hover:-translate-y-1 hover:bg-sage-800 sm:w-auto" type="submit">
          <Plus size={19} /> Save page
        </button>
      </div>
       <div className="mt-6 rounded-[2.2rem] border border-[#e8dfd5] bg-gradient-to-r from-sage-50/60 via-white to-sand-50/40 p-4 shadow-inner ring-1 ring-white/70 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage-700"><Feather size={16} /> If you want a starting line</div>
            <p className="max-w-2xl font-display text-2xl font-bold leading-relaxed text-sage-950">{activePrompt}</p>
            <p className="mt-3 text-sm font-semibold text-sage-700">Use the prompt if it helps, or leave it and begin exactly where your mind already is.</p>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e8dfd5] bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-1 hover:border-amber-200/50 hover:bg-sage-50" onClick={() => setActivePrompt(prompts[(prompts.indexOf(activePrompt) + 1) % prompts.length])} type="button">
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
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8dfd5] bg-white text-xl shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200/50 hover:shadow-md"
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
                  <button key={starter} className="rounded-full border border-[#e8dfd5] bg-white px-3.5 py-2 text-sm font-bold text-sage-700 transition hover:-translate-y-0.5 hover:border-amber-200/50 hover:bg-sage-50" onClick={() => addStarterLine(starter)} type="button">
                    {starter}
                  </button>
                ))}
              </div>
            </div>
             <div className="rounded-[2.2rem] border border-[#e8dfd5] bg-white/88 p-5 shadow-sm ring-1 ring-sage-100/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-700">Kept gently</p>
                  <h3 className="mt-2 text-xl font-extrabold leading-tight text-sage-950">A quiet record is forming.</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-50 text-2xl text-sage-800 shadow-sm">{rewardLevel.emoji}</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#e8dfd5] bg-sage-50/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">Pages saved</p>
                  <p className="mt-2 text-2xl font-extrabold text-sage-950">{entries.length}</p>
                </div>
                <div className="rounded-2xl border border-[#e8dfd5] bg-sage-50/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">Current rhythm</p>
                  <p className="mt-2 text-2xl font-extrabold text-sage-950">{streak}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#e8dfd5] bg-sage-50/55 px-4 py-3 text-sm leading-7 text-sage-700">
                {weeklyCheckIns >= weeklyGoal ? 'This week already has enough gentle attention in it.' : `${weeklyGoal - weeklyCheckIns} more check-in${weeklyGoal - weeklyCheckIns === 1 ? '' : 's'} if you want to fill this week softly.`}
              </div>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={() => navigateToTab('memories')} type="button">
                <BookOpen size={15} /> Visit your memories
              </button>
            </div>
          </div>
        </div>
      </div>
       <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.85fr)] xl:grid-cols-[1.3fr_0.9fr]">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#e8dfd5] bg-white p-5 shadow-sm lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-sage-600">Soft landing</p>
                <h3 className="mt-2 text-xl font-extrabold text-ink">Three gentle ways in</h3>
              </div>
              <div className="rounded-full bg-sage-100 px-3 py-2 text-sm font-extrabold text-sage-800">{completedQuestCount}/3 felt natural</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {journalQuest.map((step) => (
                <div key={step.label} className={`rounded-full px-4 py-2 text-sm font-bold transition ${step.done ? 'bg-sage-900 text-white shadow-lift' : 'border border-[#e8dfd5] bg-sage-50 text-sage-700'}`}>
                  {step.done ? '✓' : '○'} {step.label}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-sage-800">{journalNudge}</p>
          </div>
          <div className="rounded-3xl border border-[#e8dfd5] bg-gradient-to-br from-sand-50 to-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-sand-500">This week so far</p>
            <p className="mt-2 text-3xl font-extrabold text-sage-950">{weeklyCheckIns}/{weeklyGoal}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">{weeklyCheckIns >= weeklyGoal ? 'You already gave yourself enough room this week.' : `${weeklyGoal - weeklyCheckIns} more soft check-in${weeklyGoal - weeklyCheckIns === 1 ? '' : 's'} if you want to fill this week.`}</p>
          </div>
          <div className="rounded-3xl border border-[#e8dfd5] bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-rose-500">Keepsake path</p>
            <p className="mt-2 text-3xl font-extrabold text-sage-950">{rewardLevel.emoji}</p>
            <p className="mt-2 text-base font-extrabold text-sage-900">{entriesToNextReward === 0 ? 'Your next bloom is already here.' : `${entriesToNextReward} more ${entriesToNextReward === 1 ? 'page' : 'pages'} until the next bloom.`}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">A few honest pages slowly turn into a quiet little collection.</p>
          </div>
          <div className="rounded-3xl border border-[#e8dfd5] bg-gradient-to-br from-sage-50 to-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-sage-500">{returnRitual.eyebrow}</p>
            <p className="mt-2 text-xl font-extrabold text-sage-950">{returnRitual.title}</p>
            <p className="mt-3 text-sm leading-7 text-sage-700">{returnRitual.text}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-sage-500">{latestEntry ? `${latestEntry.mood} mood kept nearby` : 'A gentle habit can start today'}</p>
          </div>
          <div className="rounded-3xl border border-[#e8dfd5] bg-white p-5 shadow-sm lg:col-span-3">
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
                <div key={badge.id} className={`rounded-[1.5rem] border p-4 transition ${badge.unlocked ? 'border-amber-200/50 bg-sage-50 shadow-sm' : 'border-[#e8dfd5] bg-white'}`}>
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
          <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl transition duration-300 hover:shadow-md">
            <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Atmosphere</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/20 text-3xl shadow-sm backdrop-blur-md ring-4 ring-white/10 transition hover:scale-105">
                  <WeatherGlyph mood={selectedMoodOption} size="text-2xl" />
                </div>
                <div>
                  <p className="text-xl font-black text-white lofi-sharp-text">{selectedMoodGuide.title}</p>
                  <p className="text-sm font-bold text-white/95 lofi-sharp-text-soft">{selectedMoodGuide.summary}</p>
                </div>
              </div>
              <p className="mt-5 text-sm font-bold leading-7 text-white/95 lofi-sharp-text-soft">{latestEntry ? `Continuing "${latestEntry.title}".` : selectedMoodGuide.detail}</p>
            </div>
          </div>
           <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
            <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Journey progress</p>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/20 text-3xl shadow-sm backdrop-blur-md ring-4 ring-white/10">{nextAchievement.emoji}</div>
                <div>
                  <p className="text-lg font-black text-white lofi-sharp-text">{nextAchievement.title}</p>
                  <p className="mt-1 text-sm font-bold leading-relaxed text-white/95 lofi-sharp-text-soft">{nextAchievement.hint}</p>
                </div>
              </div>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-black/40 shadow-inner">
                <div className="h-full bg-white/90 transition-all duration-700" style={{ width: `${(unlockedAchievementCount / achievementBadges.length) * 100}%` }}></div>
              </div>
              <p className="mt-4 text-[13px] font-black text-white lofi-sharp-text-soft">{rewardLevel.next}</p>
            </div>
          </div>
           <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
            <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Soft actions</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white shadow-sm backdrop-blur-md">
                  <Compass size={16} />
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  { label: 'Name the feeling', icon: Feather, onClick: () => addStarterLine('Today feels') },
                  { label: 'Open notes', icon: FileText, onClick: () => navigateToTab('notes'), count: openPlannerTodoCount },
                  { label: 'View check-ins', icon: CalendarDays, onClick: () => navigateToTab('insights'), count: importantDateCount }
                ].map((btn) => (
                  <button key={btn.label} className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-left text-sm font-black text-white shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md" onClick={btn.onClick} type="button">
                    <span className="inline-flex items-center gap-3 lofi-sharp-chip"><btn.icon size={17} /> {btn.label}</span>
                    {btn.count !== undefined && <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] shadow-sm backdrop-blur-md">{btn.count}</span>}
                  </button>
                ))}
              </div>
              <p className="mt-5 border-t border-white/20 pt-5 text-sm font-bold leading-relaxed text-white/95 italic lofi-sharp-text-soft">&ldquo;You do not need to finish the whole story today.&rdquo;</p>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </form>
    </>
  );
}
