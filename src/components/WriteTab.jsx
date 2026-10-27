import React, { useState, useEffect } from 'react';
import { BookOpen, CalendarDays, Compass, Feather, FileText, HeartHandshake, ImagePlus, Minimize2, Plus, Sparkles, X } from 'lucide-react';
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
    body,
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
    title,
    toggleBoldText,
    toggleBulletList,
    toggleUnderlineText,
    unlockedAchievementCount,
    weatherOptions,
    weeklyCheckIns,
    weeklyGoal,
    writingCategory
  } = props;

  const [minimalMode, setMinimalMode] = useState(false);

  // Sync contentEditable body when entering the tab or when body changes externally
  useEffect(() => {
    if (entryBodyRef?.current && entryBodyRef.current.innerHTML !== body) {
      entryBodyRef.current.innerHTML = body || '';
    }
  }, [body, entryBodyRef]);

  return (
    <>
      {saveReward && (
        <div className="fixed top-12 left-1/2 z-[9999] w-max max-w-[90vw] -translate-x-1/2 rounded-full border border-sage-800/20 bg-sage-900 px-6 py-4 text-center text-sm font-extrabold text-white shadow-2xl transition-all" role="alert" aria-live="assertive">
          {saveReward}
        </div>
      )}

      {minimalMode ? (
        <div className="fixed inset-0 z-[80] flex flex-col bg-[#fbf7f0]">
          <div className="flex items-center justify-between border-b border-[#ece3d7] px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage-700">Minimal writing mode</p>
              <span className="text-sm font-semibold text-sage-600">{entryTypeMeta[writingCategory].shortLabel} · {selectedMood}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-full border border-[#dbc7b1] bg-white px-4 py-2 text-sm font-extrabold text-[#4f3f32] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf2]" onClick={saveEntry} type="submit">
                <Plus size={15} /> Save page
              </button>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbc7b1] bg-white text-[#4f3f32] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf2]" onClick={() => setMinimalMode(false)} type="button" aria-label="Exit minimal mode" title="Exit minimal mode">
                <Minimize2 size={17} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
              <input
                className="w-full bg-transparent text-2xl font-extrabold text-ink outline-none placeholder:text-sage-400 sm:text-3xl"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title, if you want one"
                value={title}
              />
              <div
                ref={entryBodyRef}
                className="mt-6 min-h-[60vh] w-full bg-transparent text-lg leading-8 text-sage-900 outline-none placeholder:text-sage-400"
                contentEditable
                suppressContentEditableWarning
                style={{ fontFamily: activeJournalFont, fontSize: activeJournalSize, lineHeight: 1.95, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                onInput={(e) => setBody(sanitizeJournalHtml(e.currentTarget.innerHTML))}
                data-placeholder="Start with one true sentence. Everything else can wait."
              />
              <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-sage-500">
                <button className="rounded-full border border-[#dbc7b1] bg-white px-3 py-2 text-[#4f3f32] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf2]" onClick={() => toggleBoldText(entryBodyRef, setBody)} type="button">Bold</button>
                <button className="rounded-full border border-[#dbc7b1] bg-white px-3 py-2 text-[#4f3f32] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf2]" onClick={() => toggleUnderlineText(entryBodyRef, setBody)} type="button">Underline</button>
                <button className="rounded-full border border-[#dbc7b1] bg-white px-3 py-2 text-[#4f3f32] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf2]" onClick={() => toggleBulletList(entryBodyRef, setBody)} type="button">List</button>
                {quickEmojis.slice(0, 5).map((emoji) => (
                  <button key={emoji} className="rounded-full border border-[#dbc7b1] bg-white px-3 py-2 text-base shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf2]" onClick={() => insertQuickEmoji(emoji)} type="button">{emoji}</button>
                ))}
                <span className="ml-2">{draftWordCount === 0 ? 'slow is still writing' : `${draftWordCount} words so far`}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-5xl font-bold tracking-tight text-white lofi-sharp-text">Diary</h1>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-white/95 lofi-sharp-text-soft">Private Journal</p>
              </div>
              <button
                type="button"
                onClick={() => setMinimalMode(true)}
                className="inline-flex items-center gap-2 self-start rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-bold text-white lofi-sharp-chip shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/22"
                title="Open minimal writing mode"
              >
                <Minimize2 size={15} /> Minimal mode
              </button>
            </div>
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
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20" onClick={() => setActivePrompt(activePrompt || moodStarterPrompts[selectedMood] || prompts[0])} type="button">
            <Sparkles size={15} /> {activePrompt ? 'Keep this prompt' : 'Use a gentle prompt'}
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20" onClick={addStarterLine} type="button">
            <Feather size={15} /> Add a starter line
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-[#ffd7b5] bg-white px-5 py-3 text-sm font-black text-[#3d3025] shadow-lift transition hover:-translate-y-1 hover:bg-[#fffaf0]" type="submit">
            <Plus size={18} /> Save this page
          </button>
        </div>
      </div>

      {activePrompt && (
        <div className="mt-5 rounded-[1.6rem] border border-[#ffd7b5] bg-[#fff9f2] p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sage-700">Gentle prompt</p>
              <p className="mt-2 text-base font-bold leading-7 text-ink">{activePrompt}</p>
            </div>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e9d7c5] bg-white text-sage-600 transition hover:bg-sage-50" onClick={() => setActivePrompt('')} type="button" aria-label="Close prompt">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      </div>
    </form>
      )}

    {!minimalMode && (
      <>
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.85fr)] xl:grid-cols-[1.3fr_0.9fr]">
        <div className="lofi-picture-border lofi-border-soft lofi-note-paper relative overflow-hidden rounded-[2.4rem] border border-[#8b5e3c]/20 bg-[#fdfbf6] p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">Returning ritual</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{returnRitual.title}</h3>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-sage-700">{returnRitual.copy}</p>
            </div>
            <WeatherGlyph mood={selectedMoodOption} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {journalQuest.map((step, index) => (
              <div className="rounded-[1.2rem] border border-sage-200 bg-white/85 p-4" key={`quest-${step.label}-${index}`}>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sage-100 text-sage-800">{index + 1}</span>
                  {step.label}
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-sage-800">{step.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-sage-800">
            <span className="rounded-full bg-sage-100 px-4 py-2">{completedQuestCount}/{journalQuest.length} ritual steps today</span>
            <span className="rounded-full bg-sage-100 px-4 py-2">{unlockedAchievementCount} badges unlocked</span>
            <span className="rounded-full bg-sage-100 px-4 py-2">Level {rewardLevel}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="lofi-picture-border lofi-border-soft relative overflow-hidden rounded-[2.4rem] border border-[#8b5e3c]/20 bg-[#fffaf2] p-5 shadow-soft sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">Recent thought</p>
            {latestEntry ? (
              <div className="mt-3">
                <p className="text-xl font-extrabold text-sage-950">{latestEntry.title || 'Untitled page'}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-sage-700">{latestEntry.plainSnippet || 'You saved something soft today. You can always return to it.'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-white px-4 py-2 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={() => navigateToTab('memories')} type="button">
                    <BookOpen size={15} /> Visit your memories
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">No saved pages yet. Even one sentence today is enough to begin softly.</p>
            )}
          </div>
          <div className="lofi-picture-border lofi-border-soft relative overflow-hidden rounded-[2.4rem] border border-[#8b5e3c]/20 bg-[#fff8ee] p-5 shadow-soft sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">Companion</p>
            <div className="mt-3 flex items-start gap-3">
              {companionIsUploadedMedia ? (
                <img src={companion.image} alt="" className="h-14 w-14 rounded-2xl object-cover shadow-sm" />
              ) : (
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8ede0] text-3xl shadow-sm" aria-hidden="true">{companion.emoji}</span>
              )}
              <div>
                <p className="text-lg font-extrabold text-sage-950">{companion.name}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-sage-700">{companion.support}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lofi-picture-border lofi-border-soft relative overflow-hidden rounded-[2.4rem] border border-[#8b5e3c]/20 bg-white/92 p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">
            <Compass size={15} /> Weekly rhythm
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">{weeklyCheckIns >= weeklyGoal ? 'This week already has enough gentle attention in it.' : `${weeklyGoal - weeklyCheckIns} more check-in${weeklyGoal - weeklyCheckIns === 1 ? '' : 's'} if you want to fill this week softly.`}</p>
        </div>
        <div className="lofi-picture-border lofi-border-soft relative overflow-hidden rounded-[2.4rem] border border-[#8b5e3c]/20 bg-white/92 p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">
            <HeartHandshake size={15} /> Important dates
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">{importantDateCount ? `${importantDateCount} date${importantDateCount === 1 ? '' : 's'} marked` : 'No important dates saved yet.'}</p>
        </div>
        <div className="lofi-picture-border lofi-border-soft relative overflow-hidden rounded-[2.4rem] border border-[#8b5e3c]/20 bg-white/92 p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">
            <FileText size={15} /> Notes waiting
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">{openPlannerTodoCount ? `${openPlannerTodoCount} reminder${openPlannerTodoCount === 1 ? '' : 's'} still open` : 'Notes are calm and clear right now.'}</p>
        </div>
      </div>

      {entriesToNextReward <= 3 && (
        <div className="mt-6 rounded-[2rem] border border-[#f4ddb8] bg-[#fffaf0] p-5 shadow-sm sm:p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sage-600">Next unlock</p>
          <p className="mt-3 text-base font-bold leading-7 text-sage-900">{entriesToNextReward} more page{entriesToNextReward === 1 ? '' : 's'} to unlock <span className="rounded-full bg-sage-100 px-2 py-1 text-sm">{nextAchievement.emoji} {nextAchievement.title}</span></p>
        </div>
      )}
      </>
    )}
    </>
  );
}
