import React from 'react';
import { Moon, PenLine } from 'lucide-react';
import lofiMemoryHeaderImage from '../assets/optimized/lofi-memory-header.webp';
import MoodChart from './MoodChart.jsx';

export default function InsightsTab(props) {
  const {
    achievementBadges,
    entries,
    entriesToNextReward,
    navigateToTab,
    returnRitual,
    rewardLevel,
    unlockedAchievementCount,
    weatherOptions,
    weeklyCheckIns,
    weeklyGoal,
    weeklySummary
  } = props;

  return (
    <div className="mt-6 grid gap-6 pb-28 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:pb-0">
      <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-4 shadow-soft backdrop-blur sm:p-6 xl:p-8">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft sm:text-sm sm:tracking-widest">Reflection pattern</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white lofi-sharp-text sm:text-4xl">Your recent journal check-ins</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-white lofi-sharp-text">See the week in a calmer way: mood shifts, small streaks, and the gentle rhythm you are building by returning.</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-white shadow-sm backdrop-blur-md">
            <Moon size={20} />
          </div>
        </div>
        <div className="relative z-10 mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-white">
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 shadow-sm backdrop-blur-md">{weeklyCheckIns}/{weeklyGoal} check-ins this week</span>
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 shadow-sm backdrop-blur-md">{entries.length} pages in your archive</span>
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 shadow-sm backdrop-blur-md">{unlockedAchievementCount}/{achievementBadges.length} keepsakes lit</span>
        </div>
      </div>
       <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur xl:p-8">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft sm:text-sm sm:tracking-widest">This week so far</p>
          <p className="mt-3 text-4xl font-extrabold text-white lofi-sharp-text">{weeklyCheckIns}/{weeklyGoal}</p>
          <p className="mt-3 text-sm font-semibold leading-7 text-white lofi-sharp-text">{weeklyCheckIns >= weeklyGoal ? 'You already gave yourself enough room this week.' : `${weeklyGoal - weeklyCheckIns} more soft check-ins if you want to fill this week.`}</p>
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-md shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-r from-white/60 to-white/90 transition-all duration-700" style={{ width: `${Math.min((weeklyCheckIns / weeklyGoal) * 100, 100)}%` }}></div>
          </div>
          <div className="mt-6 rounded-[2.2rem] border border-white/20 bg-black/20 p-5 shadow-sm backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft sm:text-sm sm:tracking-widest">Keepsake path</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 text-3xl shadow-sm backdrop-blur-md text-white">{rewardLevel.emoji}</div>
              <div>
                <p className="text-lg font-extrabold text-white lofi-sharp-text">{rewardLevel.title}</p>
                <p className="text-sm font-semibold leading-6 text-white/95 lofi-sharp-text-soft">{entriesToNextReward === 0 ? 'Your next bloom is here.' : `${entriesToNextReward} pages until the next bloom.`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur xl:p-8">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft sm:text-sm sm:tracking-widest">Mood garden</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white lofi-sharp-text">A softer chart view so the patterns stay readable on both mobile and desktop.</p>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md shadow-sm">Weekly summary</div>
        </div>
        <div className="relative z-10 mt-5 bg-white/90 rounded-[2rem] p-4 shadow-sm backdrop-blur-md">
          <MoodChart entries={entries} weatherOptions={weatherOptions} />
        </div>
        <div className="relative z-10 mt-5 rounded-[2.2rem] border border-white/20 bg-black/20 p-5 text-sm font-bold leading-7 text-white lofi-sharp-text shadow-sm backdrop-blur-md">
          {weeklySummary}
        </div>
      </div>
       <div className="grid gap-6">
        <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur xl:p-8">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft sm:text-sm sm:tracking-widest">{returnRitual.eyebrow}</p>
            <p className="mt-2 text-2xl font-extrabold leading-tight text-white lofi-sharp-text">{returnRitual.title}</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-white lofi-sharp-text">{returnRitual.text}</p>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/30" onClick={() => navigateToTab('write')} type="button">
              <PenLine size={16} /> Return to writing
            </button>
          </div>
        </div>
         <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur xl:p-8">
          <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Keepsake shelf</p>
            <div className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black text-white shadow-sm backdrop-blur-md">{unlockedAchievementCount}/{achievementBadges.length}</div>
          </div>
          <div className="relative z-10 mt-4 grid grid-cols-6 gap-2">
            {achievementBadges.map((badge) => (
              <div key={badge.id} className={`flex aspect-square items-center justify-center rounded-2xl text-xl shadow-sm backdrop-blur-md transition-all ${badge.unlocked ? 'bg-white/20 grayscale-0' : 'bg-black/20 opacity-40 grayscale'}`} title={`${badge.title}: ${badge.hint}`}>
                {badge.emoji}
              </div>
            ))}
          </div>
          <p className="relative z-10 mt-4 text-sm font-semibold leading-7 text-white/95 lofi-sharp-text-soft">Every return adds another little sign that this space is becoming yours.</p>
        </div>
      </div>
    </div>
  );
}
