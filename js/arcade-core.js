/* Arcade games, part 1: shared helpers, Bully Buster, Seed Catcher */
window.Arcade = window.Arcade || {};
window.AC = (function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const bear = {
    cheer: t => window.Bear && Bear.cheer(t),
    oops: t => window.Bear && Bear.oops(t),
    say: (t, o) => window.Bear && Bear.say(t, o)
  };
  const $ = (s, r) => (r || document).querySelector(s);
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hearts = (n, max) => "♥".repeat(Math.max(0, n)) + "♡".repeat(Math.max(0, max - n));
  const natives = () => PLANTS.filter(p => p.type === "native");
  const bullies = () => PLANTS.filter(p => p.type === "invasive");

  /* tiny sound effects, off until the player turns them on */
  let soundOn = store.get("ohe-sound", false), ac = null;
  function beep(freq, dur, type) {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + dur);
    } catch (e) {}
  }
  const sfx = {
    pop: () => beep(440, .06, "square"),
    good: () => beep(660, .12, "triangle"),
    great: () => { beep(660, .08, "triangle"); setTimeout(() => beep(880, .14, "triangle"), 80); },
    bad: () => beep(150, .25, "sawtooth")
  };
  function toggleSound(btn) {
    soundOn = !soundOn; store.set("ohe-sound", soundOn);
    btn.textContent = "Sound: " + (soundOn ? "on" : "off");
    btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
    if (soundOn) sfx.good();
  }
  /* "Heart Rescue" pop-up question.
     panel: the game panel element to cover. opts.full: hearts already full (bonus points instead).
     opts.onDone(true | false): true = right, false = wrong. There is no Skip: kids must answer. */
  let qOverlay = null;
  function closeQuestion() {
    if (qOverlay) { qOverlay.remove(); qOverlay = null; }
  }
  function askQuestion(panel, opts) {
    closeQuestion();
    const item = nextQuestion();
    const overlay = document.createElement("div");
    overlay.className = "qpop";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", opts.final ? "Final question" : opts.full ? "Bonus question" : "Heart Rescue question");
    const pl = item.pic ? PLANTS.find(p => p.id === item.pic) : null;
    overlay.innerHTML = `<div class="qpop-box">
      <div class="qpop-head">${opts.final ? "&#127942; Final question!" : opts.full ? "&#11088; Bonus question!" : "&#10084;&#65039; Heart Rescue!"}</div>
      <p class="qpop-sub">${opts.final ? "Answer right to win 50 bonus points." : opts.full ? "Your hearts are full. Answer right to win 50 bonus points." : "Answer right to win a heart back."}</p>
      ${pl ? `<div class="q-pic">${plantPic(pl, 110)}</div>` : ""}
      <p class="q-text">${item.q}</p>
      <div class="options">${item.opts.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o.text}</button>`).join("")}</div>
      <div class="feedback" role="status" aria-live="polite"></div>
      <div class="qpop-actions"><button type="button" class="btn" data-go hidden>${opts.final ? "See my score" : "Back to the game"}</button></div>
    </div>`;
    panel.appendChild(overlay);
    qOverlay = overlay;
    const box = overlay.querySelector(".qpop-box");
    if (box.scrollIntoView) box.scrollIntoView({ block: "center" });
    let done = false;
    overlay.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      done = true;
      const ok = item.opts[+b.dataset.i].ok;
      overlay.querySelectorAll(".opt").forEach((x, i) => { x.disabled = true; if (item.opts[i].ok) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      const fb = overlay.querySelector(".feedback");
      fb.className = "feedback show " + (ok ? "good" : "bad");
      fb.textContent = (ok ? "Correct! " : "Not quite. ") + item.why;
      const go = overlay.querySelector("[data-go]");
      go.hidden = false;
      go.focus();
      go.addEventListener("click", () => { closeQuestion(); opts.onDone(ok); });
    }));
    const first = overlay.querySelector(".opt");
    if (first) first.focus();
  }

  return { store, bear, $, rnd, clamp, hearts, natives, bullies, sfx, toggleSound, isSoundOn: () => soundOn, askQuestion, closeQuestion };
})();

/* =====================================================================
   BULLY BUSTER: whack-a-mole with plant bullies
   ===================================================================== */
Arcade.bully = (function () {
  const { store, bear, $, rnd, hearts, natives, bullies, sfx } = AC;
  const root = () => $("#game-bully");
  let st = null, loop = null;

  function stop() {
    AC.closeQuestion();
    if (loop) { clearInterval(loop); loop = null; }
    if (st) st.moles.forEach(m => m && clearTimeout(m.timer));
  }

  /* Heart Rescue: pause the game and ask a question */
  function rescue() {
    clearInterval(loop); loop = null;
    st.moles.forEach((m, i) => {
      if (m) { clearTimeout(m.timer); st.moles[i] = null; const el = $("#mole-" + i); if (el) el.className = "mole"; }
    });
    st.sinceQ = 0; st.nextQ = 24;
    const full = st.lives >= 3;
    bear.say(full ? "Bonus question time!" : "Heart Rescue! Answer right to win a heart back.", { stay: 2500 });
    AC.askQuestion(root(), {
      full,
      onDone: ok => {
        if (!st || st.over) return;
        if (ok !== null) st.qTotal++;
        if (ok === true) {
          st.qRight++;
          if (full) st.score += 50; else st.lives++;
          bear.cheer(full ? "Bonus points! Smart thinking!" : "Heart back! Nice thinking!");
          sfx.great();
        } else if (ok === false) {
          bear.say("Not quite, but now you know! Back to busting.", { stay: 3000 });
        }
        st.nextSpawn = 700;
        draw();
        loop = setInterval(tick, 100);
      }
    });
  }

  function menu() {
    stop(); st = null;
    const best = store.get("ohe-best-bully", 0);
    root().innerHTML = `<div class="final">
      <div class="arcade-icon">&#129508;</div>
      <h2>Bully Buster</h2>
      <p class="bb-lead">Plant bullies are taking over the garden. <strong>Pull them out!</strong></p>
      <div class="bb-howto">
        <div class="bb-card bully"><span class="face" aria-hidden="true">&#128544;</span><strong>Plant bully</strong><span>Red and grumpy.<br><b>TAP to pull it out!</b></span></div>
        <div class="bb-card friend"><span class="face" aria-hidden="true">&#128578;</span><strong>Plant friend</strong><span>Green and happy.<br><b>Leave it alone!</b></span></div>
      </div>
      <p>You have 3 hearts and 60 seconds. Pull several bullies in a row for a combo! Every so often Cali asks a question. <strong>Answer right to win a heart back!</strong></p>
      <p class="bestline">Best score: <strong>${best}</strong></p>
      <button class="btn" id="bb-play">Play</button></div>`;
    $("#bb-play").addEventListener("click", start);
  }

  function start() {
    stop();
    const holes = 9;
    st = { score: 0, lives: 3, time: 60, combo: 0, maxCombo: 0, moles: new Array(holes).fill(null), busted: {}, friends: {}, nextSpawn: 500, over: false, sinceQ: 0, nextQ: 18, qRight: 0, qTotal: 0, hinted: false };
    root().innerHTML = `
      <div class="hud"><span>Score <strong id="bb-score">0</strong></span><span>Time <strong id="bb-time">60</strong></span><span class="lives" id="bb-lives" aria-label="Hearts left"></span><span>Combo <strong id="bb-combo">0</strong></span></div>
      <p class="bb-rule" aria-hidden="true"><span class="r-bully">&#128544; Pull out the bullies</span><span class="r-friend">&#128578; Leave the friends</span></p>
      <div class="hole-grid" id="bb-grid">${Array.from({ length: holes }, (_, i) =>
        `<button class="hole" data-i="${i}" aria-label="Hole ${i + 1}"><span class="dirt"></span><span class="mole" id="mole-${i}"></span></button>`).join("")}</div>
      <p class="bb-msg" id="bb-msg" role="status" aria-live="polite">Go go go!</p>`;
    $("#bb-grid").addEventListener("click", onTap);
    loop = setInterval(tick, 100);
    draw();
    bear.say("Pull out the grumpy red bullies! Leave the happy green friends.", { stay: 3500 });
  }

  function setMsg(t) { const m = $("#bb-msg"); if (m) m.textContent = t; }
  /* little floating words over a hole, like "Pulled!" */
  function popText(i, text, kind) {
    const hole = document.querySelector('.hole[data-i="' + i + '"]');
    if (!hole) return;
    const t = document.createElement("span");
    t.className = "pop-txt " + kind; t.textContent = text;
    hole.appendChild(t);
    setTimeout(() => t.remove(), 900);
  }
  /* after a bully is pulled, a little native sprout pops up in its place */
  function sprout(i) {
    const hole = document.querySelector('.hole[data-i="' + i + '"]');
    if (!hole) return;
    hole.classList.add("sprouted");
    setTimeout(() => hole.classList.remove("sprouted"), 900);
  }

  function draw() {
    if (!st) return;
    $("#bb-score").textContent = st.score;
    $("#bb-time").textContent = Math.ceil(st.time);
    $("#bb-lives").textContent = hearts(st.lives, 3);
    $("#bb-combo").textContent = st.combo > 1 ? "x" + (1 + Math.floor(st.combo / 5)) + " (" + st.combo + ")" : st.combo;
  }

  function tick() {
    if (!st || st.over) return;
    st.time = Math.max(0, st.time - 0.1);
    st.sinceQ += 0.1;
    if (st.sinceQ >= st.nextQ && st.time > 8) { rescue(); return; }
    const prog = 1 - st.time / 60;
    st.nextSpawn -= 100;
    if (st.nextSpawn <= 0) {
      spawn(prog);
      st.nextSpawn = 850 - 450 * prog + Math.random() * 250;
      if (prog > 0.5 && Math.random() < 0.35) spawn(prog);
    }
    draw();
    if (st.time <= 0) end();
  }

  function spawn(prog) {
    const free = st.moles.map((m, i) => (m ? -1 : i)).filter(i => i >= 0);
    if (!free.length) return;
    const i = rnd(free);
    const hint = !st.hinted;                 /* the very first plant is a bully with a pointing hand */
    const isBully = hint || Math.random() < 0.65;
    const p = rnd(isBully ? bullies() : natives());
    const m = { p, bully: isBully, hit: false, timer: null };
    m.timer = setTimeout(() => leave(i), hint ? 3000 : 1250 - 600 * prog);
    st.hinted = true;
    st.moles[i] = m;
    const el = $("#mole-" + i);
    el.className = "mole up " + (isBully ? "is-bully" : "is-friend") + (hint ? " hint" : "");
    el.innerHTML = plantPic(p, 78) + `<span class="mole-face" aria-hidden="true">${isBully ? "&#128544;" : "&#128578;"}</span>` +
      `<span class="mole-name">${isBully ? "Bully: " : "Friend: "}${p.name}</span>` + (hint ? `<span class="mole-hint" aria-hidden="true">&#128070; Tap!</span>` : "");
    sfx.pop();
  }

  function leave(i) {
    const m = st && st.moles[i];
    if (!m) return;
    if (m.bully && !m.hit) { st.combo = 0; setMsg(m.p.name + " got away and will spread! Tap the grumpy red ones fast."); }
    st.moles[i] = null;
    const el = $("#mole-" + i);
    if (el) el.className = "mole";
  }

  function onTap(e) {
    const b = e.target.closest(".hole");
    if (!b || !st || st.over) return;
    const i = +b.dataset.i, m = st.moles[i];
    if (!m || m.hit) return;
    m.hit = true;
    clearTimeout(m.timer);
    const el = $("#mole-" + i);
    if (m.bully) {
      st.combo++; st.maxCombo = Math.max(st.maxCombo, st.combo);
      st.score += 10 * (1 + Math.floor(st.combo / 5));
      st.busted[m.p.id] = m.p;
      el.className = "mole up hit-good";
      popText(i, "Pulled!", "good");
      sprout(i);
      setMsg("Pulled out! " + m.p.name + ": " + m.p.fact);
      sfx.good();
      if (st.combo % 5 === 0) { bear.cheer(st.combo + " in a row! Bully buster!"); sfx.great(); }
    } else {
      st.lives--; st.combo = 0;
      st.friends[m.p.id] = m.p;
      el.className = "mole up hit-bad";
      popText(i, "Ouch! I'm a friend!", "bad");
      setMsg("Oops! " + m.p.name + " is a plant friend. Leave the happy green ones in the ground.");
      sfx.bad();
      bear.oops("Oops! " + m.p.name + " is a native plant friend. Don't tap those!");
    }
    setTimeout(() => {
      if (st && st.moles[i] === m) st.moles[i] = null;
      const e2 = $("#mole-" + i);
      if (e2) e2.className = "mole";
    }, 420);
    draw();
    if (st.lives <= 0) end();
  }

  function end() {
    if (!st || st.over) return;
    st.over = true;
    stop();
    const prevBest = store.get("ohe-best-bully", 0);
    const isNew = st.score > prevBest;
    if (isNew) store.set("ohe-best-bully", st.score);
    const names = o => Object.values(o).map(p => p.name).join(", ") || "none";
    root().innerHTML = `<div class="final">
      <p class="big">${st.score}</p>
      <h2>${isNew && st.score > 0 ? "New high score!" : st.score >= 200 ? "Bully-busting champion!" : "Nice try!"}</h2>
      <p>Best combo: <strong>${st.maxCombo}</strong> in a row. Best score: <strong>${Math.max(prevBest, st.score)}</strong></p>
      ${st.qTotal ? `<p><strong>Heart Rescue questions:</strong> ${st.qRight} of ${st.qTotal} right</p>` : ""}
      <p><strong>Bullies you pulled out:</strong> ${names(st.busted)}</p>
      <p><strong>Plant friends you tapped by mistake:</strong> ${names(st.friends)}</p>
      <button class="btn" id="bb-again">Play again</button></div>`;
    $("#bb-again").addEventListener("click", start);
    $("#bb-again").focus();
    if (st.score >= 200 || isNew) bear.cheer("Great job, bully buster! Can you beat that score?");
    else bear.say("Good try! Check the plant guide to learn the bullies, then play again.", { stay: 4500 });
  }

  return { show: menu, hide: stop };
})();

/* =====================================================================
   SEED CATCHER: canvas catcher game
   ===================================================================== */
Arcade.catch = (function () {
  const { store, bear, $, rnd, clamp, hearts, sfx } = AC;
  const W = 360, H = 520;
  const root = () => $("#game-catch");
  let cv, ctx, raf = null, st = null, last = 0, keys = {};

  function onKey(e, down) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { keys[e.key] = down; e.preventDefault(); }
  }
  const kd = e => onKey(e, true), ku = e => onKey(e, false);

  /* Heart Rescue: pause the game and ask a question */
  function rescue() {
    if (raf) cancelAnimationFrame(raf);
    raf = null; keys = {};
    st.asking = false; st.sinceQ = 0; st.nextQ = 24;
    const full = st.lives >= 3;
    bear.say(full ? "Bonus question time!" : "Heart Rescue! Answer right to win a heart back.", { stay: 2500 });
    AC.askQuestion(root(), {
      full,
      onDone: ok => {
        if (!st || st.over) return;
        if (ok !== null) st.qTotal++;
        if (ok === true) {
          st.qRight++;
          if (full) { st.score += 50; for (let k = 0; k < 2 && st.flowers.length < 22; k++) st.flowers.push({ x: 14 + Math.random() * (W - 28), h: 14 + Math.random() * 20, c: rnd(["#FF9F2E", "#FFC94A", "#E24C9B", "#9B6FC4", "#FFFFFF", "#5B8FD8"]) }); }
          else st.lives++;
          bear.cheer(full ? "Bonus points! Smart thinking!" : "Heart back! Nice thinking!");
          sfx.great();
        } else if (ok === false) {
          bear.say("Not quite, but now you know! Back to catching.", { stay: 3000 });
        }
        st.items = st.items.filter(it => it.y < H - 230);
        updateHud();
        document.addEventListener("keydown", kd);
        document.addEventListener("keyup", ku);
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
  }

  function stop() {
    AC.closeQuestion();
    if (raf) cancelAnimationFrame(raf);
    raf = null; keys = {};
    document.removeEventListener("keydown", kd);
    document.removeEventListener("keyup", ku);
  }

  function menu() {
    stop(); st = null;
    const best = store.get("ohe-best-catch", 0);
    root().innerHTML = `<div class="final">
      <div class="arcade-icon">&#129530;</div>
      <h2>Seed Catcher</h2>
      <p>Move the basket to <strong>catch native seeds</strong> and <strong>raindrops</strong>. <strong>Dodge the bully seeds</strong> (the spiky angry ones). Golden acorns are worth a lot! Your garden grows as your score grows. Every so often Cali asks a question. <strong>Answer right to win a heart back!</strong></p>
      <p class="bestline">Best score: <strong>${best}</strong></p>
      <button class="btn" id="sc-play">Play</button></div>`;
    $("#sc-play").addEventListener("click", start);
  }

  function start() {
    stop();
    root().innerHTML = `
      <div class="hud"><span>Score <strong id="sc-score">0</strong></span><span class="lives" id="sc-lives"></span><span>Combo <strong id="sc-combo">0</strong></span></div>
      <div class="canvas-wrap"><canvas id="sc-canvas" aria-label="Seed Catcher game. Move the basket left and right."></canvas></div>
      <p class="hint">Drag with your finger or mouse, or use the left and right arrow keys.</p>`;
    cv = $("#sc-canvas");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    st = { score: 0, lives: 3, x: W / 2, items: [], t: 0, spawn: 0.5, flowers: [], pops: [], combo: 0, over: false, flash: 0, sinceQ: 0, nextQ: 18, qRight: 0, qTotal: 0, asking: false };
    const move = e => {
      const r = cv.getBoundingClientRect();
      st.x = clamp((e.clientX - r.left) * (W / r.width), 36, W - 36);
    };
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); move(e); });
    cv.addEventListener("pointermove", move);
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);
    updateHud();
    last = performance.now();
    raf = requestAnimationFrame(frame);
    bear.say("Catch the seeds! Dodge the spiky bullies.", { stay: 3500 });
  }

  function updateHud() {
    if (!st) return;
    $("#sc-score").textContent = st.score;
    $("#sc-lives").textContent = hearts(st.lives, 3);
    $("#sc-combo").textContent = st.combo;
  }

  function frame(now) {
    if (!st) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    if (st.over) return;
    if (st.asking) { rescue(); return; }
    raf = requestAnimationFrame(frame);
  }

  function pop(x, y, text, color) { st.pops.push({ x, y, text, color, t: 0 }); }

  function update(dt) {
    st.t += dt;
    st.sinceQ += dt;
    if (st.sinceQ >= st.nextQ) st.asking = true;
    if (keys.ArrowLeft) st.x -= 340 * dt;
    if (keys.ArrowRight) st.x += 340 * dt;
    st.x = clamp(st.x, 36, W - 36);
    st.flash = Math.max(0, st.flash - dt);

    st.spawn -= dt;
    if (st.spawn <= 0) {
      st.spawn = Math.max(0.32, 0.9 - st.t * 0.01) * (0.7 + Math.random() * 0.6);
      const r = Math.random();
      const type = r < 0.56 ? "seed" : r < 0.7 ? "drop" : r < 0.95 ? "bully" : "gold";
      const base = 130 + Math.min(210, st.t * 4);
      st.items.push({ type, x: 24 + Math.random() * (W - 48), y: -24, vy: base * (0.85 + Math.random() * 0.4), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 3 });
    }

    for (let i = st.items.length - 1; i >= 0; i--) {
      const it = st.items[i];
      it.y += it.vy * dt; it.rot += it.vr * dt;
      const inBasket = it.y > H - 104 && it.y < H - 56 && Math.abs(it.x - st.x) < 44;
      if (inBasket) {
        if (it.type === "bully") {
          st.lives--; st.combo = 0; st.flash = 0.3;
          pop(it.x, it.y, "Ouch!", "#B4452A"); sfx.bad();
          if (st.lives > 0) bear.oops("Ouch! A bully seed!");
        } else {
          const mult = 1 + Math.floor(st.combo / 10);
          const pts = it.type === "gold" ? 50 : it.type === "drop" ? 5 : 10 * mult;
          const before = Math.floor(st.score / 25);
          st.score += pts;
          if (it.type !== "drop") st.combo++;
          pop(it.x, it.y, "+" + pts, it.type === "gold" ? "#C98F00" : "#1F5C38");
          it.type === "gold" ? sfx.great() : sfx.good();
          if (it.type === "gold") bear.cheer("A golden acorn! Wow!");
          else if (st.combo > 0 && st.combo % 10 === 0) bear.cheer(st.combo + " in a row!");
          const after = Math.floor(st.score / 25);
          for (let k = before; k < after && st.flowers.length < 22; k++) {
            st.flowers.push({ x: 14 + Math.random() * (W - 28), h: 14 + Math.random() * 20, c: rnd(["#FF9F2E", "#FFC94A", "#E24C9B", "#9B6FC4", "#FFFFFF", "#5B8FD8"]) });
          }
        }
        st.items.splice(i, 1);
        updateHud();
        if (st.lives <= 0) { end(); return; }
        continue;
      }
      if (it.y > H + 30) {
        if (it.type === "seed" || it.type === "gold") { if (st.combo) { st.combo = 0; updateHud(); } }
        st.items.splice(i, 1);
      }
    }
    for (let i = st.pops.length - 1; i >= 0; i--) {
      st.pops[i].t += dt;
      if (st.pops[i].t > 0.8) st.pops.splice(i, 1);
    }
  }

  function drawItem(it) {
    ctx.save();
    ctx.translate(it.x, it.y);
    if (it.type === "seed") {
      ctx.rotate(it.rot);
      ctx.fillStyle = "#C9953A"; ctx.beginPath(); ctx.ellipse(0, 0, 8, 11, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#E7C27A"; ctx.beginPath(); ctx.ellipse(-3, -3, 2.5, 5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#5FAF4A"; ctx.beginPath(); ctx.ellipse(0, -12, 4, 2.4, -0.5, 0, 7); ctx.fill();
    } else if (it.type === "drop") {
      ctx.fillStyle = "#4DA3D8";
      ctx.beginPath(); ctx.moveTo(0, -13); ctx.bezierCurveTo(12, 2, 9, 12, 0, 12); ctx.bezierCurveTo(-9, 12, -12, 2, 0, -13); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.ellipse(-3, 3, 2, 4, 0.3, 0, 7); ctx.fill();
    } else if (it.type === "bully") {
      ctx.rotate(it.rot);
      ctx.fillStyle = "#6B2020";
      for (let k = 0; k < 10; k++) {
        ctx.save(); ctx.rotate(k * Math.PI / 5);
        ctx.beginPath(); ctx.moveTo(-4, -10); ctx.lineTo(0, -21); ctx.lineTo(4, -10); ctx.fill(); ctx.restore();
      }
      ctx.fillStyle = "#9A2E2E"; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill();
      ctx.rotate(-it.rot);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-5, -2, 3.2, 0, 7); ctx.arc(5, -2, 3.2, 0, 7); ctx.fill();
      ctx.fillStyle = "#1a0d0d"; ctx.beginPath(); ctx.arc(-5, -1.5, 1.6, 0, 7); ctx.arc(5, -1.5, 1.6, 0, 7); ctx.fill();
      ctx.strokeStyle = "#1a0d0d"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-9, -7); ctx.lineTo(-2, -4); ctx.moveTo(9, -7); ctx.lineTo(2, -4); ctx.stroke();
    } else if (it.type === "gold") {
      ctx.rotate(Math.sin(it.rot) * 0.3);
      ctx.fillStyle = "#FFC94A"; ctx.beginPath(); ctx.ellipse(0, 3, 10, 12, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#A9743F"; ctx.beginPath(); ctx.ellipse(0, -6, 11, 6, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.ellipse(-4, 4, 2, 5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillRect(10, -14, 2, 8); ctx.fillRect(7, -11, 8, 2);
    }
    ctx.restore();
  }

  function render() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#BFE3F3"); g.addColorStop(1, "#FFF8EC");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (st.flash > 0) { ctx.fillStyle = "rgba(180,69,42," + (st.flash * 0.6) + ")"; ctx.fillRect(0, 0, W, H); }
    // ground and garden
    ctx.fillStyle = "#7DB06A"; ctx.fillRect(0, H - 34, W, 34);
    ctx.fillStyle = "#5E9A5B"; ctx.fillRect(0, H - 34, W, 6);
    st.flowers.forEach(f => {
      ctx.strokeStyle = "#3F7F52"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f.x, H - 30); ctx.lineTo(f.x, H - 30 - f.h); ctx.stroke();
      ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(f.x, H - 30 - f.h, 6, 0, 7); ctx.fill();
      ctx.fillStyle = "#8A5A2B"; ctx.beginPath(); ctx.arc(f.x, H - 30 - f.h, 2.4, 0, 7); ctx.fill();
    });
    st.items.forEach(drawItem);
    // bear in the basket
    const x = st.x, y = H - 84;
    ctx.fillStyle = "#A56B3F";
    ctx.beginPath(); ctx.arc(x - 18, y - 12, 8, 0, 7); ctx.arc(x + 18, y - 12, 8, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 24, 0, 7); ctx.fill();
    ctx.fillStyle = "#E3BE92"; ctx.beginPath(); ctx.ellipse(x, y + 8, 11, 8, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#2B1A10"; ctx.beginPath(); ctx.arc(x - 9, y - 4, 3, 0, 7); ctx.arc(x + 9, y - 4, 3, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y + 3, 4.5, 3, 0, 0, 7); ctx.fill();
    // basket
    ctx.fillStyle = "#B98A52";
    ctx.beginPath(); ctx.moveTo(x - 42, y + 8); ctx.lineTo(x + 42, y + 8); ctx.lineTo(x + 32, y + 50); ctx.lineTo(x - 32, y + 50); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#8A6232"; ctx.lineWidth = 2;
    for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(x + k * 15, y + 10); ctx.lineTo(x + k * 11, y + 49); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x - 40, y + 24); ctx.lineTo(x + 40, y + 24); ctx.moveTo(x - 36, y + 38); ctx.lineTo(x + 36, y + 38); ctx.stroke();
    ctx.fillStyle = "#8A6232"; ctx.fillRect(x - 44, y + 4, 88, 8);
    // floating text
    ctx.font = "800 18px Nunito, sans-serif"; ctx.textAlign = "center";
    st.pops.forEach(p => { ctx.globalAlpha = 1 - p.t / 0.8; ctx.fillStyle = p.color; ctx.fillText(p.text, p.x, p.y - p.t * 40); });
    ctx.globalAlpha = 1;
  }

  /* The game is over: everyone answers one final question first (right = +50 points), then the score screen */
  function end() {
    if (!st || st.over) return;
    st.over = true;
    stop();
    const s = st;
    bear.say("One last question! Answer right for 50 bonus points.", { stay: 3000 });
    AC.askQuestion(root(), {
      final: true,
      onDone: ok => {
        if (ok !== null) s.qTotal++;
        if (ok === true) { s.qRight++; s.score += 50; }
        showFinal(s, ok);
      }
    });
  }

  function showFinal(s, finalOk) {
    const prevBest = store.get("ohe-best-catch", 0);
    const isNew = s.score > prevBest;
    if (isNew) store.set("ohe-best-catch", s.score);
    const flowers = s.flowers.length;
    root().innerHTML = `<div class="final">
      <p class="big">${s.score}</p>
      <h2>${isNew && s.score > 0 ? "New high score!" : "Game over"}</h2>
      <p>You grew <strong>${flowers}</strong> flower${flowers === 1 ? "" : "s"} in your garden. Best score: <strong>${Math.max(prevBest, s.score)}</strong></p>
      ${finalOk === true ? `<p><strong>Final question right: +50 bonus points!</strong></p>` : ""}
      ${s.qTotal ? `<p><strong>Questions:</strong> ${s.qRight} of ${s.qTotal} right</p>` : ""}
      <button class="btn" id="sc-again">Play again</button></div>`;
    $("#sc-again").addEventListener("click", start);
    $("#sc-again").focus();
    if (isNew && s.score > 0) bear.cheer("New high score! Your garden looks amazing!");
    else bear.say("Nice garden! Try again to grow even more flowers.", { stay: 4000 });
  }

  return { show: menu, hide: stop };
})();
