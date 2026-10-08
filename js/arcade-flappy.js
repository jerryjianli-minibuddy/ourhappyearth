/* =====================================================================
   FLAPPY BEE: tap to flap a little bee past the plant bullies.
   Every bully you pass makes a flower bloom. Every crash asks a question:
   answer right to keep flying, wrong ends the game. No other pop-ups.
   ===================================================================== */
Arcade.flappy = (function () {
  const { store, bear, $, clamp, sfx } = AC;
  const W = 360, H = 520, GROUND = H - 56;
  const SEED_X = 96, R = 15;                 /* bee position and hit radius (body is about 27 x 21, so forgiving) */
  const GRAVITY = 1250, FLAP = 360, MAX_FALL = 560;
  const STALK_W = 54, SPACING = 170;
  const root = () => $("#game-flappy");
  /* the bee hero (picture is 120 x 114, drawn at half size; body center at 63.6, 69.1) */
  const SPRITE = new Image();
  SPRITE.src = "data:image/webp;base64,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";
  const SP_SCALE = 0.5, SP_CX = 63.6, SP_CY = 69.1;
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
      <img src="${SPRITE.src}" alt="Our fuzzy little bee" width="120" height="114" style="display:block;margin:0 auto 4px">
      <h2>Flappy Bee</h2>
      <p class="bb-lead">Help a little bee fly to a burned hill so flowers can bloom again. <strong>Tap to flap!</strong></p>
      <div class="bb-howto">
        <div class="bb-card friend"><span class="face" aria-hidden="true">&#128070;</span><strong>Tap or press Space</strong><span>The bee flaps up.<br><b>Stop tapping and it falls.</b></span></div>
        <div class="bb-card bully"><span class="face" aria-hidden="true">&#128544;</span><strong>Plant bullies</strong><span>Tall grumpy weeds.<br><b>Fly through the gaps!</b></span></div>
      </div>
      <p>Every bully you pass makes a new flower bloom. Bump into something? <strong>Answer a question right to keep flying!</strong> A wrong answer ends the game.</p>
      <p class="bestline">Best score: <strong>${best}</strong></p>
      <button class="btn" id="fs-play">Play</button></div>`;
    $("#fs-play").addEventListener("click", start);
  }

  function start() {
    stop();
    root().innerHTML = `
      <div class="hud"><span>Score <strong id="fs-score">0</strong></span><span>Best <strong id="fs-best">${store.get("ohe-best-flappy", 0)}</strong></span></div>
      <div class="canvas-wrap"><canvas id="fs-canvas" aria-label="Flappy Bee game. Tap or press Space to flap."></canvas></div>
      <p class="hint">Tap the game, click it, or press Space to flap.</p>`;
    cv = $("#fs-canvas");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    st = { state: "ready", y: H * 0.42, vy: 0, t: 0, flapT: 1, score: 0, obs: [], sprouts: [], pops: [], clouds: makeClouds(), groundX: 0, qRight: 0, qTotal: 0, flash: 0 };
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
    st.sprouts.forEach(s => { s.x -= v * dt; });
    st.obs = st.obs.filter(o => o.x > -STALK_W - 10);
    st.sprouts = st.sprouts.filter(s => s.x > -20);

    /* new bully pair */
    const lastOb = st.obs[st.obs.length - 1];
    if (!lastOb || lastOb.x < W - SPACING) {
      const gap = gapSize();
      const mid = 110 + Math.random() * (GROUND - 220);
      const ob = { x: W + 10, top: mid - gap / 2, bot: mid + gap / 2, passed: false };
      st.obs.push(ob);
    }

    /* passing a bully makes a flower bloom */
    st.obs.forEach(o => {
      if (!o.passed && o.x + STALK_W < SEED_X - R) {
        o.passed = true;
        st.score++;
        st.sprouts.push({ x: SEED_X - 30, g: 0, c: st.score % 3 });
        sfx.good();
        if (st.score % 10 === 0) { bear.cheer(st.score + " flowers blooming! You're a super bee!"); sfx.great(); }
        updateHud();
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
      head: "&#128029; Bonk! Question time!",
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
      <p>You helped <strong>${st.score}</strong> flower${st.score === 1 ? "" : "s"} bloom on the burned hill. Best score: <strong>${Math.max(prevBest, st.score)}</strong></p>
      ${st.qTotal ? `<p>Questions answered right: <strong>${st.qRight}</strong></p>` : ""}
      <button class="btn" id="fs-again">Play again</button></div>`;
    $("#fs-again").addEventListener("click", start);
    $("#fs-again").focus();
    if (isNew && st.score > 0) bear.cheer("New high score! That bee really flew!");
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
    /* far hills: green on the left, burned brown on the right (where the bee is going) */
    ctx.fillStyle = "#A8D5A0";
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.quadraticCurveTo(90, GROUND - 120, 200, GROUND); ctx.fill();
    ctx.fillStyle = "#B99B7A";
    ctx.beginPath(); ctx.moveTo(150, GROUND); ctx.quadraticCurveTo(290, GROUND - 150, W + 40, GROUND); ctx.fill();

    st.obs.forEach(drawBully);

    /* ground */
    ctx.fillStyle = "#7A5230"; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = "#5FA84F"; ctx.fillRect(0, GROUND, W, 8);
    ctx.fillStyle = "#4E8F40";
    for (let x = st.groundX; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, GROUND + 8); ctx.lineTo(x + 6, GROUND); ctx.lineTo(x + 12, GROUND + 8); ctx.fill(); }
    st.sprouts.forEach(s => drawSprout(s.x, GROUND + 4, s.g, s.c));

    drawBee();

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

  function drawSprout(x, y, g, c) {
    if (g <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(g, g);
    ctx.strokeStyle = "#3E8E3A"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -20); ctx.stroke();
    ctx.fillStyle = "#6CC24A";
    ctx.beginPath(); ctx.ellipse(-6, -8, 6, 3, -0.5, 0, 7); ctx.ellipse(6, -10, 6, 3, 0.5, 0, 7); ctx.fill();
    /* a little flower on top: poppy orange, sage purple or sunny yellow */
    ctx.fillStyle = ["#F28C28", "#9B6BD6", "#F5C518"][c || 0];
    for (let i = 0; i < 5; i++) { const a = i * 1.2566; ctx.beginPath(); ctx.arc(Math.cos(a) * 4.5, -22 + Math.sin(a) * 4.5, 3.6, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#7A4A12"; ctx.beginPath(); ctx.arc(0, -22, 2.6, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* the hero: the fuzzy bee. It tilts with its speed and squishes a little on each flap. */
  function drawBee() {
    const tilt = clamp(st.vy / 900, -0.35, 0.5);
    const k = st.flapT < 0.15 ? Math.sin(st.flapT / 0.15 * Math.PI) : 0;
    const sx = 1 - k * 0.08, sy = 1 + k * 0.1;
    ctx.save(); ctx.translate(SEED_X, st.y); ctx.rotate(tilt); ctx.scale(sx, sy);
    if (SPRITE.complete && SPRITE.naturalWidth) {
      const s = SP_SCALE;
      ctx.drawImage(SPRITE, -SP_CX * s, -SP_CY * s, SPRITE.naturalWidth * s, SPRITE.naturalHeight * s);
    } else {                                 /* picture still loading: a simple yellow ball */
      ctx.fillStyle = "#F5C518"; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 7); ctx.fill();
      ctx.fillStyle = "#1F1F1F"; ctx.beginPath(); ctx.arc(-6, -2, 4, 0, 7); ctx.arc(7, -2, 4, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  return { show: menu, hide: stop };
})();
