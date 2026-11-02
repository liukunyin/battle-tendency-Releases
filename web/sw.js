const BUILD = {"version": "805aa276de5b901e7d09", "startup": ["bt-4f5208df6afc22fabe0d.audio.position.worklet.js", "bt-4f5208df6afc22fabe0d.audio.worklet.js", "bt-4f5208df6afc22fabe0d.js", "bt-4f5208df6afc22fabe0d.pck", "bt-4f5208df6afc22fabe0d.wasm", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "packs": ["packs/abdul-bca0735c3919b61e.pck", "packs/alice_kuonji-f78857fa033d06ef.pck", "packs/altera-aed5b5722cc4f3ae.pck", "packs/anasui-f5429d38006d8ccf.pck", "packs/anubis-f44ad72d4a65866a.pck", "packs/blackmore-794dd327e9dabfd4.pck", "packs/bucciarati-fd595b83ff78d9e4.pck", "packs/caveman-d6214c59b81c6037.pck", "packs/circe-4deb81996b702ba3.pck", "packs/cu_chulainn-96f58422cb7851ae.pck", "packs/danmaku_streamer-9546fd47bd8d40cb.pck", "packs/diego-560c59efc152d2ec.pck", "packs/diego_parallel-f1e1c4306f6ff96c.pck", "packs/doppio_diavolo-09750634e03e1a0f.pck", "packs/emiya-167d8b825665de20.pck", "packs/enkidu-1c047970dcdba64e.pck", "packs/ermes-a16b34ef70225585.pck", "packs/gilgamesh-e187482b3443bdc7.pck", "packs/giorno-98195964703234d9.pck", "packs/gojo-bd56392bcd8e457b.pck", "packs/gyro-6398c1c110cb531e.pck", "packs/hassan_cursed_arm-86f416b74b317874.pck", "packs/heracles-eada7b16669d428c.pck", "packs/iggy-d500fb55aa26a0b1.pck", "packs/jack_the_ripper-0aea9b2477d388a0.pck", "packs/jeanne_d_arc-7e0f4e8c4bccf9fa.pck", "packs/johnny-d3801d274b9538ec.pck", "packs/jolyne-5d86aed1869c744d.pck", "packs/jonathan-211eb904cec3bf69.pck", "packs/joseph-ca83c886fe6e2f7e.pck", "packs/joseph_part2-4e6bc974de03ead4.pck", "packs/josuke-098a5bdd6ea5914e.pck", "packs/jotaro-bd4a98d490b4fbcf.pck", "packs/jotaro_part4-7616dcdcba09cd4f.pck", "packs/jotaro_part6-92259ddd920258d5.pck", "packs/kakyoin-96d9dc8ab771f990.pck", "packs/karna-48eb8efaff7ec583.pck", "packs/kars-671e2befad0cce91.pck", "packs/kawajiri-416ba078b3743b5d.pck", "packs/king_hassan-dbd673e5bad4bd8c.pck", "packs/kira-7d8e004894dc1a05.pck", "packs/kiyohime-5d2784e1e6cb98e8.pck", "packs/koichi-81f0539fb6b005da.pck", "packs/makima-98af0194c73eb974.pck", "packs/mash_kyrielight-1d078dca4ec87ab1.pck", "packs/mista-f71e723f34571178.pck", "packs/morgan-89fdd4dda07d7894.pck", "packs/narancia-bf0bec48f9e7ee5c.pck", "packs/nero_claudius-890e03516e2d752d.pck", "packs/okuyasu-2df15f31cd26a631.pck", "packs/ozymandias-59670a467bf2f52a.pck", "packs/polnareff-e0bde750f63f09c1.pck", "packs/pucci-2b79cb64b5620d50.pck", "packs/risotto-8905282f889b87aa.pck", "packs/rohan-d3b43357e6d81881.pck", "packs/scathach-937592886d5e1d16.pck", "packs/shigechi-de8f7906a1192a9b.pck", "packs/sisyphus-1771398545f44557.pck", "packs/tamamo_no_mae-316e57fe42b6dab6.pck", "packs/tesla-f7a04681ec84e060.pck", "packs/trish-ef2dfa8a47d2d951.pck", "packs/valentine-67cb1ec8e7376f54.pck", "packs/vanilla_ice-3b30edae13c964af.pck", "packs/weather_report-3fa6daf9b998023f.pck"], "shell": ["bt-4f5208df6afc22fabe0d.audio.position.worklet.js", "bt-4f5208df6afc22fabe0d.audio.worklet.js", "bt-4f5208df6afc22fabe0d.js", "index.apple-touch-icon.png", "index.html", "index.icon.png", "index.png"], "forceUpdate": true};
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
