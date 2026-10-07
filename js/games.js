/* Three games: Nature Quiz, Spot It (native or invasive?), Sort It (which habitat?) */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const byId = id => PLANTS.find(p => p.id === id);

  function msg(el, text, kind) {
    el.textContent = text;
    el.className = "feedback show " + (kind || "");
  }

  /* ---------------- tabs ---------------- */
  const tabs = document.querySelectorAll(".tab");
  const panels = {
    bully: $("#game-bully"), catch: $("#game-catch"), flappy: $("#game-flappy"), merge: $("#game-merge"), grow: $("#game-grow"),
    quiz: $("#game-quiz"), spot: $("#game-spot"), sort: $("#game-sort")
  };
  let current = null;
  function showTab(name) {
    if (current && window.Arcade && Arcade[current] && Arcade[current].hide) Arcade[current].hide();
    current = name;
    tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.game === name ? "true" : "false"));
    Object.keys(panels).forEach(k => { panels[k].hidden = k !== name; });
    if (window.Arcade && Arcade[name] && Arcade[name].show) Arcade[name].show();
    try { history.replaceState(null, "", "#" + name); } catch (e) {}
  }
  tabs.forEach(t => t.addEventListener("click", () => showTab(t.dataset.game)));
  const soundBtn = $("#sound-toggle");
  if (soundBtn) {
    soundBtn.textContent = "Sound: " + (AC.isSoundOn() ? "on" : "off");
    soundBtn.addEventListener("click", () => AC.toggleSound(soundBtn));
  }
  const start = (location.hash || "").replace("#", "");
  showTab(panels[start] ? start : "bully");

  /* ---------------- QUIZ ---------------- */
  /* The question bank lives in js/questions.js */

  const quiz = { i: 0, score: 0, set: [], locked: false };
  function quizStart() {
    quiz.set = shuffle(QUESTIONS).slice(0, 10);
    quiz.i = 0; quiz.score = 0;
    quizShow();
  }
  function quizShow() {
    const root = $("#game-quiz");
    if (quiz.i >= quiz.set.length) return quizEnd();
    const item = quiz.set[quiz.i];
    quiz.locked = false;
    const order = shuffle(item.a.map((text, idx) => ({ text, idx })));
    root.innerHTML = `
      <div class="game-top"><span>Question ${quiz.i + 1} of ${quiz.set.length}</span><span>Score: ${quiz.score}</span></div>
      <div class="progress" aria-hidden="true"><div style="width:${(quiz.i / quiz.set.length) * 100}%"></div></div>
      ${item.pic ? `<div class="q-pic">${plantPic(byId(item.pic), 140)}</div>` : ""}
      <p class="q-text">${item.q}</p>
      <div class="options">${order.map(o => `<button class="opt" data-i="${o.idx}">${o.text}</button>`).join("")}</div>
      <div class="feedback" role="status" aria-live="polite"></div>
      <button class="btn" id="quiz-next" hidden>Next</button>`;
    root.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => quizPick(b, item)));
    $("#quiz-next").addEventListener("click", () => { quiz.i++; quizShow(); });
  }
  function quizPick(btn, item) {
    if (quiz.locked) return;
    quiz.locked = true;
    const root = $("#game-quiz");
    const right = Number(btn.dataset.i) === item.c;
    if (right) quiz.score++;
    root.querySelectorAll(".opt").forEach(b => {
      b.disabled = true;
      if (Number(b.dataset.i) === item.c) b.classList.add("right");
    });
    if (!right) btn.classList.add("wrong");
    msg($(".feedback", root), (right ? "Yes! " : "Not quite. ") + item.why, right ? "good" : "bad");
    const next = $("#quiz-next");
    next.hidden = false;
    next.textContent = quiz.i === quiz.set.length - 1 ? "See my score" : "Next";
    next.focus();
  }
  function quizEnd() {
    const root = $("#game-quiz");
    const n = quiz.set.length;
    const praise = quiz.score >= 9 ? "Nature expert!" : quiz.score >= 6 ? "Great job, Earth helper!" : "Good start. Try again to learn more!";
    root.innerHTML = `<div class="final"><p class="big">${quiz.score} / ${n}</p><h2>${praise}</h2>
      <p>Visit the <a href="plants.html">plant guide</a> to learn more, then play again.</p>
      <button class="btn" id="quiz-again">Play again</button></div>`;
    $("#quiz-again").addEventListener("click", quizStart);
    $("#quiz-again").focus();
  }

  /* ---------------- SPOT IT ---------------- */
  const spot = { i: 0, score: 0, set: [], locked: false };
  function spotStart() {
    const natives = shuffle(PLANTS.filter(p => p.type === "native")).slice(0, 5);
    const inv = shuffle(PLANTS.filter(p => p.type === "invasive")).slice(0, 5);
    spot.set = shuffle(natives.concat(inv));
    spot.i = 0; spot.score = 0;
    spotShow();
  }
  function spotShow() {
    const root = $("#game-spot");
    if (spot.i >= spot.set.length) return spotEnd();
    const p = spot.set[spot.i];
    spot.locked = false;
    root.innerHTML = `
      <div class="game-top"><span>Plant ${spot.i + 1} of ${spot.set.length}</span><span>Score: ${spot.score}</span></div>
      <div class="progress" aria-hidden="true"><div style="width:${(spot.i / spot.set.length) * 100}%"></div></div>
      <div class="q-pic">${plantPic(p, 160)}</div>
      <p class="q-text" style="text-align:center">${p.name}<br><small style="font-family:Nunito,sans-serif;font-style:italic;color:#4E6556">${p.sci}</small></p>
      <p style="text-align:center">Is this plant a <strong>native</strong> friend or an <strong>invasive</strong> bully?</p>
      <div class="two-btns">
        <button class="opt" data-a="native">Native</button>
        <button class="opt" data-a="invasive">Invasive</button>
      </div>
      <div class="feedback" role="status" aria-live="polite"></div>
      <div style="text-align:center"><button class="btn" id="spot-next" hidden>Next</button></div>`;
    root.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => spotPick(b, p)));
    $("#spot-next").addEventListener("click", () => { spot.i++; spotShow(); });
  }
  function spotPick(btn, p) {
    if (spot.locked) return;
    spot.locked = true;
    const root = $("#game-spot");
    const right = btn.dataset.a === p.type;
    if (right) spot.score++;
    root.querySelectorAll(".opt").forEach(b => {
      b.disabled = true;
      if (b.dataset.a === p.type) b.classList.add("right");
    });
    if (!right) btn.classList.add("wrong");
    const place = p.type === "native" ? "native, a plant friend that belongs here" : "invasive, a plant bully that doesn't belong here";
    msg($(".feedback", root), `${right ? "Correct!" : "Not this time."} ${p.name} is ${place}. ${p.fact}${p.warn ? " Warning: never touch or eat it." : ""}`, right ? "good" : "bad");
    const next = $("#spot-next");
    next.hidden = false;
    next.textContent = spot.i === spot.set.length - 1 ? "See my score" : "Next plant";
    next.focus();
  }
  function spotEnd() {
    const root = $("#game-spot");
    const n = spot.set.length;
    const praise = spot.score >= 9 ? "Super plant spotter!" : spot.score >= 6 ? "Nice spotting!" : "Keep practicing. The plant guide can help!";
    root.innerHTML = `<div class="final"><p class="big">${spot.score} / ${n}</p><h2>${praise}</h2>
      <p>Look through the <a href="plants.html">plant guide</a> and try again with new plants.</p>
      <button class="btn" id="spot-again">Play again</button></div>`;
    $("#spot-again").addEventListener("click", spotStart);
    $("#spot-again").focus();
  }

  /* ---------------- SORT IT ---------------- */
  const SORT_IDS = ["california-sagebrush", "purple-sage", "lemonade-berry", "manzanita", "chamise", "california-lilac", "coast-live-oak", "black-walnut", "willow", "cottonwood", "cattail", "coyote-brush"];
  const BINS = ["sage", "chaparral", "oak", "wetland"];
  const sort = { sel: null, correct: 0, tries: 0 };

  function sortStart() {
    const root = $("#game-sort");
    sort.sel = null; sort.correct = 0; sort.tries = 0;
    root.innerHTML = `
      <p class="q-text">Which habitat does each plant call home?</p>
      <p>Tap a plant, then tap its habitat. You can also drag and drop.</p>
      <div class="sort-bins">${BINS.map(b => `<div class="bin" data-bin="${b}" tabindex="0" role="button" aria-label="${HABITATS[b]}"><h3>${HABITATS[b]}</h3><div class="placed"></div></div>`).join("")}</div>
      <div class="sort-pool" id="sort-pool"></div>
      <div class="feedback" role="status" aria-live="polite"></div>
      <div class="game-top" style="margin-top:12px"><span id="sort-score">Sorted: 0 / ${SORT_IDS.length}</span><button class="btn ghost" id="sort-reset">Start over</button></div>`;
    const pool = $("#sort-pool");
    shuffle(SORT_IDS).forEach(id => {
      const p = byId(id);
      const card = document.createElement("button");
      card.className = "sort-card";
      card.type = "button";
      card.draggable = true;
      card.dataset.id = id;
      card.innerHTML = plantPic(p, 42) + `<span>${p.name}</span>`;
      card.addEventListener("click", () => selectCard(card));
      card.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", id); selectCard(card, true); });
      pool.appendChild(card);
    });
    root.querySelectorAll(".bin").forEach(bin => {
      bin.addEventListener("click", () => dropOn(bin));
      bin.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dropOn(bin); } });
      bin.addEventListener("dragover", e => { e.preventDefault(); bin.classList.add("over"); });
      bin.addEventListener("dragleave", () => bin.classList.remove("over"));
      bin.addEventListener("drop", e => {
        e.preventDefault(); bin.classList.remove("over");
        const id = e.dataTransfer.getData("text/plain");
        const card = pool.querySelector(`[data-id="${id}"]`);
        if (card) { selectCard(card, true); dropOn(bin); }
      });
    });
    $("#sort-reset").addEventListener("click", sortStart);
  }
  function selectCard(card, keep) {
    const root = $("#game-sort");
    if (sort.sel === card && !keep) { card.classList.remove("sel"); sort.sel = null; return; }
    root.querySelectorAll(".sort-card.sel").forEach(c => c.classList.remove("sel"));
    card.classList.add("sel");
    sort.sel = card;
  }
  function dropOn(bin) {
    const root = $("#game-sort");
    const fb = $(".feedback", root);
    if (!sort.sel) { msg(fb, "First tap a plant, then tap the habitat where it lives."); return; }
    const card = sort.sel;
    const p = byId(card.dataset.id);
    sort.tries++;
    if (p.habitat === bin.dataset.bin) {
      sort.correct++;
      card.classList.remove("sel");
      card.classList.add("ok");
      card.draggable = false;
      card.disabled = true;
      $(".placed", bin).appendChild(card);
      sort.sel = null;
      msg(fb, `Yes! ${p.name} lives in ${HABITATS[p.habitat].toLowerCase()}. ${p.fact}`, "good");
      $("#sort-score").textContent = `Sorted: ${sort.correct} / ${SORT_IDS.length}`;
      if (sort.correct === SORT_IDS.length) {
        msg(fb, `All sorted in ${sort.tries} tries. You are a habitat expert! Want to play again?`, "good");
      }
    } else {
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 400);
      msg(fb, `Not ${HABITATS[bin.dataset.bin].toLowerCase()}. Hint: look up ${p.name} in the plant guide.`, "bad");
    }
  }

  quizStart();
  spotStart();
  sortStart();
})();
