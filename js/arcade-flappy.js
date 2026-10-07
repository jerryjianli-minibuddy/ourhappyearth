/* =====================================================================
   FLAPPY SEED: tap to flap a little winged seed past the plant bullies.
   Every bully you pass plants a sprout. Crash once? Answer a question
   right to keep flying (one second chance per game).
   ===================================================================== */
Arcade.flappy = (function () {
  const { store, bear, $, clamp, sfx } = AC;
  const W = 360, H = 520, GROUND = H - 56;
  const SEED_X = 96, R = 10;                 /* seed position and hit radius (a little forgiving) */
  const GRAVITY = 1250, FLAP = 360, MAX_FALL = 560;
  const STALK_W = 54, SPACING = 205;
  const root = () => $("#game-flappy");
  let cv, ctx, raf = null, st = null, last = 0;

  /* ---------- controls ---------- */
  function flap() {
    if (!st || st.state === "paused" || st.state === "over") return;
    if (st.state === "ready") st.state = "play";
    st.vy = -FLAP; st.flapT = 0;
    sfx.pop();
  }
  function onKey(e) {
    if (!st || !root() || root().hidden) return;
    if (st.state === "paused" || st.state === "over") return;
    if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { e.preventDefault(); flap(); }
  }

  function stop() {
    AC.closeQuestion();
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    document.removeEventListener("keydown", onKey);
  }

  /* ---------- screens ---------- */
  function menu() {
    stop(); st = null;
    const best = store.get("ohe-best-flappy", 0);
    root().innerHTML = `<div class="final">
      <div class="arcade-icon">&#127793;</div>
      <h2>Flappy Seed</h2>
      <p class="bb-lead">Help a little seed fly to a burned hill so it can grow. <strong>Tap to flap!</strong></p>
      <div class="bb-howto">
        <div class="bb-card friend"><span class="face" aria-hidden="true">&#128070;</span><strong>Tap or press Space</strong><span>The seed flaps up.<br><b>Stop tapping and it falls.</b></span></div>
        <div class="bb-card bully"><span class="face" aria-hidden="true">&#128544;</span><strong>Plant bullies</strong><span>Tall grumpy weeds.<br><b>Fly through the gaps!</b></span></div>
      </div>
      <p>Every bully you pass plants a new sprout. Crash once? <strong>Answer a question right to keep flying!</strong></p>
      <p class="bestline">Best score: <strong>${best}</strong></p>
      <button class="btn" id="fs-play">Play</button></div>`;
    $("#fs-play").addEventListener("click", start);
  }

  function start() {
    stop();
    root().innerHTML = `
      <div class="hud"><span>Score <strong id="fs-score">0</strong></span><span>Best <strong id="fs-best">${store.get("ohe-best-flappy", 0)}</strong></span></div>
      <div class="canvas-wrap"><canvas id="fs-canvas" aria-label="Flappy Seed game. Tap or press Space to flap."></canvas></div>
      <p class="hint">Tap the game, click it, or press Space to flap.</p>`;
    cv = $("#fs-canvas");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    st = { state: "ready", y: H * 0.42, vy: 0, t: 0, flapT: 1, score: 0, obs: [], drops: [], sprouts: [], pops: [], clouds: makeClouds(), groundX: 0, rescued: false, qRight: 0, qTotal: 0, flash: 0 };
    cv.addEventListener("pointerdown", e => { e.preventDefault(); flap(); });
    document.addEventListener("keydown", onKey);
    last = performance.now();
    raf = requestAnimationFrame(frame);
    bear.say("Tap to flap! Fly through the gaps between the grumpy bully plants.", { stay: 3500 });
  }

  function makeClouds() {
    return [0, 1, 2, 3].map(i => ({ x: i * 110 + Math.random() * 60, y: 40 + Math.random() * 110, s: .7 + Math.random() * .6 }));
  }

  /* ---------- game loop ---------- */
  function frame(now) {
    if (!st) return;
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    if (st.state === "paused" || st.state === "over") return;
    raf = requestAnimationFrame(frame);
  }

  function speed() { return Math.min(195, 135 + st.score * 2.5); }
  function gapSize() { return Math.max(122, 162 - st.score * 2); }

  function update(dt) {
    st.t += dt; st.flapT += dt;
    st.flash = Math.max(0, st.flash - dt);
    st.clouds.forEach(c => { c.x -= 12 * dt * c.s; if (c.x < -70) { c.x = W + 30; c.y = 40 + Math.random() * 110; } });
    st.pops.forEach(p => p.t += dt);
    st.pops = st.pops.filter(p => p.t < 0.9);
    st.sprouts.forEach(s => { s.g = Math.min(1, s.g + dt * 2.5); });

    if (st.state === "ready") {            /* gentle bobbing until the first tap */
      st.y = H * 0.42 + Math.sin(st.t * 4) * 6;
      return;
    }
    if (st.state !== "play") return;

    const v = speed();
    st.groundX = (st.groundX - v * dt) % 24;
    st.vy = Math.min(MAX_FALL, st.vy + GRAVITY * dt);
    st.y += st.vy * dt;
    if (st.y < R) { st.y = R; st.vy = 0; }

    /* move everything left */
    st.obs.forEach(o => { o.x -= v * dt; });
    st.drops.forEach(d => { d.x -= v * dt; });
    st.sprouts.forEach(s => { s.x -= v * dt; });
    st.obs = st.obs.filter(o => o.x > -STALK_W - 10);
    st.drops = st.drops.filter(d => d.x > -20 && !d.got);
    st.sprouts = st.sprouts.filter(s => s.x > -20);

    /* new bully pair */
    const lastOb = st.obs[st.obs.length - 1];
    if (!lastOb || lastOb.x < W - SPACING) {
      const gap = gapSize();
      const mid = 110 + Math.random() * (GROUND - 220);
      const ob = { x: W + 10, top: mid - gap / 2, bot: mid + gap / 2, passed: false };
      st.obs.push(ob);
      if (Math.random() < 0.35) st.drops.push({ x: ob.x + STALK_W / 2, y: mid, got: false });
    }

    /* passing a bully plants a sprout */
    st.obs.forEach(o => {
      if (!o.passed && o.x + STALK_W < SEED_X - R) {
        o.passed = true;
        st.score++;
        st.sprouts.push({ x: SEED_X - 30, g: 0 });
        sfx.good();
        if (st.score % 10 === 0) { bear.cheer(st.score + " sprouts planted! You're a seed pilot!"); sfx.great(); }
        updateHud();
      }
    });

    /* raindrops are a +1 bonus */
    st.drops.forEach(d => {
      if (!d.got && Math.hypot(d.x - SEED_X, d.y - st.y) < R + 9) {
        d.got = true; st.score++;
        st.pops.push({ x: d.x, y: d.y, text: "+1 rain!", t: 0 });
        sfx.good(); updateHud();
      }
    });

    /* crash? */
    if (st.y + R >= GROUND) { st.y = GROUND - R; crash(); return; }
    for (const o of st.obs) {
      if (SEED_X + R > o.x + 3 && SEED_X - R < o.x + STALK_W - 3 && (st.y - R < o.top || st.y + R > o.bot)) { crash(); return; }
    }
  }

  function updateHud() {
    const s = $("#fs-score"); if (s) s.textContent = st.score;
  }

  /* ---------- crash: one second chance with a question ---------- */
  function crash() {
    st.state = "paused"; st.flash = 0.4;
    if (raf) cancelAnimationFrame(raf); raf = null;
    sfx.bad();
    draw();
    if (st.rescued) { setTimeout(end, 500); return; }
    st.rescued = true;
    bear.say("Bonk! Answer right to keep flying!", { stay: 2500 });
    AC.askQuestion(root(), {
      head: "&#127793; Second chance!",
      sub: "Answer right to keep flying from here.",
      goText: "OK",
      onDone: ok => {
        if (!st) return;
        st.qTotal++;
        if (ok === true) { st.qRight++; revive(); }
        else end();
      }
    });
  }

  function revive() {
    st.obs = st.obs.filter(o => o.x > SEED_X + 140 || o.x + STALK_W < SEED_X - 60);
    st.y = H * 0.42; st.vy = 0; st.state = "ready"; st.t = 0;
    bear.cheer("Correct! Tap to keep flying!");
    sfx.great();
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function end() {
    if (!st || st.state === "over") return;
    st.state = "over";
    stop();
    const prevBest = store.get("ohe-best-flappy", 0);
    const isNew = st.score > prevBest;
    if (isNew) store.set("ohe-best-flappy", st.score);
    root().innerHTML = `<div class="final">
      <p class="big">${st.score}</p>
      <h2>${isNew && st.score > 0 ? "New high score!" : "Game over"}</h2>
      <p>You planted <strong>${st.score}</strong> sprout${st.score === 1 ? "" : "s"} on the burned hill. Best score: <strong>${Math.max(prevBest, st.score)}</strong></p>
      ${st.qTotal ? `<p><strong>Second-chance question:</strong> ${st.qRight ? "right! You kept flying." : "not this time."}</p>` : ""}
      <button class="btn" id="fs-again">Play again</button></div>`;
    $("#fs-again").addEventListener("click", start);
    $("#fs-again").focus();
    if (isNew && st.score > 0) bear.cheer("New high score! That seed really flew!");
    else bear.say("Nice flying! Tap gently. Little taps work better than big ones.", { stay: 4500 });
  }

  /* ---------- drawing ---------- */
  function draw() {
    if (!ctx || !st) return;
    /* sky */
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
    sky.addColorStop(0, "#9FD8F5"); sky.addColorStop(1, "#E3F4FB");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, GROUND);
    /* clouds */
    ctx.fillStyle = "rgba(255,255,255,.9)";
    st.clouds.forEach(c => { ctx.beginPath(); ctx.ellipse(c.x, c.y, 28 * c.s, 12 * c.s, 0, 0, 7); ctx.ellipse(c.x + 18 * c.s, c.y - 6 * c.s, 18 * c.s, 11 * c.s, 0, 0, 7); ctx.fill(); });
    /* far hills: green on the left, burned brown on the right (where the seed is going) */
    ctx.fillStyle = "#A8D5A0";
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.quadraticCurveTo(90, GROUND - 120, 200, GROUND); ctx.fill();
    ctx.fillStyle = "#B99B7A";
    ctx.beginPath(); ctx.moveTo(150, GROUND); ctx.quadraticCurveTo(290, GROUND - 150, W + 40, GROUND); ctx.fill();

    st.obs.forEach(drawBully);
    st.drops.forEach(d => { if (!d.got) drawDrop(d.x, d.y); });

    /* ground */
    ctx.fillStyle = "#7A5230"; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = "#5FA84F"; ctx.fillRect(0, GROUND, W, 8);
    ctx.fillStyle = "#4E8F40";
    for (let x = st.groundX; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, GROUND + 8); ctx.lineTo(x + 6, GROUND); ctx.lineTo(x + 12, GROUND + 8); ctx.fill(); }
    st.sprouts.forEach(s => drawSprout(s.x, GROUND + 4, s.g));

    drawSeed();

    /* big score */
    ctx.textAlign = "center";
    ctx.font = "800 34px Fredoka, Nunito, sans-serif";
    ctx.lineWidth = 5; ctx.strokeStyle = "rgba(31,58,43,.6)"; ctx.strokeText(String(st.score), W / 2, 50);
    ctx.fillStyle = "#FFFFFF"; ctx.fillText(String(st.score), W / 2, 50);

    /* floating text */
    ctx.font = "800 15px Nunito, sans-serif";
    st.pops.forEach(p => { ctx.globalAlpha = 1 - p.t / 0.9; ctx.fillStyle = "#1F6FB2"; ctx.fillText(p.text, p.x, p.y - 14 - p.t * 30); });
    ctx.globalAlpha = 1;

    if (st.state === "ready") {
      ctx.fillStyle = "rgba(31,58,43,.75)";
      roundRect(W / 2 - 110, H * 0.62, 220, 44, 22); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.font = "800 18px Nunito, sans-serif";
      ctx.fillText(st.rescued ? "Tap to keep flying!" : "Tap to start flapping!", W / 2, H * 0.62 + 28);
    }
    if (st.flash > 0) { ctx.fillStyle = "rgba(255,255,255," + (st.flash * 1.5) + ")"; ctx.fillRect(0, 0, W, H); }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /* a tall grumpy bully weed: reed-like stalk with joints, a fluffy plume at the tip, and an angry face */
  function drawBully(o) {
    drawStalk(o.x, 0, o.top, true);
    drawStalk(o.x, o.bot, GROUND, false);
  }
  function drawStalk(x, y0, y1, fromTop) {
    const h = y1 - y0; if (h <= 0) return;
    ctx.fillStyle = "#7E9A3A"; ctx.strokeStyle = "#4F6420"; ctx.lineWidth = 3;
    ctx.fillRect(x, y0, STALK_W, h); ctx.strokeRect(x, y0, STALK_W, h);
    ctx.strokeStyle = "rgba(79,100,32,.7)"; ctx.lineWidth = 2;
    for (let yy = fromTop ? y1 - 30 : y0 + 30; fromTop ? yy > y0 : yy < y1; yy += fromTop ? -30 : 30) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + STALK_W, yy); ctx.stroke(); }
    /* plume (fluffy tip) at the gap edge */
    const tipY = fromTop ? y1 : y0;
    ctx.fillStyle = "#EADFB8"; ctx.strokeStyle = "#C9B98A"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x + STALK_W / 2, tipY, STALK_W / 2 + 8, 14, 0, 0, 7); ctx.fill(); ctx.stroke();
    /* grumpy face just behind the plume */
    const fy = fromTop ? tipY - 30 : tipY + 30, cx = x + STALK_W / 2;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.arc(cx - 9, fy, 5.5, 0, 7); ctx.arc(cx + 9, fy, 5.5, 0, 7); ctx.fill();
    ctx.fillStyle = "#1F1F1F";
    ctx.beginPath(); ctx.arc(cx - 8, fy + 1, 2.6, 0, 7); ctx.arc(cx + 8, fy + 1, 2.6, 0, 7); ctx.fill();
    ctx.strokeStyle = "#1F1F1F"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx - 16, fy - 9); ctx.lineTo(cx - 4, fy - 5); ctx.moveTo(cx + 16, fy - 9); ctx.lineTo(cx + 4, fy - 5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, fy + 14, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  }

  function drawDrop(x, y) {
    ctx.fillStyle = "#4FA8D8"; ctx.strokeStyle = "#1F6FB2"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y - 11); ctx.quadraticCurveTo(x + 9, y + 1, x, y + 8); ctx.quadraticCurveTo(x - 9, y + 1, x, y - 11); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(x - 2.5, y, 2, 0, 7); ctx.fill();
  }

  function drawSprout(x, y, g) {
    if (g <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(g, g);
    ctx.strokeStyle = "#3E8E3A"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -16); ctx.stroke();
    ctx.fillStyle = "#6CC24A";
    ctx.beginPath(); ctx.ellipse(-6, -16, 7, 3.5, -0.5, 0, 7); ctx.ellipse(6, -18, 7, 3.5, 0.5, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* the hero: a little brown seed with two leaf wings that flap */
  function drawSeed() {
    const tilt = clamp(st.vy / 600, -0.5, 0.9);
    const wing = st.flapT < 0.18 ? -0.9 + st.flapT * 5 : Math.sin(st.t * 10) * 0.25;
    ctx.save(); ctx.translate(SEED_X, st.y); ctx.rotate(tilt);
    /* back wing */
    ctx.save(); ctx.rotate(-0.4 + wing); ctx.fillStyle = "#4FA84A";
    ctx.beginPath(); ctx.ellipse(-4, -10, 13, 6, -0.6, 0, 7); ctx.fill(); ctx.restore();
    /* body */
    ctx.fillStyle = "#9A6332"; ctx.strokeStyle = "#5C3A1A"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 10, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.ellipse(-4, -4, 5, 3, -0.4, 0, 7); ctx.fill();
    /* front wing */
    ctx.save(); ctx.rotate(-0.2 + wing); ctx.fillStyle = "#6CC24A"; ctx.strokeStyle = "#3E8E3A"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(2, -12, 14, 6, -0.3, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    /* face */
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(6, -2, 3.6, 0, 7); ctx.fill();
    ctx.fillStyle = "#1F1F1F"; ctx.beginPath(); ctx.arc(7, -2, 1.8, 0, 7); ctx.fill();
    ctx.strokeStyle = "#3B220E"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(6, 3, 3, 0.2, Math.PI - 0.4); ctx.stroke();
    ctx.restore();
  }

  return { show: menu, hide: stop };
})();
