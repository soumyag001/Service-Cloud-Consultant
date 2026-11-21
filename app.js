/* Chapter reader: fetches the Markdown files and renders them in the page. */
const CHAPTERS = [
  ["README",                              "Start here"],
  ["01-service-cloud-fundamentals",       "01 Fundamentals"],
  ["02-knowledge-and-data-categories",    "02 Knowledge and Data Categories"],
  ["03-omni-channel",                     "03 Omni-Channel"],
  ["04-voice-and-contact-center",         "04 Voice and Contact Center"],
  ["05-collaboration-analytics-agentforce","05 Collaboration, Analytics, Agentforce"],
  ["06-data-architecture-ldv",            "06 Data Architecture and LDV"],
  ["07-consulting-practice",              "07 Consulting Practice"],
  ["08-scenario-question-bank",           "08 Scenario Question Bank"],
  ["09-hands-on-labs",                    "09 Hands-on Labs"],
  ["10-cheat-sheet",                      "10 Cheat Sheet"],
  ["11-additional-scenarios",             "11 Additional Scenarios"]
];

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");

sidebar.innerHTML = CHAPTERS.map(([id, title]) =>
  `<a href="#${id}" data-id="${id}">${title}</a>`).join("");

document.getElementById("menuBtn").addEventListener("click", () =>
  sidebar.classList.toggle("open"));

function currentId() {
  const h = decodeURIComponent(location.hash.replace("#", ""));
  return CHAPTERS.some(c => c[0] === h) ? h : "README";
}

async function load() {
  const id = currentId();
  const idx = CHAPTERS.findIndex(c => c[0] === id);
  sidebar.querySelectorAll("a").forEach(a =>
    a.classList.toggle("active", a.dataset.id === id));
  sidebar.classList.remove("open");
  try {
    const res = await fetch(id + ".md");
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    const md = await res.text();
    let html = marked.parse(md);
    const prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
    html += `<div class="pager"><span>${prev ? `<a href="#${prev[0]}">← ${prev[1]}</a>` : ""}</span>` +
            `<span>${next ? `<a href="#${next[0]}">${next[1]} →</a>` : ""}</span></div>`;
    content.innerHTML = html;
    // make links between chapters (e.g. 03-omni-channel.md) work inside the reader
    content.querySelectorAll("a[href$='.md']").forEach(a => {
      const target = a.getAttribute("href").replace(/\.md$/, "");
      if (CHAPTERS.some(c => c[0] === target)) a.setAttribute("href", "#" + target);
    });
    document.title = CHAPTERS[idx][1] + " | Service Cloud Consultant Study Guide";
    window.scrollTo(0, 0);
  } catch (err) {
    content.innerHTML = `<div class="notice">Could not load <b>${id}.md</b> (${err.message}).
      If you opened this file directly from your computer, run a local server
      (<code>python3 -m http.server</code>) or publish it with GitHub Pages.
      The chapters are also readable directly on GitHub as .md files.</div>`;
  }
}

window.addEventListener("hashchange", load);
load();
