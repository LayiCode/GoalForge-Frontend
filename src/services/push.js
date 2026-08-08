import api from './api';

export const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent || '');

export const isStandalone =
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function getPushPublicKey() {
  const { data } = await api.get('/api/push/public-key');
  return data.publicKey || '';
}

export async function isPushConfigured() {
  const key = await getPushPublicKey();
  return Boolean(key);
}

export function isSupported() {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

export function getPermission() {
  return isSupported() ? Notification.permission : 'unsupported';
}

export async function getCurrentSubscription() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function enableNotifications() {
  if (!isSupported()) {
    throw new Error(
      'Notifications are not supported in this browser. On iPhone, use Safari and add GoalForge to your Home Screen first.',
    );
  }
  const publicKey = await getPushPublicKey();
  if (!publicKey) {
    throw new Error('Push notifications are not configured yet. Try again in a moment.');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted. Enable it in Settings to receive alarms.');
  }
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  const json = subscription.toJSON();
  await api.post('/api/push/subscribe', {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  });
  return true;
}

export async function disableNotifications() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await api.delete('/api/push/subscribe', { data: { endpoint: sub.endpoint } });
      await sub.unsubscribe();
    }
  } catch {
    // Best-effort cleanup; local unsubscribe may still work next visit.
  }
}

export async function sendTestNotification() {
  const { data } = await api.post('/api/push/test');
  return data;
}
