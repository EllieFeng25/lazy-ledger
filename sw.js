// 離線快取：App 本身的檔案存在手機裡，沒網路也能打開記帳。
// 每次改了 index.html 之後，把 VERSION 數字加 1，手機才會抓新版。
const VERSION = 'v9';
const CACHE = 'lazy-ledger-' + VERSION;
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './art.js',
  './fonts/cormorant-garamond-latin-500-normal.woff2',
  './fonts/cormorant-garamond-latin-600-normal.woff2',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== 'lazy-ledger-fonts').map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Google 字型：第一次下載後存起來，之後離線也有漂亮的字
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open('lazy-ledger-fonts').then((c) =>
        c.match(e.request).then((hit) =>
          hit || fetch(e.request).then((res) => { if (res.ok || res.type === 'opaque') c.put(e.request, res.clone()); return res; })
        )
      )
    );
    return;
  }
  // 匯率 API 不快取，直接走網路（失敗時 App 會用上次存的匯率）
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) => hit || fetch(e.request)
    )
  );
});
