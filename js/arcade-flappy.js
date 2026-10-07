/* =====================================================================
   FLAPPY SEED: tap to flap a little winged seed past the plant bullies.
   Every bully you pass plants a sprout. Every crash asks a question:
   answer right to keep flying, wrong ends the game. No other pop-ups.
   ===================================================================== */
Arcade.flappy = (function () {
  const { store, bear, $, clamp, sfx } = AC;
  const W = 360, H = 520, GROUND = H - 56;
  const SEED_X = 96, R = 14;                 /* seed position and hit radius (body is 18, so a little forgiving) */
  const GRAVITY = 1250, FLAP = 360, MAX_FALL = 560;
  const STALK_W = 54, SPACING = 205;
  const root = () => $("#game-flappy");
  /* the fuzzy seed hero (picture is 120 x 118; body center at 84.6, 66.9; body radius 33.9) */
  const SPRITE = new Image();
  SPRITE.src = "data:image/webp;base64,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";
  const SP_SCALE = 18 / 33.9, SP_CX = 84.6, SP_CY = 66.9;
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
      <img src="${SPRITE.src}" alt="Our fuzzy seed with wings" width="120" height="118" style="display:block;margin:0 auto 4px">
      <h2>Flappy Seed</h2>
      <p class="bb-lead">Help a little seed fly to a burned hill so it can grow. <strong>Tap to flap!</strong></p>
      <div class="bb-howto">
        <div class="bb-card friend"><span class="face" aria-hidden="true">&#128070;</span><strong>Tap or press Space</strong><span>The seed flaps up.<br><b>Stop tapping and it falls.</b></span></div>
        <div class="bb-card bully"><span class="face" aria-hidden="true">&#128544;</span><strong>Plant bullies</strong><span>Tall grumpy weeds.<br><b>Fly through the gaps!</b></span></div>
      </div>
      <p>Every bully you pass plants a new sprout. Bump into something? <strong>Answer a question right to keep flying!</strong> A wrong answer ends the game.</p>
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
    st = { state: "ready", y: H * 0.42, vy: 0, t: 0, flapT: 1, score: 0, obs: [], drops: [], sprouts: [], pops: [], clouds: makeClouds(), groundX: 0, qRight: 0, qTotal: 0, flash: 0 };
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
  function gapSize() { return Math.max(132, 172 - st.score * 2); }

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

  /* ---------- crash: every bump asks a question ---------- */
  function crash() {
    st.state = "paused"; st.flash = 0.4;
    if (raf) cancelAnimationFrame(raf); raf = null;
    sfx.bad();
    draw();
    bear.say("Bonk! Answer right to keep flying!", { stay: 2500 });
    AC.askQuestion(root(), {
      head: "&#127793; Bonk! Question time!",
      sub: "Answer right to keep flying. A wrong answer ends the game.",
      goText: "Continue",
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
      ${st.qTotal ? `<p>Questions answered right: <strong>${st.qRight}</strong></p>` : ""}
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
      ctx.fillText(st.qRight ? "Tap to keep flying!" : "Tap to start flapping!", W / 2, H * 0.62 + 28);
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

  /* the hero: the fuzzy winged seed. It tilts with its speed and squishes a little on each flap. */
  function drawSeed() {
    const tilt = clamp(st.vy / 900, -0.35, 0.5);
    const k = st.flapT < 0.15 ? Math.sin(st.flapT / 0.15 * Math.PI) : 0;
    const sx = 1 - k * 0.08, sy = 1 + k * 0.1;
    ctx.save(); ctx.translate(SEED_X, st.y); ctx.rotate(tilt); ctx.scale(sx, sy);
    if (SPRITE.complete && SPRITE.naturalWidth) {
      const s = SP_SCALE;
      ctx.drawImage(SPRITE, -SP_CX * s, -SP_CY * s, SPRITE.naturalWidth * s, SPRITE.naturalHeight * s);
    } else {                                 /* picture still loading: a simple fuzzy ball */
      ctx.fillStyle = "#8A6235"; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 7); ctx.fill();
      ctx.fillStyle = "#1F1F1F"; ctx.beginPath(); ctx.arc(-6, -2, 4, 0, 7); ctx.arc(7, -2, 4, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  return { show: menu, hide: stop };
})();
