/* Example content for the toolkit-mockup skill.
   Everything here is invented: the company "Fjordly Outdoor", its regions, products and numbers.
   Build with:  python skills/toolkit-mockup/scripts/build.py examples/fjordly-sales/content.js examples/fjordly-sales/index.html */
window.MOCKUP = (function () {
  /* ---- invented data (deterministic) ---- */
  var seed = 7;
  function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
  var DAYS = [], d0 = Date.UTC(2026, 2, 1);
  for (var i = 0; i < 60; i++) {
    var dow = new Date(d0 + i * 864e5).getUTCDay(), wk = (dow === 0 || dow === 6);
    var base = i < 30 ? 46000 : 48600;
    DAYS.push(Math.round(base * (wk ? 0.62 : 1.08) * (0.94 + rnd() * 0.12)));
  }
  var PREV = DAYS.slice(0, 30), CUR = DAYS.slice(30);
  function avg(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
  var curAvg = avg(CUR), prevAvg = avg(PREV), chg = curAvg - prevAvg, pct = chg / prevAvg * 100;
  function k(n) { return Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + "K" : String(Math.round(n)); }
  function sp(p) { return (p > 0 ? "+" : "") + p.toFixed(1) + "%"; }

  var REGIONS = [
    { n: "Coastal", v: 15200, p: 6.4, s: "on" }, { n: "North Fjord", v: 11800, p: 3.1, s: "on" },
    { n: "City Centre", v: 9900, p: -4.8, s: "watch" }, { n: "Highlands", v: 6700, p: -11.2, s: "off" },
    { n: "Inland Plains", v: 5000, p: 0.4, s: "on" }];
  var PRODUCTS = [
    { n: "Trail Pack 30L", v: 7400, p: 9.1, s: "on" }, { n: "Summit Jacket", v: 6900, p: -6.3, s: "watch" },
    { n: "Camp Stove Mini", v: 5100, p: 1.2, s: "on" }, { n: "Merino Base Layer", v: 4700, p: -14.9, s: "off" },
    { n: "Trekking Poles", v: 3300, p: 2.0, s: "on" }];

  /* ---- small renderers ---- */
  var ST = { on: ["On track", "✓", "#0F6E6E", "#fff"], watch: ["Watch", "!", "#E0A526", "#1B2733"], off: ["Off track", "!", "#C2410C", "#fff"] };
  function chip(s) {
    var c = ST[s];
    return '<span style="display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px 0 5px;border:2px solid ' + c[2] + ';border-radius:999px;background:#fff;font-weight:600;font-size:15px;white-space:nowrap"><i style="width:20px;height:20px;border-radius:50%;background:' + c[2] + ';color:' + c[3] + ';display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:13px;font-weight:700">' + c[1] + "</i>" + c[0] + "</span>";
  }
  function spark(w, h, st) {
    var CURV = (st && st.trend === "14") ? CUR.slice(-14) : CUR;
    var lo = 25000, hi = 62000, L = 8, R = 70, T = 10, B = 24, n = CURV.length;
    function X(i) { return L + (w - L - R) * i / (n - 1); }
    function Y(v) { return T + (h - T - B) * (1 - (v - lo) / (hi - lo)); }
    var path = CURV.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" ");
    var ma = CURV.map(function (v, i) { var a = CURV.slice(Math.max(0, i - 6), i + 1); return avg(a); });
    var mp = ma.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" ");
    var ry = Y(prevAvg);
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Daily sales for 30 days with a 7-day average and the previous period average">'
      + '<line x1="' + L + '" x2="' + (w - R) + '" y1="' + ry + '" y2="' + ry + '" stroke="#1B2733" stroke-width="2" stroke-dasharray="6 5"/>'
      + '<text x="' + (w - R + 6) + '" y="' + (ry + 5) + '" font-size="14" fill="#1B2733">Prev ' + k(prevAvg) + "</text>"
      + '<path d="' + path + '" fill="none" stroke="#9CC7C5" stroke-width="2"/><path d="' + mp + '" fill="none" stroke="#0F6E6E" stroke-width="4" stroke-linecap="round"/>'
      + '<circle cx="' + X(n - 1) + '" cy="' + Y(ma[n - 1]) + '" r="6" fill="#fff" stroke="#1B2733" stroke-width="3"/>'
      + '<text x="' + (X(n - 1) + 12) + '" y="' + (Y(ma[n - 1]) + 5) + '" font-size="14" font-weight="600" fill="#1B2733">' + k(ma[n - 1]) + "</text>"
      + '<text x="' + L + '" y="' + (h - 4) + '" font-size="14" fill="#3F5163">30 days ago</text><text x="' + (w - R) + '" y="' + (h - 4) + '" font-size="14" fill="#3F5163" text-anchor="end">Today</text></svg>';
  }
  function bars(rows, w, rh) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; })), out = '<table style="width:100%;border-collapse:collapse;font-size:15px">';
    rows.forEach(function (r) {
      out += '<tr style="height:' + rh + 'px"><td style="border:0;padding:0 8px 0 0;font-weight:600;white-space:nowrap">' + r.n + '</td><td style="border:0;padding:0 8px 0 0;width:' + Math.round(w * 0.3) + 'px"><span style="display:block;height:14px;border-radius:999px;background:#0F6E6E;width:' + Math.round(100 * r.v / max) + '%"></span></td><td style="border:0;padding:0 8px 0 0;text-align:right;white-space:nowrap">' + k(r.v) + '</td><td style="border:0;padding:0 8px 0 0;text-align:right;white-space:nowrap">' + (r.p > 0 ? "▲" : "▼") + " " + sp(r.p) + "</td><td style=\"border:0;padding:0\">" + chip(r.s) + "</td></tr>";
    });
    return out + "</table>";
  }
  function vt(t, s) { return '<div style="font:500 20px/1.15 var(--mk-head)">' + t + '</div><div style="font-size:14px;color:#3F5163;margin:2px 0 8px">' + s + "</div>"; }
  var kpiNumber = '<div style="font:500 52px/1 var(--mk-head);letter-spacing:-.02em">' + k(curAvg) + '<small style="font:500 18px var(--mk-body);margin-left:6px;color:#3F5163">sales per day</small></div>';
  var kpiGap = '<div style="font-weight:600;font-size:16px;margin-top:6px">' + (chg > 0 ? "▲" : "▼") + " " + k(Math.abs(chg)) + " (" + sp(pct) + ') <span style="font-weight:400;color:#3F5163">against ' + k(prevAvg) + " in the previous 30 days</span></div>";
  var status = pct > 2 ? "on" : pct < -2 ? "off" : "watch";

  function header() {
    return { id: "H1", name: "Page title", build: "Card with a dynamic title", newItem: true, x: 24, y: 20, w: 760, h: 64, flat: true,
      html: '<div style="font:500 30px/1.05 var(--mk-head)">Sales are up ' + pct.toFixed(1) + '% per day</div><div style="font-size:15px;color:#3F5163;margin-top:6px">Fjordly Outdoor. Last 30 days against the 30 days before</div>' };
  }

  return {
    title: "Sales Overview Mockups",
    eyebrow: "Example for the toolkit-mockup skill",
    intro: "<p>A fictional retailer, <b>Fjordly Outdoor</b>, with invented numbers. This page shows what the skill produces: layout variants at true pixel size, a label on every element that says what builds it, a list of decisions, a build list, and a way to comment on any part and hand the comments back to your agent.</p>",
    notes: [
      { title: "What is invented", html: "<p>The company, regions, products and every number. The numbers come from a small seeded generator, so they are the same on every build. In a real project this is where you put real values read from the data source.</p>" },
      { title: "Try this", html: "<p>Press <b>Comment mode</b>, click a component and write a comment. Toggle <b>Show build labels</b> to see each element's size and position. Then press <b>Finish review</b>.</p>" }
    ],
    controls: { trend: { label: "Trend window", value: "30", options: [["30", "30 days"], ["14", "14 days"]] } },
    decisionsTitle: "Three things the reviewer decides",
    decisions: [
      "<b>Layout.</b> A keeps the KPI on top left and puts regions beside it. B gives the trend the full width. Which reads faster?",
      "<b>Status colours.</b> Teal, amber and orange with a symbol and a word. Each status also has a word, so colour is never the only signal. Keep, or change the colours?",
      "<b>Trend window.</b> 30 days with a 7-day average. Would 90 days be more useful for this audience?"
    ],
    frames: [
      { id: "A", eyebrow: "Variant A", title: "KPI top left, regions beside it", controls: ["trend"], note: "The reader sees the answer first, then where it comes from, then the detail.", w: 1280, h: 720, bg: "#E9EEF2",
        components: [
          header(),
          { id: "A1", name: "KPI card", build: "Card (new) + line chart", x: 24, y: 100, w: 520, h: 300, html: function (c) { return '<div style="font:500 20px/1.15 var(--mk-head)">Sales per day</div><div style="font-size:14px;color:#3F5163">Last 30 days</div><div style="margin-top:10px">' + kpiNumber + kpiGap + '</div><div style="margin-top:10px">' + chip(status) + '</div>'; } },
          { id: "A2", name: "Regions", build: "Table with data bars", x: 568, y: 100, w: 688, h: 300, html: function () { return vt("Where it comes from", "Sales per day by region, change against the previous 30 days") + bars(REGIONS, 640, 40); } },
          { id: "A3", name: "30-day trend", build: "Line chart with constant line", newItem: true, x: 24, y: 424, w: 640, h: 276, html: function (c, s) { return vt("Daily sales", "Pale line: daily. Dark line: 7-day average. Dashed: previous period average") + spark(604, 190, s); } },
          { id: "A4", name: "Top products", build: "Table with data bars", x: 688, y: 424, w: 568, h: 276, html: function () { return vt("Top products", "Sales per day, change against the previous 30 days") + bars(PRODUCTS, 520, 36); } }
        ] },
      { id: "B", eyebrow: "Variant B", title: "Wide trend band, detail below", controls: ["trend"], note: "The trend is the hero. Regions and products sit side by side underneath.", w: 1280, h: 720, bg: "#E9EEF2",
        components: [
          header(),
          { id: "B1", name: "KPI and trend band", build: "Card (new) + line chart", newItem: true, x: 24, y: 100, w: 1232, h: 280, html: function (c, s) { return '<div style="display:flex;gap:28px;height:100%"><div style="width:400px">' + '<div style="font:500 20px/1.15 var(--mk-head)">Sales per day</div><div style="font-size:14px;color:#3F5163">Last 30 days</div><div style="margin-top:14px">' + kpiNumber + kpiGap + '</div><div style="margin-top:12px">' + chip(status) + '</div></div><div style="flex:1;border-left:2px solid #D5DCE3;padding-left:24px">' + vt("Daily sales", "7-day average against the previous period") + spark(760, 190, s) + "</div></div>"; } },
          { id: "B2", name: "Regions", build: "Table with data bars", x: 24, y: 404, w: 604, h: 296, html: function () { return vt("Regions", "Sales per day and change") + bars(REGIONS, 560, 40); } },
          { id: "B3", name: "Top products", build: "Table with data bars", x: 652, y: 404, w: 604, h: 296, html: function () { return vt("Top products", "Sales per day and change") + bars(PRODUCTS, 560, 40); } }
        ] },
      { id: "T", eyebrow: "Tooltip page", title: "What appears when you point at a status", note: "Small frames work too. This one is a tooltip page.", w: 520, h: 320, bg: "#E9EEF2",
        components: [
          { id: "T1", name: "Status tooltip", build: "Report page tooltip", x: 20, y: 28, w: 480, h: 270, html: function () { return "<div>" + chip("off") + '<span style="margin-left:10px;font-weight:600">Highlands</span></div><p style="font-size:14px;margin:12px 0 10px">Sales per day fell 11.2% against the previous 30 days. Footfall data is not yet in this model, so the reason is not shown.</p><table style="font-size:14px"><tr><th></th><th>Last 30 days</th><th>Previous 30</th></tr><tr><td>Sales per day</td><td>' + k(6700) + "</td><td>" + k(6700 / 0.888) + "</td></tr><tr><td>Days with data</td><td>30</td><td>30</td></tr></table>"; } }
        ] }
    ],
    build: {
      intro: "Each row names the visual, what it still needs and what to watch out for. Anything under \"Needs\" that is a new measure or item is a change to the model, so it needs approval first.",
      rows: [
        ["Page title", "Card with a dynamic title", "New measure: a title text", "Keep it short so it stays on one line"],
        ["KPI card", "New card visual with reference labels", "Existing sales-per-day measure", "A built-in KPI visual cannot show a status word or reason"],
        ["30-day trend", "Line chart with a constant line", "New measure: 7-day average", "Show missing days as gaps, not zero"],
        ["Regions and products", "Table with data bars", "Existing measures", "Rank by the measure that answers the question, not by name"],
        ["Status tooltip", "Report page tooltip", "New measure: status text", "A tooltip page needs a fixed size"]
      ]
    }
  };
})();
