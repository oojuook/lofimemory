import React from 'react';
import { ArrowUp, CalendarDays, FileText, PenLine, Plus, Trash2 } from 'lucide-react';
import lofiMemoryHeaderImage from '../assets/optimized/lofi-memory-header.webp';
import notesSectionPreviewImage from '../assets/optimized/notes-section-preview.webp';

export default function NotesTab(props) {
  const {
    addPlannerTodo,
    cancelEditingPlannerTodo,
    clearCompletedPlannerTodos,
    completedPlannerTodoCount,
    cyclePlannerTodoPriority,
    cyclePlannerTodoStatus,
    deletePlannerTodo,
    draggedPlannerTodoId,
    editingPlannerTodoDueDate,
    editingPlannerTodoId,
    editingPlannerTodoPriority,
    editingPlannerTodoRecurrence,
    editingPlannerTodoText,
    filteredPlannerTodos,
    formatDate,
    formatReminderTime,
    formatShortDate,
    getPlannerPriorityLabel,
    getPlannerRecurrenceLabel,
    getPlannerStatusLabel,
    inProgressPlannerTodoCount,
    isPlannerTodoOverdue,
    movePlannerTodo,
    navigateToTab,
    openPlannerTodoCount,
    overduePlannerTodoCount,
    plannerBoard,
    plannerNoteLineCount,
    plannerNoteSearch,
    plannerNoteSearchCount,
    plannerNoteWordCount,
    plannerQuickTemplates,
    plannerStorageLabel,
    plannerTodoCount,
    plannerTodoDraft,
    plannerTodoDueDateDraft,
    plannerTodoFilter,
    plannerTodoPriorityDraft,
    plannerTodoRecurrenceDraft,
    reminderStorageLabel,
    reorderPlannerTodo,
    savePlannerTodoEdit,
    setDraggedPlannerTodoId,
    setEditingPlannerTodoDueDate,
    setEditingPlannerTodoPriority,
    setEditingPlannerTodoRecurrence,
    setEditingPlannerTodoText,
    setPlannerBoard,
    setPlannerNoteSearch,
    setPlannerTodoDraft,
    setPlannerTodoDueDateDraft,
    setPlannerTodoFilter,
    setPlannerTodoPriorityDraft,
    setPlannerTodoRecurrenceDraft,
    setSelectedCalendarDate,
    startEditingPlannerTodo,
    todayISO,
    upcomingReminderCount,
    upcomingReminderPreview
  } = props;

  return (
    <div className="mx-auto max-w-[1280px] px-3 pt-4 sm:px-5 sm:pt-6">
      <div className="grid gap-6 pb-28 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:pb-0">
        <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[2.2rem] sm:rounded-[3rem] border border-[#8b5e3c]/25 p-5 sm:p-8 shadow-soft lg:p-10 xl:p-12">
        <img src={notesSectionPreviewImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-black/5" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.15),transparent_25rem)]" />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold tracking-tight text-white lofi-sharp-text">Notes</h1>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-white/95 lofi-sharp-text-soft">Important things</p>
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="text-base font-bold leading-7 text-white lofi-sharp-text-soft">One cleaner page for reminders, practical notes, and the things you cannot afford to forget.</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-md">
              <FileText size={20} />
            </div>
          </div>
        </div>
         <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Open tasks', value: openPlannerTodoCount },
            { label: 'In progress', value: inProgressPlannerTodoCount },
            { label: 'Completed', value: completedPlannerTodoCount },
            { label: 'Overdue', value: overduePlannerTodoCount }
          ].map((stat) => (
            <div key={stat.label} className="relative overflow-hidden rounded-[1.4rem] border border-white/20 p-4 shadow-sm">
              <div className="absolute inset-0 bg-white/15 backdrop-blur-md" />
              <div className="relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-white lofi-sharp-text">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
         <div className="mt-6 rounded-[2.2rem] border border-[#e8dfd5]/80 bg-sage-50/45 p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-sage-500">Important notes</p>
              <p className="mt-1 text-sm font-semibold text-sage-600">Keep deadlines, reminders, shopping needs, travel details, or anything else you want in one calmer place.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sage-700">
              <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1">{plannerNoteWordCount} words</span>
              <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1">{plannerNoteLineCount} lines</span>
              <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1">{plannerStorageLabel}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {plannerQuickTemplates.map((template) => (
                <button
                  key={template}
                  className="rounded-full border border-[#e8dfd5] bg-white px-3 py-2 text-xs font-extrabold text-sage-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-100"
                  onClick={() => setPlannerBoard((current) => ({ ...current, text: current.text.trim() ? `${current.text.trim()}\n\n${template}` : template }))}
                  type="button"
                >
                  {template.split('\n')[0].replace('## ', '')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#e8dfd5] bg-white px-3 py-2 shadow-sm">
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
            className="mt-4 min-h-[22rem] w-full rounded-[1.5rem] border border-[#e8dfd5] bg-white px-5 py-4 text-sm leading-7 text-sage-900 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
            onChange={(event) => setPlannerBoard((current) => ({ ...current, text: event.target.value }))}
            placeholder="Keep important things here: dates, calls, shopping needs, ideas, and practical details you want nearby."
            value={plannerBoard.text}
          />
          <p className="mt-3 text-xs font-semibold text-sage-500">Tip: use the quick chips above to drop in neat little sections instead of staring at a blank notes page.</p>
        </div>
      </div>
       <aside className="flex flex-col gap-5">
        <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[2.2rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Task board</p>
              <p className="mt-1 text-sm font-semibold text-white lofi-sharp-text">Small, clear tasks with priority, status, and optional due dates so the page stays useful without feeling noisy.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white lofi-sharp-chip">
              <button className={`rounded-full border px-3 py-1 backdrop-blur-md transition ${plannerTodoFilter === 'all' ? 'border-white/40 bg-white/30 text-white' : 'border-white/20 bg-black/20 text-white/95 hover:bg-black/40'}`} onClick={() => setPlannerTodoFilter('all')} type="button">All {plannerTodoCount}</button>
              <button className={`rounded-full border px-3 py-1 backdrop-blur-md transition ${plannerTodoFilter === 'open' ? 'border-white/40 bg-white/30 text-white' : 'border-white/20 bg-black/20 text-white/95 hover:bg-black/40'}`} onClick={() => setPlannerTodoFilter('open')} type="button">Open {openPlannerTodoCount}</button>
              <button className={`rounded-full border px-3 py-1 backdrop-blur-md transition ${plannerTodoFilter === 'doing' ? 'border-white/40 bg-white/30 text-white' : 'border-white/20 bg-black/20 text-white/95 hover:bg-black/40'}`} onClick={() => setPlannerTodoFilter('doing')} type="button">Doing {inProgressPlannerTodoCount}</button>
              <button className={`rounded-full border px-3 py-1 backdrop-blur-md transition ${plannerTodoFilter === 'done' ? 'border-white/40 bg-white/30 text-white' : 'border-white/20 bg-black/20 text-white/95 hover:bg-black/40'}`} onClick={() => setPlannerTodoFilter('done')} type="button">Done {completedPlannerTodoCount}</button>
              <button className={`rounded-full border px-3 py-1 backdrop-blur-md transition ${plannerTodoFilter === 'high' ? 'border-white/40 bg-white/30 text-white' : 'border-white/20 bg-black/20 text-white/95 hover:bg-black/40'}`} onClick={() => setPlannerTodoFilter('high')} type="button">High {plannerBoard.todos.filter((todo) => todo.priority === 'high').length}</button>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 backdrop-blur-md text-white/95">{plannerStorageLabel}</span>
            </div>
          </div>
           <form className="relative z-10 mt-4 grid gap-3 sm:grid-cols-2" onSubmit={addPlannerTodo}>
            <input
              className="flex-1 rounded-[1.15rem] border border-white/20 bg-black/20 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md placeholder:text-white/60 transition focus:border-white/40 focus:ring-4 focus:ring-white/10 sm:col-span-2"
              onChange={(event) => setPlannerTodoDraft(event.target.value)}
              placeholder="Add a task"
              value={plannerTodoDraft}
            />
            <select
              className="rounded-[1.15rem] border border-white/20 bg-black/40 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition focus:border-white/40 focus:ring-4 focus:ring-white/10 [&>option]:bg-[#2b231d]"
              onChange={(event) => setPlannerTodoPriorityDraft(event.target.value)}
              value={plannerTodoPriorityDraft}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <input
              className="rounded-[1.15rem] border border-white/20 bg-black/40 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition focus:border-white/40 focus:ring-4 focus:ring-white/10"
              min={todayISO()}
              onChange={(event) => setPlannerTodoDueDateDraft(event.target.value)}
              type="date"
              value={plannerTodoDueDateDraft}
            />
            <select
              className="rounded-[1.15rem] border border-white/20 bg-black/40 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition focus:border-white/40 focus:ring-4 focus:ring-white/10 [&>option]:bg-[#2b231d]"
              onChange={(event) => setPlannerTodoRecurrenceDraft(event.target.value)}
              value={plannerTodoRecurrenceDraft}
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button className="inline-flex items-center justify-center rounded-[1.15rem] bg-white/20 px-4 py-3 text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/30 sm:col-span-2" type="submit">
              <Plus size={18} />
            </button>
          </form>
           <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/95 lofi-sharp-text-soft">
            <span>{filteredPlannerTodos.length} shown · {overduePlannerTodoCount} overdue</span>
            {completedPlannerTodoCount > 0 && (
              <button className="rounded-full border border-white/30 bg-black/20 px-3 py-2 text-white transition backdrop-blur-md hover:bg-black/40" onClick={clearCompletedPlannerTodos} type="button">
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
                  : 'border-amber-200/50 bg-white text-sage-500 hover:border-sage-300 hover:text-sage-600';
              const priorityTone = todo.priority === 'high'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : todo.priority === 'low'
                  ? 'border-[#e8dfd5] bg-sage-50 text-sage-600'
                  : 'border-amber-200 bg-amber-50 text-amber-700';
              const isEditingTodo = editingPlannerTodoId === todo.id;
              return (
                <div
                  key={todo.id}
                  className={`rounded-[1.4rem] border bg-white px-4 py-3 shadow-sm transition ${draggedPlannerTodoId === todo.id ? 'border-teal-200 opacity-60' : 'border-[#e8dfd5]'}`}
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
                            className="w-full rounded-2xl border border-[#e8dfd5] bg-sage-50/60 px-4 py-3 text-sm font-semibold text-sage-900 outline-none transition focus:border-sage-300 focus:ring-4 focus:ring-sage-100/70"
                            onChange={(event) => setEditingPlannerTodoText(event.target.value)}
                            value={editingPlannerTodoText}
                          />
                          <div className="grid gap-2 sm:grid-cols-3">
                            <select className="rounded-2xl border border-[#e8dfd5] bg-white px-3 py-2 text-xs font-bold text-sage-700 outline-none" onChange={(event) => setEditingPlannerTodoPriority(event.target.value)} value={editingPlannerTodoPriority}>
                              <option value="low">Low priority</option>
                              <option value="medium">Medium priority</option>
                              <option value="high">High priority</option>
                            </select>
                            <input className="rounded-2xl border border-[#e8dfd5] bg-white px-3 py-2 text-xs font-bold text-sage-700 outline-none" min={todayISO()} onChange={(event) => setEditingPlannerTodoDueDate(event.target.value)} type="date" value={editingPlannerTodoDueDate} />
                            <select className="rounded-2xl border border-[#e8dfd5] bg-white px-3 py-2 text-xs font-bold text-sage-700 outline-none" onChange={(event) => setEditingPlannerTodoRecurrence(event.target.value)} value={editingPlannerTodoRecurrence}>
                              <option value="none">One-time</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em]">
                            <button className="rounded-full bg-sage-900 px-3 py-2 text-white transition hover:bg-sage-800" onClick={() => savePlannerTodoEdit(todo.id)} type="button">Save edit</button>
                            <button className="rounded-full border border-[#e8dfd5] bg-white px-3 py-2 text-sage-600 transition hover:bg-sage-50" onClick={cancelEditingPlannerTodo} type="button">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`text-sm font-semibold leading-6 ${todo.status === 'done' ? 'text-sage-400 line-through' : 'text-sage-800'}`}>{todo.text}</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                              <span className={`rounded-full border px-2.5 py-1 ${todo.status === 'done' ? 'border-amber-200/50 bg-white text-sage-500' : 'border-[#e8dfd5] bg-white text-sage-600'}`}>{getPlannerStatusLabel(todo.status)}</span>
                              <button className={`rounded-full border px-2.5 py-1 transition ${priorityTone}`} onClick={() => cyclePlannerTodoPriority(todo.id)} type="button">
                                {getPlannerPriorityLabel(todo.priority)} priority
                              </button>
                              {todo.dueDate ? <span className={`rounded-full border px-2.5 py-1 ${isPlannerTodoOverdue(todo) ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-[#e8dfd5] bg-white text-sage-600'}`}>{isPlannerTodoOverdue(todo) ? 'Overdue' : 'Due'} {formatShortDate(todo.dueDate)}</span> : null}
                              <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-teal-700">{getPlannerRecurrenceLabel(todo.recurrence)}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2 text-sage-400">
                            <button className="rounded-full border border-[#e8dfd5] bg-white p-1.5 transition hover:text-sage-700" onClick={() => startEditingPlannerTodo(todo)} type="button" aria-label="Edit task">
                              <PenLine size={15} />
                            </button>
                            <button className="rounded-full border border-[#e8dfd5] bg-white p-1.5 transition hover:text-sage-700" onClick={() => movePlannerTodo(todo.id, -1)} type="button" aria-label="Move task up">
                              <ArrowUp size={15} />
                            </button>
                            <button className="rounded-full border border-[#e8dfd5] bg-white p-1.5 text-xs font-black transition hover:text-sage-700" onClick={() => movePlannerTodo(todo.id, 1)} type="button" aria-label="Move task down">
                              ↓
                            </button>
                            <button className="rounded-full border border-[#e8dfd5] bg-white p-1.5 transition hover:text-rose-500" onClick={() => deletePlannerTodo(todo.id)} type="button" aria-label="Delete task">
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
              <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[1.4rem] border border-[#8b5e3c]/25 p-5 shadow-sm backdrop-blur-xl">
                <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/25 to-black/15" />
                <div className="relative z-10 text-sm font-semibold leading-6 text-white lofi-sharp-text">
                  No tasks match this view yet. Try another filter or add a new task with a priority, due date, or recurring rhythm.
                </div>
              </div>
            )}
          </div>
        </div>
         <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[2.2rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Upcoming reminders</p>
              <p className="mt-1 text-sm font-semibold text-white lofi-sharp-text">A calm shortlist of the dates that are coming up next.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 backdrop-blur-md">{upcomingReminderCount} upcoming</span>
              <span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 backdrop-blur-md">{reminderStorageLabel}</span>
            </div>
          </div>
          <div className="relative z-10 mt-4 space-y-3">
            {upcomingReminderPreview.length ? upcomingReminderPreview.map((item) => (
              <button className="w-full rounded-[1.4rem] border border-white/20 bg-black/20 px-4 py-3 text-left transition backdrop-blur-md hover:-translate-y-0.5 hover:bg-black/40 hover:shadow-sm" key={item.dateKey} onClick={() => { setSelectedCalendarDate(item.dateKey); navigateToTab('memories'); }} type="button">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-6 text-white lofi-sharp-text">{item.note}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/85 lofi-sharp-text-soft">{formatDate(item.dateKey)}{item.time ? ` · ${formatReminderTime(item.time)}` : ''}</p>
                  </div>
                  <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white lofi-sharp-chip">{item.relativeLabel}</span>
                </div>
              </button>
            )) : (
              <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[1.4rem] border border-[#8b5e3c]/25 p-5 shadow-sm backdrop-blur-xl">
                <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/25 to-black/15" />
                <div className="relative z-10 text-sm font-semibold leading-6 text-white lofi-sharp-text">
                  No upcoming reminders yet. Mark an important date in the calendar and it will show up here.
                </div>
              </div>
            )}
          </div>
        </div>
         <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[2.2rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Keep it simple</p>
            <div className="mt-4 space-y-3 text-sm font-semibold leading-7 text-white lofi-sharp-text">
              <p>Use this page for practical life details, not emotional journaling.</p>
              <p>Keep the to-do list short enough that it still feels calm to open.</p>
              <p>Move back to writing when you want reflection instead of admin.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/30" onClick={() => navigateToTab('write')} type="button">
                <PenLine size={15} /> Go back to writing
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 py-2 text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-black/30" onClick={() => navigateToTab('insights')} type="button">
                <CalendarDays size={15} /> Open calendar
              </button>
            </div>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}
