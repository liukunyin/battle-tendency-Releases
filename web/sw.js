const BUILD = {"version": "e4bd40dea86ad0654f31", "startup": ["bt-be29ae6ac57c0a5059bd.audio.position.worklet.js", "bt-be29ae6ac57c0a5059bd.audio.worklet.js", "bt-be29ae6ac57c0a5059bd.js", "bt-be29ae6ac57c0a5059bd.pck", "bt-be29ae6ac57c0a5059bd.wasm", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "packs": ["packs/abdul-7a692522fdaee7de.pck", "packs/alice_kuonji-3ddf2b19dc05c255.pck", "packs/altera-34fbc1b1881418fe.pck", "packs/anasui-377b43b45208b154.pck", "packs/anubis-f44ad72d4a65866a.pck", "packs/blackmore-d5c5c887ea5d800a.pck", "packs/bucciarati-ced3d4cc14d7ac5d.pck", "packs/caveman-94d579cfcf2a169a.pck", "packs/circe-ab7dfb2f6bbfb853.pck", "packs/cu_chulainn-96f58422cb7851ae.pck", "packs/danmaku_streamer-86fd629f6d1b4247.pck", "packs/diego-365ac32c41860cb9.pck", "packs/diego_parallel-b59e41adaa14a7fd.pck", "packs/doppio_diavolo-4296b1976088abf4.pck", "packs/emiya-bb0a4f02dddb2816.pck", "packs/enkidu-35f9669c83e5b959.pck", "packs/ermes-6036fd0c218b3763.pck", "packs/gilgamesh-e713bcf435f64635.pck", "packs/giorno-0ecc11bf36dadd89.pck", "packs/gyro-419690dd058d9c90.pck", "packs/hassan_cursed_arm-4a40637bf5426e5c.pck", "packs/heracles-3ad166bdcf324b50.pck", "packs/iggy-dcf0329a07dada32.pck", "packs/jack_the_ripper-0aea9b2477d388a0.pck", "packs/jeanne_d_arc-d74b0373b4a05bcd.pck", "packs/johnny-a4c74b763a00a1a8.pck", "packs/jolyne-5d86aed1869c744d.pck", "packs/joseph-12d2df5b7a3ee98c.pck", "packs/joseph_part2-704c07e838d6c4c0.pck", "packs/josuke-098a5bdd6ea5914e.pck", "packs/jotaro-be6989a88f737889.pck", "packs/jotaro_part4-ef1eae48c746c3e8.pck", "packs/jotaro_part6-84d135e2bd372a5d.pck", "packs/kakyoin-128aeb62e5f40e76.pck", "packs/karna-4392bf510d992f35.pck", "packs/kars-327410977929b57d.pck", "packs/kawajiri-1825286e8d2a2df1.pck", "packs/king_hassan-b9b88bd340a08105.pck", "packs/kira-d4ccc8f668122554.pck", "packs/kiyohime-d9f291320f3ac5db.pck", "packs/koichi-81f0539fb6b005da.pck", "packs/makima-98af0194c73eb974.pck", "packs/mash_kyrielight-be9181e017a5ed79.pck", "packs/mista-f71e723f34571178.pck", "packs/morgan-d111390cfea411cc.pck", "packs/narancia-0df69317fba448a0.pck", "packs/nero_claudius-bab0696484747967.pck", "packs/okuyasu-2df15f31cd26a631.pck", "packs/ozymandias-69b33cf60cfe93bc.pck", "packs/polnareff-0233e8f663457623.pck", "packs/pucci-8a285e4343f34084.pck", "packs/risotto-8905282f889b87aa.pck", "packs/rohan-e81db950294acd19.pck", "packs/scathach-baded161478f631f.pck", "packs/shigechi-48d56a4a4043a69b.pck", "packs/sisyphus-1771398545f44557.pck", "packs/tamamo_no_mae-df9180e44336860f.pck", "packs/tesla-9ab22b97abb3a557.pck", "packs/trish-ef2dfa8a47d2d951.pck", "packs/valentine-67cb1ec8e7376f54.pck", "packs/vanilla_ice-6beadb6a291d9ec7.pck", "packs/weather_report-26501cef7ee51b9c.pck"], "shell": ["bt-be29ae6ac57c0a5059bd.audio.position.worklet.js", "bt-be29ae6ac57c0a5059bd.audio.worklet.js", "bt-be29ae6ac57c0a5059bd.js", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "forceUpdate": true};
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

async function cachedResponse(request, key, cacheName) {
    let cache, cached;
    try {
        cache = await caches.open(cacheName);
        cached = await cache.match(key);
    } catch (error) { return decodedPackResponse(await fetch(request), cacheName); }
    if (cached) return decodedPackResponse(cached, cacheName);
    const response = await fetch(request);
    if (response.status === 200 && response.type !== 'opaque') {
        try { await cache.put(key, response.clone()); }
        catch (error) { console.warn('Game resource cache write failed:', error); }
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
        event.respondWith(cachedResponse(request, absolute('index.html'), startupCache));
    } else if (startup.has(url.href)) {
        event.respondWith(cachedResponse(request, url.href, startupCache));
    } else if (packs.has(url.href)) {
        event.respondWith(cachedResponse(request, url.href, packCache));
    }
});
