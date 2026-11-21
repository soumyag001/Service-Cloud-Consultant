/* Scenario quiz: setup -> questions with instant per-option explanations -> results/review. */
const app = document.getElementById("app");
const KEY = "scc-quiz-missed";

function loadMissed() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
}
function saveMissed(ids) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) { /* storage unavailable */ }
}
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));

let state = null;

function showSetup() {
  const topics = [...new Set(QUESTIONS.map(q => q.topic))].sort();
  const missed = loadMissed();
  app.innerHTML = `
    <h2>Scenario quiz</h2>
    <p>${QUESTIONS.length} consultant-style questions. After each answer you see why every option is right or wrong.</p>
    <div class="card">
      <div class="row">
        <label>Question set
          <select id="set">
            <option value="all">All questions</option>
            <option value="yours">The questions you supplied</option>
            <option value="extra">Additional scenarios</option>
            <option value="missed">Only ones I missed before (${missed.length})</option>
          </select></label>
        <label>Topic
          <select id="topic"><option value="all">All topics</option>
            ${topics.map(t => `<option>${esc(t)}</option>`).join("")}</select></label>
        <label>How many
          <input type="number" id="count" min="1" max="${QUESTIONS.length}" value="10"></label>
      </div>
      <p><label><input type="checkbox" id="shuf" checked> Shuffle question and option order</label></p>
      <button class="btn" id="start">Start</button>
    </div>`;
  document.getElementById("start").onclick = start;
}

function start() {
  const set = document.getElementById("set").value;
  const topic = document.getElementById("topic").value;
  const count = Math.max(1, parseInt(document.getElementById("count").value, 10) || 10);
  const shuf = document.getElementById("shuf").checked;
  const missed = loadMissed();
  let pool = QUESTIONS.filter(q =>
    (set === "all" || (set === "missed" ? missed.includes(q.id) : q.set === set)) &&
    (topic === "all" || q.topic === topic));
  if (!pool.length) { alert("No questions match those filters."); return; }
  if (shuf) pool = shuffle(pool);
  pool = pool.slice(0, count).map(q => {
    const order = q.options.map((_, i) => i);
    return { q, order: shuf ? shuffle(order) : order };
  });
  state = { items: pool, i: 0, score: 0, wrong: [], answered: false };
  showQuestion();
}

function showQuestion() {
  const { items, i } = state;
  const { q, order } = items[i];
  state.answered = false;
  app.innerHTML = `
    <div class="meta"><span>Question ${i + 1} of ${items.length}</span>
      <span class="tag">${esc(q.topic)}</span></div>
    <div class="progress"><div style="width:${(i / items.length) * 100}%"></div></div>
    <div class="card">
      <p><strong>${esc(q.q)}</strong></p>
      <div id="opts">${order.map(oi =>
        `<button class="opt" data-oi="${oi}">${esc(q.options[oi])}<span class="why" hidden></span></button>`).join("")}</div>
      <p><button class="btn" id="next" disabled>${i + 1 === items.length ? "See results" : "Next"}</button></p>
    </div>`;
  app.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.oi));
  document.getElementById("next").onclick = () => {
    if (state.i + 1 === state.items.length) showResults(); else { state.i++; showQuestion(); }
  };
}

function answer(chosen) {
  if (state.answered) return;
  state.answered = true;
  const { q } = state.items[state.i];
  const ok = chosen === q.answer;
  if (ok) state.score++; else state.wrong.push(q);
  app.querySelectorAll(".opt").forEach(b => {
    const oi = +b.dataset.oi;
    b.disabled = true;
    if (oi === q.answer) b.classList.add("correct");
    else if (oi === chosen) b.classList.add("wrong");
    const w = b.querySelector(".why");
    w.textContent = (oi === q.answer ? "✔ " : "✘ ") + q.why[oi];
    w.hidden = false;
  });
  document.getElementById("next").disabled = false;
}

function showResults() {
  const { items, score, wrong } = state;
  const pct = Math.round((score / items.length) * 100);
  // update the missed list: remove questions answered correctly this run, add new misses
  const ran = items.map(x => x.q.id);
  let missed = loadMissed().filter(id => !ran.includes(id));
  missed = missed.concat(wrong.map(q => q.id));
  saveMissed(missed);
  app.innerHTML = `
    <h2>Results</h2>
    <div class="card">
      <div class="score">${score} / ${items.length} (${pct}%)</div>
      ${wrong.length ? `<p>Review these before moving on:</p>
        <ul class="review">${wrong.map(q =>
          `<li><strong>${esc(q.topic)}:</strong> ${esc(q.q)}<br>
           <em>Answer:</em> ${esc(q.options[q.answer])}<br>
           <span class="tag">${esc(q.why[q.answer])}</span></li>`).join("")}</ul>`
        : "<p>Perfect run. Try a harder topic filter or the full set.</p>"}
      <p><button class="btn" id="again">New quiz</button>
         ${wrong.length ? `<button class="btn ghost" id="retry">Retry missed</button>` : ""}</p>
    </div>`;
  document.getElementById("again").onclick = showSetup;
  const r = document.getElementById("retry");
  if (r) r.onclick = () => {
    state = { items: wrong.map(q => ({ q, order: shuffle(q.options.map((_, i) => i)) })),
              i: 0, score: 0, wrong: [], answered: false };
    showQuestion();
  };
}

showSetup();
