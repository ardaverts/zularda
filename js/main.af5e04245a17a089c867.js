( () => {
    "use strict";
    var e, t = {
        284: (e, t, s) => {
            s.d(t, {
                i: () => h
            });
            const a = /-?\d*\.?\d+/g
              , r = 2 * Math.PI
              , n = matchMedia("(prefers-reduced-motion: reduce)")
              , i = {
                "out-elastic": (e, t=1, s=.4) => {
                    if (0 === e)
                        return 0;
                    if (1 === e)
                        return 1;
                    const a = Math.max(t, 1)
                      , n = s / r * Math.asin(1 / a);
                    return a * Math.pow(2, -10 * e) * Math.sin((e - n) * r / s) + 1
                }
                ,
                "in-elastic": (e, t=1, s=.4) => {
                    if (0 === e)
                        return 0;
                    if (1 === e)
                        return 1;
                    const a = Math.max(t, 1)
                      , n = s / r * Math.asin(1 / a);
                    return -a * Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1 - n) * r / s)
                }
            };
            class o {
                static parseValue(e) {
                    const t = e.match(a)?.map(Number) || [];
                    return [e.split(a).join("$"), t]
                }
                static interpolateSimpleTransform(e, t, s, a) {
                    return "scale" === e ? `scale(${t[0] + (s[0] - t[0]) * a})` : "translate" === e ? `translate(${t[0] + (s[0] - t[0]) * a}px,${t[1] + (s[1] - t[1]) * a}px)` : ""
                }
                static interpolate(e, t, s, a, r) {
                    if ("scale($)" === e && "scale($)" === s)
                        return this.interpolateSimpleTransform("scale", t, a, r);
                    if ("translate($px,$px)" === e && "translate($px,$px)" === s)
                        return this.interpolateSimpleTransform("translate", t, a, r);
                    const n = t.map(( (e, t) => e + ((a[t] ?? e) - e) * r));
                    return e.replace(/\$/g, ( () => String(n.shift())))
                }
                static prepare(e) {
                    const t = Array.isArray(e) ? e[0] : "0"
                      , s = Array.isArray(e) ? e[1] : e;
                    return {
                        start: this.parseValue(t),
                        end: this.parseValue(s)
                    }
                }
            }
            class c {
                static hexToRgb(e) {
                    return 3 === (e = e.replace("#", "")).length && (e = e.split("").map((e => e + e)).join("")),
                    [parseInt(e.substr(0, 2), 16), parseInt(e.substr(2, 2), 16), parseInt(e.substr(4, 2), 16)]
                }
                static rgbToHex(e) {
                    return "#" + e.map((e => {
                        const t = Math.round(e).toString(16);
                        return 1 === t.length ? "0" + t : t
                    }
                    )).join("")
                }
                static parseColor(e) {
                    if (e.startsWith("#"))
                        return this.hexToRgb(e);
                    const t = e.match(/\d+/g);
                    return t ? t.map(Number) : [0, 0, 0]
                }
                static prepare(e) {
                    const t = Array.isArray(e) ? e[0] : "rgb(0, 0, 0)"
                      , s = Array.isArray(e) ? e[1] : e;
                    return {
                        start: this.parseColor(t),
                        end: this.parseColor(s)
                    }
                }
                static interpolate(e, t, s) {
                    return `rgb(${e.map(( (e, a) => e + (t[a] - e) * s)).map(Math.round).join(",")})`
                }
            }
            class l {
                duration;
                easingFn;
                amplitude;
                period;
                animations = new Set;
                constructor(e, t, s, a) {
                    this.duration = e,
                    this.easingFn = t,
                    this.amplitude = s,
                    this.period = a
                }
                animate(e, t, s, a, r, n) {
                    let i = 0;
                    const o = () => {
                        const e = requestAnimationFrame(c);
                        this.animations.add(e)
                    }
                      , c = t => {
                        i || (i = t);
                        const c = t - i
                          , l = Math.min(c / this.duration, 1)
                          , h = this.easingFn(l, this.amplitude, this.period);
                        this.updateElement(e, h, s, a, r),
                        l < 1 ? o() : n()
                    }
                    ;
                    t ? setTimeout(o, t) : o()
                }
                updateElement(e, t, s, a, r) {
                    const n = {};
                    if (a) {
                        const [e,s] = Array.isArray(a) ? a : [0, a];
                        n.opacity = String(e + (s - e) * t)
                    }
                    s && (n.transform = o.interpolate(s.start[0], s.start[1], s.end[0], s.end[1], t)),
                    r && (n.backgroundColor = c.interpolate(r.start, r.end, t)),
                    Object.assign(e.style, n)
                }
                cleanup() {
                    this.animations.forEach((e => cancelAnimationFrame(e))),
                    this.animations.clear()
                }
            }
            const h = e => {
                const {elements: t, easing: s="out-elastic", duration: a=1e3, delay: r=0, stagger: h=0, opacity: d, transform: u, backgroundColor: p} = e
                  , m = (e => e ? e instanceof Element ? [e] : e instanceof NodeList || Array.isArray(e) ? Array.from(e) : "string" == typeof e ? Array.from(document.querySelectorAll(e)) : [] : [])(t);
                return m.length ? n.matches ? (m.forEach((e => {
                    const t = {};
                    if (d && (t.opacity = String(Array.isArray(d) ? d[1] : d)),
                    u && (t.transform = String(Array.isArray(u) ? u[1] : u)),
                    p) {
                        const e = Array.isArray(p) ? p[1] : p;
                        t.backgroundColor = e
                    }
                    Object.assign(e.style, t)
                }
                )),
                Promise.resolve()) : new Promise((e => {
                    const [t="out-elastic",n="1",g="0.4"] = s.split(" ")
                      , f = new l(a,i[t],Number(n),Number(g))
                      , y = u ? o.prepare(u) : null
                      , w = p ? c.prepare(p) : null;
                    let b = 0;
                    const E = () => {
                        ++b === m.length && (f.cleanup(),
                        e())
                    }
                    ;
                    m.forEach(( (e, t) => {
                        const s = "function" == typeof r ? r(t) : r + h * t;
                        f.animate(e, s, y, d, w, E)
                    }
                    ))
                }
                )) : Promise.resolve()
            }
        }
        ,
        834: (e, t, s) => {
            s.d(t, {
                F_: () => r,
                k3: () => a,
                sg: () => n
            });
            const a = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
              , r = {
                writes: new Set,
                scheduled: !1,
                BATCH_SIZE: 20,
                write(e) {
                    this.writes.add(e),
                    this.schedule()
                },
                schedule() {
                    this.scheduled || (this.scheduled = !0,
                    requestAnimationFrame(( () => {
                        const e = Array.from(this.writes);
                        this.writes.clear(),
                        this.scheduled = !1;
                        for (let t = 0; t < e.length; t += this.BATCH_SIZE) {
                            const s = e.slice(t, t + this.BATCH_SIZE);
                            t + this.BATCH_SIZE < e.length ? requestAnimationFrame(( () => {
                                s.forEach((e => e()))
                            }
                            )) : s.forEach((e => e()))
                        }
                    }
                    )))
                }
            }
              , n = (e, t) => {
                let s = null;
                const a = (...a) => {
                    null !== s && clearTimeout(s),
                    s = window.setTimeout(( () => {
                        e(...a),
                        s = null
                    }
                    ), t)
                }
                ;
                return a.cancel = () => {
                    null !== s && (clearTimeout(s),
                    s = null)
                }
                ,
                a
            }
        }
    }, s = {};
    function a(e) {
        var r = s[e];
        if (void 0 !== r)
            return r.exports;
        var n = s[e] = {
            exports: {}
        };
        return t[e](n, n.exports, a),
        n.exports
    }
    a.m = t,
    a.d = (e, t) => {
        for (var s in t)
            a.o(t, s) && !a.o(e, s) && Object.defineProperty(e, s, {
                enumerable: !0,
                get: t[s]
            })
    }
    ,
    a.f = {},
    a.e = e => Promise.all(Object.keys(a.f).reduce(( (t, s) => (a.f[s](e, t),
    t)), [])),
    a.u = e => "js/" + ({
        87: "wide-display",
        187: "search",
        317: "related-fonts",
        377: "chat"
    }[e] || e) + "." + {
        87: "37ea3080fc57b9ae47cd",
        187: "e903f55e56b211cff425",
        273: "235835dfa7d615720358",
        317: "000ad80067e77dc6dd49",
        377: "231541742ff72ea49b5e"
    }[e] + ".chunk.js",
    a.miniCssF = e => {}
    ,
    a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
    e = {},
    a.l = (t, s, r, n) => {
        if (e[t])
            e[t].push(s);
        else {
            var i, o;
            if (void 0 !== r)
                for (var c = document.getElementsByTagName("script"), l = 0; l < c.length; l++) {
                    var h = c[l];
                    if (h.getAttribute("src") == t) {
                        i = h;
                        break
                    }
                }
            i || (o = !0,
            (i = document.createElement("script")).charset = "utf-8",
            i.timeout = 120,
            a.nc && i.setAttribute("nonce", a.nc),
            i.src = t),
            e[t] = [s];
            var d = (s, a) => {
                i.onerror = i.onload = null,
                clearTimeout(u);
                var r = e[t];
                if (delete e[t],
                i.parentNode && i.parentNode.removeChild(i),
                r && r.forEach((e => e(a))),
                s)
                    return s(a)
            }
              , u = setTimeout(d.bind(null, void 0, {
                type: "timeout",
                target: i
            }), 12e4);
            i.onerror = d.bind(null, i.onerror),
            i.onload = d.bind(null, i.onload),
            o && document.head.appendChild(i)
        }
    }
    ,
    a.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    a.p = "/assets/",
    ( () => {
        a.b = document.baseURI || self.location.href;
        var e = {
            792: 0
        };
        a.f.j = (t, s) => {
            var r = a.o(e, t) ? e[t] : void 0;
            if (0 !== r)
                if (r)
                    s.push(r[2]);
                else {
                    var n = new Promise(( (s, a) => r = e[t] = [s, a]));
                    s.push(r[2] = n);
                    var i = a.p + a.u(t)
                      , o = new Error;
                    a.l(i, (s => {
                        if (a.o(e, t) && (0 !== (r = e[t]) && (e[t] = void 0),
                        r)) {
                            var n = s && ("load" === s.type ? "missing" : s.type)
                              , i = s && s.target && s.target.src;
                            o.message = "Loading chunk " + t + " failed.\n(" + n + ": " + i + ")",
                            o.name = "ChunkLoadError",
                            o.type = n,
                            o.request = i,
                            r[1](o)
                        }
                    }
                    ), "chunk-" + t, t)
                }
        }
        ;
        var t = (t, s) => {
            var r, n, [i,o,c] = s, l = 0;
            if (i.some((t => 0 !== e[t]))) {
                for (r in o)
                    a.o(o, r) && (a.m[r] = o[r]);
                c && c(a)
            }
            for (t && t(s); l < i.length; l++)
                n = i[l],
                a.o(e, n) && e[n] && e[n][0](),
                e[n] = 0
        }
          , s = globalThis.webpackChunk = globalThis.webpackChunk || [];
        s.forEach(t.bind(null, 0)),
        s.push = t.bind(null, s.push.bind(s))
    }
    )();
    var r = a(284)
      , n = a(834);
    const i = "2.0.2"
      , o = "fontDataVersion"
      , c = "fontData";
    class l {
        elements;
        updateElements;
        workerManager;
        features = new Map;
        loadPromises = new Map;
        constructor(e, t, s) {
            this.elements = e,
            this.updateElements = t,
            this.workerManager = s,
            this.registerFeature("chat", {
                module: () => a.e(377).then(a.bind(a, 81)),
                dependencies: [this.updateElements]
            }),
            this.registerFeature("search", {
                module: () => a.e(187).then(a.bind(a, 439)),
                dependencies: [this.workerManager]
            }),
            document.addEventListener("click", this.handleFeatureTrigger.bind(this))
        }
        registerFeature(e, t) {
            this.features.set(e, t)
        }
        async handleFeatureTrigger(e) {
            const t = e.target;
            if (t.matches(".js-openchat")) {
                e.preventDefault();
                const t = this.features.get("chat");
                t?.instance ? t.instance.openChat?.() : await this.loadFeature("chat")
            } else if (t.matches(".searchthingy")) {
                e.preventDefault();
                const t = this.features.get("search");
                t?.instance ? t.instance.openSearch?.() : await this.loadFeature("search")
            }
        }
        async loadFeature(e) {
            const t = this.features.get(e);
            if (!t)
                return;
            if (this.loadPromises.has(e))
                return void await this.loadPromises.get(e);
            const s = (async () => {
                try {
                    const {default: e} = await t.module();
                    t.instance = new e(this.elements,...t.dependencies),
                    t.instance.initialize()
                } catch (t) {
                    console.error(`Failed to load feature: ${e}`, t),
                    this.loadPromises.delete(e)
                }
            }
            )();
            this.loadPromises.set(e, s),
            await s
        }
    }
    const h = ["display", "sans-serif", "serif", "monospace"];
    class d {
        elements;
        worker;
        openStates = new Set;
        sessionResetKey = "listResetForSession";
        classOpen = "categories--open";
        typeCats = [];
        typeCatParents = [];
        constructor(e, t) {
            this.elements = e,
            this.worker = t
        }
        async initialize() {
            this.elements.parent && (this.typeCats = Array.from(this.elements.parent.querySelectorAll(".category")),
            this.typeCatParents = this.typeCats.map((e => e.parentElement)).filter((e => null !== e)),
            this.setupEventListeners(),
            this.resetLists(),
            await this.initializeStates(),
            await this.loadFonts())
        }
        setupEventListeners() {
            this.elements.parent && (this.elements.parent.addEventListener("click", this.handleInteraction, {
                passive: !1
            }),
            this.elements.parent.addEventListener("keyup", this.handleInteraction, {
                passive: !0
            }))
        }
        handleInteraction = e => {
            const t = e.target
              , s = t.closest(".category")?.parentElement;
            if (!(s instanceof HTMLElement))
                return;
            if ("keyup" === e.type && "Enter" !== e.key)
                return;
            e.preventDefault();
            const a = s.classList.contains(this.classOpen);
            this.updateTypeCatState(s, !a, !0)
        }
        ;
        async loadFonts() {
            const e = Date.now() - 432e6;
            for (const t of h)
                await this.processFontsForCategory(t, e)
        }
        async processFontsForCategory(e, t) {
            const s = `.categories[data-tc="type--${e}"]`
              , a = document.querySelector(s)
              , r = a?.querySelector(".category");
            if (r && !r.querySelector(".type-items") && "true" !== r.dataset.processing) {
                r.dataset.processing = "true";
                try {
                    const s = await this.worker.processFonts(`type--${e}`, t)
                      , r = document.createElement("div");
                    r.className = "type-items";
                    const i = document.createDocumentFragment();
                    s.fonts.forEach((e => {
                        i.appendChild(this.createFontElement(e))
                    }
                    )),
                    r.appendChild(i),
                    a && n.F_.write(( () => {
                        a.appendChild(r),
                        s.hasNewClass && a.classList.add("newcat")
                    }
                    ))
                } catch (t) {
                    console.error("Error processing fonts for", e, t)
                } finally {
                    delete r.dataset.processing
                }
            }
        }
        createFontElement(e) {
            const t = document.createElement("article");
            t.className = "type-items__item" + (e.isNew ? " type-items__item-new" : "");
            const s = e.a.map((e => e.name)).join(", ");
            return t.innerHTML = `\n      <img\n        loading="lazy"\n        decoding="async"\n        class="preview-thumb m-2x--bottom"\n        src="/assets/images/${e.l}.svg"\n        width="101"\n        height="30"\n        alt="Preview of typeface ${e.n}"\n      >\n      <h3 class="h2">${e.n}</h3>\n      <p class="type-items__item-by smaaaal m-2x--bottom">\n        by ${s}\n      </p>\n      <a class="btn" href="/${e.s}/${e.l}/">Info</a>\n      <a class="btn"\n         href="${e.dl}?ref=uncut.wtf"\n         target="_blank"\n         rel="${e.relAtt}"\n         aria-label="Download ${e.n} - link opens in new tab"\n      >Download</a>\n    `,
            t
        }
        updateTypeCatState(e, t, s=!1) {
            const a = e.dataset.tc;
            a && this.openStates.has(a) !== t && n.F_.write(( () => {
                e.classList.toggle(this.classOpen, t),
                t ? (this.openStates.add(a),
                sessionStorage.setItem(a, "open")) : (this.openStates.delete(a),
                sessionStorage.removeItem(a)),
                s && e.scrollIntoView({
                    behavior: n.k3,
                    block: t ? "start" : "nearest",
                    inline: t ? "start" : "nearest"
                })
            }
            ))
        }
        resetLists() {
            sessionStorage.getItem(this.sessionResetKey) || n.F_.write(( () => {
                this.typeCatParents.forEach((e => {
                    this.updateTypeCatState(e, !1, !1)
                }
                )),
                sessionStorage.setItem(this.sessionResetKey, "true")
            }
            ))
        }
        async initializeStates() {
            const e = new Set(this.typeCatParents.map((e => e.dataset.tc)).filter((e => void 0 !== e && "open" === sessionStorage.getItem(e))));
            0 !== e.size && n.F_.write(( () => {
                e.forEach((e => {
                    this.openStates.add(e);
                    const t = this.elements.parent?.querySelector(`[data-tc="${e}"]`);
                    t && t.classList.add(this.classOpen)
                }
                ))
            }
            ))
        }
    }
    const u = {
        WORKER_LINK: document.getElementById("jsjson")?.getAttribute("href") ?? "",
        COOKIE_ENABLED: navigator.cookieEnabled,
        RESIZE_DEBOUNCE: 250,
        EMAIL: "submit@uncut.wtf",
        VIEW_PREF_KEY: "viewPreference"
    }
      , p = "grid"
      , m = new class {
        worker = null;
        fontData = null;
        initPromise = null;
        cache = new Map;
        async initialize(e) {
            return this.initPromise || (this.initPromise = this.initializeWorker(e)),
            this.initPromise
        }
        async initializeWorker(e) {
            if (!this.worker)
                try {
                    this.worker = new Worker(new URL(a.p + a.u(273),a.b),{
                        type: void 0,
                        credentials: "same-origin"
                    }),
                    this.worker.onerror = this.handleWorkerError.bind(this),
                    this.worker.onmessage = this.handleWorkerMessage.bind(this),
                    this.fontData = await this.getCachedFontData(),
                    this.fontData || (this.fontData = await this.fetchFontData(e),
                    await this.cacheFontData(this.fontData)),
                    await this.sendMessage({
                        type: "initializeFontData",
                        fontData: this.fontData
                    })
                } catch (e) {
                    throw console.error("Failed to initialize worker:", e),
                    e
                }
        }
        handleWorkerError(e) {
            throw console.error("Worker error:", e),
            new Error(`Worker error: ${e.message}`)
        }
        async getCachedFontData() {
            try {
                const e = localStorage.getItem(o)
                  , t = localStorage.getItem(c);
                if (e === i && t)
                    return JSON.parse(t)
            } catch (e) {
                console.warn("Failed to retrieve cached font data:", e)
            }
            return null
        }
        async fetchFontData(e) {
            const t = await fetch(e, {
                credentials: "include",
                headers: {
                    Accept: "application/json"
                }
            });
            if (!t.ok)
                throw new Error(`HTTP error! status: ${t.status}`);
            return t.json()
        }
        async cacheFontData(e) {
            try {
                localStorage.setItem(c, JSON.stringify(e)),
                localStorage.setItem(o, i)
            } catch (e) {
                console.warn("Failed to cache font data:", e)
            }
        }
        handleWorkerMessage(e) {
            const {data: t} = e;
            if (this.shouldCacheResponse(t)) {
                const e = this.generateCacheKey(t);
                if (this.cache.set(e, t),
                this.cache.size > 100) {
                    const [e] = this.cache.keys();
                    this.cache.delete(e)
                }
            }
        }
        shouldCacheResponse(e) {
            return ["fontsProcessed", "relatedFontsProcessed"].includes(e.type)
        }
        generateCacheKey(e) {
            return "typeCatData"in e ? `fonts-${e.typeCatData}` : "fonts"in e ? `related-${JSON.stringify(e.fonts)}` : ""
        }
        async sendMessage(e) {
            if (!this.worker)
                throw new Error("Worker not initialized");
            const t = this.generateCacheKey(e);
            return this.cache.get(t) || new Promise(( (t, s) => {
                const a = setTimeout(( () => {
                    s(new Error("Worker request timeout"))
                }
                ), 1e4)
                  , r = e => {
                    clearTimeout(a);
                    const n = e.data;
                    "error" === n.type ? s(new Error(n.error)) : t(n),
                    this.worker?.removeEventListener("message", r)
                }
                ;
                this.worker.addEventListener("message", r),
                this.worker.postMessage(e)
            }
            ))
        }
        async processFonts(e, t) {
            const s = await this.sendMessage({
                type: "processFonts",
                typeCatData: e,
                fiveDaysAgo: t
            });
            return {
                fonts: s.fonts,
                hasNewClass: s.hasNewClass,
                typeCatData: s.typeCatData
            }
        }
        async filterSearchResults(e) {
            return (await this.sendMessage({
                type: "filterSearchResults",
                searchTerm: e
            })).results
        }
        async getRelatedFonts(e, t) {
            return (await this.sendMessage({
                type: "getRelatedFonts",
                category: e,
                currentFontSlug: t
            })).fonts
        }
    }
      , g = new Proxy({},{
        get: (e, t) => localStorage.getItem(t),
        set: (e, t, s) => (localStorage.setItem(t, s),
        !0)
    })
      , f = {
        relatedFontsContainer: null,
        parent: null,
        search: null,
        results: null,
        searchTrigger: null,
        searchWrapper: null,
        toggleBtn: null
    }
      , y = () => {
        Object.entries({
            relatedFontsContainer: "#related-fonts-container",
            parent: "#js-type-container",
            search: "#js-search",
            results: "#results",
            searchTrigger: ".searchthingy",
            searchWrapper: ".search-wrapper",
            toggleBtn: ".togglethinghy"
        }).forEach(( ([e,t]) => {
            f[e] = document.querySelector(t)
        }
        ))
    }
      , w = "feedCookieMonster";
    y(),
    requestAnimationFrame(( () => {
        ( () => {
            const {parent: e, toggleBtn: t} = f;
            if (!e || !t)
                return;
            const s = s => {
                var a;
                (s => {
                    n.F_.write(( () => {
                        e.classList.remove(s ? "list-view" : "grid-view"),
                        e.classList.add(s ? "grid-view" : "list-view"),
                        t.setAttribute("aria-label", s ? "Switch to list view" : "Switch to grid view")
                    }
                    ))
                }
                )(s),
                a = s ? p : "list",
                u.COOKIE_ENABLED && (g[u.VIEW_PREF_KEY] = a)
            }
              , a = u.COOKIE_ENABLED ? g[u.VIEW_PREF_KEY] ?? p : p;
            s(a === p),
            t.addEventListener("click", ( () => {
                const t = e.classList.contains("grid-view");
                s(!t)
            }
            ), {
                passive: !0
            })
        }
        )(),
        (async () => {
            if (await m.initialize(u.WORKER_LINK),
            f.parent) {
                const e = new d(f,m);
                await e.initialize(),
                new l(f,y,m)
            }
            f.relatedFontsContainer && requestAnimationFrame((async () => {
                const {showRelatedFonts: e} = await a.e(317).then(a.bind(a, 173));
                e(m)
            }
            ));
            const e = matchMedia("(min-aspect-ratio: 2/1) and (min-width: 1800px)")
              , t = () => {
                requestAnimationFrame(( () => {
                    a.e(87).then(a.bind(a, 651)).then(( ({default: e}) => {
                        new e(f).initialize()
                    }
                    )).catch(console.error)
                }
                ))
            }
            ;
            e.matches && t(),
            e.addEventListener("change", (e => {
                e.matches && t()
            }
            ))
        }
        )(),
        ( () => {
            const e = document.createElement("dialog");
            e.className = "notification-dialog",
            e.innerHTML = '\n    <div class="notification-content">\n      <p class="h3 emailbtn">Email copied to clipboard</p>\n    </div>\n  ',
            document.body.appendChild(e),
            document.addEventListener("click", ( ({target: t}) => {
                t instanceof HTMLElement && t.matches(".js-copy-email") && (async () => {
                    try {
                        await navigator.clipboard.writeText(u.EMAIL),
                        e.showModal(),
                        await (0,
                        r.i)({
                            elements: ".notification-dialog .notification-content",
                            duration: 400,
                            easing: "out-elastic .7 .9",
                            opacity: [0, 1],
                            transform: ["scale(0) translateY(0)", "1 0"]
                        }),
                        await new Promise((e => setTimeout(e, 1e3))),
                        e.close()
                    } catch (e) {
                        console.error("Failed to copy email:", e)
                    }
                }
                )()
            }
            ))
        }
        )()
    }
    )),
    requestAnimationFrame(( () => {
        ( () => {
            const e = () => {
                const e = document.createElement("script");
                e.src = "https://static.cloudflareinsights.com/beacon.min.js",
                e.setAttribute("data-cf-beacon", '{"token": "aa503be02ee6486d8259bd58197951ac"}'),
                e.crossOrigin = "anonymous",
                e.async = !0,
                document.head.appendChild(e)
            }
              , t = document.querySelector(".cookie-monster");
            "true" === g[w] ? (t.remove(),
            e()) : ( () => {
                if ("true" === g[w])
                    return;
                if (!t)
                    return;
                const s = t.querySelector(".cookie-accept");
                s && s.addEventListener("click", ( () => {
                    g[w] = "true",
                    t.remove(),
                    e()
                }
                ), {
                    passive: !0
                }),
                t.showModal()
            }
            )(),
            setTimeout(( () => {
                "none" == window.getComputedStyle(t).display && (t.remove(),
                e())
            }
            ), "10")
        }
        )()
    }
    ))
}
)();
