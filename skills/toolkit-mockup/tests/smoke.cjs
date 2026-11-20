/* Smoke test for a built mockup page. Needs jsdom:  npm i --no-save jsdom
   Usage: node tests/smoke.cjs path/to/index.html
   Checks both comment modes with a fake host. It does not check how the page looks. */
const fs = require("fs");
const { JSDOM } = require("jsdom");
const file = process.argv[2];
if (!file) { console.error("usage: node smoke.cjs index.html"); process.exit(2); }
const html = fs.readFileSync(file, "utf8");
let failed = 0;
function ok(cond, msg) { console.log((cond ? "PASS " : "FAIL ") + msg); if (!cond) failed++; }

function open(beforeParse) {
  return new Promise(function (resolve) {
    const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, beforeParse });
    dom.window.document.addEventListener("mockup-ready", function (e) { resolve({ dom, mode: e.detail.mode }); });
    setTimeout(function () { resolve({ dom, mode: "timeout" }); }, 6000);
  });
}
function click(win, el, x, y) {
  el.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true, clientX: x || 5, clientY: y || 5 }));
}

(async function () {
  /* ---- standalone mode ---- */
  let r = await open();
  let w = r.dom.window, d = w.document;
  ok(r.mode === "standalone", "standalone mode when no host comments capability");
  const comps = d.querySelectorAll(".mk-comp");
  ok(comps.length >= 3, "components rendered (" + comps.length + ")");
  ok(d.querySelectorAll(".mk-stage").length >= 1, "frames rendered");
  ok(d.querySelectorAll(".mk-tag").length === comps.length, "a build label on every component");
  ok(d.querySelector("#mk-decisions").children.length >= 1, "decisions rendered");
  ok(d.querySelectorAll("#mk-build tr").length >= 2, "build list rendered");
  ok(!d.querySelector("#mk-mode").hidden, "comment mode button shown");
  click(w, d.querySelector("#mk-mode"));
  ok(d.body.classList.contains("mk-commenting"), "comment mode on");
  click(w, comps[0], 10, 10);
  ok(!d.querySelector("#mk-pop").hidden, "popover opens when a component is clicked");
  d.querySelector("#mk-pop-text").value = "Make this bigger";
  click(w, d.querySelector("#mk-pop-save"));
  ok(w.MockupEngine.comments().length === 1, "comment saved");
  ok(d.querySelectorAll(".mk-pin").length === 1, "pin drawn");
  ok(w.MockupEngine.markdown().indexOf("Make this bigger") > 0, "markdown export has the text");
  ok(/## /.test(w.MockupEngine.markdown()), "markdown names the element");
  ok(w.localStorage.length === 1, "comment kept in localStorage");
  click(w, d.querySelector("#mk-finish"));
  ok(d.querySelector("#mk-export").value.indexOf("Make this bigger") > 0, "finish shows the export text");
  w.close();

  /* ---- native mode with a fake host ---- */
  const calls = { composer: 0, sent: 0, el: null, payload: null };
  r = await open(function (win) {
    win.claude = { use: function (name) {
      return Promise.resolve(name === "comments" ? {
        openComposer: function (t) { calls.composer++; calls.el = t.element; return Promise.resolve({ opened: true }); },
        canSendToClaude: function () { return Promise.resolve("available"); },
        anchorFor: function () { return Promise.resolve({ path: "p", x: 1, y: 1 }); },
        sendToClaude: function (p) { calls.sent++; calls.payload = p; return Promise.resolve({ threadId: "t", commentId: "c" }); }
      } : null);
    } };
  });
  w = r.dom.window; d = w.document;
  ok(r.mode === "native", "native mode when the host offers comments");
  ok(d.querySelector("#mk-mode").hidden, "standalone buttons hidden in native mode");
  const btn = d.querySelector(".mk-comp > .mk-cbtn");
  ok(!!btn, "native comment button present on components");
  click(w, btn);
  ok(calls.composer === 1 && calls.el && calls.el.classList.contains("mk-comp"), "button opens the host composer on the component");
  click(w, d.querySelector("#mk-finish"));
  await new Promise(function (res) { setTimeout(res, 50); });
  ok(calls.sent === 1 && /Review finished/.test(calls.payload.text), "finish sends one message to the agent");
  w.close();

  console.log(failed ? failed + " check(s) failed" : "all checks passed");
  process.exit(failed ? 1 : 0);
})();
