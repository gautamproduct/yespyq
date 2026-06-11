// YESPYQ — app logic (vanilla JS, no build step)

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const STORE_KEY = "yespyq_progress_v1";
const subjectMap = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
const YEARS = [...new Set(QUESTIONS.map(q => q.year))].sort((a, b) => b - a);

const state = {
  set: [],        // current question set
  idx: 0,         // current index
  answers: {},    // questionId -> chosen option index
  label: "",      // set label e.g. "Polity & Governance"
};

/* ---------- navigation ---------- */
function showView(name) {
  $$(".view").forEach(v => v.classList.add("hidden"));
  $(`#view-${name}`)?.classList.remove("hidden");
  $$(".main-nav a").forEach(a =>
    a.classList.toggle("active", a.dataset.nav === name));
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.addEventListener("click", e => {
  const nav = e.target.closest("[data-nav]");
  if (nav) { e.preventDefault(); showView(nav.dataset.nav); return; }
  const start = e.target.closest("[data-action='start']");
  if (start) { e.preventDefault(); startSet(QUESTIONS, "All PYQs · Mixed"); }
});

/* ---------- home rendering ---------- */
function countBySubject(id){ return QUESTIONS.filter(q => q.subject === id).length; }
function countByYear(y){ return QUESTIONS.filter(q => q.year === y).length; }

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
  $("#home-years").innerHTML = YEARS.map(y => {
    const n = countByYear(y);
    return `<div class="year-card" data-year="${y}">
        <b>${y}</b><span>${n} question${n === 1 ? "" : "s"}</span>
      </div>`;
  }).join("");
}

document.addEventListener("click", e => {
  const sc = e.target.closest("[data-subject]");
  if (sc) {
    const s = subjectMap[sc.dataset.subject];
    startSet(QUESTIONS.filter(q => q.subject === s.id), s.name);
    return;
  }
  const yc = e.target.closest("[data-year]");
  if (yc) {
    const y = +yc.dataset.year;
    startSet(QUESTIONS.filter(q => q.year === y), `Year ${y}`);
  }
});

/* ---------- quiz engine ---------- */
function startSet(questions, label) {
  if (!questions.length) return;
  state.set = questions;
  state.idx = 0;
  state.answers = {};
  state.label = label;
  showView("practice");
  renderQuestion();
}

function renderQuestion() {
  const q = state.set[state.idx];
  const total = state.set.length;
  const chosen = state.answers[q.id];      // undefined if unanswered
  const answered = chosen !== undefined;

  $("#quiz-meta").innerHTML =
    `${state.label}<small>${subjectMap[q.subject].name} · ${q.year} · ${q.paper}</small>`;
  $("#quiz-count").textContent = `Q ${state.idx + 1} / ${total}`;
  $("#progress-fill").style.width = `${((state.idx + 1) / total) * 100}%`;

  const opts = q.options.map((opt, i) => {
    let cls = "option";
    if (answered) {
      cls += " locked";
      if (i === q.answer) cls += " correct";
      else if (i === chosen) cls += " wrong";
      else cls += " dim";
    }
    const key = String.fromCharCode(97 + i); // a,b,c,d
    return `<button class="${cls}" data-opt="${i}">
        <span class="key">${key}</span><span>${opt}</span>
      </button>`;
  }).join("");

  const isOk = chosen === q.answer;
  const explainHTML = answered ? `
    <div class="explain">
      <div class="verdict ${isOk ? "ok" : "no"}">
        ${isOk ? "✓ Correct" : "✗ Incorrect"} — Answer: ${String.fromCharCode(97 + q.answer)}) ${q.options[q.answer]}
      </div>
      <p><span class="lbl">Explanation:</span> ${q.explanation}</p>
    </div>` : "";

  $("#quiz-body").innerHTML = `
    <div class="qcard">
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
  if (state.answers[q.id] !== undefined) return; // already answered
  state.answers[q.id] = +opt.dataset.opt;
  saveProgress(q, +opt.dataset.opt === q.answer);
  renderQuestion();
});

$("#btn-prev").addEventListener("click", () => {
  if (state.idx > 0) { state.idx--; renderQuestion(); }
});
$("#btn-next").addEventListener("click", () => {
  if (state.idx < state.set.length - 1) { state.idx++; renderQuestion(); }
  else showResults();
});
$("#btn-quit").addEventListener("click", () => showView("home"));

/* ---------- results ---------- */
function showResults() {
  const total = state.set.length;
  let ok = 0, attempted = 0;
  state.set.forEach(q => {
    if (state.answers[q.id] !== undefined) {
      attempted++;
      if (state.answers[q.id] === q.answer) ok++;
    }
  });
  const skipped = total - attempted;
  const pct = total ? Math.round((ok / total) * 100) : 0;
  const msg = pct >= 80 ? "Outstanding! You're exam-ready. 🏆"
            : pct >= 50 ? "Good going — keep revising the misses. 💪"
            : "Early days. Review the explanations and retry. 📚";

  $("#result-card").innerHTML = `
    <div class="score-ring">${pct}%</div>
    <h2>${state.label} — Complete</h2>
    <p class="sub">${msg}</p>
    <div class="result-breakdown">
      <div class="r-ok"><b>${ok}</b><span>Correct</span></div>
      <div class="r-no"><b>${attempted - ok}</b><span>Wrong</span></div>
      <div class="r-sk"><b>${skipped}</b><span>Skipped</span></div>
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" id="r-retry">Retry Set</button>
      <button class="btn btn-ghost" data-nav="subjects">Try Another Subject</button>
      <button class="btn btn-ghost" data-nav="home">Home</button>
    </div>`;
  showView("results");
  $("#r-retry").addEventListener("click", () => startSet(state.set, state.label));
}

/* ---------- progress persistence ---------- */
function saveProgress(q, correct) {
  let p;
  try { p = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { p = {}; }
  p.attempted = (p.attempted || 0) + 1;
  p.correct = (p.correct || 0) + (correct ? 1 : 0);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch {}
}

/* ---------- util ---------- */
function escapeHTML(str) {
  return str.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

/* ---------- init ---------- */
renderHeroStats();
renderSubjects();
renderYears();
$("#year").textContent = new Date().getFullYear();
showView("home");
