import React from 'react';

export function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="group lofi-glass rounded-[2.2rem] border border-[#e8dfd5] bg-gradient-to-br from-white/95 to-white/75 p-5 text-center shadow-lift backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-soft">
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

export function WeatherGlyph({ mood, size = 'text-3xl' }) {
  if (mood?.image) {
    return <img alt={mood.label} className="inline-block h-9 w-9 rounded-2xl object-cover shadow-sm" src={mood.image} />;
  }
  return <span className={`inline-block ${size}`} aria-label={mood?.label}>{mood?.emoji || '🌙'}</span>;
}

export function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-9 max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-sage-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-5xl font-bold leading-tight text-sage-950">{title}</h2>
      {text && <p className="mt-4 text-lg leading-8 text-sage-800">{text}</p>}
    </div>
  );
}

export function InfoCard({ icon: Icon, title, children }) {
  return (
    <article className="customizable-card rounded-3xl border border-amber-200/50 bg-white/75 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/90">
      <div className="theme-icon mb-5 flex h-12 w-12 items-center justify-center rounded-3xl bg-sage-100 text-sage-800">
        <Icon size={22} />
      </div>
      <h3 className="text-2xl font-extrabold text-ink">{title}</h3>
      <div className="mt-3 leading-7 text-sage-800">{children}</div>
    </article>
  );
}
