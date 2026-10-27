import React, { useMemo } from 'react';
import { WeatherGlyph } from './SmallComponents.jsx';

export default function MoodChart({ entries, weatherOptions }) {
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
      <div className="flex min-h-56 items-center justify-center rounded-3xl border border-dashed border-amber-200/50 bg-sage-50/70 p-8 text-center text-sage-700">
        Your mood garden is waiting for its first check-in.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-sage-50 px-3 pb-3 pt-6 shadow-inner sm:p-5">
      <div className="flex h-40 items-end gap-1.5 px-0.5 sm:h-64 sm:gap-3 sm:px-2">
        {recent.map((entry) => {
          const effectiveMoodLabel = legacyMoodMap[entry.mood] || entry.mood;
          const mood = weatherOptions.find((item) => item.label === effectiveMoodLabel) || weatherOptions.find(m => m.label === entry.mood) || weatherOptions[2] || { value: 4, emoji: '🌙', label: 'Neutral', color: 'bg-slate-200' };
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

