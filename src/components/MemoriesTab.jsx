import React from 'react';
import { CalendarDays, Trash2 } from 'lucide-react';
import lofiMemoryHeaderImage from '../assets/optimized/lofi-memory-header.webp';
import memoriesSectionPreviewImage from '../assets/optimized/memories-section-preview.webp';
import { WeatherGlyph } from './SmallComponents.jsx';

export default function MemoriesTab(props) {
  const {
    archiveEntries,
    calendarDays,
    calendarForecastByDate,
    calendarForecastLocation,
    calendarForecastPermission,
    calendarForecastStatus,
    calendarMonth,
    deleteEntry,
    deleteImportantDate,
    entries,
    entriesByDate,
    entryTypeMeta,
    formatDate,
    formatForecastTemperature,
    formatMonthLabel,
    formatReminderTime,
    getForecastVisuals,
    getPlainTextFromHtml,
    importanceDetailsDraft,
    importanceDraft,
    importanceModalOpen,
    importanceReminderEnabled,
    importanceTimeDraft,
    importantDateCount,
    importantDates,
    loadCalendarForecast,
    memoriesCategoryFilter,
    memoriesView,
    notificationPermission,
    notificationStatusMessage,
    openImportantDateEditor,
    requestNotificationPermission,
    saveImportantDate,
    selectedCalendarDate,
    selectedCalendarForecast,
    selectedCalendarForecastVisuals,
    selectedDateDiaryEntries,
    selectedDateJournalEntries,
    selectedImportantDate,
    setCalendarMonth,
    setImportanceDetailsDraft,
    setImportanceDraft,
    setImportanceModalOpen,
    setImportanceReminderEnabled,
    setImportanceTimeDraft,
    setMemoriesCategoryFilter,
    setMemoriesView,
    setSelectedCalendarDate,
    setSelectedEntry,
    shiftMonthKey,
    todayISO,
    upcomingReminderCount,
    upcomingReminderPreview,
    weatherOptions
  } = props;

  return (
    <div className="mx-auto max-w-[1280px] px-3 pt-4 sm:px-5 sm:pt-6">
      <div className="grid gap-6 pb-24 lg:pb-0">
       <div className="lofi-picture-border lofi-border-memory relative overflow-hidden flex flex-wrap items-center justify-center gap-2 rounded-[1.6rem] border border-[#8b5e3c]/25 p-2 shadow-sm backdrop-blur-xl">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
        <div className="relative z-10 flex gap-2">
          <button className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition backdrop-blur-md ${memoriesView === 'calendar' ? 'bg-white/30 text-white lofi-sharp-chip shadow-sm' : 'bg-black/20 text-white/90 lofi-sharp-chip hover:bg-black/40 hover:text-white'}`} onClick={() => setMemoriesView('calendar')} type="button">Calendar</button>
          <button className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition backdrop-blur-md ${memoriesView === 'archive' ? 'bg-white/30 text-white lofi-sharp-chip shadow-sm' : 'bg-black/20 text-white/90 lofi-sharp-chip hover:bg-black/40 hover:text-white'}`} onClick={() => setMemoriesView('archive')} type="button">Positivity archive</button>
        </div>
      </div>
       {memoriesView === 'calendar' && (
      <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-8 shadow-soft lg:p-10">
        <img src={memoriesSectionPreviewImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-black/5" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.15),transparent_25rem)]" />
        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-5xl font-bold tracking-tight text-white lofi-sharp-text">Memories</h1>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-white/95 lofi-sharp-text-soft">Journal calendar</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/95 lofi-sharp-chip">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">{importantDateCount} saved</span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">{upcomingReminderCount} reminders</span>
            </div>
          </div>
           <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(19rem,29rem)_minmax(0,1fr)] xl:items-start">
            <div className="rounded-[1.6rem] border border-white/20 bg-black/20 p-3 shadow-inner backdrop-blur-md sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2 rounded-[1.2rem] bg-white/20 px-2 py-2 shadow-sm backdrop-blur-md">
              <button className="rounded-full bg-black/20 px-3 py-2 text-sm font-extrabold text-white transition hover:bg-black/40" onClick={() => setCalendarMonth(shiftMonthKey(calendarMonth, -1))} type="button">‹</button>
              <p className="text-center text-sm font-extrabold text-white lofi-sharp-text sm:text-base">{formatMonthLabel(calendarMonth)}</p>
              <button className="rounded-full bg-black/20 px-3 py-2 text-sm font-extrabold text-white transition hover:bg-black/40" onClick={() => setCalendarMonth(shiftMonthKey(calendarMonth, 1))} type="button">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/90 lofi-sharp-text-soft">
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
                    className={`relative flex h-11 items-center justify-center rounded-xl border text-xs font-extrabold backdrop-blur-md transition hover:-translate-y-0.5 sm:h-12 sm:text-sm ${isSelected ? 'border-white/60 bg-white/40 text-white lofi-sharp-chip shadow-sm' : isToday ? 'border-white/40 bg-white/20 text-white lofi-sharp-chip' : 'border-white/20 bg-black/20 text-white lofi-sharp-chip hover:bg-black/40'}`}
                    key={day.dateKey}
                    onClick={() => {
                      setSelectedCalendarDate(day.dateKey);
                      openImportantDateEditor(day.dateKey);
                    }}
                    type="button"
                  >
                    <span>{day.day}</span>
                    {hasImportantDate && <span className={`absolute right-1.5 top-1 text-[10px] ${isSelected ? 'text-white' : 'text-rose-400'}`}>✦</span>}
                    {dayForecast && <span className="absolute bottom-1 right-1 text-[10px] leading-none" title={dayForecastVisuals.label}>{dayForecastVisuals.emoji}</span>}
                    {dayEntries.length > 0 && <span className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? 'bg-white' : 'bg-white/80'}`} />}
                  </button>
                ) : <div key={`blank-${index}`} />;
              })}
            </div>
            <button className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white lofi-sharp-chip shadow-sm transition hover:bg-white/20" onClick={() => { const today = todayISO(); setCalendarMonth(today.slice(0, 7)); setSelectedCalendarDate(today); openImportantDateEditor(today); }} type="button">
              Jump to today
            </button>
          </div>
           <div className="rounded-[2.2rem] border border-white/20 bg-black/20 p-4 shadow-sm backdrop-blur-md sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft">Selected date</p>
                <h3 className="mt-1 text-2xl font-extrabold text-white lofi-sharp-text">{formatDate(selectedCalendarDate)}</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-white lofi-sharp-text-soft">Click any date, then write a note or reminder here.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full bg-white/20 px-4 py-2.5 text-sm font-extrabold text-white lofi-sharp-chip backdrop-blur-md shadow-sm transition hover:bg-white/30" onClick={() => openImportantDateEditor(selectedCalendarDate)} type="button">
                  {selectedImportantDate ? 'Edit note' : 'Write note'}
                </button>
                {selectedImportantDate && (
                  <button className="rounded-full bg-red-500/20 border border-red-400/30 px-4 py-2.5 text-sm font-extrabold text-white lofi-sharp-chip backdrop-blur-md transition hover:bg-red-500/40" onClick={() => deleteImportantDate(selectedCalendarDate)} type="button">
                    Remove
                  </button>
                )}
              </div>
            </div>
             <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md text-xl shadow-sm">
                    {selectedCalendarForecast ? selectedCalendarForecastVisuals.emoji : '📍'}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/95 lofi-sharp-text-soft">Local weather</p>
                    {selectedCalendarForecast ? (
                      <p className="mt-1 text-sm font-extrabold text-white lofi-sharp-text">
                        {selectedCalendarForecastVisuals.label} · {formatForecastTemperature(selectedCalendarForecast.maxTemp)} / {formatForecastTemperature(selectedCalendarForecast.minTemp)}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm font-semibold leading-6 text-white lofi-sharp-text-soft">{calendarForecastStatus}</p>
                    )}
                    {selectedCalendarForecast && <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/90 lofi-sharp-text-soft">{calendarForecastLocation || 'Your location'} · {selectedCalendarDate}</p>}
                  </div>
                </div>
                {calendarForecastPermission !== 'loading' && (
                  <button className="rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white lofi-sharp-chip backdrop-blur-md shadow-sm transition hover:bg-black/40" onClick={loadCalendarForecast} type="button">
                    {calendarForecastPermission === 'granted' ? 'Refresh' : 'Use location'}
                  </button>
                )}
                {calendarForecastPermission === 'loading' && <span className="rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-md shadow-sm">Loading</span>}
              </div>
              {selectedCalendarForecast && <p className="mt-3 text-xs font-semibold leading-5 text-white/90 lofi-sharp-text-soft">Forecast uses your browser location and is available for nearby upcoming dates.</p>}
            </div>
             {selectedImportantDate && (
              <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/95 lofi-sharp-text-soft">Saved note or reminder</p>
                    <p className="mt-2 text-base font-extrabold leading-6 text-white lofi-sharp-text">{selectedImportantDate.note}</p>
                    {selectedImportantDate.details && <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-white/95 lofi-sharp-text-soft">{selectedImportantDate.details}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                    {selectedImportantDate.time && <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-md shadow-sm">{formatReminderTime(selectedImportantDate.time)}</span>}
                    <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-md shadow-sm">{selectedImportantDate.remindersEnabled ? 'Reminder on' : 'Note only'}</span>
                  </div>
                </div>
              </div>
            )}
             {importanceModalOpen && (
              <div className="mt-4 rounded-[1.6rem] border border-white/20 bg-black/20 p-4 shadow-sm backdrop-blur-md sm:p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Add to this date</p>
                <div className="mt-4 grid gap-3">
                  <label className="block">
                    <span className="text-sm font-extrabold text-white lofi-sharp-text">Title</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md placeholder:text-white/50 transition focus:border-white/40 focus:ring-4 focus:ring-white/10"
                      maxLength={80}
                      onChange={(event) => setImportanceDraft(event.target.value)}
                      placeholder="Exam, birthday, deadline..."
                      value={importanceDraft}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-extrabold text-white lofi-sharp-text">Notes</span>
                    <textarea
                      className="mt-2 min-h-[150px] w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none backdrop-blur-md placeholder:text-white/50 transition focus:border-white/40 focus:ring-4 focus:ring-white/10"
                      maxLength={320}
                      onChange={(event) => setImportanceDetailsDraft(event.target.value)}
                      placeholder="Write what you want to remember on this date."
                      value={importanceDetailsDraft}
                    />
                  </label>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)]">
                  <label className="block">
                    <span className="text-sm font-extrabold text-white lofi-sharp-text">Time</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition focus:border-white/40 focus:ring-4 focus:ring-white/10 [color-scheme:dark]"
                      onChange={(event) => setImportanceTimeDraft(event.target.value)}
                      type="time"
                      value={importanceTimeDraft}
                    />
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold leading-6 text-white backdrop-blur-md">
                    <input checked={importanceReminderEnabled} className="h-4 w-4 rounded border-white/30 text-white/50 focus:ring-white/30 accent-black/50" onChange={(event) => setImportanceReminderEnabled(event.target.checked)} type="checkbox" />
                    Remind me if browser notifications are allowed
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-full bg-white/20 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-md shadow-sm transition hover:bg-white/30" onClick={saveImportantDate} type="button">Save</button>
                  <button className="rounded-full border border-white/30 bg-black/20 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-md shadow-sm transition hover:bg-black/40" onClick={() => setImportanceModalOpen(false)} type="button">Cancel</button>
                  <button className={`rounded-full border px-5 py-3 text-sm font-extrabold backdrop-blur-md shadow-sm transition ${notificationPermission === 'granted' ? 'border-white/30 bg-black/20 text-white hover:bg-black/40' : 'border-white/50 bg-white/20 text-white hover:bg-white/30'}`} onClick={requestNotificationPermission} type="button">
                    {notificationPermission === 'granted' ? 'Notifications on' : 'Allow notifications'}
                  </button>
                </div>
                {notificationStatusMessage && <p className="mt-3 rounded-2xl bg-black/20 border border-white/20 backdrop-blur-md px-4 py-3 text-sm font-semibold leading-6 text-white/95 lofi-sharp-text-soft">{notificationStatusMessage}</p>}
              </div>
            )}
             {(selectedDateDiaryEntries.length || selectedDateJournalEntries.length) ? (
              <div className="mt-4 space-y-4">
                {selectedDateDiaryEntries.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Diary entries on this day</p>
                    {selectedDateDiaryEntries.map((entry) => (
                      <button className="w-full rounded-2xl border border-white/20 bg-black/20 p-3 text-left backdrop-blur-md shadow-sm transition hover:-translate-y-0.5 hover:bg-black/40 hover:shadow-md" key={entry.id} onClick={() => setSelectedEntry(entry)} type="button">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/90 lofi-sharp-text-soft">Diary</span>
                          <p className="font-extrabold text-white lofi-sharp-text">{entry.title}</p>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-white/95 lofi-sharp-text-soft">{getPlainTextFromHtml(entry.body || entry.prompt || '') || 'Photo entry'}</p>
                      </button>
                    ))}
                  </div>
                )}
                {selectedDateJournalEntries.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Journal reflections on this day</p>
                    {selectedDateJournalEntries.map((entry) => (
                      <button className="w-full rounded-2xl border border-white/20 bg-black/20 p-3 text-left backdrop-blur-md shadow-sm transition hover:-translate-y-0.5 hover:bg-black/40 hover:shadow-md" key={entry.id} onClick={() => setSelectedEntry(entry)} type="button">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/90 lofi-sharp-text-soft">Journal</span>
                          <p className="font-extrabold text-white lofi-sharp-text">{entry.title}</p>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-white/95 lofi-sharp-text-soft">{getPlainTextFromHtml(entry.body || entry.prompt || '') || 'Photo entry'}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : <p className="mt-4 rounded-2xl border border-white/20 bg-black/20 px-4 py-4 text-sm font-semibold leading-6 text-white/95 lofi-sharp-text-soft backdrop-blur-md shadow-sm">No diary or journal entry for this date yet.</p>}
             {upcomingReminderPreview.length > 0 && (
              <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Upcoming</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {upcomingReminderPreview.slice(0, 3).map((item) => (
                    <button className={`rounded-full border px-3 py-2 text-xs font-extrabold backdrop-blur-md shadow-sm transition hover:bg-white/30 ${item.dateKey === selectedCalendarDate ? 'border-white/40 bg-white/30 text-white' : 'border-white/20 bg-black/20 text-white'}`} key={item.dateKey} onClick={() => { setSelectedCalendarDate(item.dateKey); openImportantDateEditor(item.dateKey); }} type="button">
                      {formatDate(item.dateKey)} · {item.note}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )}
       {memoriesView === 'archive' && (
      <div className="lofi-picture-border lofi-border-memory relative overflow-hidden flex h-full flex-col rounded-[3rem] border border-[#8b5e3c]/25 p-4 shadow-soft backdrop-blur sm:p-6 lg:p-8">
        <img src={memoriesSectionPreviewImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-black/5" />
        <div className="relative z-10 mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-white lofi-sharp-text" size={18} />
            <div>
              <h2 className="text-2xl font-extrabold text-white lofi-sharp-text sm:text-3xl">Your positivity archive</h2>
              <p className="mt-1 text-sm font-semibold leading-7 text-white lofi-sharp-text-soft">Open any page to read the full memory, with a calmer layout that uses the whole panel more gracefully.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="rounded-full bg-black/20 border border-white/20 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white shadow-sm sm:text-[11px]">
              {archiveEntries.length} saved
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition shadow-sm backdrop-blur-md ${memoriesCategoryFilter === 'all' ? 'bg-white border-white text-sage-900' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`} onClick={() => setMemoriesCategoryFilter('all')} type="button">All</button>
              <button className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition shadow-sm backdrop-blur-md ${memoriesCategoryFilter === 'diary' ? 'bg-white border-white text-sage-900' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`} onClick={() => setMemoriesCategoryFilter('diary')} type="button">Diary</button>
              <button className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition shadow-sm backdrop-blur-md ${memoriesCategoryFilter === 'journal' ? 'bg-white border-white text-sage-900' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`} onClick={() => setMemoriesCategoryFilter('journal')} type="button">Journal</button>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex-1 space-y-4 overflow-y-auto pr-0 min-h-[24rem] sm:min-h-[32rem] sm:pr-2 xl:min-h-0 lofi-scrollbar">
          {!archiveEntries.length && <p className="rounded-3xl border border-white/20 bg-black/20 p-5 font-semibold leading-7 text-white backdrop-blur-md shadow-sm">No {memoriesCategoryFilter === 'all' ? '' : memoriesCategoryFilter} entries yet. Start with one sentence if that is all you have today.</p>}
          {archiveEntries.map((entry) => {
            const effectiveMoodLabel = { 'Grounded': 'Happy', 'Soft': 'Calm', 'Okay': 'Neutral', 'Heavy': 'Sad', 'Stormy': 'Anxious' }[entry.mood] || entry.mood;
            const mood = weatherOptions.find((item) => item.label === effectiveMoodLabel) || weatherOptions.find(m => m.label === entry.mood) || moods[2];
            return (
              <article
                className="group w-full cursor-pointer rounded-3xl border border-white/20 bg-black/20 p-4 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-black/30 hover:shadow-md sm:p-5"
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex flex-col gap-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white/90 lofi-sharp-text-soft">{entryTypeMeta[entry.entryType || 'diary'].shortLabel}</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md shadow-sm text-white"><WeatherGlyph mood={mood} size="text-base" /> {entry.mood}</span>
                    <span className="rounded-full bg-black/20 px-3 py-1.5 shadow-sm border border-white/20 backdrop-blur-md text-white">{formatDate(entry.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-extrabold leading-tight text-white lofi-sharp-text">{entry.title}</h3>
                  <p className="mt-3 whitespace-pre-line break-words leading-7 text-white/95 lofi-sharp-text-soft">
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
    </div>
  );
}
