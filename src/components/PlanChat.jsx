import { useEffect, useRef, useState } from 'react';
import api from '../services/api';

const WELCOME = 'Hi! I\'m your GoalForge planner. Tell me what you want to achieve, and I\'ll ask a few questions to shape it into a solid plan.';

export default function PlanChat({ onApplyPlan }) {
  const [messages, setMessages] = useState([{ role: 'model', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [finalizing, setFinalizing] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);

  const reset = () => {
    setMessages([{ role: 'model', content: WELCOME }]);
    setError('');
  };

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/api/ai/chat', { messages: next });
      setMessages(ms => [...ms, { role: 'model', content: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.error || 'AI could not reply. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const createGoal = async () => {
    setFinalizing(true);
    setError('');
    try {
      const res = await api.post('/api/ai/plan-from-chat', { messages });
      onApplyPlan(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not turn this into a plan. Please try again.');
    } finally {
      setFinalizing(false);
    }
  };

  const canCreate = messages.filter(m => m.role === 'user').length >= 1;

  return (
    <div className="card mb-6 p-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">Plan with AI</h2>
        <button type="button" onClick={reset} className="btn btn-outline px-3 py-1.5 text-xs">
          Start over
        </button>
      </div>
      <p className="mb-4 text-sm text-muted">Chat about your goal, then turn the conversation into a plan.</p>

      <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-line bg-base p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'border border-line bg-surface text-ink'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-line bg-surface px-4 py-2 text-sm text-muted">
              AI is typing…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. I want to get fit and cook my own meals"
          className="input flex-1"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary shrink-0">
          Send
        </button>
      </form>

      {canCreate && (
        <button type="button" onClick={createGoal} disabled={finalizing} className="btn btn-outline mt-3 w-full">
          {finalizing ? 'Building your plan…' : 'Create goal from this plan'}
        </button>
      )}
    </div>
  );
}
