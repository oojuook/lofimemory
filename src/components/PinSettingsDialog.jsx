import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

export default function PinSettingsDialog({ isOpen, onClose, onChangePin, onRemovePin }) {
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
      <div className="w-full max-w-2xl rounded-[3rem] border border-[#e8dfd5] bg-[#fffaf2]/95 p-8 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Privacy</p>
            <h3 className="mt-2 text-3xl font-extrabold text-ink">Manage your lock PIN</h3>
            <p className="mt-3 max-w-xl leading-7 text-sage-700">Change the current PIN for this browser or remove the lock completely if you no longer want the journal gated. Keep the PIN written down somewhere safe because there is no recovery flow yet.</p>
          </div>
          <button className="rounded-full border border-amber-200/50 bg-white px-4 py-2 text-sm font-bold text-sage-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50" onClick={onClose} type="button">
            Done
          </button>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={handleChangePin}>
          <label className="block text-sm font-bold text-sage-800">
            Current PIN
            <div className="relative mt-2">
              <input
                className="w-full rounded-2xl border border-amber-200/50 bg-white px-4 py-3 pr-14 text-base outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
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
                className="w-full rounded-2xl border border-amber-200/50 bg-white px-4 py-3 pr-14 text-base outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
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
