const BUILD = {"version": "643e6cad2ea98250b67e", "startup": ["bt-72afc387860398c7b48a.audio.position.worklet.js", "bt-72afc387860398c7b48a.audio.worklet.js", "bt-72afc387860398c7b48a.js", "bt-72afc387860398c7b48a.pck", "bt-72afc387860398c7b48a.wasm", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "packs": ["packs/abdul-004af3a898ccf97d.pck", "packs/alice_kuonji-20debed0192356eb.pck", "packs/altera-a698eb62c8d8c8e4.pck", "packs/anasui-b13ee0fe7ad5b7ac.pck", "packs/anubis-05c6856c5891f662.pck", "packs/artoria_pendragon-005bcdc3861b7825.pck", "packs/blackmore-bdeeb8018f889247.pck", "packs/bucciarati-fcf31234ea5e2a6f.pck", "packs/caveman-42078aae3a75f7f0.pck", "packs/circe-4ad6c56301d9759a.pck", "packs/cu_chulainn-7b0fef009548f1e5.pck", "packs/danmaku_streamer-b6e9c588b37f1012.pck", "packs/diego-663939c5b514aecf.pck", "packs/diego_parallel-e57e85e3dcca0bb0.pck", "packs/dio_part1-297fdb8a5d4d3cdf.pck", "packs/doppio_diavolo-8cf08f1f785bdda8.pck", "packs/emiya-7574b21f53600a91.pck", "packs/enkidu-2e18c65267758a27.pck", "packs/ermes-1ed9e1826d3c9583.pck", "packs/gilgamesh-acfc5e00bd8c986f.pck", "packs/giorno-bfcb8671def3eea3.pck", "packs/gojo-1120bfb18d775855.pck", "packs/gyro-28d6f915223628c6.pck", "packs/hassan_cursed_arm-5395aa4d45e75b22.pck", "packs/heracles-82fc1a442280065e.pck", "packs/iggy-a323bf4f6c6115e4.pck", "packs/jack_the_ripper-4416ba0d9fce7c09.pck", "packs/jeanne_d_arc-9deaf87099e6a8ba.pck", "packs/johnny-ea7ee218848a5de4.pck", "packs/jolyne-cf7a42028d34a3bc.pck", "packs/jonathan-6fe7cf87f575ec98.pck", "packs/joseph-ca83c886fe6e2f7e.pck", "packs/joseph_part2-2cecfcbb7a41eb79.pck", "packs/jotaro-d1be4be0c11277ad.pck", "packs/jotaro_part4-b1c812ca0c7472e4.pck", "packs/jotaro_part6-efb0c357e8116369.pck", "packs/kakyoin-f49dbb9d4411da80.pck", "packs/karna-4db1c27ce8cadd87.pck", "packs/kars-7022f6536c3d1ee2.pck", "packs/kawajiri-664ae4e9ef0b1853.pck", "packs/king_hassan-3317e0ac3f174cd0.pck", "packs/kira-ddf2f8385c3e1a84.pck", "packs/kiyohime-98d928937f245fda.pck", "packs/koichi-d66948b0fdf34ca5.pck", "packs/makima-bc23d83229ab29f6.pck", "packs/mash_kyrielight-969b41476d036288.pck", "packs/mista-e4d97f9560a58d02.pck", "packs/morgan-c1ae74913823e94d.pck", "packs/narancia-bf0bec48f9e7ee5c.pck", "packs/nero_claudius-02b1bba023f7a2b6.pck", "packs/okuyasu-dcb6f102b2685215.pck", "packs/olga-e40bc1069134a833.pck", "packs/ozymandias-0c3d62963e07d90b.pck", "packs/polnareff-080722fbb892b6c8.pck", "packs/pucci-a40a7dce0224da5d.pck", "packs/risotto-8905282f889b87aa.pck", "packs/rohan-437d0048c5541def.pck", "packs/scathach-ce117f60e9fc09dc.pck", "packs/shigechi-6e0555ebb931f7dc.pck", "packs/sisyphus-38979e063dd87458.pck", "packs/sukuna-a1c138e732d0d8d7.pck", "packs/tamamo_no_mae-965b6809bb7de3af.pck", "packs/tesla-f7a04681ec84e060.pck", "packs/trish-2bdbe62f24a975fc.pck", "packs/valentine-da443feadea0fd83.pck", "packs/vanilla_ice-aee5f8fb6bcc8825.pck", "packs/weather_report-cccef12c9a2c380e.pck"], "shell": ["bt-72afc387860398c7b48a.audio.position.worklet.js", "bt-72afc387860398c7b48a.audio.worklet.js", "bt-72afc387860398c7b48a.js", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "forceUpdate": true};
/* Build configuration is prepended by build_web_cache.py. */
const scopeURL = new URL(self.registration.scope);
const prefix = 'bt-web-' + encodeURIComponent(scopeURL.pathname) + '-';
const startupCache = prefix + 'startup-' + BUILD.version;
const packCache = prefix + 'packs';
const absolute = path => new URL(path, scopeURL).href;
const startup = new Set(BUILD.startup.map(absolute));
const packs = new Set(BUILD.packs.map(absolute));
const forceReloadMarker = absolute('__bt_force_reload__');

self.addEventListener('install', event => {
    // Cache only the small shell at install time. Engine/PCKs remain demand-loaded.
    event.waitUntil((async () => {
        const cache = await caches.open(startupCache);
        // An update is not ready to replace the offline build until its engine
        // and startup PCK are cached too. First-install downloads are handled
        // by the game's normal progress screen instead.
        const files = self.registration.active ? BUILD.startup : BUILD.shell;
        const previousCaches = (await caches.keys()).filter(key => key.startsWith(prefix + 'startup-') && key !== startupCache);
        async function previousResponse(path) {
            for (const key of previousCaches) {
                const response = await (await caches.open(key)).match(absolute(path));
                if (response) return response;
            }
        }
        const previousHTML = BUILD.compatibleHotfix ? await previousResponse('index.html') : null;
        await Promise.all(files.map(async path => {
            // Content-hashed engines cannot change. Avoid downloading the same
            // large PCK/WASM again for a worker-only fix.
            const reusable = /^bt-[0-9a-f]{20}\./.test(path) ? await previousResponse(path) : null;
            if (reusable) await cache.put(absolute(path), reusable);
            else await cache.add(new Request(absolute(path), {cache: 'reload'}));
        }));
        if (BUILD.forceUpdate && self.registration.active) {
            // Persist across worker termination between install and activate.
            // Only migrate live tabs after ALL new startup files are available.
            await cache.put(forceReloadMarker, new Response('ready'));
            await self.skipWaiting();
            return;
        }
        // A deployed worker-only hotfix may take over an identical game shell.
        // Normal exports omit this flag and still wait for old tabs to close.
        if (previousHTML && (await previousHTML.text()) === (await (await cache.match(absolute('index.html'))).text())) {
            await self.skipWaiting();
        }
    })());
    // An update waits for old game tabs to close, avoiding mixed-version assets.
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const current = await caches.open(startupCache);
        const reloadClients = BUILD.forceUpdate && !!(await current.match(forceReloadMarker));
        await current.delete(forceReloadMarker);
        for (const key of await caches.keys()) {
            if (key.startsWith(prefix + 'startup-') && key !== startupCache) await caches.delete(key);
        }
        const cache = await caches.open(packCache);
        for (const request of await cache.keys()) {
            if (!packs.has(request.url)) await cache.delete(request);
        }
        await self.clients.claim();
        if (reloadClients) {
            // Older bootstraps have no update listener. Navigate them directly
            // under this worker so HTML, engine, PCK and manifest change together.
            const windows = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
            for (const client of windows) {
                const url = new URL(client.url);
                if (url.origin === scopeURL.origin &&
                    (url.pathname === scopeURL.pathname || url.pathname === new URL('index.html', scopeURL).pathname)) {
                    // Do not await navigation inside activate: its fetch waits
                    // for activation to finish, which would deadlock this event.
                    client.navigate(client.url).catch(error => console.warn('Game update navigation failed:', error));
                }
            }
        }
    })());
});

async function cachedResponse(event, key, cacheName) {
    const request = event.request;
    let cache, cached;
    try {
        cache = await caches.open(cacheName);
        // A failed size/hash check explicitly retries past both HTTP and SW caches.
        if (request.cache === 'reload' || request.cache === 'no-store') await cache.delete(key);
        else cached = await cache.match(key);
    } catch (error) { return decodedPackResponse(await fetch(request), cacheName); }
    if (cached) return decodedPackResponse(cached, cacheName);
    const response = await fetch(request);
    if (response.status === 200 && response.type !== 'opaque') {
        // Stream bytes to Godot while the worker stores its copy.
        event.waitUntil(cache.put(key, response.clone()).catch(error => {
            console.warn('Game resource cache write failed:', error);
        }));
    }
    return decodedPackResponse(response, cacheName);
}

function decodedPackResponse(response, cacheName) {
    // Fetch already decoded HTTP compression. Godot HTTPRequest must not
    // decode it again, or compare decoded bytes with the compressed length.
    if (cacheName !== packCache || !response.headers.has('Content-Encoding')) return response;
    const headers = new Headers(response.headers);
    headers.delete('Content-Encoding');
    headers.delete('Content-Length');
    return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET' || request.headers.has('Range')) return;
    const url = new URL(request.url);
    if (url.origin !== scopeURL.origin) return;
    // Root and index.html use this worker's shell, so its engine and PCK agree.
    if (request.mode === 'navigate' && (url.pathname === scopeURL.pathname || url.pathname === new URL('index.html', scopeURL).pathname)) {
        event.respondWith(cachedResponse(event, absolute('index.html'), startupCache));
    } else if (startup.has(url.href)) {
        event.respondWith(cachedResponse(event, url.href, startupCache));
    } else if (packs.has(url.href)) {
        event.respondWith(cachedResponse(event, url.href, packCache));
    }
});
