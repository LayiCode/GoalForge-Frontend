import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from './Icons';
import {
  isIos,
  isStandalone,
  isSupported,
  getPermission,
  getCurrentSubscription,
  enableNotifications,
  disableNotifications,
  sendTestNotification,
} from '../services/push';

export default function AlertsCard() {
  const navigate = useNavigate();
  const [state, setState] = useState(() => (isSupported() ? getPermission() : 'unsupported'));
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isSupported()) return;
    let active = true;
    getCurrentSubscription()
      .then(sub => {
        if (!active) return;
        setEnabled(Boolean(sub));
        setState(getPermission());
      })
      .catch(() => {
        if (active) setState('unsupported');
      });
    return () => {
      active = false;
    };
  }, []);

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 6000);
  };

  const syncState = async () => {
    try {
      const sub = await getCurrentSubscription();
      setEnabled(Boolean(sub));
      setState(getPermission());
    } catch {
      setState('unsupported');
    }
  };

  const handleEnable = async () => {
    setBusy(true);
    try {
      await enableNotifications();
      setEnabled(true);
      notify('success', 'Notifications enabled. Alarms will ring even when GoalForge is closed.');
    } catch (err) {
      notify('error', err.response?.data?.error || err.message || 'Could not enable notifications.');
    } finally {
      setBusy(false);
      syncState();
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      await disableNotifications();
      setEnabled(false);
      notify('success', 'Notifications disabled.');
    } catch {
      notify('error', 'Could not disable notifications.');
    } finally {
      setBusy(false);
      syncState();
    }
  };

  const handleTest = async () => {
    setBusy(true);
    try {
      const data = await sendTestNotification();
      if (data.sent > 0) {
        notify('success', 'Test notification sent! Check your device.');
      } else {
        notify('error', data.error || 'No active device subscriptions.');
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Could not send test notification.');
    } finally {
      setBusy(false);
    }
  };

  const needsInstall = isIos && !isStandalone;

  return (
    <div className="card mt-4 p-6">
      <div className="mb-1 flex items-center gap-2">
        <BellIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-display text-lg font-semibold text-ink">Alerts &amp; notifications</h3>
      </div>
      <p className="mb-4 text-sm text-muted">
        Get pushed alarms even when the app is closed, and a beeping countdown when it&apos;s open.
      </p>

      <button
        type="button"
        onClick={() => navigate('/alarm')}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-line bg-base px-4 py-3 text-left transition hover:bg-base-soft"
      >
        <span className="text-sm font-medium text-ink">Set an alarm or start a countdown</span>
        <span className="text-muted">→</span>
      </button>

      {needsInstall && (
        <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
          <p className="mb-2 text-sm font-semibold text-ink">
            Install GoalForge to get alarms anywhere
          </p>
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted">
            <li>In Safari, tap the Share button <span className="font-medium text-ink">(⌃)</span></li>
            <li>Choose <span className="font-medium text-ink">Add to Home Screen</span></li>
            <li>Open GoalForge from your Home Screen, then enable notifications below</li>
          </ol>
          <a
            href="/install-goalforge.mobileconfig"
            download
            className="btn btn-primary w-full py-2.5 text-sm"
          >
            Download Home Screen shortcut
          </a>
          <p className="mt-2 text-xs text-muted">
            No iCloud? Tap the button, allow the profile, then install it from Settings → Profile Downloaded.
          </p>
        </div>
      )}

      {message && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-line bg-base p-4">
        {state === 'unsupported' ? (
          <p className="text-sm text-muted">
            Notifications aren&apos;t supported in this browser. Use Safari on iPhone after adding the app to your Home Screen.
          </p>
        ) : state === 'denied' ? (
          <div>
            <p className="text-sm font-medium text-ink">Notifications are blocked</p>
            <p className="mt-1 text-sm text-muted">
              Allow notifications in your browser/Settings to receive alarms.
            </p>
          </div>
        ) : enabled ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">Notifications enabled</p>
              <span className="chip whitespace-nowrap bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
                On
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={handleTest} disabled={busy} className="btn btn-outline flex-1">
                {busy ? 'Sending…' : 'Send test notification'}
              </button>
              <button type="button" onClick={handleDisable} disabled={busy} className="btn btn-ghost flex-1">
                Disable
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted">Allow push notifications to ring your alarms anywhere.</p>
            <button type="button" onClick={handleEnable} disabled={busy} className="btn btn-primary w-full py-2.5">
              {busy ? 'Enabling…' : 'Enable notifications'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
