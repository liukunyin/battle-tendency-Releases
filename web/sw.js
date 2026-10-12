const BUILD = {"version": "cc7bf672b3e437ee24e1", "startup": ["bt-6d3367e6e40270331cd4.audio.position.worklet.js", "bt-6d3367e6e40270331cd4.audio.worklet.js", "bt-6d3367e6e40270331cd4.js", "bt-6d3367e6e40270331cd4.pck", "bt-6d3367e6e40270331cd4.wasm", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "packs": ["packs/abdul-1dcec112ab4df46f.pck", "packs/alice_kuonji-aebe429d921d2b26.pck", "packs/altera-aed5b5722cc4f3ae.pck", "packs/anasui-2d6eb879a0042863.pck", "packs/anubis-bb6f5a3c975e7dd7.pck", "packs/blackmore-bcf6d8a2bfd934e4.pck", "packs/bucciarati-19d8adb7bdd19da9.pck", "packs/caveman-f479daf13d0c36d3.pck", "packs/circe-4deb81996b702ba3.pck", "packs/cu_chulainn-96f58422cb7851ae.pck", "packs/danmaku_streamer-86fd629f6d1b4247.pck", "packs/diego-365ac32c41860cb9.pck", "packs/diego_parallel-b59e41adaa14a7fd.pck", "packs/dio-ad2ca389cf8fd016.pck", "packs/doppio_diavolo-e75c0f7616610fd2.pck", "packs/emiya-9ca35162218d982b.pck", "packs/enkidu-1c047970dcdba64e.pck", "packs/ermes-d58dbe8efcf88642.pck", "packs/gilgamesh-e713bcf435f64635.pck", "packs/giorno-80b51029b4677cb7.pck", "packs/gyro-419690dd058d9c90.pck", "packs/hassan_cursed_arm-86f416b74b317874.pck", "packs/heracles-b2cb115f39e62084.pck", "packs/iggy-dcf0329a07dada32.pck", "packs/jack_the_ripper-0aea9b2477d388a0.pck", "packs/jeanne_d_arc-04664804cb541f95.pck", "packs/johnny-a4f353f13eb9df31.pck", "packs/jolyne-a32c7ed751fb951f.pck", "packs/joseph-284b6a90d4f1e0da.pck", "packs/joseph_part2-486523e784386f31.pck", "packs/josuke-2aa5638d0f8f6944.pck", "packs/jotaro-21e24c65204693db.pck", "packs/jotaro_part4-cdff243bc2d8775c.pck", "packs/jotaro_part6-84d135e2bd372a5d.pck", "packs/kakyoin-3ad560b8bc72f6fc.pck", "packs/karna-48eb8efaff7ec583.pck", "packs/kars-22e33f7965a9b2a4.pck", "packs/kawajiri-32be932955ed008c.pck", "packs/king_hassan-c71036f4a1b59e18.pck", "packs/kira-e19de0e15eabe6a2.pck", "packs/kiyohime-5d2784e1e6cb98e8.pck", "packs/koichi-81f0539fb6b005da.pck", "packs/makima-98af0194c73eb974.pck", "packs/mash_kyrielight-1d078dca4ec87ab1.pck", "packs/mista-2dc47cf8688d2253.pck", "packs/morgan-03d4c09b1920538a.pck", "packs/narancia-0df69317fba448a0.pck", "packs/nero_claudius-890e03516e2d752d.pck", "packs/okuyasu-02115481e486af79.pck", "packs/ozymandias-ed3cfcf620966abe.pck", "packs/polnareff-2293f84801e78431.pck", "packs/pucci-549a0b292b8af09b.pck", "packs/risotto-cd981e1edc8d308e.pck", "packs/scathach-937592886d5e1d16.pck", "packs/shigechi-de8f7906a1192a9b.pck", "packs/sisyphus-1771398545f44557.pck", "packs/tamamo_no_mae-316e57fe42b6dab6.pck", "packs/tesla-c15ed80839a9b860.pck", "packs/trish-ce3f0bf4846f6cfe.pck", "packs/valentine-25aeb51e93917c0f.pck", "packs/vanilla_ice-d677dec89800fc38.pck", "packs/weather_report-26501cef7ee51b9c.pck"], "shell": ["bt-6d3367e6e40270331cd4.audio.position.worklet.js", "bt-6d3367e6e40270331cd4.audio.worklet.js", "bt-6d3367e6e40270331cd4.js", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"]};
/* Build configuration is prepended by build_web_cache.py. */
const scopeURL = new URL(self.registration.scope);
const prefix = 'bt-web-' + encodeURIComponent(scopeURL.pathname) + '-';
const startupCache = prefix + 'startup-' + BUILD.version;
const packCache = prefix + 'packs';
const absolute = path => new URL(path, scopeURL).href;
const startup = new Set(BUILD.startup.map(absolute));
const packs = new Set(BUILD.packs.map(absolute));

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
        for (const key of await caches.keys()) {
            if (key.startsWith(prefix + 'startup-') && key !== startupCache) await caches.delete(key);
        }
        const cache = await caches.open(packCache);
        for (const request of await cache.keys()) {
            if (!packs.has(request.url)) await cache.delete(request);
        }
        await self.clients.claim();
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
