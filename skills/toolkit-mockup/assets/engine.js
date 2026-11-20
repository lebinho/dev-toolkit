/* toolkit-mockup engine.
   Reads window.MOCKUP (see references/config.md in the skill) and renders the review page.
   Two comment modes, chosen at load:
   - native: the host offers a comments capability (claude.ai artifacts). Buttons open the host composer.
   - standalone: any browser. Click to comment, keep in localStorage, export as Markdown. */
(function () {
  "use strict";
  var M = window.MOCKUP || {};
  var TITLE = M.title || document.title || "Mockup";
  /* view state: one value per control declared in M.controls */
  var STATE = {};
  Object.keys(M.controls || {}).forEach(function (k) { STATE[k] = M.controls[k].value; });

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function status(msg) { var el = $("#mk-status"); if (el) el.textContent = msg || ""; }
  function chipClass(build) { return /custom|deneb|vega|d3|script/i.test(build || "") ? "custom" : ""; }

  /* ---------- render ---------- */
  function target(uid, label) { return 'data-comment-target data-uid="' + esc(uid) + '" data-label="' + esc(label) + '"'; }

  function renderComp(c) {
    var inner = typeof c.html === "function" ? c.html(c, STATE) : (c.html || "");
    var tag = '<div class="mk-tag"><b>' + esc(c.id) + '</b> ' + esc(c.name) + ' <span>| ' + esc(c.build || "") + (c.newItem ? " | new item needed" : "") + " | " + c.w + "x" + c.h + " at " + c.x + "," + c.y + "</span></div>";
    return '<div class="mk-comp' + (c.flat ? " flat" : "") + '" ' + target("comp:" + c.id, c.id + " " + c.name) + ' data-comp="' + esc(c.id) + '" style="left:' + c.x + "px;top:" + c.y + "px;width:" + c.w + "px;height:" + c.h + 'px">' + tag + inner + "</div>";
  }

  /* Controls: M.controls = { id: { label, value, options: [[value, label], ...] } }.
     A frame lists the controls it shows in f.controls. A component can also draw one inline with MockupEngine.ctl(id). */
  function ctl(id, small) {
    var c = (M.controls || {})[id]; if (!c) return "";
    return '<div class="mk-seg' + (small ? " sm" : "") + '" role="group" aria-label="' + esc(c.label) + '">' + c.options.map(function (o) {
      return '<button type="button" data-ctl="' + esc(id) + '" data-val="' + esc(o[0]) + '" aria-pressed="' + (String(STATE[id]) === String(o[0])) + '">' + esc(o[1]) + "</button>";
    }).join("") + "</div>";
  }
  function ctlBar(f) {
    var ids = f.controls || []; if (!ids.length) return "";
    return '<div class="mk-ctlbar">' + ids.map(function (id) { var c = M.controls[id]; return '<span class="mk-ctl"><span class="mk-ctl-label">' + esc(c.label) + "</span>" + ctl(id) + "</span>"; }).join("") + "</div>";
  }
  function compsOf(f) { return (typeof f.components === "function" ? f.components(STATE) : (f.components || [])); }
  function rerender() {
    renderFrames(); fit();
    var m = document.body.getAttribute("data-mk-mode");
    if (m === "native") addNativeButtons(); else if (m === "standalone") renderPins();
  }

  function renderFrames() {
    var host = $("#mk-frames"), out = "";
    (M.frames || []).forEach(function (f) {
      var stage = '<div class="mk-stagewrap"><div class="mk-sizer"><div class="mk-stage" data-w="' + f.w + '" data-h="' + f.h + '" style="width:' + f.w + "px;height:" + f.h + "px;background:" + (f.bg || "var(--mk-frame-bg)") + '">' + compsOf(f).map(renderComp).join("") + "</div></div></div>";
      var body = '<div class="mk-eyebrow">' + esc(f.eyebrow || "") + "</div><h2>" + esc(f.title || "") + "</h2>" + (f.note ? "<p>" + f.note + "</p>" : "") + ctlBar(f) + stage;
      out += '<div id="frame-' + esc(f.id) + '" class="' + (f.band ? "mk-band" : "") + '"><div class="mk-wrap wide mk-sec">' + body + "</div></div>";
    });
    host.innerHTML = out;
  }

  function renderExtras() {
    var out = "";
    (M.extras || []).forEach(function (x, i) {
      out += '<div class="' + (x.band ? "mk-band" : "") + '"><div class="mk-wrap mk-sec"><div class="mk-eyebrow">' + esc(x.eyebrow || "") + "</div><h2>" + esc(x.title || "") + "</h2>" + (x.html || "") + "</div></div>";
    });
    $("#mk-extras").innerHTML = out;
  }

  function renderDecisions() {
    var d = M.decisions || [];
    if (!d.length) { $("#mk-decisions-band").hidden = true; return; }
    if (M.decisionsTitle) $("#mk-decisions-title").textContent = M.decisionsTitle;
    $("#mk-decisions").innerHTML = d.map(function (h, i) { return "<li " + target("decision:" + (i + 1), "Decision " + (i + 1)) + ">" + h + "</li>"; }).join("");
  }

  function renderBuild() {
    var b = M.build;
    if (!b || !b.rows) { $("#mk-build-band").hidden = true; return; }
    if (b.title) $("#mk-build-title").textContent = b.title;
    $("#mk-build-intro").innerHTML = b.intro || "";
    var cols = b.cols || ["Element", "Built with", "Needs", "Watch out for"];
    $("#mk-build").innerHTML = "<table><tr>" + cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr>" + b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
  }

  function renderLegend() {
    var L = M.legend || [["Built-in visual or component", ""], ["Custom or certified add-on", "custom"], ["Needs a new measure or item", "measure"]];
    $("#mk-legend").innerHTML = L.map(function (l) { return '<span class="mk-chip ' + l[1] + '">' + esc(l[0]) + "</span>"; }).join("");
  }

  function renderHow(mode) {
    var how = mode === "native"
      ? "<h3>How to comment</h3><p>Open comment mode in the host bar, then click an element or select text. Or hover a component and press <b>Comment</b>. Plain comments are a queue and do not notify the agent. Press <b>Finish review</b> when you are done.</p>"
      : "<h3>How to comment</h3><p>Press <b>Comment mode</b> in the bar, click any element and type. Comments stay in this browser. Press <b>Finish review</b> to copy them as Markdown, paste them into your agent chat and say you are done.</p>";
    var cards = '<div class="mk-note">' + how + "</div>";
    (M.notes || []).forEach(function (n) { cards += '<div class="mk-note"><h3>' + esc(n.title) + "</h3>" + n.html + "</div>"; });
    $("#mk-how").innerHTML = cards;
  }

  function fit() {
    $$(".mk-stage").forEach(function (st) {
      var sz = st.parentNode, wr = sz.parentNode, w = +st.getAttribute("data-w"), h = +st.getAttribute("data-h");
      var sc = Math.min(1, Math.max(0.42, wr.clientWidth / w));
      st.style.transform = "scale(" + sc + ")";
      sz.style.width = (w * sc) + "px"; sz.style.height = (h * sc) + "px";
    });
  }

  function addNativeButtons() {
    $$("[data-comment-target]").forEach(function (el) {
      if (el.querySelector(":scope > .mk-cbtn")) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "mk-cbtn"; b.textContent = "Comment";
      b.setAttribute("aria-label", "Comment on " + (el.getAttribute("data-label") || "this element"));
      el.appendChild(b);
    });
  }

  /* ---------- native mode ---------- */
  function startNative(c) {
    document.body.classList.add("mk-native");
    addNativeButtons();
    /* a visible comment mode, so commenting does not depend on finding the hover button */
    var nb = $("#mk-mode"), nativeOn = false;
    nb.hidden = false; nb.textContent = "Add a comment: off"; nb.setAttribute("aria-pressed", "false");
    nb.addEventListener("click", function () {
      nativeOn = !nativeOn;
      document.body.classList.toggle("mk-commenting", nativeOn);
      nb.classList.toggle("on", nativeOn); nb.setAttribute("aria-pressed", String(nativeOn));
      nb.textContent = "Add a comment: " + (nativeOn ? "on, click an element" : "off");
    });
    document.addEventListener("click", function (e) {
      if (!nativeOn) return;
      if (e.target.closest(".mk-toolbar,#mk-pop,#mk-panel")) return;
      var t = e.target.closest("[data-comment-target]"); if (!t) return;
      e.preventDefault(); e.stopPropagation();
      c.openComposer({ element: t }).then(function (r) { if (r && r.opened === false) status("The comment box did not open. Click the page once, then try again."); })
        .catch(function () { status("Commenting is not available right now."); });
    }, true);
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".mk-cbtn"); if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var host = b.closest("[data-comment-target]"); if (!host) return;
      c.openComposer({ element: host }).catch(function () { status("Commenting is not available right now."); });
    });
    var sent = false, sending = false;
    $("#mk-finish").addEventListener("click", function () {
      if (sent || sending) { status("Already sent. The agent answers in a comment thread at this button, then publishes a new version. Reload this page when it says it is done."); return; }
      if (typeof c.sendToClaude !== "function" || typeof c.canSendToClaude !== "function") { status("Tell the agent in chat that you are done."); return; }
      sending = true;
      c.canSendToClaude().then(function (v) {
        if (v !== "available") { sending = false; status("Sending to the agent is not available here. Tell it in chat that you are done."); return; }
        return c.anchorFor($("#mk-finish")).then(function (a) {
          return c.sendToClaude({ anchor: a, text: "Review finished. Please read every comment thread on this page and update the mockup once." });
        }).then(function () {
          sent = true; sending = false;
          var b = $("#mk-finish"); b.textContent = "Review sent"; b.disabled = true;
          status("Sent once. The agent answers in a comment thread at this button, reads all comments, then publishes a new version of this page. Reload it later.");
        });
      }).catch(function (err) {
        sending = false;
        var code = err && err.code;
        status(code === "consent_required" ? "Allow comments from this page when asked, then press again." : code === "forbidden" ? "Commenting from the page is off here. Tell the agent in chat that you are done." : "Could not send. Tell the agent in chat that you are done.");
      });
    });
  }

  /* ---------- standalone mode ---------- */
  var KEY = "mockup-comments:" + TITLE, items = [], memoryOnly = false, commenting = false, pending = null;
  function load() { try { var r = localStorage.getItem(KEY); items = r ? JSON.parse(r) : []; } catch (e) { memoryOnly = true; items = []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { memoryOnly = true; } }

  function markdown() {
    var groups = {}, order = [];
    items.forEach(function (it, i) { if (!groups[it.label]) { groups[it.label] = []; order.push(it.label); } groups[it.label].push({ n: i + 1, it: it }); });
    var md = "# Review comments: " + TITLE + "\n\n" + items.length + " comment(s). Each heading names the element the comment is about.\n";
    order.forEach(function (l) {
      md += "\n## " + l + "\n";
      groups[l].forEach(function (g) { md += "- (" + g.n + ") " + g.it.text.replace(/\n+/g, " ") + "\n"; });
    });
    return md;
  }

  function renderPins() {
    $$(".mk-pin").forEach(function (p) { p.parentNode.removeChild(p); });
    items.forEach(function (it, i) {
      var el = document.querySelector('[data-uid="' + it.uid + '"]'); if (!el) return;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      var p = document.createElement("span");
      p.className = "mk-pin"; p.textContent = String(i + 1);
      p.style.left = (it.fx * 100) + "%"; p.style.top = (it.fy * 100) + "%";
      el.appendChild(p);
    });
  }

  function renderList() {
    var ul = $("#mk-list");
    ul.innerHTML = items.map(function (it, i) {
      return '<li><span class="n">' + (i + 1) + '</span><div><div class="t">' + esc(it.label) + "</div>" + esc(it.text) + '</div><button class="mk-btn" type="button" data-del="' + i + '" aria-label="Delete comment ' + (i + 1) + '">Delete</button></li>';
    }).join("");
    var n = items.length;
    $("#mk-copy").textContent = "Copy comments (" + n + ")";
    $("#mk-panel").hidden = n === 0 && !$("#mk-export").value;
  }

  function closePop() { $("#mk-pop").hidden = true; pending = null; }
  function openPop(el, e) {
    var r = el.getBoundingClientRect();
    pending = { uid: el.getAttribute("data-uid"), label: el.getAttribute("data-label") || el.getAttribute("data-uid"), fx: Math.min(1, Math.max(0, (e.clientX - r.left) / (r.width || 1))), fy: Math.min(1, Math.max(0, (e.clientY - r.top) / (r.height || 1))) };
    $("#mk-pop-who").textContent = "Comment on: " + pending.label;
    $("#mk-pop-text").value = "";
    var pop = $("#mk-pop"); pop.hidden = false;
    pop.style.left = Math.max(8, Math.min(e.clientX, window.innerWidth - 356)) + "px";
    pop.style.top = Math.max(8, Math.min(e.clientY + 12, window.innerHeight - 200)) + "px";
    $("#mk-pop-text").focus();
  }
  function savePop() {
    var text = $("#mk-pop-text").value.trim();
    if (!pending || !text) { closePop(); return; }
    items.push({ uid: pending.uid, label: pending.label, fx: pending.fx, fy: pending.fy, text: text, at: new Date().toISOString() });
    save(); closePop(); renderPins(); renderList();
    status(items.length + " comment(s)" + (memoryOnly ? " (not saved in this browser: copy them before you leave)" : "") + ".");
  }

  function exportText(show) {
    var md = markdown(), box = $("#mk-export");
    box.value = md; if (show) { box.hidden = false; $("#mk-panel").hidden = false; box.focus(); box.select(); }
    return md;
  }
  function copyAll() {
    var md = exportText(false);
    function fallback() { exportText(true); status("Select and copy the text in the box below."); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(function () { status("Copied " + items.length + " comment(s). Paste them into your agent chat."); }, fallback);
    } else { fallback(); }
  }

  function startStandalone() {
    ["#mk-mode", "#mk-copy", "#mk-dl", "#mk-clear"].forEach(function (s) { $(s).hidden = false; });
    load(); renderPins(); renderList();
    var modeBtn = $("#mk-mode");
    modeBtn.addEventListener("click", function () {
      commenting = !commenting;
      document.body.classList.toggle("mk-commenting", commenting);
      modeBtn.classList.toggle("on", commenting);
      modeBtn.setAttribute("aria-pressed", String(commenting));
      modeBtn.textContent = "Comment mode: " + (commenting ? "on" : "off");
      if (!commenting) closePop();
    });
    document.addEventListener("click", function (e) {
      if (!commenting) return;
      if (e.target.closest("#mk-pop,.mk-toolbar,#mk-panel")) return;
      var t = e.target.closest("[data-comment-target]"); if (!t) return;
      e.preventDefault(); e.stopPropagation(); openPop(t, e);
    }, true);
    $("#mk-pop-save").addEventListener("click", savePop);
    $("#mk-pop-cancel").addEventListener("click", closePop);
    $("#mk-pop-text").addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePop();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) savePop();
    });
    $("#mk-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-del]"); if (!b) return;
      items.splice(+b.getAttribute("data-del"), 1); save(); renderPins(); renderList();
    });
    $("#mk-copy").addEventListener("click", copyAll);
    $("#mk-dl").addEventListener("click", function () {
      try {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([markdown()], { type: "text/markdown" }));
        a.download = "review-comments.md"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
        status("Downloaded review-comments.md");
      } catch (e) { exportText(true); status("Download is not available here. Copy the text below."); }
    });
    var armed = false;
    $("#mk-clear").addEventListener("click", function () {
      var b = $("#mk-clear");
      if (!armed) { armed = true; b.textContent = "Click again to clear"; setTimeout(function () { armed = false; b.textContent = "Clear all"; }, 4000); return; }
      armed = false; b.textContent = "Clear all"; items = []; save(); renderPins(); renderList(); status("Cleared.");
    });
    $("#mk-finish").addEventListener("click", function () {
      if (!items.length) { status("No comments yet. Tell the agent you are done, or add comments first."); return; }
      copyAll(); exportText(true);
    });
  }

  /* ---------- start ---------- */
  function detect() {
    return new Promise(function (resolve) {
      var cl = window.claude;
      if (!cl || typeof cl.use !== "function") { resolve(null); return; }
      var done = false, t = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 3000);
      try {
        cl.use("comments").then(function (c) { if (done) return; done = true; clearTimeout(t); resolve(c && c.openComposer ? c : null); },
          function () { if (!done) { done = true; clearTimeout(t); resolve(null); } });
      } catch (e) { clearTimeout(t); resolve(null); }
    });
  }

  function init() {
    if (M.css) { var st = document.createElement("style"); st.textContent = M.css; document.head.appendChild(st); }
    (M.fontLinks || []).forEach(function (u) { var l = document.createElement("link"); l.rel = "stylesheet"; l.href = u; document.head.appendChild(l); });
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-ctl]"); if (!b) return;
      STATE[b.getAttribute("data-ctl")] = b.getAttribute("data-val"); rerender();
    });
    renderLegend(); renderFrames(); renderExtras(); renderDecisions(); renderBuild();
    var tg = $("#mk-tags");
    function tags() { document.body.classList.toggle("mk-show-tags", tg.checked); }
    tg.addEventListener("change", tags); tags();
    fit(); window.addEventListener("resize", fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(document.body);
    detect().then(function (c) {
      var mode = c ? "native" : "standalone";
      renderHow(mode);
      if (c) startNative(c); else startStandalone();
      document.body.setAttribute("data-mk-mode", mode);
      document.dispatchEvent(new CustomEvent("mockup-ready", { detail: { mode: mode } }));
    });
  }

  window.MockupEngine = { markdown: markdown, comments: function () { return items.slice(); }, ctl: ctl, state: STATE, rerender: rerender };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
