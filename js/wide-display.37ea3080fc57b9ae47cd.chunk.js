
"use strict";
(globalThis.webpackChunk = globalThis.webpackChunk || []).push([[87], {
    651: (e, o, r) => {
        r.r(o),
        r.d(o, {
            default: () => a
        });
        var s = r(834);
        class a {
            elements;
            constructor(e) {
                this.elements = e
            }
            async initialize() {
                try {
                    await Promise.all(["/assets/images/door_sprite.jpg", "/assets/images/wide_flower.png"].map((e => new Promise(( (o, r) => {
                        const s = new Image;
                        s.onload = () => o(),
                        s.onerror = () => r(new Error(`Failed to load image: ${e}`)),
                        s.src = e
                    }
                    )))));
                    const e = '\n        <div class="too-wide" aria-hidden="true">\n          <div class="door-cont">\n            <div class="door-cont__door">\n              <div class="dooroverlay"></div>\n            </div>\n            <div class="door-cont__dude"></div>\n          </div>\n        </div>\n      ';
                    s.F_.write(( () => {
                        document.querySelector(".full-wrapper")?.insertAdjacentHTML("afterend", e)
                    }
                    ))
                } catch {
                    console.error("Failed to load wide display")
                }
            }
            destroy() {
                document.querySelector(".too-wide")?.remove()
            }
        }
    }
}]);
