import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';

const PIN_KEY = 'quiet-harbor-pin-v1';

function getSavedPin() {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
}

export default function PrivacyGate({ hasPin, onUnlock, onCreatePin }) {
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
        <div className="grid overflow-hidden rounded-3xl border border-[#e8dfd5] bg-white/75 shadow-soft backdrop-blur md:grid-cols-2">
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
            <p className="mt-3 leading-7 text-sage-700">{hasPin ? 'Enter your private PIN to open your journal. Keep it somewhere safe — this local lock does not have a recovery option yet.' : 'Set a simple PIN for this browser. It is a light privacy step for your personal writing space, and it currently has no recovery flow if you forget it.'}</p>
            <div className="relative mt-8">
              <input
                className="w-full rounded-2xl border border-amber-200/50 bg-white px-5 py-4 pr-16 text-lg font-semibold tracking-widest outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
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
