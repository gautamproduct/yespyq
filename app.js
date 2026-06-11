// YESPYQ — app logic + Duolingo-style gamification (vanilla JS, no build step)

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- drop unwanted years (per product decision) ---------- */
const DROP_YEARS = new Set([2021, 2022]);
for (let i = QUESTIONS.length - 1; i >= 0; i--)
  if (DROP_YEARS.has(QUESTIONS[i].year)) QUESTIONS.splice(i, 1);

const subjectMap = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
const YEARS = [...new Set(QUESTIONS.map(q => q.year))].sort((a, b) => b - a);

const LESSON_SIZE = 10;     // bite-sized lessons
const START_HEARTS = 5;
const DAILY_GOAL = 50;      // XP per day
const XP_CORRECT = 10;

/* ============================================================
   GAMIFICATION STATE  (persisted)
   ============================================================ */
const GKEY = "yespyq_game_v1";
function loadGame() { try { return JSON.parse(localStorage.getItem(GKEY)) || {}; } catch { return {}; } }
function saveGame() { try { localStorage.setItem(GKEY, JSON.stringify(game)); } catch {} }

const game = Object.assign({
  xp: 0, streak: 0, lastDay: null, dailyXp: 0,
  totalCorrect: 0, totalAnswered: 0, bestCombo: 0, lessons: 0, muted: false,
}, loadGame());

const dayStr = d => d.toISOString().slice(0, 10);
function today() { return dayStr(new Date()); }
function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }

function levelInfo(xp) {
  const per = 100;
  return { level: Math.floor(xp / per) + 1, into: xp % per, per, pct: (xp % per) / per * 100 };
}

function rollDay() {
  // ensure dailyXp reflects today; advance/break streak lazily
  const t = today();
  if (game.lastDay !== t) {
    game.dailyXp = 0;            // new day → reset daily progress (streak handled on earn)
  }
}

function earnXp(n) {
  const t = today();
  if (game.lastDay !== t) {
    game.streak = (game.lastDay === yesterday()) ? game.streak + 1 : 1;
    game.lastDay = t;
    game.dailyXp = 0;
    toast(`🔥 Day ${game.streak} streak!`, "streak");
  }
  const before = game.dailyXp;
  game.xp += n; game.dailyXp += n;
  if (before < DAILY_GOAL && game.dailyXp >= DAILY_GOAL) {
    confettiBurst(); toast("🎯 Daily goal complete!", "goal");
  }
  saveGame(); renderGameStats(); renderGamePanel();
}

/* ============================================================
   SOUND  (tiny WebAudio blips, no assets)
   ============================================================ */
let _ac;
function ac() { if (!_ac) { try { _ac = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } return _ac; }
function beep(freq, t0, dur, type = "sine", vol = 0.15) {
  const a = ac(); if (!a || game.muted) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, a.currentTime + t0);
  g.gain.setValueAtTime(vol, a.currentTime + t0);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + dur);
  o.connect(g); g.connect(a.destination);
  o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + dur);
}
const sndCorrect = () => { beep(660, 0, 0.12, "triangle"); beep(990, 0.08, 0.18, "triangle"); };
const sndWrong   = () => { beep(180, 0, 0.25, "sawtooth", 0.12); };
const sndCombo   = () => { beep(880, 0, 0.1); beep(1175, 0.07, 0.1); beep(1568, 0.14, 0.16); };
const sndFinish  = () => { [523, 659, 784, 1047].forEach((f, i) => beep(f, i * 0.1, 0.22, "triangle")); };

/* ============================================================
   FX: confetti + floating popups + toasts
   ============================================================ */
function confettiBurst() {
  const cv = $("#confetti"); if (!cv) return;
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"];
  const N = 140, parts = [];
  for (let i = 0; i < N; i++) parts.push({
    x: innerWidth / 2, y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 4,
    s: Math.random() * 7 + 4, c: colors[i % colors.length],
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 0
  });
  let raf;
  (function frame() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = false;
    for (const p of parts) {
      p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      if (p.y < cv.height + 40) alive = true;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore();
    }
    if (alive) raf = requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, cv.width, cv.height); cancelAnimationFrame(raf); }
  })();
}

function floatXp(x, y, text) {
  const el = document.createElement("div");
  el.className = "xp-pop"; el.textContent = text;
  el.style.left = x + "px"; el.style.top = y + "px";
  $("#fx-layer").appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

let _toastT;
function toast(text, kind = "") {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; $("#fx-layer").appendChild(t); }
  t.className = "toast show " + kind; t.textContent = text;
  clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ============================================================
   GAME UI (header stats + home panel)
   ============================================================ */
function renderGameStats() {
  const { level } = levelInfo(game.xp);
  const showHearts = currentView === "practice";
  $("#game-stats").innerHTML = `
    <div class="gs-item gs-streak" title="Day streak">🔥<b>${game.streak}</b></div>
    <div class="gs-item gs-xp" title="Total XP · Level ${level}">⚡<b>${game.xp}</b></div>
    ${showHearts ? `<div class="gs-item gs-hearts" title="Hearts this lesson">❤️<b>${state.hearts}</b></div>` : ""}
    <button class="gs-mute" title="Sound on/off">${game.muted ? "🔇" : "🔊"}</button>`;
}

function renderGamePanel() {
  const p = $("#game-panel"); if (!p) return;
  const { level, into, per, pct } = levelInfo(game.xp);
  const goalPct = Math.min(100, Math.round(game.dailyXp / DAILY_GOAL * 100));
  const acc = game.totalAnswered ? Math.round(game.totalCorrect / game.totalAnswered * 100) : 0;
  p.innerHTML = `
    <div class="gp-card">
      <div class="gp-ico">🔥</div>
      <div class="gp-meta"><b>${game.streak}</b><span>day streak</span></div>
    </div>
    <div class="gp-card">
      <div class="gp-ico">⚡</div>
      <div class="gp-meta">
        <b>Level ${level}</b><span>${into} / ${per} XP</span>
        <div class="gp-bar"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    <div class="gp-card gp-goal">
      <div class="gp-ring" style="--p:${goalPct * 3.6}deg">
        <span>${goalPct}%</span>
      </div>
      <div class="gp-meta"><b>Daily Goal</b><span>${game.dailyXp} / ${DAILY_GOAL} XP today</span></div>
    </div>
    <div class="gp-card">
      <div class="gp-ico">🎯</div>
      <div class="gp-meta"><b>${acc}%</b><span>lifetime accuracy</span></div>
    </div>`;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
let currentView = "home";
function showView(name) {
  currentView = name;
  $$(".view").forEach(v => v.classList.add("hidden"));
  $(`#view-${name}`)?.classList.remove("hidden");
  $$(".main-nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === name));
  renderGameStats();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.addEventListener("click", e => {
  const mute = e.target.closest(".gs-mute");
  if (mute) { game.muted = !game.muted; saveGame(); renderGameStats(); if (!game.muted) sndCorrect(); return; }
  const nav = e.target.closest("[data-nav]");
  if (nav) { e.preventDefault(); showView(nav.dataset.nav); return; }
  const start = e.target.closest("[data-action='start']");
  if (start) { e.preventDefault(); startSet(QUESTIONS, "Quick Lesson · Mixed"); }
});

/* ============================================================
   HOME RENDERING
   ============================================================ */
const countBySubject = id => QUESTIONS.filter(q => q.subject === id).length;
const countByYear = y => QUESTIONS.filter(q => q.year === y).length;

function renderHeroStats() {
  $("#hero-stats").innerHTML = `
    <div class="stat"><b>${QUESTIONS.length}</b><span>PYQ questions</span></div>
    <div class="stat"><b>${SUBJECTS.length}</b><span>Subjects</span></div>
    <div class="stat"><b>${YEARS.length}</b><span>Exam years</span></div>
    <div class="stat"><b>UPSC</b><span>CSE Prelims</span></div>`;
}

function subjectCardHTML(s) {
  const n = countBySubject(s.id);
  return `<div class="subject-card" data-subject="${s.id}">
      <div class="ico">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>UPSC CSE Prelims PYQs</p>
      <span class="count">${n} question${n === 1 ? "" : "s"}</span>
    </div>`;
}
function renderSubjects() {
  const html = SUBJECTS.map(subjectCardHTML).join("");
  $("#home-subjects").innerHTML = html;
  $("#all-subjects").innerHTML = html;
}
function renderYears() {
  $("#home-years").innerHTML = YEARS.map(y =>
    `<div class="year-card" data-year="${y}"><b>${y}</b><span>${countByYear(y)} questions</span></div>`
  ).join("");
}

document.addEventListener("click", e => {
  const sc = e.target.closest("[data-subject]");
  if (sc) { const s = subjectMap[sc.dataset.subject]; startSet(QUESTIONS.filter(q => q.subject === s.id), s.name + " · Lesson"); return; }
  const yc = e.target.closest("[data-year]");
  if (yc) { const y = +yc.dataset.year; startSet(QUESTIONS.filter(q => q.year === y), `Year ${y} · Lesson`); }
});

/* ============================================================
   QUIZ ENGINE  (bite-sized lessons)
   ============================================================ */
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const state = { set: [], idx: 0, answers: {}, label: "", combo: 0, hearts: START_HEARTS, sessionXp: 0, sessionMaxCombo: 0 };

const MASCOT = {
  idle:    ["Pick the best answer 👇", "Take your time.", "You've got this!", "Think it through 🧠"],
  correct: ["Brilliant! 🎉", "Spot on! ⭐", "Exactly right!", "You're on fire! 🔥", "Nailed it! 💪"],
  wrong:   ["Close! Review below 👀", "No worries — learn & move on.", "Tricky one. You'll get the next!", "Read the explanation 📘"],
};
const pick = a => a[Math.floor(Math.random() * a.length)];

function startSet(pool, label) {
  if (!pool || !pool.length) return;
  state.set = shuffle(pool).slice(0, LESSON_SIZE);
  state.idx = 0; state.answers = {}; state.combo = 0;
  state.hearts = START_HEARTS; state.sessionXp = 0; state.sessionMaxCombo = 0;
  state.label = label;
  showView("practice");
  renderQuestion();
}

function renderQuestion(justAnswered) {
  const q = state.set[state.idx];
  const total = state.set.length;
  const chosen = state.answers[q.id];
  const answered = chosen !== undefined;
  const isOk = chosen === q.answer;
  const mood = !answered ? "idle" : (isOk ? "correct" : "wrong");

  $("#quiz-meta").innerHTML = `${state.label}<small>${subjectMap[q.subject].name} · ${q.year} · ${q.paper}</small>`;
  $("#quiz-count").textContent = `${state.idx + 1} / ${total}`;
  $("#progress-fill").style.width = `${((state.idx + (answered ? 1 : 0)) / total) * 100}%`;

  const opts = q.options.map((opt, i) => {
    let cls = "option";
    if (answered) { cls += " locked"; if (i === q.answer) cls += " correct"; else if (i === chosen) cls += " wrong"; else cls += " dim"; }
    return `<button class="${cls}" data-opt="${i}"><span class="key">${String.fromCharCode(97 + i)}</span><span>${opt}</span></button>`;
  }).join("");

  const comboBadge = (!answered && state.combo >= 2) ? `<div class="combo-badge">🔥 ${state.combo} in a row!</div>` : "";

  const explainHTML = answered ? `
    <div class="explain ${justAnswered ? "pop" : ""}">
      <div class="verdict ${isOk ? "ok" : "no"}">${isOk ? "✓ Correct" : "✗ Incorrect"} — Answer: ${String.fromCharCode(97 + q.answer)}) ${q.options[q.answer]}</div>
      <p><span class="lbl">Explanation:</span> ${q.explanation}</p>
    </div>` : "";

  $("#quiz-body").innerHTML = `
    <div class="mascot">
      <div class="mascot-face ${mood}">${mood === "correct" ? "🤩" : mood === "wrong" ? "🤔" : "🦉"}</div>
      <div class="mascot-bubble">${pick(MASCOT[mood])}</div>
    </div>
    <div class="qcard ${justAnswered ? (isOk ? "flash-ok" : "flash-no") : ""}">
      ${comboBadge}
      <div class="qtags">
        <span class="qtag">${subjectMap[q.subject].icon} ${subjectMap[q.subject].name}</span>
        <span class="qtag">${q.year}</span>
        <span class="qtag">${q.id}</span>
      </div>
      <div class="qtext">${escapeHTML(q.q)}</div>
      <div class="options">${opts}</div>
      ${explainHTML}
    </div>`;

  $("#btn-prev").disabled = state.idx === 0;
  $("#btn-next").textContent = state.idx === total - 1 ? "Finish ✓" : "Next →";
}

$("#quiz-body").addEventListener("click", e => {
  const opt = e.target.closest("[data-opt]");
  if (!opt) return;
  const q = state.set[state.idx];
  if (state.answers[q.id] !== undefined) return;
  const chosen = +opt.dataset.opt;
  const correct = chosen === q.answer;
  state.answers[q.id] = chosen;

  game.totalAnswered++;
  if (correct) {
    game.totalCorrect++;
    state.combo++;
    state.sessionMaxCombo = Math.max(state.sessionMaxCombo, state.combo);
    if (state.combo > game.bestCombo) game.bestCombo = state.combo;
    const bonus = Math.min(10, (state.combo - 1) * 2);
    const gained = XP_CORRECT + bonus;
    state.sessionXp += gained;
    earnXp(gained);
    const r = opt.getBoundingClientRect();
    floatXp(r.right - 60, r.top, `+${gained} XP`);
    if (state.combo >= 3) { sndCombo(); } else { sndCorrect(); }
    if (state.combo === 5) { confettiBurst(); toast("🔥 5-combo! Unstoppable!", "streak"); }
  } else {
    state.combo = 0;
    state.hearts = Math.max(0, state.hearts - 1);
    sndWrong();
    if (navigator.vibrate) navigator.vibrate(120);
  }
  saveGame();
  renderQuestion(true);
});

$("#btn-prev").addEventListener("click", () => { if (state.idx > 0) { state.idx--; renderQuestion(); } });
$("#btn-next").addEventListener("click", () => {
  if (state.idx < state.set.length - 1) { state.idx++; renderQuestion(); }
  else showResults();
});
$("#btn-quit").addEventListener("click", () => showView("home"));

/* ============================================================
   LESSON COMPLETE  (celebration)
   ============================================================ */
function showResults() {
  const total = state.set.length;
  let ok = 0, attempted = 0;
  state.set.forEach(q => { if (state.answers[q.id] !== undefined) { attempted++; if (state.answers[q.id] === q.answer) ok++; } });
  const pct = total ? Math.round(ok / total * 100) : 0;
  game.lessons++; saveGame();

  const perfect = pct === 100;
  const title = perfect ? "Flawless Lesson! 🏆" : pct >= 70 ? "Lesson Complete! 🎉" : "Lesson Done 💪";
  const msg = perfect ? "A perfect run — you're exam-ready!"
            : pct >= 70 ? "Strong work. Keep the streak alive!"
            : "Every miss is a lesson. Review and go again!";

  $("#result-card").innerHTML = `
    <div class="result-emoji">${perfect ? "🏆" : pct >= 70 ? "🎉" : "📘"}</div>
    <h2>${title}</h2>
    <p class="sub">${msg}</p>
    <div class="result-rewards">
      <div class="rw rw-xp"><b>+${state.sessionXp}</b><span>XP earned</span></div>
      <div class="rw rw-acc"><b>${pct}%</b><span>accuracy</span></div>
      <div class="rw rw-combo"><b>🔥 ${state.sessionMaxCombo}</b><span>best combo</span></div>
      <div class="rw rw-streak"><b>${game.streak}</b><span>day streak</span></div>
    </div>
    <div class="result-breakdown">
      <div class="r-ok"><b>${ok}</b><span>Correct</span></div>
      <div class="r-no"><b>${attempted - ok}</b><span>Wrong</span></div>
      <div class="r-sk"><b>${total - attempted}</b><span>Skipped</span></div>
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" id="r-again">Another Lesson →</button>
      <button class="btn btn-ghost" data-nav="home">Home</button>
    </div>`;
  showView("results");
  sndFinish();
  if (pct >= 70) confettiBurst();
  $("#r-again").addEventListener("click", () => startSet(QUESTIONS, "Quick Lesson · Mixed"));
}

/* ---------- util ---------- */
function escapeHTML(str) { return str.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

/* ---------- init ---------- */
rollDay();
renderHeroStats();
renderSubjects();
renderYears();
renderGamePanel();
renderGameStats();
$("#year").textContent = new Date().getFullYear();
showView("home");
