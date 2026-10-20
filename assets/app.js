// Set this to your repo URL to show a GitHub link in the top bar.
const REPO_URL = "https://github.com/bscript/startup-security-roadmap";

const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const laneById = Object.fromEntries(LANES.map(l => [l.id, l]));
const laneOrder = id => LANES.findIndex(l => l.id === id);
const PRI_LABEL = { must: "Must", should: "Should", could: "Could" };
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const narrow = window.matchMedia("(max-width: 960px)");

function load(key, fallback) { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

const state = {
  tab: "roadmap",
  layout: load("ssr.layout", "matrix"),
  pri: "all",
  q: "",
  lane: "all",
  size: load("ssr.size", -1),
  trig: new Set(load("ssr.trig", [])),
  hide: load("ssr.hide", false),
  done: new Set(load("ssr.done", [])),
  signs: new Set(load("ssr.signs", [])),
  toolType: "all",
  tq: "",
  open: null
};
const layout = () => narrow.matches ? "list" : state.layout;

/* ---------- Theme ---------- */
function applyTheme(t) {
  if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
  else document.documentElement.removeAttribute("data-theme");
  document.querySelectorAll("[data-theme-btn]").forEach(b => b.setAttribute("aria-pressed", b.dataset.themeBtn === t));
}
let theme = "light";
try { theme = localStorage.getItem("ssr.theme") || "light"; } catch (e) {}
applyTheme(theme);
document.querySelectorAll("[data-theme-btn]").forEach(b => b.addEventListener("click", () => {
  theme = b.dataset.themeBtn;
  try { localStorage.setItem("ssr.theme", theme); } catch (e) {}
  applyTheme(theme);
}));

// Keep the sticky table header just under the top bar
function syncTopbar() { document.documentElement.style.setProperty("--topbar-h", document.querySelector(".topbar").offsetHeight + "px"); }
window.addEventListener("resize", syncTopbar);

/* ---------- Filters ---------- */
function fits(it) {
  if (state.size !== -1 && it.size > state.size) return false;
  if (state.trig.size && it.tags.length && !it.tags.some(t => state.trig.has(t))) return false;
  return true;
}
function matches(it) {
  if (!fits(it)) return false;
  if (state.lane !== "all" && it.lane !== state.lane) return false;
  if (state.pri !== "all" && it.pri !== state.pri) return false;
  if (state.q) {
    const hay = [it.id, it.title, it.why, it.steps.join(" "), it.out.join(" "), it.tools.join(" "), it.soc, it.iso, laneById[it.lane].name].join(" ").toLowerCase();
    if (!hay.includes(state.q)) return false;
  }
  return true;
}
// Reading order: phase, then domain. Used by the list view, export and prev/next.
const byReading = (a, b) => a.phase - b.phase || laneOrder(a.lane) - laneOrder(b.lane);
const ordered = () => ITEMS.filter(matches).sort(byReading);

function renderFilters() {
  $("sizeSel").innerHTML = SIZES.map(z => `<option value="${z.id}" ${state.size === z.id ? "selected" : ""}>${z.id === -1 ? "Any size" : z.label + " people"}</option>`).join("");
  $("laneSel").innerHTML = `<option value="all">All domains</option>` + LANES.map(l => `<option value="${l.id}" ${state.lane === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("");
  $("trigChips").innerHTML = TRIGGERS.map(t => `<button class="chip" data-trig="${t.id}" aria-pressed="${state.trig.has(t.id)}">${esc(t.label)}</button>`).join("");
  $("hideOther").checked = state.hide;
}

function renderSummary() {
  const n = ITEMS.filter(matches).length;
  const musts = ITEMS.filter(i => matches(i) && i.pri === "must").length;
  const filtered = state.size !== -1 || state.trig.size || state.lane !== "all" || state.pri !== "all" || state.q;
  $("profileSum").innerHTML = filtered
    ? `<b>${n}</b> of ${ITEMS.length} items match, <b>${musts}</b> of them Must.<button class="link-btn" id="clearFilters" style="margin-left:8px">Clear filters</button>`
    : `Showing all <b>${ITEMS.length}</b> items. Set your size and what's driving the work to see only what applies.`;
}

/* ---------- Roadmap ---------- */
function itemBtn(it, showLane) {
  const done = state.done.has(it.id);
  const cls = ["item", done && "done", !matches(it) && "dim", state.open === it.id && "active"].filter(Boolean).join(" ");
  return `<button class="${cls}" data-id="${it.id}">
    <i class="sq ${it.pri}" aria-hidden="true"></i>
    <span class="t"><span class="title">${esc(it.title)}</span>
      <span class="meta">${it.id} · ${it.eff}${showLane ? " · " + esc(laneById[it.lane].name) : ""}</span>
    </span>
    ${done ? '<span class="tick" aria-label="done">✓</span>' : ""}
  </button>`;
}

function renderWeek() {
  const days = [...new Set(FIRST_WEEK.map(w => w.day))];
  let n = 0;
  $("weekDays").innerHTML = days.map(d => `<div class="wday"><h4>${d}</h4>${FIRST_WEEK.filter(w => w.day === d).map(w => {
    n++;
    return `<div class="wjob ${state.done.has(w.id) ? "done" : ""}"><span class="n">${String(n).padStart(2, "0")}</span><span class="wt">${esc(w.t)}</span><button class="link-btn" data-id="${w.id}">${w.id}</button></div>`;
  }).join("")}</div>`).join("");
}

function renderMatrix() {
  let h = `<div class="mx-h" style="border-right:1px solid var(--rule)"><span class="when">Domain</span><span class="what">Where</span><span class="goal">${ITEMS.filter(matches).length} of ${ITEMS.length} shown</span></div>`;
  PHASES.forEach(p => { h += `<div class="mx-h"><span class="when">${p.when}</span><span class="what">${esc(p.what)}</span><span class="goal">${esc(p.goal)}</span></div>`; });
  LANES.forEach(l => {
    if (state.lane !== "all" && state.lane !== l.id) return;
    const all = ITEMS.filter(i => i.lane === l.id);
    const shown = state.hide ? all.filter(matches) : all;
    if (state.hide && !shown.length) return;
    const d = all.filter(i => state.done.has(i.id)).length;
    h += `<div class="mx-lane"><span class="c">${l.code}</span><span class="n">${esc(l.name)}</span><span class="d">${d}/${all.length} done</span></div>`;
    PHASES.forEach(p => { h += `<div class="mx-cell">${shown.filter(i => i.phase === p.id).map(i => itemBtn(i, false)).join("")}</div>`; });
  });
  $("matrix").innerHTML = h;
}

function renderList() {
  $("listWrap").innerHTML = PHASES.map(p => {
    const its = ordered().filter(i => i.phase === p.id);
    return `<section class="phase"><div><span class="when">${p.when}</span><h3>${esc(p.what)}</h3><p class="goal">${esc(p.goal)}</p></div>
      ${its.length ? `<div class="phase-items">${its.map(i => itemBtn(i, true)).join("")}</div>` : `<p class="empty">Nothing matches your filters in this phase.</p>`}</section>`;
  }).join("");
}

function renderRoadmap() {
  renderWeek();
  renderSummary();
  const ly = layout();
  $("lyMatrix").setAttribute("aria-pressed", ly === "matrix");
  $("lyList").setAttribute("aria-pressed", ly === "list");
  $("matrixWrap").hidden = ly !== "matrix";
  $("listWrap").hidden = ly !== "list";
  if (ly === "matrix") renderMatrix(); else renderList();
}

/* ---------- Maturity ---------- */
function laneTier(lid) {
  const musts = ITEMS.filter(i => i.lane === lid && i.pri === "must");
  let t = 1;
  for (const ph of TIER_PHASES) {
    if (musts.filter(i => ph.includes(i.phase)).every(i => state.done.has(i.id))) t++; else break;
  }
  const next = t < 4 ? musts.filter(i => TIER_PHASES[t - 1].includes(i.phase) && !state.done.has(i.id)) : [];
  return { t, next };
}

function renderMaturity() {
  const rows = LANES.map(l => ({ l, ...laneTier(l.id) }));
  const low = Math.min(...rows.map(r => r.t));
  const weakest = rows.filter(r => r.t === low).map(r => r.l.name);
  let h = `<div class="mat-summary">
    <div><span class="label">Program tier</span><div class="big">Tier ${low} · ${TIERS[low - 1].n}</div>
      <p>${low < 4 ? `Held back by: ${esc(weakest.join(", "))}.` : "Every domain is at the top tier. Keep it running."}</p></div>
    <dl class="tier-key">${TIERS.map((t, i) => `<dt>Tier ${i + 1}</dt><dd><b>${t.n}.</b> ${esc(t.d)}</dd>`).join("")}</dl>
  </div>`;
  h += `<div class="mat-table">${rows.map(({ l, t, next }) => `
    <div class="mat-row">
      <div><span class="c">${l.code}</span><span class="n">${esc(l.name)}</span></div>
      <div><span class="mono" style="font-size:12px;color:var(--muted)">Tier ${t} of 4</span><div class="pips" aria-hidden="true">${[1, 2, 3, 4].map(n => `<span class="${n <= t ? "on" : ""}"></span>`).join("")}</div></div>
      <div class="tier">${TIERS[t - 1].n}</div>
      <div class="next">${next.length ? `To reach tier ${t + 1}: ${next.map(d => `<button class="link-btn" data-id="${d.id}">${d.id} ${esc(d.title)}</button>`).join(", ")}` : "Keep the ongoing work running."}</div>
    </div>`).join("")}</div>`;
  h += `<div class="section-head"><div><span class="kicker">Beyond the checklist</span><h2>Signs the program is mature</h2></div><p>Ticking items is not the same as maturity. Be honest with these.</p></div>
    <div class="signs">${SIGNS.map(s => `<label for="sign-${s.id}"><input type="checkbox" id="sign-${s.id}" data-sign="${s.id}" ${state.signs.has(s.id) ? "checked" : ""}><span>${esc(s.t)}<small>${esc(s.s)}</small></span></label>`).join("")}</div>`;
  $("matrixMat").innerHTML = h;
}

/* ---------- Tools ---------- */
function toolMatches(t) {
  if (state.toolType !== "all" && t.type !== state.toolType) return false;
  if (state.tq) {
    const hay = [t.name, t.what, TOOL_CATEGORIES.find(c => c.id === t.cat).name, TOOL_TYPES[t.type]].join(" ").toLowerCase();
    if (!hay.includes(state.tq)) return false;
  }
  return true;
}

function renderTypeSeg() {
  const opts = [["all", "All"], ...Object.entries(TOOL_TYPES)];
  $("typeSeg").innerHTML = opts.map(([k, v]) => `<button data-ttype="${k}" aria-pressed="${state.toolType === k}">${v}</button>`).join("");
}

function renderTools() {
  const groups = TOOL_CATEGORIES.map(c => ({ c, tools: TOOLS.filter(t => t.cat === c.id && toolMatches(t)) })).filter(g => g.tools.length);
  $("catNav").innerHTML = groups.map(g => `<a href="#tools" data-cat="${g.c.id}">${esc(g.c.name)}<span>${g.tools.length}</span></a>`).join("");
  $("toolList").innerHTML = groups.length ? groups.map(g => `
    <section class="tool-cat" id="cat-${g.c.id}">
      <h3>${esc(g.c.name)}</h3><p>${esc(g.c.note)}</p>
      <div class="tool-list">${g.tools.map(t => `
        <div class="tool">
          <div class="name"><a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.name)}</a></div>
          <span class="ttype ${t.type}">${TOOL_TYPES[t.type]}</span>
          <div class="what">${esc(t.what)}</div>
          <div class="lanes">${t.lanes.map(l => laneById[l].code).join(" ")}</div>
        </div>`).join("")}</div>
    </section>`).join("") : `<p class="empty">No tools match.</p>`;
}

/* ---------- Export ---------- */
const SIZE_LABEL = { 0: "Any size", 1: "20+ people", 2: "100+ people" };
const trigLabel = id => (TRIGGERS.find(t => t.id === id) || {}).label || id;
function itemMarkdown(it, level) {
  const h = "#".repeat(level);
  return [`${h} ${it.id} ${it.title}`, "", `**When:** ${PHASES[it.phase].when} · **Priority:** ${PRI_LABEL[it.pri]} · **Effort:** ${EFFORT[it.eff]}`, "", it.why, "",
    "**Steps**", ...it.steps.map(x => `- [ ] ${x}`), "", "**Deliverables**", ...it.out.map(x => `- ${x}`), "",
    `**Tools:** ${it.tools.join(", ")}`, `**Controls:** SOC 2 ${it.soc} · ISO 27001 ${it.iso}`,
    it.deps.length ? `**Depends on:** ${it.deps.join(", ")}` : ""].filter((x, i, a) => !(x === "" && a[i - 1] === "")).join("\n");
}
function csvCell(v) { return `"${String(v).replace(/"/g, '""')}"`; }
function buildCsv() {
  const pri = { must: "High", should: "Medium", could: "Low" };
  const est = { S: 1, M: 3, L: 5 };
  const rows = [["Title", "Description", "Priority", "Labels", "Estimate", "Phase"]];
  ordered().forEach(it => rows.push([`[${it.id}] ${it.title}`, itemMarkdown(it, 3).split("\n").slice(2).join("\n"), pri[it.pri], ["Security", laneById[it.lane].name].join(","), est[it.eff], PHASES[it.phase].when]));
  return rows.map(r => r.map(csvCell).join(",")).join("\r\n");
}
function buildMarkdown() {
  const items = ordered();
  let md = `# Security roadmap\n\n${items.length} items. Source: ${REPO_URL || "Startup Security Roadmap"}\n`;
  PHASES.forEach(p => {
    const its = items.filter(i => i.phase === p.id);
    if (!its.length) return;
    md += `\n## ${p.when}: ${p.what}\n\n` + its.map(i => itemMarkdown(i, 3)).join("\n\n") + "\n";
  });
  return md;
}
function note(msg) { $("exportNote").textContent = msg; clearTimeout(note.t); note.t = setTimeout(() => $("exportNote").textContent = "", 4000); }
$("csvBtn").addEventListener("click", () => {
  const blob = new Blob([buildCsv()], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "security-roadmap.csv";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  note(`${ordered().length} items. Import into Linear or Jira and map the columns.`);
});
$("mdBtn").addEventListener("click", () => {
  const md = buildMarkdown();
  navigator.clipboard.writeText(md).then(() => note(`Copied ${ordered().length} items.`)).catch(() => {
    const ta = document.createElement("textarea"); ta.value = md; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); note(`Copied ${ordered().length} items.`); } catch (e) { note("Couldn't copy. Your browser blocked the clipboard."); }
    ta.remove();
  });
});

/* ---------- Drawer ---------- */
const toolIndex = TOOLS.map(t => ({ key: t.name.toLowerCase(), t }));
function toolLink(name) {
  const k = name.toLowerCase();
  const hit = toolIndex.find(x => x.key === k) || toolIndex.find(x => k.startsWith(x.key + " ") || x.key.startsWith(k + " "));
  return hit ? `<a href="${esc(hit.t.url)}" target="_blank" rel="noopener">${esc(name)}</a>` : `<span>${esc(name)}</span>`;
}

// Prev / next walks the items that match the filters, in reading order.
function sequence() { const s = ordered(); return s.length ? s : ITEMS.slice().sort(byReading); }

let lastFocus = null;
function openItem(id) {
  const it = byId[id]; if (!it) return;
  const ph = PHASES[it.phase], ln = laneById[it.lane];
  const needs = it.deps.map(d => byId[d]).filter(Boolean);
  const unlocks = ITEMS.filter(x => x.deps.includes(it.id));
  const depList = list => list.map(d => `<li><button class="link-btn" data-id="${d.id}">${d.id} ${esc(d.title)}</button></li>`).join("");
  const seq = sequence(), pos = seq.findIndex(x => x.id === id);
  const prev = pos > 0 ? seq[pos - 1] : null;
  const next = pos > -1 && pos < seq.length - 1 ? seq[pos + 1] : null;
  $("drawer").innerHTML = `
    <button class="close" id="dClose" aria-label="Close">×</button>
    <div><div class="crumb">${it.id} · ${ln.code} ${esc(ln.name)}</div><h2 id="dTitle">${esc(it.title)}</h2></div>
    <div class="facts"><div><span>When</span>${ph.when}</div><div><span>Priority</span>${PRI_LABEL[it.pri]}</div><div><span>Effort</span>${EFFORT[it.eff]}</div></div>
    <p class="why">${esc(it.why)}</p>
    <p class="fit-line"><b>Matters from:</b> ${SIZE_LABEL[it.size]}${it.tags.length ? ` · <b>Most relevant if:</b> ${it.tags.map(trigLabel).map(esc).join(", ")}` : " · <b>Applies to:</b> every startup"}</p>
    <section><h4>Steps</h4><ol>${it.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></section>
    <section><h4>What you hand over</h4><ul>${it.out.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>
    <section><h4>Tools to look at</h4><div class="tool-links">${it.tools.map(toolLink).join("")}</div></section>
    <section><h4>Controls covered</h4><dl class="ctrl"><dt>SOC 2</dt><dd>${esc(it.soc)}</dd><dt>ISO 27001</dt><dd>${esc(it.iso)}</dd></dl></section>
    ${needs.length ? `<section><h4>Do these first</h4><ul>${depList(needs)}</ul></section>` : ""}
    ${unlocks.length ? `<section><h4>This unlocks</h4><ul>${depList(unlocks)}</ul></section>` : ""}
    <label class="done-row" for="dDone"><input type="checkbox" id="dDone" ${state.done.has(it.id) ? "checked" : ""}> Mark as done</label>
    <nav class="d-nav" aria-label="Browse items">
      ${prev ? `<button class="link-btn" data-id="${prev.id}">← ${esc(prev.title)}</button>` : "<span></span>"}
      ${pos > -1 ? `<span class="pos">${pos + 1} / ${seq.length}</span>` : ""}
      ${next ? `<button class="link-btn" data-id="${next.id}">${esc(next.title)} →</button>` : "<span></span>"}
    </nav>
    <p class="d-hint">Use ← and → to move between items, Esc to close.</p>`;
  if ($("drawer").hidden) lastFocus = document.activeElement;
  state.open = id;
  $("drawer").hidden = false; $("scrim").hidden = false; $("drawer").scrollTop = 0;
  $("dClose").focus();
  $("dDone").addEventListener("change", e => {
    if (e.target.checked) state.done.add(it.id); else state.done.delete(it.id);
    save("ssr.done", [...state.done]); render();
  });
  render();
}
function closeDrawer() {
  $("drawer").hidden = true; $("scrim").hidden = true; state.open = null; render();
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

/* ---------- Shell ---------- */
function renderProgress() {
  const n = ITEMS.length, d = ITEMS.filter(i => state.done.has(i.id)).length;
  $("pmText").textContent = `${d} / ${n} done`;
  $("pmBar").style.width = (d / n * 100) + "%";
  $("stats").innerHTML = `<span><b>${ITEMS.length}</b> pieces of work</span><span><b>${LANES.length}</b> domains</span><span><b>${PHASES.length}</b> phases</span><span><b>${TOOLS.length}</b> tools</span><span><b>${d}</b> done by you</span>`;
}

function render() {
  document.querySelectorAll("[data-view]").forEach(v => v.hidden = v.dataset.view !== state.tab);
  document.querySelectorAll("[data-tab]").forEach(a => { if (a.dataset.tab === state.tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  if (state.tab === "roadmap") renderRoadmap();
  else if (state.tab === "maturity") renderMaturity();
  else renderTools();
  renderProgress();
}

function route() {
  const h = location.hash.replace("#", "");
  if (["roadmap", "maturity", "tools"].includes(h)) state.tab = h;
  else if (byId[h]) { state.tab = "roadmap"; render(); openItem(h); return; }
  render();
}

document.addEventListener("click", e => {
  const item = e.target.closest("[data-id]");
  if (item) { openItem(item.dataset.id); return; }
  if (e.target.closest("#dClose") || e.target === $("scrim")) { closeDrawer(); return; }
  const tg = e.target.closest("[data-trig]");
  if (tg) {
    const t = tg.dataset.trig;
    if (state.trig.has(t)) state.trig.delete(t); else state.trig.add(t);
    save("ssr.trig", [...state.trig]); tg.setAttribute("aria-pressed", state.trig.has(t)); render(); return;
  }
  if (e.target.closest("#clearFilters")) {
    Object.assign(state, { size: -1, lane: "all", pri: "all", q: "" }); state.trig.clear();
    save("ssr.size", -1); save("ssr.trig", []); $("q").value = "";
    document.querySelectorAll("[data-pri]").forEach(b => b.setAttribute("aria-pressed", b.dataset.pri === "all"));
    renderFilters(); render(); return;
  }
  const pri = e.target.closest("[data-pri]");
  if (pri) { state.pri = pri.dataset.pri; document.querySelectorAll("[data-pri]").forEach(b => b.setAttribute("aria-pressed", b === pri)); render(); return; }
  const tt = e.target.closest("[data-ttype]");
  if (tt) { state.toolType = tt.dataset.ttype; renderTypeSeg(); render(); return; }
  const cat = e.target.closest("[data-cat]");
  if (cat) { e.preventDefault(); const el = $("cat-" + cat.dataset.cat); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
});
document.addEventListener("change", e => {
  const s = e.target.closest("[data-sign]"); if (!s) return;
  if (s.checked) state.signs.add(s.dataset.sign); else state.signs.delete(s.dataset.sign);
  save("ssr.signs", [...state.signs]);
});
document.addEventListener("keydown", e => {
  if ($("drawer").hidden) return;
  if (e.key === "Escape") { closeDrawer(); return; }
  if (e.target.matches("input, select, textarea")) return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    const seq = sequence(), pos = seq.findIndex(x => x.id === state.open);
    const n = seq[pos + (e.key === "ArrowRight" ? 1 : -1)];
    if (pos > -1 && n) { e.preventDefault(); openItem(n.id); }
  }
});
$("sizeSel").addEventListener("change", e => { state.size = Number(e.target.value); save("ssr.size", state.size); render(); });
$("laneSel").addEventListener("change", e => { state.lane = e.target.value; render(); });
$("hideOther").addEventListener("change", e => { state.hide = e.target.checked; save("ssr.hide", state.hide); render(); });
$("lyMatrix").addEventListener("click", () => { state.layout = "matrix"; save("ssr.layout", "matrix"); render(); });
$("lyList").addEventListener("click", () => { state.layout = "list"; save("ssr.layout", "list"); render(); });
$("q").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); render(); });
$("tq").addEventListener("input", e => { state.tq = e.target.value.trim().toLowerCase(); render(); });
$("week").addEventListener("toggle", e => save("ssr.weekOpen", e.target.open));
narrow.addEventListener("change", render);
window.addEventListener("hashchange", route);

let resetArmed = false;
$("resetBtn").addEventListener("click", () => {
  if (!resetArmed) {
    resetArmed = true; $("resetBtn").textContent = "Click again to clear"; $("resetBtn").classList.add("confirm");
    setTimeout(() => { resetArmed = false; $("resetBtn").textContent = "Clear my ticks"; $("resetBtn").classList.remove("confirm"); }, 4000);
    return;
  }
  state.done.clear(); state.signs.clear(); save("ssr.done", []); save("ssr.signs", []);
  resetArmed = false; $("resetBtn").textContent = "Cleared"; $("resetBtn").classList.remove("confirm"); render();
});

if (REPO_URL) { $("ghLink").href = REPO_URL; $("ghLink").hidden = false; }
if (load("ssr.weekOpen", true) === false) $("week").open = false;
syncTopbar(); renderFilters(); renderTypeSeg(); route();
