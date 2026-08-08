import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import PageLoader from '../components/PageLoader';
import { BellIcon, TrashIcon, PlusIcon, CheckIcon } from '../components/Icons';

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

const formatDuration = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const emptyForm = { label: '', time: '', repeatDaily: false };

export default function Alarms() {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [minutes, setMinutes] = useState(5);
  const [count, setCount] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const countRef = useRef(5 * 60);

  useEffect(() => {
    api.get('/api/alarms')
      .then(res => setAlarms(res.data))
      .catch(err => setError(err.response?.data?.error || 'Could not load alarms'))
      .finally(() => setLoading(false));
  }, []);

  const ring = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.value = 0.2;
          const t = ctx.currentTime + i * 0.6;
          osc.start(t);
          osc.stop(t + 0.4);
        }
      }
    } catch {
      // Audio is best-effort.
    }
    if (navigator.vibrate) navigator.vibrate([500, 300, 500]);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('GoalForge', {
        body: 'Your countdown is done!',
        icon: '/icon-192.png',
      });
    }
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const next = countRef.current - 1;
      countRef.current = next;
      setCount(next);
      if (next <= 0) {
        clearInterval(id);
        setRunning(false);
        setDone(true);
        ring();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => {
    if (countRef.current <= 0) {
      countRef.current = minutes * 60;
      setCount(minutes * 60);
    }
    setDone(false);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setDone(false);
    countRef.current = minutes * 60;
    setCount(minutes * 60);
  };

  const handleMinutesChange = (value) => {
    const v = Math.max(0, Math.min(999, Number(value) || 0));
    setMinutes(v);
    countRef.current = v * 60;
    setCount(v * 60);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.time) {
      setError('Label and time are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { label: form.label.trim(), time: form.time, repeatDaily: form.repeatDaily };
      if (editingId) {
        await api.put(`/api/alarms/${editingId}`, payload);
      } else {
        await api.post('/api/alarms', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      const res = await api.get('/api/alarms');
      setAlarms(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save alarm');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (alarm) => {
    setEditingId(alarm.id);
    setError('');
    setForm({
      label: alarm.label,
      time: alarm.nextFireAt.slice(11, 16),
      repeatDaily: alarm.repeatDaily,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/alarms/${id}`);
      setAlarms(alarms => alarms.filter(a => a.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete alarm');
    }
  };

  const sorted = [...alarms].sort((a, b) => a.nextFireAt.localeCompare(b.nextFireAt));
  const totalSeconds = count;

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 pt-8 pb-28 sm:px-6 md:pb-8">
        <div className="mb-6">
          <h1 className="section-title">Alarms</h1>
          <p className="mt-1 text-sm text-muted">
            Recurring alarms ring as push notifications even when GoalForge is closed.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="card p-6">
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">
            {editingId ? 'Edit alarm' : 'New alarm'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="label" className="label">Label *</label>
                <input
                  id="label"
                  type="text"
                  placeholder="Morning workout"
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="label">Time *</label>
                <input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form.repeatDaily}
                    onChange={e => setForm({ ...form, repeatDaily: e.target.checked })}
                    className="h-4 w-4 cursor-pointer accent-brand-600"
                  />
                  Repeat daily
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                <PlusIcon className="h-4 w-4" />
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add alarm'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn btn-outline">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card mt-4 divide-y divide-line p-0">
          {loading ? (
            <div className="p-6"><PageLoader /></div>
          ) : sorted.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted">
              No alarms yet. Add one above and it will push to your device.
            </p>
          ) : (
            sorted.map(alarm => (
              <div key={alarm.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <BellIcon className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    <p className="truncate font-medium text-ink">{alarm.label}</p>
                    {alarm.repeatDaily && (
                      <span className="chip whitespace-nowrap bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                        daily
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    Next: {formatDate(alarm.nextFireAt)} · {formatTime(alarm.nextFireAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(alarm)}
                    className="btn btn-ghost px-3 py-1.5 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(alarm.id)}
                    aria-label="Delete alarm"
                    className="btn btn-danger px-3 py-1.5"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card mt-4 p-6">
          <h2 className="font-display mb-1 text-lg font-semibold text-ink">In-app countdown</h2>
          <p className="mb-4 text-sm text-muted">
            A timer that beeps, vibrates, and notifies you while GoalForge is open.
          </p>

          <div className="rounded-2xl border border-line bg-base p-6 text-center">
            <p className="font-display text-5xl font-bold tabular-nums text-ink sm:text-6xl">
              {formatDuration(totalSeconds)}
            </p>
            {done && (
              <p className="mt-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
                Time&apos;s up!
              </p>
            )}
            <div className="mx-auto mt-5 max-w-xs">
              <label htmlFor="countMin" className="label">Minutes</label>
              <input
                id="countMin"
                type="number"
                min="0"
                max="999"
                value={minutes}
                disabled={running}
                onChange={e => handleMinutesChange(e.target.value)}
                className="input text-center"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {!running ? (
                <button type="button" onClick={start} disabled={count === 0} className="btn btn-primary px-6">
                  <CheckIcon className="h-4 w-4" />
                  Start
                </button>
              ) : (
                <button type="button" onClick={() => setRunning(false)} className="btn btn-outline px-6">
                  Pause
                </button>
              )}
              {running && (
                <button type="button" onClick={() => setRunning(true)} className="btn btn-primary px-6">
                  Resume
                </button>
              )}
              <button type="button" onClick={reset} className="btn btn-ghost px-6">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
